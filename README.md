# EarnifyX Lab 🧪
> **"Tools • Prompts • Resources"**
> Professional, clean creator platform ready for **GitHub Pages**.

---

## 🌟 Project Overview

**EarnifyX Lab** is a high-performance, minimal, and creator-focused platform designed to showcase:
1. **Chrome Extensions** developed by you
2. **Software & Native Desktop Apps**
3. **Master Prompts Hub** (with 1-click clipboard copying, category filters, and locked preview modals)
4. **Curated AI Tools & Web Engines**
5. **Creator Resources** (Notion templates, checklists, audio/asset packs)
6. **Technical Blog Posts & Tutorials**
7. **Unified Global Search Engine** (Instant keyboard shortcut `Ctrl+K`)
8. **User Dashboard & Saved Items Library** (Local storage synced)
9. **Admin Panel** for quick JSON generation

---

## 📂 Project Structure

```
EarnifyXlabs/
├── index.html                  # Homepage (Exact recreation of reference design)
├── ai-tools.html               # AI Tools Directory (Categorized by writing, image, video, etc.)
├── extensions.html             # Chrome Extensions Hub
├── software.html               # Software & Desktop Apps Hub
├── prompts.html                # Dedicated Master Prompts Hub with Copy & Preview
├── automation.html             # Automation & Workflow Tools
├── creator-tools.html          # Creator Specific Tools
├── resources.html              # Free & Premium Templates, Guides, Checklists
├── blog.html                   # Blog Posts & Articles
├── tutorials.html              # Step-by-Step Guides with time & difficulty
├── search.html                 # Unified Global Search Engine across all items
├── login.html                  # User Sign-In (Firebase Auth)
├── register.html               # User Registration (Firebase Auth + profile)
├── firestore.rules             # Firestore access rules for users and site data
├── profile.html                # User Profile Management
├── dashboard.html              # User Dashboard (Saved Items, Downloads, Stats)
├── admin-dashboard.html        # Platform Admin Panel
├── 404.html                    # 404 Error Page
│
├── css/
│   ├── style.css               # Design system tokens, light/dark themes, components
│   └── responsive.css          # Breakpoints for Mobile, Tablet, and Desktop
│
├── js/
│   ├── theme.js                # Light/Dark mode toggle with localStorage
│   ├── main.js                 # Global navigation, mobile drawer, toast alerts, modals
│   ├── components.js           # Reusable HTML card generator functions
│   ├── search.js               # Universal live search engine (Ctrl+K)
│   ├── filters.js              # Client-side category filtering engine
│   ├── prompts.js              # Prompt copy-to-clipboard, preview modal, locked pro modal
│   └── auth-ui.js              # LocalStorage bookmarks & user session manager
│
├── data/
│   ├── extensions.js           # Chrome extensions dataset
│   ├── software.js             # Software & apps dataset
│   ├── prompts.js              # Master AI prompts dataset
│   ├── tools.js                # AI tools dataset
│   ├── resources.js            # Creator resources & packs dataset
│   ├── blog.js                 # Blog articles dataset
│   └── tutorials.js            # Tutorials dataset
│
├── assets/
│   ├── icons/
│   │   └── logo.svg            # EarnifyX Lab glowing flask logo
│   └── images/
│       ├── hero-creator.svg    # Hero visual illustration matching reference
│       ├── blog-*.svg          # Blog article thumbnails
│       └── tut-*.svg           # Tutorial walkthrough thumbnails
│
├── .nojekyll                   # Ensures GitHub Pages serves static files directly
├── robots.txt                  # SEO crawler instructions
├── sitemap.xml                 # Search engine sitemap
└── README.md                   # Documentation & guide
```

## Firebase User Database

Firestore does not use SQL tables. The registration flow creates one document per account at:

```text
users/{firebaseAuthUid}
```

Each new account starts with `plan: "free"`, `isPro: false`, and `subscriptionStatus: "inactive"`. The document also stores the name, email, mobile number, role, timestamps, and a future `premiumUntil` value. Payment integration can later update the premium fields from a trusted server or Firebase Admin SDK.

Deploy `firestore.rules` from the Firebase CLI or paste its contents into Firebase Console > Firestore Database > Rules. Admin writes require a Firebase custom claim named `admin`; never grant premium access only from browser code.

