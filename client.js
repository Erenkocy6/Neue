var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// client.ts
document.addEventListener('DOMContentLoaded', function () {
    var _a, _b, _c;
    var pages = {
        start: document.querySelector('.Startseite-Page'),
        login: document.querySelector('.Login-Page'),
        profile: document.querySelector('.Profil-Page'),
        agb: document.querySelector('.AGB-Page'),
        impressum: document.querySelector('.Impressum-Page'),
        datenschutz: document.querySelector('.Datenschutz-Page'),
        ueberuns: document.querySelector('.Überuns-Page'),
        dashboard: document.querySelector('.Dashboard-Page'),
        benutzer: document.querySelector('.Benutzer-Page'),
        marktplatz: document.querySelector('.Marktplatz-Page'),
        produktdetail: document.querySelector('.Produktdetail-Page')
    };
    var header = document.querySelector('header');
    var footer = document.querySelector('footer');
    var showPage = function (pageKey) {
        Object.values(pages).forEach(function (page) { return page.style.display = 'none'; });
        var target = pages[pageKey];
        if (target) {
            target.style.display = 'block';
            var isAdminPage = pageKey === 'dashboard' || pageKey === 'benutzer';
            header.classList.toggle('hide', isAdminPage);
            footer.classList.toggle('hide', isAdminPage);
        }
    };
    showPage('start');
    document.querySelectorAll('[data-page]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var page = link.dataset.page;
            if (page)
                showPage(page);
        });
    });
    document.querySelectorAll('.logo-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            showPage('start');
        });
    });
    document.querySelectorAll('.btn-sidebar').forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            var pageKey = button.dataset.page;
            if (pageKey)
                showPage(pageKey);
        });
    });
    var dashboardBtn = document.querySelector('.dashboard-btn');
    var updateHeaderVisibility = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data_1, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/api/session', { credentials: 'include' })];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data_1 = _b.sent();
                    document.querySelectorAll('.btn.btn-gradient').forEach(function (btn) {
                        var _a, _b;
                        var el = btn;
                        if (((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Login')) || ((_b = el.textContent) === null || _b === void 0 ? void 0 : _b.includes('Registrieren'))) {
                            el.style.display = data_1.user ? 'none' : 'inline-block';
                        }
                    });
                    if (dashboardBtn) {
                        dashboardBtn.style.display = ((_a = data_1.user) === null || _a === void 0 ? void 0 : _a.role) === 'Admin' ? 'inline-block' : 'none';
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    console.error('Fehler beim Session-Check:', err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    pages.start.style.display = 'block';
    updateHeaderVisibility();
    var profileIcons = document.querySelectorAll('.bi-person-circle, #dashboard-profile-icon, #benutzer-profile-icon');
    profileIcons.forEach(function (icon) {
        icon.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var res, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('/api/session', { credentials: 'include' })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (res.ok && data.user) {
                            showPage('profile');
                            fillProfile(data.user);
                            updateHeaderVisibility();
                        }
                        else {
                            showPage('login');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error('Fehler beim Laden des Profils:', err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var res, data;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch('/api/session', { credentials: 'include' })];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _b.sent();
                        if (((_a = data.user) === null || _a === void 0 ? void 0 : _a.role) === 'Admin') {
                            showPage('dashboard');
                        }
                        else {
                            alert('Kein Zugriff – nur Admins.');
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
    // Produktdetailseite öffnen/schließen
    var addBtn = document.getElementById('open-product-detail');
    var backBtn = document.getElementById('back-to-profile');
    addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', function () { return showPage('produktdetail'); });
    backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener('click', function () { return showPage('profile'); });
    var fillProfile = function (user) {
        var map = {
            '#profil-vorname': user.givenName,
            '#profil-nachname': user.familyName,
            '#profil-email': user.email,
            '#profil-passwort': '',
            '#profil-telefon': user.mobileNumber,
            '#profil-strasse': user.street || '',
            '#profil-plz': user.zip || '',
            '#profil-stadt': user.city || ''
        };
        for (var selector in map) {
            var input = document.querySelector(selector);
            if (input) {
                input.value = map[selector];
                input.setAttribute('readonly', 'true');
                input.style.backgroundColor = '';
            }
        }
    };
    var editIcon = document.querySelector('.icon-pencil');
    var buttonContainer = editIcon === null || editIcon === void 0 ? void 0 : editIcon.parentElement;
    if (editIcon && buttonContainer) {
        var saveBtn_1 = document.createElement('button');
        saveBtn_1.textContent = 'Speichern';
        saveBtn_1.className = 'btn btn-purple btn-dashboard ms-2';
        saveBtn_1.style.display = 'none';
        var deleteBtn_1 = document.createElement('button');
        deleteBtn_1.textContent = 'Löschen';
        deleteBtn_1.className = 'btn btn-purple btn-dashboard ms-2';
        deleteBtn_1.style.display = 'none';
        buttonContainer.appendChild(saveBtn_1);
        buttonContainer.appendChild(deleteBtn_1);
        editIcon.addEventListener('click', function () {
            document.querySelectorAll('.Profil-Page input').forEach(function (input) {
                var el = input;
                el.removeAttribute('readonly');
                el.style.backgroundColor = '#1a1a1a';
            });
            editIcon.style.display = 'none';
            saveBtn_1.style.display = 'inline-block';
            deleteBtn_1.style.display = 'inline-block';
        });
        saveBtn_1.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var getInputValue, data, response, result, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getInputValue = function (id) {
                            var el = document.getElementById(id);
                            return (el === null || el === void 0 ? void 0 : el.value.trim()) || '';
                        };
                        data = {
                            givenName: getInputValue('profil-vorname'),
                            familyName: getInputValue('profil-nachname'),
                            email: getInputValue('profil-email'),
                            mobileNumber: getInputValue('profil-telefon'),
                            street: getInputValue('profil-strasse'),
                            zip: getInputValue('profil-plz'),
                            city: getInputValue('profil-stadt'),
                            password: getInputValue('profil-passwort')
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('/api/user', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(data)
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        alert(result.message);
                        if (response.ok) {
                            ['profil-vorname', 'profil-nachname', 'profil-email', 'profil-telefon', 'profil-strasse', 'profil-plz', 'profil-stadt', 'profil-passwort']
                                .forEach(function (id) {
                                var input = document.getElementById(id);
                                if (input) {
                                    input.setAttribute('readonly', 'true');
                                    input.style.backgroundColor = '';
                                }
                            });
                            editIcon.style.display = 'inline-block';
                            saveBtn_1.style.display = 'none';
                            deleteBtn_1.style.display = 'none';
                            updateHeaderVisibility();
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        alert('Fehler beim Speichern.');
                        console.error(err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        deleteBtn_1.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
            var response, result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm('Willst du dein Profil wirklich löschen?'))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('/api/user', {
                                method: 'DELETE',
                                credentials: 'include'
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        alert(result.message);
                        if (response.ok)
                            window.location.reload();
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _a.sent();
                        alert('Fehler beim Löschen.');
                        console.error(err_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    var afterLoginSuccess = function () {
        showPage('start');
        updateHeaderVisibility();
    };
    var form = document.getElementById('formInput');
    var output = document.getElementById('registerOutput');
    if (form && output) {
        form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var getValue, data, response, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        getValue = function (id) { var _a; return ((_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) || ''; };
                        data = {
                            firstname: getValue('firstname'),
                            lastname: getValue('lastname'),
                            email: getValue('email'),
                            password: getValue('password'),
                            passwordRepeat: getValue('passwordRepeat'),
                            address: getValue('address'),
                            city: getValue('city'),
                            zip: getValue('zip'),
                            phone: getValue('phone')
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('/register', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(data)
                            })];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _b.sent();
                        output.textContent = result.message;
                        output.style.color = response.ok ? 'green' : 'red';
                        if (response.ok)
                            afterLoginSuccess();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        output.textContent = 'Fehler beim Senden der Daten.';
                        output.style.color = 'red';
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    var loginForm = document.getElementById('loginForm');
    var emailInput = document.getElementById('loginEmail');
    var passwordInput = document.getElementById('loginPassword');
    if (loginForm && emailInput && passwordInput) {
        loginForm.addEventListener('submit', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var data, response, result, out, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        data = { email: emailInput.value, password: passwordInput.value };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('/login', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(data)
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        out = document.getElementById('loginOutput');
                        out.textContent = result.message;
                        out.style.color = response.ok ? 'green' : 'red';
                        if (response.ok)
                            afterLoginSuccess();
                        return [3 /*break*/, 5];
                    case 4:
                        err_5 = _a.sent();
                        console.error('Fehler beim Login', err_5);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    }
    (_a = document.getElementById('btn-login')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) { e.preventDefault(); showPage('login'); });
    (_b = document.getElementById('btn-register')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) { e.preventDefault(); showPage('login'); });
    (_c = document.getElementById('btn-logout')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var res, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch('/logout', { method: 'POST', credentials: 'include' })];
                case 1:
                    res = _a.sent();
                    if (res.ok) {
                        emailInput.value = '';
                        passwordInput.value = '';
                        document.getElementById('loginOutput').textContent = '';
                        showPage('start');
                        updateHeaderVisibility();
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    console.error('Fehler beim Logout:', err_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    // === Admin: User-CRUD im Dashboard ===
    var loadUsers = function () { return __awaiter(_this, void 0, void 0, function () {
        var table, tbody, thead, headerRow, newRow, response, userList, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    table = document.querySelector('.Benutzer-Page table');
                    tbody = table.querySelector('tbody');
                    if (!tbody)
                        return [2 /*return*/, console.error('Kein <tbody> gefunden')];
                    tbody.innerHTML = '';
                    // Kopfzeile neu aufbauen
                    if (table.tHead)
                        table.removeChild(table.tHead);
                    thead = table.createTHead();
                    headerRow = thead.insertRow();
                    ['ID', 'Vorname', 'Nachname', 'E-Mail', 'Telefonnummer', 'Straße', 'PLZ', 'Ort', 'Rolle', 'Passwort', 'Aktionen']
                        .forEach(function (text) {
                        var th = document.createElement('th');
                        th.innerText = text;
                        headerRow.appendChild(th);
                    });
                    newRow = document.createElement('tr');
                    newRow.innerHTML = "\n        <td>-</td>\n        <td contenteditable=\"true\" data-field=\"givenName\"></td>\n        <td contenteditable=\"true\" data-field=\"familyName\"></td>\n        <td contenteditable=\"true\" data-field=\"email\"></td>\n        <td contenteditable=\"true\" data-field=\"mobileNumber\"></td>\n        <td contenteditable=\"true\" data-field=\"street\"></td>\n        <td contenteditable=\"true\" data-field=\"zip\"></td>\n        <td contenteditable=\"true\" data-field=\"city\"></td>\n        <td>\n          <select data-field=\"role\">\n            <option>Admin</option>\n            <option selected>Kunde</option>\n          </select>\n        </td>\n        <td data-field=\"password\">\u2022\u2022\u2022\u2022\u2022\u2022</td>\n        <td><button class=\"btn btn-sm btn-primary btn-add\">+</button></td>\n    ";
                    tbody.appendChild(newRow);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/users', { credentials: 'include' })];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Fehler beim Abrufen');
                    return [4 /*yield*/, response.json()];
                case 3:
                    userList = _a.sent();
                    // Für jeden Benutzer eine Tabellenzeile erstellen
                    userList.forEach(function (user) {
                        var row = document.createElement('tr');
                        row.innerHTML = "\n                <td>".concat(user.id, "</td>\n                <td contenteditable=\"true\" data-field=\"givenName\">").concat(user.givenName, "</td>\n                <td contenteditable=\"true\" data-field=\"familyName\">").concat(user.familyName, "</td>\n                <td contenteditable=\"true\" data-field=\"email\">").concat(user.email, "</td>\n                <td contenteditable=\"true\" data-field=\"mobileNumber\">").concat(user.mobileNumber || '', "</td>\n                <td contenteditable=\"true\" data-field=\"street\">").concat(user.street || '', "</td>\n                <td contenteditable=\"true\" data-field=\"zip\">").concat(user.zip || '', "</td>\n                <td contenteditable=\"true\" data-field=\"city\">").concat(user.city || '', "</td>\n                <td>\n                  <select data-field=\"role\">\n                    <option").concat(user.role === 'Admin' ? ' selected' : '', ">Admin</option>\n                    <option").concat(user.role === 'Kunde' ? ' selected' : '', ">Kunde</option>\n                  </select>\n                </td>\n                <td data-field=\"password\">\u2022\u2022\u2022\u2022\u2022\u2022</td>\n                <td>\n                  <button class=\"btn btn-sm btn-success btn-update\" data-id=\"").concat(user.id, "\">\uD83D\uDCBE</button>\n                  <button class=\"btn btn-sm btn-danger btn-delete\" data-id=\"").concat(user.id, "\">\uD83D\uDDD1\uFE0F</button>\n                </td>\n            ");
                        tbody.appendChild(row);
                    });
                    // 🔁 PUT: Benutzer aktualisieren
                    tbody.querySelectorAll('.btn-update').forEach(function (updateButton) {
                        updateButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                            var userId, row, updatedUserData, updateResponse, updateResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        userId = updateButton.dataset.id;
                                        row = updateButton.closest('tr');
                                        updatedUserData = {};
                                        row.querySelectorAll('[data-field]').forEach(function (cell) {
                                            var fieldName = cell.dataset.field;
                                            var value = cell.hasAttribute('contenteditable')
                                                ? cell.innerText.trim()
                                                : cell.value;
                                            if (fieldName === 'password' && value === '••••••')
                                                return;
                                            updatedUserData[fieldName] = value;
                                        });
                                        return [4 /*yield*/, fetch("/api/users/".concat(userId), {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                credentials: 'include',
                                                body: JSON.stringify(updatedUserData)
                                            })];
                                    case 1:
                                        updateResponse = _a.sent();
                                        return [4 /*yield*/, updateResponse.json()];
                                    case 2:
                                        updateResult = _a.sent();
                                        alert(updateResult.message);
                                        loadUsers();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    // 🗑️ DELETE: Benutzer löschen
                    tbody.querySelectorAll('.btn-delete').forEach(function (deleteButton) {
                        deleteButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                            var userId, deleteResponse, deleteResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!confirm('User wirklich löschen?'))
                                            return [2 /*return*/];
                                        userId = deleteButton.dataset.id;
                                        return [4 /*yield*/, fetch("/api/users/".concat(userId), {
                                                method: 'DELETE',
                                                credentials: 'include'
                                            })];
                                    case 1:
                                        deleteResponse = _a.sent();
                                        return [4 /*yield*/, deleteResponse.json()];
                                    case 2:
                                        deleteResult = _a.sent();
                                        alert(deleteResult.message);
                                        loadUsers();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    // ➕ POST: Benutzer hinzufügen
                    newRow.querySelector('.btn-add').addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                        var newUserData, createResponse, createResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    newUserData = {};
                                    newRow.querySelectorAll('[data-field]').forEach(function (cell) {
                                        var fieldName = cell.dataset.field;
                                        var value = cell.hasAttribute('contenteditable')
                                            ? cell.innerText.trim()
                                            : cell.value;
                                        newUserData[fieldName] = value;
                                    });
                                    return [4 /*yield*/, fetch('/api/users', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            credentials: 'include',
                                            body: JSON.stringify(newUserData)
                                        })];
                                case 1:
                                    createResponse = _a.sent();
                                    return [4 /*yield*/, createResponse.json()];
                                case 2:
                                    createResult = _a.sent();
                                    if (createResponse.ok) {
                                        alert("User (ID ".concat(createResult.id, ") wurde erstellt. Passwort: ").concat(createResult.password));
                                        newRow.querySelector('td').innerText = String(createResult.id);
                                        newRow.querySelector('[data-field="password"]').textContent = '••••••';
                                    }
                                    else {
                                        alert("Fehler: ".concat(createResult.message));
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    alert('Fehler beim Laden der User.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    document.querySelectorAll('[data-page="benutzer"]').forEach(function (el) {
        el.addEventListener('click', function () { return loadUsers(); });
    });
});
