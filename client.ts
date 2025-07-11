// client.ts
document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        start: document.querySelector('.Startseite-Page') as HTMLElement,
        login: document.querySelector('.Login-Page') as HTMLElement,
        profile: document.querySelector('.Profil-Page') as HTMLElement,
        agb: document.querySelector('.AGB-Page') as HTMLElement,
        impressum: document.querySelector('.Impressum-Page') as HTMLElement,
        datenschutz: document.querySelector('.Datenschutz-Page') as HTMLElement,
        ueberuns: document.querySelector('.Überuns-Page') as HTMLElement,
        dashboard: document.querySelector('.Dashboard-Page') as HTMLElement,
        benutzer: document.querySelector('.Benutzer-Page') as HTMLElement,
        marktplatz: document.querySelector('.Marktplatz-Page') as HTMLElement,
        produktdetail: document.querySelector('.Produktdetail-Page') as HTMLElement
    };

    const header = document.querySelector('header') as HTMLElement;
    const footer = document.querySelector('footer') as HTMLElement;

    const showPage = (pageKey: keyof typeof pages) => {
        Object.values(pages).forEach(page => page.style.display = 'none');
        const target = pages[pageKey];
        if (target) {
            target.style.display = 'block';
            const isAdminPage = pageKey === 'dashboard' || pageKey === 'benutzer';
            header.classList.toggle('hide', isAdminPage);
            footer.classList.toggle('hide', isAdminPage);
        }
    };

    showPage('start');

    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = (link as HTMLElement).dataset.page as keyof typeof pages;
            if (page) showPage(page);
        });
    });

    document.querySelectorAll('.logo-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showPage('start');
        });
    });

    document.querySelectorAll('.btn-sidebar').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageKey = (button as HTMLElement).dataset.page as keyof typeof pages;
            if (pageKey) showPage(pageKey);
        });
    });

    const dashboardBtn = document.querySelector('.dashboard-btn') as HTMLElement | null;

    const updateHeaderVisibility = async () => {
        try {
            const res = await fetch('/api/session', { credentials: 'include' });
            const data = await res.json();

            document.querySelectorAll('.btn.btn-gradient').forEach(btn => {
                const el = btn as HTMLElement;
                if (el.textContent?.includes('Login') || el.textContent?.includes('Registrieren')) {
                    el.style.display = data.user ? 'none' : 'inline-block';
                }
            });

            if (dashboardBtn) {
                dashboardBtn.style.display = data.user?.role === 'Admin' ? 'inline-block' : 'none';
            }
        } catch (err) {
            console.error('Fehler beim Session-Check:', err);
        }
    };

    pages.start.style.display = 'block';
    updateHeaderVisibility();

    const profileIcons = document.querySelectorAll('.bi-person-circle, #dashboard-profile-icon, #benutzer-profile-icon');
    profileIcons.forEach(icon => {
        icon.addEventListener('click', async () => {
            try {
                const res = await fetch('/api/session', { credentials: 'include' });
                const data = await res.json();
                if (res.ok && data.user) {
                    showPage('profile');
                    fillProfile(data.user);
                    updateHeaderVisibility();
                } else {
                    showPage('login');
                }
            } catch (err) {
                console.error('Fehler beim Laden des Profils:', err);
            }
        });
    });

    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', async () => {
            const res = await fetch('/api/session', { credentials: 'include' });
            const data = await res.json();
            if (data.user?.role === 'Admin') {
                showPage('dashboard');
            } else {
                alert('Kein Zugriff – nur Admins.');
            }
        });
    }

    // Produktdetailseite öffnen/schließen
    const addBtn = document.getElementById('open-product-detail');
    const backBtn = document.getElementById('back-to-profile');
    addBtn?.addEventListener('click', () => showPage('produktdetail'));
    backBtn?.addEventListener('click', () => showPage('profile'));

    const fillProfile = (user: any) => {
        const map: Record<string, string> = {
            '#profil-vorname': user.givenName,
            '#profil-nachname': user.familyName,
            '#profil-email': user.email,
            '#profil-passwort': '',
            '#profil-telefon': user.mobileNumber,
            '#profil-strasse': user.street || '',
            '#profil-plz': user.zip || '',
            '#profil-stadt': user.city || ''
        };
        for (const selector in map) {
            const input = document.querySelector(selector) as HTMLInputElement;
            if (input) {
                input.value = map[selector];
                input.setAttribute('readonly', 'true');
                input.style.backgroundColor = '';
            }
        }
    };

    const editIcon = document.querySelector('.icon-pencil') as HTMLElement | null;
    const buttonContainer = editIcon?.parentElement as HTMLElement | null;
    if (editIcon && buttonContainer) {
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Speichern';
        saveBtn.className = 'btn btn-purple btn-dashboard ms-2';
        saveBtn.style.display = 'none';
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Löschen';
        deleteBtn.className = 'btn btn-purple btn-dashboard ms-2';
        deleteBtn.style.display = 'none';
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(deleteBtn);
        editIcon.addEventListener('click', () => {
            document.querySelectorAll('.Profil-Page input').forEach(input => {
                const el = input as HTMLInputElement;
                el.removeAttribute('readonly');
                el.style.backgroundColor = '#1a1a1a';
            });
            editIcon.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
        });
        saveBtn.addEventListener('click', async () => {
            const getInputValue = (id: string) => {
                const el = document.getElementById(id) as HTMLInputElement | null;
                return el?.value.trim() || '';
            };
            const data = {
                givenName: getInputValue('profil-vorname'),
                familyName: getInputValue('profil-nachname'),
                email: getInputValue('profil-email'),
                mobileNumber: getInputValue('profil-telefon'),
                street: getInputValue('profil-strasse'),
                zip: getInputValue('profil-plz'),
                city: getInputValue('profil-stadt'),
                password: getInputValue('profil-passwort')
            };
            try {
                const response = await fetch('/api/user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    ['profil-vorname','profil-nachname','profil-email','profil-telefon','profil-strasse','profil-plz','profil-stadt','profil-passwort']
                        .forEach(id => {
                            const input = document.getElementById(id) as HTMLInputElement | null;
                            if (input) {
                                input.setAttribute('readonly','true');
                                input.style.backgroundColor = '';
                            }
                        });
                    editIcon.style.display = 'inline-block';
                    saveBtn.style.display = 'none';
                    deleteBtn.style.display = 'none';
                    updateHeaderVisibility();
                }
            } catch (err) {
                alert('Fehler beim Speichern.');
                console.error(err);
            }
        });
        deleteBtn.addEventListener('click', async () => {
            if (!confirm('Willst du dein Profil wirklich löschen?')) return;
            try {
                const response = await fetch('/api/user', {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const result = await response.json();
                alert(result.message);
                if (response.ok) window.location.reload();
            } catch (err) {
                alert('Fehler beim Löschen.');
                console.error(err);
            }
        });
    }

    const afterLoginSuccess = () => {
        showPage('start');
        updateHeaderVisibility();
    };

    const form = document.getElementById('formInput') as HTMLFormElement | null;
    const output = document.getElementById('registerOutput') as HTMLElement | null;
    if (form && output) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const getValue = (id: string): string => (document.getElementById(id) as HTMLInputElement)?.value || '';
            const data = {
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
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                output.textContent = result.message;
                output.style.color = response.ok ? 'green' : 'red';
                if (response.ok) afterLoginSuccess();
            } catch {
                output.textContent = 'Fehler beim Senden der Daten.';
                output.style.color = 'red';
            }
        });
    }

    const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
    const emailInput = document.getElementById('loginEmail') as HTMLInputElement | null;
    const passwordInput = document.getElementById('loginPassword') as HTMLInputElement | null;
    if (loginForm && emailInput && passwordInput) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = { email: emailInput.value, password: passwordInput.value };
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                const out = document.getElementById('loginOutput')!;
                out.textContent = result.message;
                out.style.color = response.ok ? 'green' : 'red';
                if (response.ok) afterLoginSuccess();
            } catch (err) {
                console.error('Fehler beim Login', err);
            }
        });
    }

    document.getElementById('btn-login')?.addEventListener('click', e => { e.preventDefault(); showPage('login'); });
    document.getElementById('btn-register')?.addEventListener('click', e => { e.preventDefault(); showPage('login'); });

    document.getElementById('btn-logout')?.addEventListener('click', async () => {
        try {
            const res = await fetch('/logout', { method: 'POST', credentials: 'include' });
            if (res.ok) {
                emailInput!.value = '';
                passwordInput!.value = '';
                document.getElementById('loginOutput')!.textContent = '';
                showPage('start');
                updateHeaderVisibility();
            }
        } catch (err) {
            console.error('Fehler beim Logout:', err);
        }
    });

    // === Admin: User-CRUD im Dashboard ===
        const loadUsers = async () => {
        const table = document.querySelector('.Benutzer-Page table') as HTMLTableElement;
        const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
        if (!tbody) return console.error('Kein <tbody> gefunden');
        tbody.innerHTML = '';

        // Kopfzeile neu aufbauen
        if (table.tHead) table.removeChild(table.tHead);
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        ['ID','Vorname','Nachname','E-Mail','Telefonnummer','Straße','PLZ','Ort','Rolle','Passwort','Aktionen']
            .forEach(text => {
                const th = document.createElement('th');
                th.innerText = text;
                headerRow.appendChild(th);
            });

        // Eingabezeile für neuen Benutzer
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <td>-</td>
        <td contenteditable="true" data-field="givenName"></td>
        <td contenteditable="true" data-field="familyName"></td>
        <td contenteditable="true" data-field="email"></td>
        <td contenteditable="true" data-field="mobileNumber"></td>
        <td contenteditable="true" data-field="street"></td>
        <td contenteditable="true" data-field="zip"></td>
        <td contenteditable="true" data-field="city"></td>
        <td>
          <select data-field="role">
            <option>Admin</option>
            <option selected>Kunde</option>
          </select>
        </td>
        <td data-field="password">••••••</td>
        <td><button class="btn btn-sm btn-primary btn-add">+</button></td>
    `;
        tbody.appendChild(newRow);

        try {
            // 📥 GET: Benutzer abrufen
            const response = await fetch('/api/users', { credentials: 'include' });
            if (!response.ok) throw new Error('Fehler beim Abrufen');
            const userList: any[] = await response.json();

            // Für jeden Benutzer eine Tabellenzeile erstellen
            userList.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${user.id}</td>
                <td contenteditable="true" data-field="givenName">${user.givenName}</td>
                <td contenteditable="true" data-field="familyName">${user.familyName}</td>
                <td contenteditable="true" data-field="email">${user.email}</td>
                <td contenteditable="true" data-field="mobileNumber">${user.mobileNumber || ''}</td>
                <td contenteditable="true" data-field="street">${user.street || ''}</td>
                <td contenteditable="true" data-field="zip">${user.zip || ''}</td>
                <td contenteditable="true" data-field="city">${user.city || ''}</td>
                <td>
                  <select data-field="role">
                    <option${user.role==='Admin' ? ' selected' : ''}>Admin</option>
                    <option${user.role==='Kunde' ? ' selected' : ''}>Kunde</option>
                  </select>
                </td>
                <td data-field="password">••••••</td>
                <td>
                  <button class="btn btn-sm btn-success btn-update" data-id="${user.id}">💾</button>
                  <button class="btn btn-sm btn-danger btn-delete" data-id="${user.id}">🗑️</button>
                </td>
            `;
                tbody.appendChild(row);
            });

            // 🔁 PUT: Benutzer aktualisieren
            tbody.querySelectorAll('.btn-update').forEach(updateButton => {
                updateButton.addEventListener('click', async () => {
                    const userId = (updateButton as HTMLElement).dataset.id!;
                    const row = (updateButton as HTMLElement).closest('tr')!;
                    const updatedUserData: any = {};

                    row.querySelectorAll('[data-field]').forEach(cell => {
                        const fieldName = (cell as HTMLElement).dataset.field!;
                        const value = cell.hasAttribute('contenteditable')
                            ? (cell as HTMLElement).innerText.trim()
                            : (cell as HTMLSelectElement).value;
                        if (fieldName === 'password' && value === '••••••') return;
                        updatedUserData[fieldName] = value;
                    });

                    const updateResponse = await fetch(`/api/users/${userId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify(updatedUserData)
                    });

                    const updateResult = await updateResponse.json();
                    alert(updateResult.message);
                    loadUsers();
                });
            });

            // 🗑️ DELETE: Benutzer löschen
            tbody.querySelectorAll('.btn-delete').forEach(deleteButton => {
                deleteButton.addEventListener('click', async () => {
                    if (!confirm('User wirklich löschen?')) return;
                    const userId = (deleteButton as HTMLElement).dataset.id!;
                    const deleteResponse = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    const deleteResult = await deleteResponse.json();
                    alert(deleteResult.message);
                    loadUsers();
                });
            });

            // ➕ POST: Benutzer hinzufügen
            newRow.querySelector('.btn-add')!.addEventListener('click', async () => {
                const newUserData: any = {};
                newRow.querySelectorAll('[data-field]').forEach(cell => {
                    const fieldName = (cell as HTMLElement).dataset.field!;
                    const value = cell.hasAttribute('contenteditable')
                        ? (cell as HTMLElement).innerText.trim()
                        : (cell as HTMLSelectElement).value;
                    newUserData[fieldName] = value;
                });

                const createResponse = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(newUserData)
                });

                const createResult = await createResponse.json();
                if (createResponse.ok) {
                    alert(`User (ID ${createResult.id}) wurde erstellt. Passwort: ${createResult.password}`);
                    newRow.querySelector('td')!.innerText = String(createResult.id);
                    newRow.querySelector('[data-field="password"]')!.textContent = '••••••';
                } else {
                    alert(`Fehler: ${createResult.message}`);
                }
            });

        } catch (error) {
            console.error(error);
            alert('Fehler beim Laden der User.');
        }
    };


    document.querySelectorAll('[data-page="benutzer"]').forEach(el => {
        el.addEventListener('click', () => loadUsers());
    });
});
