// server.ts
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { Connection, createConnection, RowDataPacket } from 'mysql2/promise';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = 8080;
const STATIC_ROOT = path.resolve(__dirname);

app.set('trust proxy', 1);
app.use(express.static(STATIC_ROOT));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'supergeheim',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: number;
            givenName: string;
            familyName: string;
            email: string;
            mobileNumber: string;
            role: string;
            street: string;
            zip: string;
            city: string;
        };
    }
}

let database: Connection;
async function connectDatabase() {
    try {
        database = await createConnection({
            host: 'localhost',
            user: 'root',
            password: 'toortoor',
            database: 'nostify'
        });
        console.log('Datenbank verbunden');
    } catch (err) {
        console.error('Datenbankfehler', err);
    }
}
connectDatabase();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.session.user?.role === 'Admin') return next();
    return res.status(403).json({ message: 'Zugriff verweigert: Admins only.' });
}

/**
 * @api {post} /register Registrierung
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiBody {String} firstname        Vorname des Nutzers (required)
 * @apiBody {String} lastname         Nachname des Nutzers (required)
 * @apiBody {String} email            Email-Adresse (required)
 * @apiBody {String} password         Passwort (required)
 * @apiBody {String} passwordRepeat   Passwort-Wiederholung (required)
 * @apiBody {String} [address]        Straße und Hausnummer
 * @apiBody {String} [city]           Stadt
 * @apiBody {String} [zip]            Postleitzahl
 * @apiBody {String} [phone]          Telefonnummer
 *
 * @apiSuccess (201) {String}  message           Erfolgsmeldung
 * @apiSuccess (201) {Object}  user              Eingeloggter Nutzer
 * @apiSuccess (201) {Number}  user.id           Nutzer-ID
 * @apiSuccess (201) {String}  user.givenName    Vorname
 * @apiSuccess (201) {String}  user.familyName   Nachname
 * @apiSuccess (201) {String}  user.email        Email
 * @apiSuccess (201) {String}  user.mobileNumber Telefonnummer
 * @apiSuccess (201) {String}  user.role         Rolle (Kunde)
 *
 * @apiError (400) {String} message Fehlende Pflichtfelder oder Validierungsfehler
 * @apiError (409) {String} message Email existiert bereits
 * @apiError (500) {String} message Serverfehler
 */
app.post('/register', async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, passwordRepeat, address, city, zip, phone } = req.body;
    if (!firstname || !lastname || !email || !password || !passwordRepeat) {
        return res.status(400).json({ message: 'Pflichtfelder fehlen.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Ungültige E-Mail.' });
    }
    if (password !== passwordRepeat) {
        return res.status(400).json({ message: 'Passwörter stimmen nicht überein.' });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Passwort zu schwach.' });
    }
    try {
        const [existing] = await database.query('SELECT UserID FROM User WHERE Email = ?', [email]);
        if ((existing as any[]).length > 0) {
            return res.status(409).json({ message: 'E-Mail existiert bereits.' });
        }
        const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');
        const [result] = await database.query(
            'INSERT INTO User (Vorname, Nachname, Email, Telefonnummer, Straße, Stadt, PLZ, Passwort, Rolle, Profilbild) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [firstname, lastname, email, phone, address, city, zip, hashedPassword, 'Kunde', 'default.jpg']
        );
        const newUserId = (result as any).insertId;
        req.session.user = {
            id: newUserId,
            givenName: firstname,
            familyName: lastname,
            email,
            mobileNumber: phone,
            role: 'Kunde',
            street: address,
            zip,
            city
        };
        req.session.save(() => {
            res.status(201).json({
                message: 'Registrierung erfolgreich und eingeloggt.',
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Fehler bei Registrierung:', err);
        res.status(500).json({ message: 'Fehler bei Registrierung.', error: err });
    }
});

/**
 * @api {post} /login Login
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiBody {String} email    Email-Adresse (required)
 * @apiBody {String} password Passwort (required)
 *
 * @apiSuccess {String} message Erfolgsmeldung
 * @apiSuccess {Object} user    Eingeloggter Nutzer
 *
 * @apiError (401) {String} message Login fehlgeschlagen
 * @apiError (500) {String} message Serverfehler
 */
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');
    try {
        const [rows] = await database.query<RowDataPacket[]>(
            'SELECT * FROM User WHERE Email = ? AND Passwort = ?',
            [email, hashedPassword]
        );
        if (rows.length !== 1) {
            return res.status(401).json({ message: 'Login fehlgeschlagen.' });
        }
        const user = rows[0];
        req.session.user = {
            id: user.UserID,
            givenName: user.Vorname,
            familyName: user.Nachname,
            email: user.Email,
            mobileNumber: user.Telefonnummer,
            role: user.Rolle,
            street: user.Straße,
            zip: user.PLZ,
            city: user.Stadt
        };
        req.session.save(() => {
            res.status(200).json({ message: 'Login erfolgreich.', user: req.session.user });
        });
    } catch (err) {
        console.error('Fehler beim Login:', err);
        res.status(500).json({ message: 'Fehler beim Login.', error: err });
    }
});

