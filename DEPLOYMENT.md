# Website Online Stellen - Deployment-Anleitung

Es gibt mehrere Möglichkeiten, Ihre Website online zu stellen. Hier sind die einfachsten Optionen:

## Option 1: Alles auf Vercel (EMPFOHLEN - Einfachste Lösung)

Vercel unterstützt sowohl Frontend als auch Backend (Serverless Functions).

### Voraussetzungen:
- GitHub Account (kostenlos)
- Vercel Account (kostenlos)

### Schritte:

1. **GitHub Repository erstellen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
   - Gehen Sie zu https://github.com/new
   - Erstellen Sie ein neues Repository
   - Befolgen Sie die Anweisungen zum Pushen:
   ```bash
   git remote add origin https://github.com/IHR-USERNAME/IHR-REPO.git
   git branch -M main
   git push -u origin main
   ```

2. **Vercel Setup**
   - Gehen Sie zu https://vercel.com
   - Melden Sie sich mit GitHub an
   - Klicken Sie auf "New Project"
   - Wählen Sie Ihr Repository aus
   - Vercel erkennt automatisch die Node.js-App
   - Fügen Sie Umgebungsvariablen hinzu (Settings → Environment Variables):
     - `PORT=3000`
     - `EMAIL_ENABLED=false` (oder Email-Daten wenn gewünscht)
     - `RECIPIENT_EMAIL=info@igs-simex.de`
     - etc.
   - Klicken Sie auf "Deploy"

3. **Anpassungen für Vercel**
   
   Erstellen Sie `vercel.json` im Projektordner:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

   Oder noch besser: Backend in Serverless Functions umwandeln (siehe unten)

---

## Option 2: Frontend auf Netlify, Backend auf Railway

### Frontend (Netlify):

1. **GitHub Repository erstellen** (siehe Option 1)

2. **Netlify Setup**
   - Gehen Sie zu https://netlify.com
   - Klicken Sie auf "New site from Git"
   - Wählen Sie GitHub und Ihr Repository
   - Build-Einstellungen:
     - Build command: (leer lassen - statische Seite)
     - Publish directory: `.` oder `dist` (je nach Struktur)
   - Klicken Sie auf "Deploy site"

3. **Backend-URL anpassen**
   
   In `script.js` die API-URL ändern:
   ```javascript
   const API_URL = process.env.NODE_ENV === 'production' 
     ? 'https://ihr-backend.railway.app' 
     : 'http://localhost:3000';
   
   const response = await fetch(`${API_URL}/api/contact`, {
     // ...
   });
   ```

### Backend (Railway):

1. **Railway Setup**
   - Gehen Sie zu https://railway.app
   - Melden Sie sich mit GitHub an
   - Klicken Sie auf "New Project"
   - Wählen Sie "Deploy from GitHub repo"
   - Wählen Sie Ihr Repository
   - Railway erkennt automatisch Node.js

2. **Umgebungsvariablen**
   - In Railway: Variables Tab
   - Fügen Sie alle Variablen aus `.env` hinzu
   - `PORT` wird automatisch gesetzt (kann entfernt werden)

3. **Deployment**
   - Railway deployed automatisch bei jedem Git Push

---

## Option 3: Alles auf einem VPS (Für mehr Kontrolle)

### Option A: DigitalOcean Droplet

1. **Droplet erstellen**
   - Gehen Sie zu https://digitalocean.com
   - Erstellen Sie einen Droplet (Ubuntu, $6/Monat)
   - Wählen Sie SSH-Key oder Password

2. **Server einrichten**
   ```bash
   # SSH-Verbindung herstellen
   ssh root@IHRE-IP
   
   # Node.js installieren
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # PM2 installieren (Prozess-Manager)
   sudo npm install -g pm2
   
   # Nginx installieren (Reverse Proxy)
   sudo apt update
   sudo apt install nginx
   
   # Git installieren
   sudo apt install git
   ```

3. **Website hochladen**
   ```bash
   # Projekt klonen oder hochladen
   git clone https://github.com/IHR-USERNAME/IHR-REPO.git
   cd IHR-REPO
   
   # Dependencies installieren
   npm install
   
   # .env Datei erstellen
   nano .env
   # (Daten eintragen, dann Ctrl+X, Y, Enter)
   
   # Server starten mit PM2
   pm2 start server.js --name igs-simex
   pm2 save
   pm2 startup
   ```

4. **Nginx konfigurieren**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Ersetzen Sie den Inhalt mit:
   ```nginx
   server {
       listen 80;
       server_name IHRE-DOMAIN.de www.IHRE-DOMAIN.de;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL/HTTPS einrichten (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d IHRE-DOMAIN.de -d www.IHRE-DOMAIN.de
   ```

---

## Option 4: Render (Alternative zu Railway)

1. **Render Setup**
   - Gehen Sie zu https://render.com
   - Melden Sie sich mit GitHub an
   - Klicken Sie auf "New +" → "Web Service"
   - Verbinden Sie Ihr GitHub Repository
   - Einstellungen:
     - Name: igs-simex-backend
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Fügen Sie Umgebungsvariablen hinzu
   - Klicken Sie auf "Create Web Service"

2. **Frontend ebenfalls auf Render**
   - "New +" → "Static Site"
   - Repository auswählen
   - Build Command: (leer)
   - Publish Directory: `.`

---

## Wichtige Vorbereitungen vor dem Deployment:

### 1. Environment Variables prüfen

Stellen Sie sicher, dass alle sensiblen Daten in `.env` sind und NICHT im Code stehen!

### 2. CORS einrichten (falls Frontend und Backend getrennt)

In `server.js` CORS anpassen:
```javascript
app.use(cors({
  origin: ['https://ihre-website.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 3. Statische Dateien

Vercel/Netlify serviert automatisch statische Dateien. Für andere Lösungen möglicherweise anpassen.

### 4. Database (optional für später)

Falls Sie später eine Datenbank benötigen:
- MongoDB Atlas (kostenlos)
- PostgreSQL auf Railway/Render
- MySQL auf verschiedenen Hostern

---

## Kostenvergleich:

| Lösung | Kosten/Monat | Einfachheit | Features |
|--------|--------------|-------------|----------|
| Vercel (alles) | Kostenlos (bis zu bestimmten Limits) | ⭐⭐⭐⭐⭐ | Serverless, Auto-Deploy |
| Netlify + Railway | Kostenlos (bis zu bestimmten Limits) | ⭐⭐⭐⭐ | Getrenntes Hosting |
| Render | Kostenlos (bis zu bestimmten Limits) | ⭐⭐⭐⭐ | Ähnlich Railway |
| DigitalOcean | $6+/Monat | ⭐⭐⭐ | Volle Kontrolle, mehr Arbeit |
| Heroku | $7+/Monat | ⭐⭐⭐ | Einfach, aber teurer |

---

## Empfehlung für den Start:

**Option 1 (Vercel)** ist am einfachsten:
- ✅ Alles an einem Ort
- ✅ Kostenlos für den Anfang
- ✅ Automatisches Deployment bei Git Push
- ✅ SSL/HTTPS automatisch
- ✅ CDN automatisch

Soll ich Ihnen bei einer spezifischen Option helfen?
