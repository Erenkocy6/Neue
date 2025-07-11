-- Ein neues Produkt für Retro Gaming hinzufügen
INSERT INTO Produkt (UserID, Titel, Beschreibung, Preis, Zustand, Kategorie, Standort, Erstelldatum)
VALUES (7, 'SNES-Konsole', 'Original SNES mit 2 Controllern und 3 Spielen', 120.00, 'Gebraucht', 'Retro Gaming', 'Hamburg', NOW());


-- Eine Bewertung hinzufügen
INSERT INTO Bewertungen (UserID, Inhalt, Sterne, Erstelldatum)
VALUES (2, 'Super Zustand, die Spiele laufen perfekt!', 5, NOW());

-- Rolle eines Benutzers aktualisieren
UPDATE USER
SET Rolle = 'Administrator'
WHERE UserID = 1;


-- Tabelle: User
CREATE TABLE User (
                      UserID INT AUTO_INCREMENT PRIMARY KEY,
                      Vorname VARCHAR(100),
                      Nachname VARCHAR(100),
                      Email VARCHAR(255) UNIQUE,
                      Telefonnummer VARCHAR(50),
                      Straße VARCHAR(255),
                      Stadt VARCHAR(100),
                      PLZ VARCHAR(10),
                      Passwort VARCHAR(255),
                      Rolle VARCHAR(50),
                      Profilbild TEXT
);

