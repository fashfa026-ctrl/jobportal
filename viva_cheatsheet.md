# 🚀 Viva Cheat Sheet: Code Change, Git Push & Vercel Deployment

நாளைக்கு viva-வில் எதாவது code changes செய்ய சொல்லி, அதை GitHub-க்கு push பண்ணி Vercel-இல் deploy செய்ய சொன்னால், இந்த எளிய வழிகளைப் பின்பற்றவும்.

---

## 💻 Step 1: Run Project Locally (உள்ளூர் கணினியில் சோதிக்க)
எந்த ஒரு மாற்றத்தையும் GitHub-க்கு push செய்வதற்கு முன், அது local-ஆக சரியாக வேலை செய்கிறதா என்று சோதிக்க வேண்டும்.

1. **Open Terminal** in VS Code.
2. Navigate to the frontend directory:
   ```bash
   cd frontend/CareerHub
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the link (e.g., `http://localhost:5173`) in your browser and check if the changes are working fine.

---

## 🐙 Step 2: Push Changes to GitHub (GitHub-க்கு அனுப்ப)
மாற்றங்கள் திருப்திகரமாக இருந்தால், அவற்றை GitHub-க்கு push செய்ய வேண்டும்.

1. local server-ஐ நிறுத்த Terminal-இல் `Ctrl + C` அழுத்தவும்.
2. Root directory-க்கு செல்லவும்:
   ```bash
   cd ../..
   ```
   *(or open a fresh terminal in the root folder `JOBPORTAL_fixed`)*
3. **Check modified files** (மாற்றப்பட்ட கோப்புகளைப் பார்க்க):
   ```bash
   git status
   ```
4. **Stage all changes** (அனைத்து மாற்றங்களையும் தயார் செய்ய):
   ```bash
   git add .
   ```
5. **Commit the changes** (ஒரு குறிப்புடன் சேமிக்க):
   ```bash
   git commit -m "viva code updates"
   ```
6. **Push to GitHub** (GitHub-க்கு அனுப்ப):
   * முதலில் உங்கள் branch பெயர் என்னவென்று பார்க்கவும்: `git branch` (e.g., `main` or `master`)
   * Branch `main` ஆக இருந்தால்:
     ```bash
     git push origin main
     ```
   * Branch `master` ஆக இருந்தால்:
     ```bash
     git push origin master
     ```

---

## ⚡ Step 3: Vercel Deployment (Vercel-இல் நேரலையாக்க)

### Option A: Automatic Deployment (தானியங்கி முறை - Most Common)
ஏற்கனவே உங்கள் GitHub repository Vercel-உடன் இணைக்கப்பட்டிருந்தால் (Connected):
* நீங்கள் `git push` செய்த உடனே, Vercel தானாகவே புதிய மாற்றங்களை build செய்து deploy செய்யத் தொடங்கிவிடும்.
* **மண்பார்ப்பது எப்படி (How to check):**
  1. [vercel.com](https://vercel.com) லாக்-இன் செய்யவும்.
  2. உங்கள் Project-ஐ கிளிக் செய்யவும்.
  3. **Deployments** tab-க்கு சென்றால், தற்போதைய deployment "Building" அல்லது "Ready" என்று காட்டுவதைக் காணலாம்.

---

### Option B: Manual Redeploy (Dashboard வழியாக மீண்டும் deploy செய்ய)
ஏதாவது காரணத்தால் auto-deploy ஆகவில்லை என்றால்:
1. Vercel Dashboard-இல் உங்கள் Project-க்குள் செல்லவும்.
2. **Deployments** tab கிளிக் செய்யவும்.
3. கடைசியாக இருக்கும் deployment-ன் வலதுபுறத்தில் உள்ள **Three dots (...)** கிளிக் செய்யவும்.
4. **Redeploy** என்பதை கிளிக் செய்யவும்.

---

### Option C: New Project Setup (புதியதாக Vercel-இல் உருவாக்க சொன்னால்)
ஒருவேளை புதிய Vercel project-ஆக deploy செய்யச் சொன்னால்:
1. Vercel Dashboard-இல் **Add New** -> **Project** கிளிக் செய்யவும்.
2. உங்கள் GitHub repository-ஐ Import செய்யவும்.
3. **Configure Project** பக்கத்தில் பின்வரும் அமைப்புகளைச் சரியாக கொடுக்க வேண்டும் (Very Important!):
   * **Framework Preset:** `Vite` (தானாகவே கண்டறியும், இல்லையென்றால் select செய்யவும்)
   * **Root Directory:** `Edit` கிளிக் செய்து `frontend/CareerHub` என்பதைத் தேர்ந்தெடுக்கவும்.
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. **Deploy** பட்டனை அழுத்தவும்.

---

## ⚠️ Troubleshooting / Errors (பிரச்சனைகள் வந்தால்)

* **Git Push error (Permission Denied / Authentication):**
  * GitHub-க்கு லாக்-இன் செய்யவில்லை என்றால், VS Code-ல் GitHub கணக்கை Sign-in செய்யச் சொல்லி கேட்கும். அதை அனுமதித்து browser-இல் லாக்-இன் செய்யவும்.
* **Vercel Build Failed:**
  * Node version அல்லது backend API URL மாறிலிகள் (Environment Variables) விடுபட்டிருக்கலாம்.
  * Project Settings -> **Environment Variables**-க்கு சென்று தேவையான key-value-களை சேர்த்துவிட்டு மீண்டும் redeploy செய்யவும்.
