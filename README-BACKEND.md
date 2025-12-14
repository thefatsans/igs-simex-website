# Backend-Setup für IGS Simex Website

Dieses Backend-System ermöglicht es, Formular-Einsendungen und Nachrichten zu empfangen und zu verarbeiten.

## Features

- ✅ Kontaktformular-Verarbeitung
- ✅ Formular-Einsendungen (Anmeldungen, Beurlaubungen, etc.)
- ✅ Automatische Speicherung aller Einsendungen als JSON-Dateien
- ✅ Optional: Email-Benachrichtigungen bei neuen Einsendungen
- ✅ RESTful API-Endpoints

## Installation

1. **Node.js installieren** (falls noch nicht installiert)
   - Download von https://nodejs.org/
   - Version 16 oder höher empfohlen

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   - Kopieren Sie `env.example` zu `.env`
   - Bearbeiten Sie `.env` und passen Sie die Einstellungen an

## Konfiguration

### Basis-Konfiguration (ohne Email)

Die einfachste Konfiguration funktioniert ohne Email-Setup:

```env
PORT=3000
EMAIL_ENABLED=false
```

Alle Einsendungen werden in `submissions/` als JSON-Dateien gespeichert.

### Email-Konfiguration (optional)

Um Email-Benachrichtigungen zu erhalten:

1. **Gmail Beispiel:**
   ```env
   EMAIL_ENABLED=true
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=ihre-email@gmail.com
   SMTP_PASS=ihr-app-passwort
   RECIPIENT_EMAIL=info@igs-simex.de
   ```
   
   **Wichtig für Gmail:** Sie benötigen ein "App-Passwort":
   - Google-Konto → Sicherheit → 2-Faktor-Authentifizierung aktivieren
   - App-Passwörter generieren
   - Dieses Passwort in `.env` verwenden (nicht das normale Passwort!)

2. **Andere SMTP-Server:**
   ```env
   EMAIL_ENABLED=true
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false  # true für Port 465
   SMTP_USER=ihre-email@example.com
   SMTP_PASS=ihr-passwort
   RECIPIENT_EMAIL=info@igs-simex.de
   ```

## Server starten

### Entwicklung (mit Auto-Reload):
```bash
npm run dev
```

### Produktion:
```bash
npm start
```

Der Server läuft standardmäßig auf `http://localhost:3000`

## API-Endpoints

### POST /api/contact
Kontaktformular-Einsendung

**Request Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "subject": "Frage zur Anmeldung",
  "message": "Ich habe eine Frage..."
}
```

### POST /api/application
Anmeldungsformular-Einsendung

### POST /api/leave-request
Beurlaubungsantrag

### POST /api/lunch-registration
Mittagessen-Anmeldung

### POST /api/submit-form
Allgemeines Formular (flexibel)

**Request Body:**
```json
{
  "formType": "beurlaubung",
  "formData": {
    "name": "...",
    "datum": "...",
    ...
  }
}
```

### GET /api/health
Health Check - prüft ob der Server läuft

## Einsendungen speichern

Alle Einsendungen werden automatisch in `submissions/` gespeichert:

- Format: `{typ}_{timestamp}.json`
- Beispiel: `contact_2025-01-15T10-30-45-123Z.json`
- Struktur:
  ```json
  {
    "type": "contact",
    "timestamp": "2025-01-15T10:30:45.123Z",
    "data": {
      "name": "...",
      "email": "...",
      ...
    }
  }
  ```

## Frontend-Integration

Das Kontaktformular ist bereits integriert und sendet automatisch an `/api/contact`.

### Andere Formulare einbinden

Um ein Formular an das Backend zu senden:

```javascript
const formData = {
  name: document.getElementById('nameInput').value,
  // ... andere Felder
};

const response = await fetch('/api/submit-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formType: 'mein-formular',
    formData: formData
  })
});

const result = await response.json();
if (result.success) {
  alert(result.message);
}
```

## Sicherheit

- ⚠️ **WICHTIG:** `.env` Datei niemals committen (steht bereits in `.gitignore`)
- ⚠️ **WICHTIG:** `submissions/` Ordner sollte nicht öffentlich zugänglich sein
- ⚠️ Für Produktion: Rate Limiting, CSRF-Schutz, etc. hinzufügen

## Produktion

Für Produktion sollten Sie:

1. **Node.js-Prozess-Manager verwenden** (z.B. PM2):
   ```bash
   npm install -g pm2
   pm2 start server.js --name igs-simex
   ```

2. **Reverse Proxy einrichten** (z.B. Nginx):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **HTTPS einrichten** (SSL-Zertifikat)

## Troubleshooting

### Email wird nicht gesendet
- Prüfen Sie, ob `EMAIL_ENABLED=true` in `.env` steht
- Prüfen Sie SMTP-Credentials
- Prüfen Sie Server-Logs für Fehlermeldungen
- Gmail: App-Passwort verwenden, nicht das normale Passwort

### Server startet nicht
- Prüfen Sie, ob Node.js installiert ist: `node --version`
- Prüfen Sie, ob Port 3000 bereits belegt ist
- Installieren Sie Dependencies: `npm install`

### Formular sendet nicht
- Prüfen Sie Browser-Konsole für Fehler
- Prüfen Sie, ob Server läuft: `http://localhost:3000/api/health`
- Prüfen Sie CORS-Einstellungen (falls Frontend auf anderem Port)

## Support

Bei Fragen oder Problemen:
- Server-Logs prüfen
- Browser-Console prüfen
- API-Endpoint direkt testen (z.B. mit Postman)