-- Tabelle: Produkt
CREATE TABLE Produkt (
                         ProduktID INT AUTO_INCREMENT PRIMARY KEY,
                         UserID INT,
                         Titel VARCHAR(255),
                         Beschreibung TEXT,
                         Preis DECIMAL(10,2),
                         Zustand VARCHAR(100),
                         Kategorie VARCHAR(100),
                         Standort VARCHAR(100),
                         Erstelldatum DATETIME DEFAULT NOW(),
                         FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Tabelle: Produktbilder
CREATE TABLE Produktbilder (
                               BildID INT AUTO_INCREMENT PRIMARY KEY,
                               ProduktID INT,
                               BildURL TEXT,
                               FOREIGN KEY (ProduktID) REFERENCES Produkt(ProduktID)
);

-- Tabelle: Bewertungen
CREATE TABLE Bewertungen (
                             BewertungID INT AUTO_INCREMENT PRIMARY KEY,
                             UserID INT,
                             ProduktID INT,
                             Inhalt TEXT,
                             Sterne INT,
                             Erstelldatum DATETIME DEFAULT NOW(),
                             Gemeldet ENUM('ja', 'nein') DEFAULT 'nein',
                             FOREIGN KEY (UserID) REFERENCES User(UserID),
                             FOREIGN KEY (ProduktID) REFERENCES Produkt(ProduktID)
);


-- Tabelle: Chat
CREATE TABLE Chat (
                      ChatID INT AUTO_INCREMENT PRIMARY KEY,
                      SenderID INT,
                      EmpfaengerID INT,
                      Nachricht TEXT,
                      Zeitstempel TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (SenderID) REFERENCES User(UserID),
                      FOREIGN KEY (EmpfaengerID) REFERENCES User(UserID)
);


-- Tabelle: Meldungen
CREATE TABLE Meldungen (
                           MeldungID INT AUTO_INCREMENT PRIMARY KEY,
                           UserID INT,
                           Meldungsgrund TEXT,
                           Meldungsdatum DATETIME DEFAULT NOW(),
                           FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Tabelle: Bestellungen
CREATE TABLE Bestellungen (
                              BestellungID INT AUTO_INCREMENT PRIMARY KEY,
                              UserID INT,
                              Bestelldatum DATETIME DEFAULT NOW(),
                              Gesamtpreis DECIMAL(10,2),
                              FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Tabelle: Bestellposition
CREATE TABLE Bestellposition (
                                 BestellpositionID INT AUTO_INCREMENT PRIMARY KEY,
                                 BestellungID INT,
                                 ProduktID INT,
                                 Einzelpreis DECIMAL(10,2),
                                 FOREIGN KEY (BestellungID) REFERENCES Bestellungen(BestellungID),
                                 FOREIGN KEY (ProduktID) REFERENCES Produkt(ProduktID)
);

-- ==== User ====
INSERT INTO User (Vorname, Nachname, Email, Telefonnummer, Straße, Stadt, PLZ, Passwort, Rolle, Profilbild) VALUES
                                                                                                                ('Daniel', 'Becker', 'daniel@mail.de', '0401234567', 'Retrostraße 1', 'Hamburg', '20095', 'pass123', 'verkäufer', 'daniel.jpg'),
                                                                                                                ('Marcel', 'Kaufmann', 'marcel@mail.de', '0642198765', 'Pixelgasse 2', 'Stadtallendorf', '35260', 'pass456', 'käufer', 'marcel.jpg'),
                                                                                                                ('Elena', 'Montero', 'elena@mail.de', '0176123456', 'Techallee 3', 'Marburg', '35037', 'adminpass', 'administrator', 'elena.jpg');

-- ==== Produkt ====
INSERT INTO Produkt (UserID, Titel, Beschreibung, Preis, Zustand, Kategorie, Standort) VALUES
                                                                                           (1, 'Nintendo 64 Konsole', 'Komplett mit OVP und Controller', 120.00, 'gebraucht – gut', 'Konsole', 'Hamburg'),
                                                                                           (1, 'Game Boy Classic', 'Guter Zustand, leichte Kratzer', 80.00, 'gebraucht – akzeptabel', 'Handheld', 'Hamburg'),
                                                                                           (2, 'PS5 Digital Edition', 'Neu, originalverpackt', 450.00, 'neu', 'Konsole', 'Stadtallendorf');

-- ==== Produktbilder ====
INSERT INTO Produktbilder (ProduktID, BildURL) VALUES
                                                   (1, 'n64_front.jpg'),
                                                   (1, 'n64_back.jpg'),
                                                   (2, 'gameboy.jpg');

-- ==== Bewertungen ====
INSERT INTO Bewertungen (UserID, ProduktID, Inhalt, Sterne, Gemeldet) VALUES
                                                                          (2, 1, 'Super Konsole, gut erhalten!', 5, 'nein'),
                                                                          (3, 2, 'Etwas verkratzt, aber funktioniert.', 3, 'ja'),
                                                                          (1, 3, 'Top Zustand, schneller Versand!', 5, 'nein');

-- ==== Chat ====
INSERT INTO Chat (SenderID, EmpfaengerID, Nachricht) VALUES
                                                         (2, 1, 'Hi, ist die N64 noch da?'),
                                                         (3, 1, 'Gibt es Zubehör zum Game Boy?'),
                                                         (1, 3, 'Wann wird die PS5 abgeholt?');

-- ==== Meldungen ====
INSERT INTO Meldungen (UserID, Meldungsgrund) VALUES
                                                  (2, 'Produktbeschreibung weicht ab'),
                                                  (3, 'Keine Antwort vom Verkäufer'),
                                                  (1, 'Zustand war schlechter als angegeben');

-- ==== Bestellungen ====
INSERT INTO Bestellungen (UserID, Gesamtpreis) VALUES
                                                   (2, 120.00),
                                                   (3, 450.00),
                                                   (1, 80.00);

-- ==== Bestellposition ====
INSERT INTO Bestellposition (BestellungID, ProduktID, Einzelpreis) VALUES
                                                                       (1, 1, 120.00),
                                                                       (2, 3, 450.00),
                                                                       (3, 2, 80.00);


-- ==== Admin hinzufügen ====

INSERT INTO User (Vorname, Nachname, Email, Telefonnummer, Straße, Stadt, PLZ, Passwort, Rolle, Profilbild)
VALUES (
           'Admin', 'User', 'admin1@nostify.de', '0123456789', 'Adminstraße 1', 'Adminstadt', '12345',
           SHA2('AdminPasswort123!', 512),
           'Admin',
           'default.jpg'
       );