/**
 * @api {get} /api/session Session-Check
 * @apiName GetSession
 * @apiGroup Auth
 *
 * @apiSuccess {Object} user Session-Daten des Nutzers
 * @apiError (401) {String} message Nicht eingeloggt
 */
app.get('/api/session', (req: Request, res: Response) => {
    if (req.session.user) {
        return res.status(200).json({ user: req.session.user });
    }
    return res.status(401).json({ message: 'Nicht eingeloggt.' });
});

/**
 * @api {post} /logout Logout
 * @apiName LogoutUser
 * @apiGroup Auth
 *
 * @apiSuccess {String} message Logout erfolgreich
 * @apiError (500) {String} message Logout fehlgeschlagen
 */
app.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Logout fehlgeschlagen.' });
        res.status(200).json({ message: 'Logout erfolgreich.' });
    });
});

/**
 * @api {get} / Statische Startseite
 * @apiName GetIndex
 * @apiGroup Public
 *
 * @apiSuccess {File} index.html HTML-Datei
 */
app.get('/', (_req, res: Response) => {
    res.sendFile(path.join(STATIC_ROOT, 'index.html'));
});

/**
 * @api {put} /api/user Profil aktualisieren
 * @apiName UpdateProfile
 * @apiGroup User
 * @apiPermission loggedIn
 *
 * @apiBody {String} givenName    Vorname (required)
 * @apiBody {String} familyName   Nachname (required)
 * @apiBody {String} email        Email (required)
 * @apiBody {String} mobileNumber Telefonnummer (required)
 * @apiBody {String} street       Straße (required)
 * @apiBody {String} zip          PLZ (required)
 * @apiBody {String} city         Stadt (required)
 * @apiBody {String} [password]   Neues Passwort
 *
 * @apiSuccess {String} message Profil erfolgreich aktualisiert
 * @apiError (400) {String} message Fehlende Felder
 * @apiError (401) {String} message Nicht eingeloggt
 * @apiError (409) {String} message E-Mail ist bereits vergeben
 * @apiError (500) {String} message Serverfehler
 */
app.put('/api/user', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Nicht eingeloggt.' });
    }
    const { givenName, familyName, email, mobileNumber, street, zip, city, password } = req.body;
    if (!givenName || !familyName || !email || !mobileNumber || !street || !zip || !city) {
        return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt sein.' });
    }

    try {
        if (password && password.trim().length > 0) {
            const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');
            await database.query(
                `UPDATE User SET Vorname = ?, Nachname = ?, Email = ?, Telefonnummer = ?, Straße = ?, PLZ = ?, Stadt = ?, Passwort = ? WHERE UserID = ?`,
                [givenName, familyName, email, mobileNumber, street, zip, city, hashedPassword, req.session.user.id]
            );
        } else {
            await database.query(
                `UPDATE User SET Vorname = ?, Nachname = ?, Email = ?, Telefonnummer = ?, Straße = ?, PLZ = ?, Stadt = ? WHERE UserID = ?`,
                [givenName, familyName, email, mobileNumber, street, zip, city, req.session.user.id]
            );
        }
        req.session.user = {
            ...req.session.user,
            givenName,
            familyName,
            email,
            mobileNumber,
            street,
            zip,
            city
        };
        res.status(200).json({ message: 'Profil erfolgreich aktualisiert.' });
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'E-Mail ist bereits vergeben.' });
        }
        console.error('Fehler beim Aktualisieren des Profils:', err);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Profils.' });
    }
});

/**
 * @api {delete} /api/user Profil löschen
 * @apiName DeleteProfile
 * @apiGroup User
 * @apiPermission loggedIn
 *
 * @apiSuccess {String} message Konto erfolgreich gelöscht
 * @apiError (401) {String} message Nicht eingeloggt
 * @apiError (404) {String} message Benutzer nicht gefunden
 * @apiError (500) {String} message Serverfehler
 */