---

## 🚀 How to Run Locally

Because this project is built entirely with clean **Vanilla HTML5, CSS3, and JavaScript**, there are **zero dependencies or npm build steps** required.

### Method 1: Double Click
Simply double-click `index.html` in your file explorer to open it in any web browser.

### Method 2: Python Local Server (Recommended)
Open a terminal in the project directory and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Method 3: VS Code / IDE Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🌐 How to Upload to GitHub & Enable GitHub Pages

### 1. Initialize Git & Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - EarnifyX Lab Website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on **GitHub.com**.
2. Click **Settings** (top right tab).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment > Branch**:
   - Select `main` branch.
   - Select `/ (root)` folder.
   - Click **Save**.
5. After 1–2 minutes, your website will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

*(The included `.nojekyll` file ensures all directories and static assets load seamlessly on GitHub Pages).*

---

## ✍️ How to Add New Content

You don't need to write HTML boilerplate to add new content. Simply open the respective file in `data/` and add an object:

### 1. Add a Chrome Extension (`data/extensions.js`)
```javascript
{
    id: "my-extension-id",
    name: "My New Extension",
    badge: "New",              // "Free" | "Premium" | "New"
    badgeType: "primary",       // "success" (green) | "primary" (blue) | "warning" (gold)
    version: "v1.0.0",
    rating: 5.0,
    users: "1,000+",
    category: "AI",             // "AI" | "Productivity" | "Creator" | "Automation"
    iconText: "🚀",
    iconBg: "#1e293b",
    iconColor: "#38bdf8",
    shortDescription: "One-line summary for creator cards...",
    description: "Full in-depth description shown in the detail modal.",
    features: [
        "Feature one description",
        "Feature two description"
    ],
    downloadUrl: "https://chromewebstore.google.com/...",
    featured: true,
    tags: ["AI", "Productivity", "New"]
}
```

### 2. Add Software (`data/software.js`)
```javascript
{
    id: "my-app-id",
    name: "EarnifyX Tool",
    badge: "Free",
    badgeType: "success",
    platform: "Windows / Mac",
    version: "v1.0.0",
    rating: 4.9,
    downloads: "5,000+",
    iconText: "⚡",
    iconBg: "#2563eb",
    iconColor: "#ffffff",
    shortDescription: "Short summary...",
    description: "Detailed description...",
    features: ["Feature 1", "Feature 2"],
    systemRequirements: "Windows 10/11, 4GB RAM",
    downloadUrl: "#",
    official: true,
    featured: true,
    tags: ["Creator", "Official", "Free"]
}
```

### 3. Add a Master Prompt (`data/prompts.js`)
```javascript
{
    id: "my-prompt-id",
    title: "Viral Scriptwriter Hook",
    category: "YouTube",        // "YouTube" | "Video" | "Image" | "Writing" | "Business" | "Social Media" | "Automation"
    badge: "Free",              // "Free" or "Premium"
    badgeType: "success",
    icon: "▶️",
    iconBg: "#ef4444",
    model: "ChatGPT / Claude",
    views: "10.5k",
    likes: "850",
    shortDescription: "Short summary...",
    promptText: `Act as a senior copywriter... [INSERT PROMPT HERE]`,
    locked: false,              // Set true for locked premium preview
    featured: true,
    tags: ["YouTube", "Writing", "Free"]
}
```

### 4. Add a Blog Post (`data/blog.js`)
```javascript
{
    id: "my-post-slug",
    title: "How to Build High CTR Thumbnails",
    category: "Creator",
    date: "Mar 10, 2026",
    readTime: "5 min read",
    author: "Suraj Kumar",
    thumbnail: "assets/images/blog-1.svg",
    shortDescription: "Short summary...",
    content: "Full markdown / text content...",
    featured: true
}
```

---

## 🔮 Future Backend & Supabase Architecture

The frontend is structured to connect to **Supabase** whenever you are ready:

- **Authentication**: `login.html` & `register.html` contain code comments for `supabase.auth.signInWithPassword` and OAuth providers.
- **Database Schema**:
  - `tools`
  - `extensions`
  - `software`
  - `prompts`
  - `bookmarks`
  - `profiles`
- **Payments**: Premium unlock modals include mock checkout flows ready to be wired up to **Stripe** or **Razorpay**.
