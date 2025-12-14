# Schnellstart-Anleitung - Backend Setup

## Schritt 1: Node.js installieren
Falls noch nicht installiert:
- Download von https://nodejs.org/
- Installation durchführen
- Terminal öffnen und testen: `node --version`

## Schritt 2: Dependencies installieren
Im Projektordner im Terminal ausführen:
```bash
npm install
```

## Schritt 3: Server starten

### Option A: Ohne Email (einfachste Lösung)
Die Datei `.env` erstellen mit folgendem Inhalt:
```
PORT=3000
EMAIL_ENABLED=false
```

Dann Server starten:
```bash
npm start
```

### Option B: Mit Email-Benachrichtigungen
1. Datei `.env` erstellen (kopieren Sie `env.example` zu `.env`)
2. `.env` bearbeiten und Email-Daten eintragen
3. Server starten: `npm start`

## Schritt 4: Testen
1. Browser öffnen: `http://localhost:3000`
2. Zum Kontaktformular scrollen
3. Test-Nachricht senden
4. Prüfen Sie den `submissions/` Ordner - dort sollte eine JSON-Datei erscheinen

## Troubleshooting

**"npm command not found"**
→ Node.js ist nicht installiert oder nicht im PATH

**"Port 3000 already in use"**
→ Ändern Sie PORT in `.env` zu einem anderen Wert (z.B. 3001)

**Email funktioniert nicht**
→ Prüfen Sie `.env` Einstellungen
→ Für Gmail: App-Passwort verwenden (nicht das normale Passwort!)

## Nächste Schritte

Siehe `README-BACKEND.md` für ausführliche Dokumentation!