app.delete('/api/user', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Nicht eingeloggt.' });
    }
    try {
        const [result] = await database.query('DELETE FROM User WHERE UserID = ?', [req.session.user.id]);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
        }
        req.session.destroy((err) => {
            if (err) console.error('Fehler beim Zerstören der Session:', err);
        });
        res.status(200).json({ message: 'Benutzerkonto erfolgreich gelöscht.' });
    } catch (err) {
        console.error('Fehler beim Löschen:', err);
        res.status(500).json({ message: 'Fehler beim Löschen.' });
    }
});

/**
 * @api {get} /api/users Admin: Alle Nutzer auflisten
 * @apiName AdminListUsers
 * @apiGroup Admin
 * @apiPermission Admin
 *
 * @apiSuccess {Object[]} users Liste der Nutzer
 * @apiError (403) {String} message Zugriff verweigert
 * @apiError (500) {String} message Serverfehler
 */
app.get('/api/users', requireAdmin, async (_req, res: Response) => {
    try {
        const [rows] = await database.query<RowDataPacket[]>(
            `SELECT
                 UserID        AS id,
                 Vorname       AS givenName,
                 Nachname      AS familyName,
                 Email         AS email,
                 Telefonnummer AS mobileNumber,
                 Straße        AS street,
                 PLZ           AS zip,
                 Stadt         AS city,
                 Rolle         AS role
             FROM User`
        );
        res.json(rows);
    } catch (err) {
        console.error('Fehler beim Laden der User:', err);
        res.status(500).json({ message: 'Fehler beim Laden der User.' });
    }
});

/**
 * @api {get} /api/users/:id Admin: Nutzer holen
 * @apiName AdminGetUser
 * @apiGroup Admin
 * @apiPermission Admin
 *
 * @apiParam {Number} id Nutzer-ID (URL-Path)
 *
 * @apiSuccess {Object} user Nutzerdaten
 * @apiError (403) {String} message Zugriff verweigert
 * @apiError (404) {String} message User nicht gefunden
 * @apiError (500) {String} message Serverfehler
 */
app.get('/api/users/:id', requireAdmin, async (req: Request, res: Response) => {
    const uid = Number(req.params.id);
    try {
        const [rows] = await database.query<RowDataPacket[]>(
            `SELECT
                 UserID        AS id,
                 Vorname       AS givenName,
                 Nachname      AS familyName,
                 Email         AS email,
                 Telefonnummer AS mobileNumber,
                 Straße        AS street,
                 PLZ           AS zip,
                 Stadt         AS city,
                 Rolle         AS role
             FROM User WHERE UserID = ?`,
            [uid]
        );
        if (!rows.length) return res.status(404).json({ message: 'User nicht gefunden.' });
        res.json(rows[0]);
    } catch (err) {
        console.error('Fehler beim Laden des User:', err);
        res.status(500).json({ message: 'Fehler beim Laden des User.' });
    }
});

/**
 * @api {post} /api/users Admin: Nutzer anlegen
 * @apiName AdminCreateUser
 * @apiGroup Admin
 * @apiPermission Admin
 *
 * @apiBody {String} givenName     Vorname (required)
 * @apiBody {String} familyName    Nachnahme (required)
 * @apiBody {String} email         Email (required)
 * @apiBody {String} role          Rolle (required)
 * @apiBody {String} [mobileNumber] Telefonnummer
 * @apiBody {String} [street]      Straße
 * @apiBody {String} [zip]         PLZ
 * @apiBody {String} [city]        Stadt
 * @apiBody {String} [password]    Passwort (optional, sonst zufällig)
 *
 * @apiSuccess (201) {Number} id       Neue Nutzer-ID
 * @apiSuccess (201) {String} password Vom System generiertes Passwort
 * @apiError (400) {String} message Fehlende Felder
 * @apiError (403) {String} message Zugriff verweigert
 * @apiError (409) {String} message E-Mail existiert bereits
 * @apiError (500) {String} message Serverfehler
 */
