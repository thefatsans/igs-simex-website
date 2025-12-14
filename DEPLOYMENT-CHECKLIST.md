# Deployment Checklist - Warum funktioniert die URL nicht?

## ✅ Schritt 1: Prüfen ob Code auf GitHub ist

Ihr Repository: `https://github.com/thefatsans/igs-simex-website`

**Prüfen:**
- Gehen Sie zu: https://github.com/thefatsans/igs-simex-website
- Sehen Sie Ihre Dateien dort? ✅ Dann weiter zu Schritt 2

## ✅ Schritt 2: Code zu GitHub pushen (falls nötig)

```powershell
git add .
git commit -m "Ready for deployment"
git push
```

## ✅ Schritt 3: Vercel Account & Projekt erstellen

1. **Gehen Sie zu:** https://vercel.com
2. **Anmelden:** Klicken Sie auf "Sign Up" → "Continue with GitHub"
3. **Autorisieren:** Erlauben Sie Vercel Zugriff auf GitHub
4. **Neues Projekt:**
   - Klicken Sie auf "Add New..." → "Project"
   - Wählen Sie das Repository: `thefatsans/igs-simex-website`
   - Klicken Sie auf "Import"

## ✅ Schritt 4: Konfiguration auf Vercel

**WICHTIG:** Verwenden Sie diese Einstellungen:

- **Framework Preset:** "Other" (oder Vercel erkennt es automatisch)
- **Root Directory:** `./` (leer lassen oder `./`)
- **Build Command:** (LEER lassen - kein Build nötig)
- **Output Directory:** (LEER lassen)
- **Install Command:** `npm install` (automatisch)

**Umgebungsvariablen:** (Optional, aber empfohlen)
- `EMAIL_ENABLED` = `false`
- `RECIPIENT_EMAIL` = `info@igs-simex.de` (oder Ihre Email)

## ✅ Schritt 5: Deploy!

- Klicken Sie auf "Deploy"
- Warten Sie 1-2 Minuten
- ✅ **Sie erhalten eine URL wie:**
  - `https://igs-simex-website-xxxxx.vercel.app` oder
  - `https://igs-simex-website.vercel.app`

## ⚠️ Häufige Probleme:

### Problem: "404 Not Found" oder Link funktioniert nicht

**Mögliche Ursachen:**

1. **Projekt wurde noch nicht deployed**
   - ✅ Lösung: Folgen Sie Schritt 3-5 oben

2. **Falsche URL**
   - Die URL kann anders sein als erwartet
   - ✅ Lösung: Prüfen Sie das Vercel Dashboard für die genaue URL

3. **Deployment fehlgeschlagen**
   - ✅ Lösung: Prüfen Sie die Logs im Vercel Dashboard
   - Schauen Sie unter "Deployments" → Klicken Sie auf das Deployment → "Logs"

4. **Fehlende Dateien**
   - ✅ Lösung: Stellen Sie sicher, dass alle Dateien zu GitHub gepusht wurden

### Problem: Build fehlgeschlagen

**Mögliche Ursachen:**

1. **Dependencies fehlen**
   - ✅ Lösung: `package.json` muss vorhanden sein

2. **Fehler im Code**
   - ✅ Lösung: Prüfen Sie die Build-Logs in Vercel

## 🔍 Wie finden Sie Ihre echte URL?

1. Gehen Sie zu: https://vercel.com/dashboard
2. Klicken Sie auf Ihr Projekt
3. Die URL steht oben: `https://ihr-projekt-name.vercel.app`

## 📞 Brauchen Sie Hilfe?

Wenn nach diesen Schritten die URL immer noch nicht funktioniert:
1. Prüfen Sie die Vercel Logs
2. Teilen Sie die Fehlermeldung
3. Oder kontaktieren Sie Vercel Support

---

**Tipp:** Die URL kann anders sein als `igs-simex-website.vercel.app` - prüfen Sie das Vercel Dashboard für die genaue URL!
