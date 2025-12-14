# 🚀 Code zu GitHub pushen & auf Vercel deployen

## Schritt 1: Code zu GitHub pushen

Führen Sie diese Befehle aus:

```powershell
git push
```

Das pusht alle Änderungen zu GitHub.

## Schritt 2: Auf Vercel deployen

### Option A: Wenn Sie bereits ein Vercel-Projekt haben

1. Gehen Sie zu: https://vercel.com/dashboard
2. Klicken Sie auf Ihr Projekt
3. Klicken Sie auf "Redeploy" oder warten Sie (Auto-Deploy)

### Option B: Neues Projekt auf Vercel erstellen

1. **Gehen Sie zu:** https://vercel.com
2. **Anmelden** mit GitHub (falls noch nicht geschehen)
3. **"Add New..." → "Project"** klicken
4. **Repository auswählen:** `thefatsans/igs-simex-website`
5. **Konfiguration:**
   - Framework Preset: "Other" 
   - Root Directory: `./`
   - Build Command: (LEER lassen)
   - Output Directory: (LEER lassen)
   - Install Command: `npm install`
6. **Umgebungsvariablen** (optional):
   - `EMAIL_ENABLED` = `false`
7. **"Deploy"** klicken

## Schritt 3: URL finden

Nach dem Deployment:

1. Im Vercel Dashboard sehen Sie: "Congratulations!"
2. Die URL steht oben: `https://ihr-projekt-name.vercel.app`
3. **WICHTIG:** Die URL kann anders sein als `igs-simex-website.vercel.app`
   - Vercel kann automatisch einen anderen Namen vergeben

## Schritt 4: Testen

1. Öffnen Sie die URL aus Schritt 3
2. Testen Sie: `https://ihre-url.vercel.app/api/health`
   - Sollte zurückgeben: `{"status":"ok","timestamp":"..."}`

## ⚠️ Wichtige Hinweise:

- **Die URL `https://igs-simex-website.vercel.app/` ist nur ein Beispiel!**
- Ihre echte URL kann anders sein
- Prüfen Sie das Vercel Dashboard für die genaue URL
- Nach dem ersten Push deployed Vercel automatisch

---

**Haben Sie das Projekt bereits auf Vercel erstellt?**
- ✅ Ja → Führen Sie `git push` aus, dann wird automatisch neu deployed
- ❌ Nein → Folgen Sie Option B oben