app.post('/api/users', requireAdmin, async (req: Request, res: Response) => {
    const { givenName, familyName, email, mobileNumber, street, zip, city, role, password } = req.body;
    if (!givenName || !familyName || !email || !role) {
        return res.status(400).json({ message: 'Feldern fehlen.' });
    }
    const clearPwd: string = password || crypto.randomBytes(8).toString('hex');
    const hashed = crypto.createHash('sha512').update(clearPwd).digest('hex');

    try {
        const [result] = await database.query(
            `INSERT INTO User
             (Vorname, Nachname, Email, Telefonnummer, Straße, PLZ, Stadt, Rolle, Passwort)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [givenName, familyName, email, mobileNumber || '', street || '', zip || '', city || '', role, hashed]
        );
        res.status(201).json({ id: (result as any).insertId, password: clearPwd });
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'E-Mail existiert bereits.' });
        }
        console.error('Fehler beim Anlegen des Users:', err);
        res.status(500).json({ message: 'Serverfehler beim Anlegen des Users.' });
    }
});

/**
 * @api {put} /api/users/:id Admin: Nutzer aktualisieren
 * @apiName AdminUpdateUser
 * @apiGroup Admin
 * @apiPermission Admin
 *
 * @apiParam {Number} id            Pfad-Parameter Nutzer-ID
 * @apiBody {String} givenName     Vorname (required)
 * @apiBody {String} familyName    Nachnahme (required)
 * @apiBody {String} email         Email (required)
 * @apiBody {String} role          Rolle (required)
 * @apiBody {String} [mobileNumber] Telefonnummer
 * @apiBody {String} [street]      Straße
 * @apiBody {String} [zip]         PLZ
 * @apiBody {String} [city]        Stadt
 * @apiBody {String} [password]    Neues Passwort
 *
 * @apiSuccess {String} message User erfolgreich aktualisiert
 * @apiError (400) {String} message Fehlende Felder
 * @apiError (403) {String} message Zugriff verweigert
 * @apiError (404) {String} message User nicht gefunden
 * @apiError (409) {String} message E-Mail ist bereits vergeben
 * @apiError (500) {String} message Serverfehler
 */
app.put('/api/users/:id', requireAdmin, async (req: Request, res: Response) => {
    const uid = Number(req.params.id);
    const { givenName, familyName, email, mobileNumber, street, zip, city, role, password } = req.body;

    if (!givenName || !familyName || !email || !role) {
        return res.status(400).json({ message: 'Feldern fehlen.' });
    }

    try {
        const [exists] = await database.query<RowDataPacket[]>(
            'SELECT UserID FROM User WHERE UserID = ?',
            [uid]
        );
        if ((exists as any[]).length === 0) {
            return res.status(404).json({ message: 'User nicht gefunden.' });
        }

        if (password) {
            const hashedPwd = crypto.createHash('sha512').update(password).digest('hex');
            await database.query(
                `UPDATE User SET Vorname=?, Nachname=?, Email=?, Telefonnummer=?, Straße=?, PLZ=?, Stadt=?, Rolle=?, Passwort=? WHERE UserID=?`,
                [givenName, familyName, email, mobileNumber||'', street||'', zip||'', city||'', role, hashedPwd, uid]
            );
        } else {
            await database.query(
                `UPDATE User SET Vorname=?, Nachname=?, Email=?, Telefonnummer=?, Straße=?, PLZ=?, Stadt=?, Rolle=? WHERE UserID=?`,
                [givenName, familyName, email, mobileNumber||'', street||'', zip||'', city||'', role, uid]
            );
        }

        res.json({ message: 'User erfolgreich aktualisiert.' });
    } catch (err: any) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'E-Mail ist bereits vergeben.' });
        }
        console.error('Fehler beim Aktualisieren des Users:', err);
        res.status(500).json({ message: 'Serverfehler beim Aktualisieren des Users.' });
    }
});

/**
 * @api {delete} /api/users/:id Admin: Nutzer löschen
 * @apiName AdminDeleteUser
 * @apiGroup Admin
 * @apiPermission Admin
 *
 * @apiParam {Number} id Pfad-Parameter Nutzer-ID
 *
 * @apiSuccess {String} message User gelöscht
 * @apiError (403) {String} message Zugriff verweigert
 * @apiError (404) {String} message User nicht gefunden
 * @apiError (500) {String} message Serverfehler
 */
app.delete('/api/users/:id', requireAdmin, async (req: Request, res: Response) => {
    const uid = Number(req.params.id);
    try {
        const [result] = await database.query('DELETE FROM User WHERE UserID=?', [uid]);
        if ((result as any).affectedRows === 0) {
            return res.status(404).json({ message: 'User nicht gefunden.' });
        }
        res.json({ message: 'User gelöscht.' });
    } catch (err) {
        console.error('Fehler beim Löschen des Users:', err);
        res.status(500).json({ message: 'Fehler beim Löschen des Users.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft unter http://localhost:${PORT}`);
});
