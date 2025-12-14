# Schnellstart: Website auf Vercel deployen

## Schritt 1: GitHub Repository erstellen

1. **GitHub Account erstellen** (falls noch nicht vorhanden)
   - Gehen Sie zu https://github.com
   - Klicken Sie auf "Sign up"

2. **Repository erstellen**
   - Klicken Sie auf das "+" oben rechts → "New repository"
   - Repository-Name: z.B. `igs-simex-website`
   - Öffentlich oder Privat (wie Sie möchten)
   - **NICHT** "Initialize with README" aktivieren
   - Klicken Sie auf "Create repository"

3. **Git konfigurieren** (nur beim ersten Mal)

   Öffnen Sie PowerShell im Projektordner:

   ```powershell
   # Git-Identität einrichten (ersetzen Sie mit Ihren Daten)
   git config --global user.name "Ihr Name"
   git config --global user.email "ihre-email@example.com"
   ```

   **Hinweis:** Diese Einstellung ist global und muss nur einmal gemacht werden.

4. **Code zu GitHub hochladen**

   Weiter im gleichen PowerShell-Fenster:

   ```powershell
   # Git initialisieren (falls noch nicht geschehen)
   git init
   
   # Alle Dateien hinzufügen
   git add .
   
   # Erster Commit
   git commit -m "Initial commit - IGS Simex Website"
   
   # Repository verbinden (ersetzen Sie IHR-USERNAME und IHR-REPO-NAME)
   git remote add origin https://github.com/IHR-USERNAME/IHR-REPO-NAME.git
   
   # Branch umbenennen
   git branch -M main
   
   # Code hochladen
   git push -u origin main
   ```

   Wenn Sie nach Benutzername/Passwort gefragt werden:
   - Benutzername: Ihr GitHub-Benutzername
   - Passwort: Personal Access Token (nicht Ihr Passwort!)
   - Token erstellen: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token

---

## Schritt 2: Vercel Setup

1. **Vercel Account erstellen**
   - Gehen Sie zu https://vercel.com
   - Klicken Sie auf "Sign Up"
   - Wählen Sie "Continue with GitHub"
   - Autorisieren Sie Vercel

2. **Neues Projekt erstellen**
   - Klicken Sie auf "Add New..." → "Project"
   - Wählen Sie Ihr Repository aus (igs-simex-website)
   - Klicken Sie auf "Import"

3. **Konfiguration**
   - Framework Preset: "Other" (wird automatisch erkannt)
   - Root Directory: `./` (bleibt so)
   - Build Command: (leer lassen)
   - Output Directory: (leer lassen)
   - Install Command: `npm install`

4. **Umgebungsvariablen hinzufügen**
   - Scrollen Sie nach unten zu "Environment Variables"
   - Fügen Sie folgende Variablen hinzu:
   
     ```
     NAME: PORT
     VALUE: 3000
     ```
     
     ```
     NAME: EMAIL_ENABLED
     VALUE: false
     ```
     
     ```
     NAME: RECIPIENT_EMAIL
     VALUE: info@igs-simex.de
     ```
   
   - Falls Sie Email aktivieren möchten, fügen Sie später hinzu:
     ```
     EMAIL_ENABLED=true
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_SECURE=false
     SMTP_USER=ihre-email@gmail.com
     SMTP_PASS=ihr-app-passwort
     ```

5. **Deploy!**
   - Klicken Sie auf "Deploy"
   - Warten Sie 1-2 Minuten
   - ✅ Fertig! Ihre Website ist jetzt online!

---

## Schritt 3: Website testen

1. **URL finden**
   - Nach dem Deploy sehen Sie eine URL wie: `https://igs-simex-website.vercel.app`
   - Diese URL ist Ihre Live-Website!
   - **Hinweis:** Sie brauchen KEINE eigene Domain! Vercel gibt Ihnen kostenlos diese URL.

2. **Testen**
   - Öffnen Sie die URL im Browser
   - Testen Sie das Kontaktformular
   - Prüfen Sie, ob alles funktioniert

3. **Custom Domain (optional - NICHT notwendig!)**
   - **Sie brauchen KEINE eigene Domain!** Die kostenlose `.vercel.app` URL reicht völlig aus.
   - Falls Sie später doch eine eigene Domain möchten (z.B. `igs-simex.de`):
     - In Vercel: Settings → Domains
     - Domain hinzufügen
     - DNS-Einstellungen folgen (Vercel erklärt Ihnen wie)

---

## Schritt 4: Automatisches Deployment

Ab jetzt:
- **Jede Änderung**, die Sie zu GitHub pushen, wird automatisch auf Vercel deployed!
- Keine manuelle Arbeit mehr nötig ✨

Beispiel:
```powershell
# Dateien ändern, dann:
git add .
git commit -m "Beschreibung der Änderung"
git push
```
→ Vercel deployed automatisch in ~1 Minute!

---

## Wichtige Hinweise

### ⚠️ Sensible Daten schützen
- Die Datei `.env` sollte **NIE** zu GitHub committed werden
- Sie ist bereits in `.gitignore` aufgelistet
- Verwenden Sie stattdessen Vercel Environment Variables

### 📁 Submissions Ordner
- Auf Vercel (Serverless) werden Dateien in `submissions/` nicht persistent gespeichert
- **Lösung**: Verwenden Sie eine Datenbank oder einen externen Service
- Für den Anfang: Email-Benachrichtigungen aktivieren, dann sind Einsendungen in Ihrem Postfach

### 🔄 Updates
- Alle Änderungen werden automatisch deployed
- Sie können auch manuell in Vercel redeployen: Deployments → ⋮ → Redeploy

---

## Troubleshooting

### "Build failed"
- Prüfen Sie die Logs in Vercel
- Stellen Sie sicher, dass `package.json` korrekt ist
- Prüfen Sie, ob alle Dependencies vorhanden sind

### "404 Not Found" für `/api/*`
- Prüfen Sie, ob `vercel.json` im Projekt vorhanden ist
- Prüfen Sie die Vercel Logs

### Formular sendet nicht
- Öffnen Sie Browser-Konsole (F12)
- Prüfen Sie Fehlermeldungen
- Prüfen Sie, ob `/api/health` funktioniert

### Domain funktioniert nicht
- DNS-Einstellungen können bis zu 24 Stunden dauern
- Prüfen Sie DNS-Einstellungen in Ihrem Domain-Provider
- Vercel zeigt Ihnen die benötigten DNS-Einträge

---

## Kostenloser Plan Limits

- ✅ 100 GB Bandbreite/Monat
- ✅ Unbegrenzte Deployments
- ✅ SSL/HTTPS automatisch
- ✅ Custom Domains möglich
- ✅ Serverless Functions

Für eine Schulwebsite sollte das ausreichen! 🎉

---

## Support

Bei Problemen:
1. Vercel Logs prüfen (im Dashboard)
2. Browser-Konsole prüfen (F12)
3. GitHub Issues prüfen
4. Vercel Dokumentation: https://vercel.com/docs
