# 📂 Community Hero - Complete File Structure

## Frontend Files Organization

```
frontend/
│
├─── HTML Files (Pages)
│    ├── index.html          (Home/Login page)
│    ├── dashboard.html      (User/Admin Dashboard)
│    ├── admin.html          (Admin-only Dashboard)
│    └── report.html         (Issue Reporting page)
│
├─── CSS Files (Styling)
│    ├── global.css          ✅ Shared styles (ALL pages)
│    ├── home.css            ✅ Home page only
│    ├── dashboard.css       ✅ Dashboard layout (user + admin)
│    ├── admin.css           ✅ Admin page only
│    ├── report.css          ✅ Report page only
│    └── style.css           (Legacy - can be deleted)
│
├─── JavaScript Files (Logic)
│    ├── auth.js             ✅ Authentication & login
│    ├── dashboard.js        ✅ Dashboard logic
│    ├── report.js           ✅ Report form handling
│    └── script.js           (Legacy)
│
└─── Other
     └── [static/uploads/]   (User-uploaded images)
```

---

## 📊 CSS Files Quick Reference

| File | Used By | Lines | Purpose |
|------|---------|-------|---------|
| **global.css** | ALL | ~400 | Header, Footer, Forms, Colors |
| **home.css** | index.html | ~300 | Hero, Login Card, Metrics |
| **dashboard.css** | dashboard.html, admin.html | ~150 | Dashboard layout, Tables |
| **admin.css** | admin.html | ~200 | Admin buttons, Filters, Actions |
| **report.css** | report.html | ~250 | Map, Sidebar, Forms, Animations |

---

## 🔗 Page-to-CSS Mapping

### Home Page (index.html)
```
Loads: global.css + home.css
Contains:
  ├── Landing hero section
  ├── Login form
  ├── Register form
  └── Stats display
```

### Dashboard (dashboard.html)
```
Loads: global.css + dashboard.css
Contains:
  ├── User stats (if Citizen)
  ├── User issues table (if Citizen)
  ├── OR
  ├── All stats (if Admin)
  └── All issues table (if Admin)
```

### Admin (admin.html)
```
Loads: global.css + dashboard.css + admin.css
Contains:
  ├── All issues from all users
  ├── Admin controls
  ├── Status updater
  ├── Department assigner
  └── Admin-only buttons
```

### Report (report.html)
```
Loads: global.css + report.css
Contains:
  ├── Interactive map
  ├── Location selector
  ├── Issue form
  ├── File upload
  └── Submit button
```

---

## 🎨 CSS Cascade Order

When a page loads, CSS files are imported in this order:

```
1. global.css        ← Base styles (colors, header, footer)
2. [Page].css        ← Page-specific styles (override global)
3. [Admin].css       ← Admin-specific (if applicable)
```

**Result:** Page-specific styles override global styles when there's a conflict.

---

## 🔐 CSS Class Hierarchy

### Global Classes (in global.css)
```
.app-header              → Navigation
.app-footer              → Footer
.form-field              → Input fields
.badge                   → Status badges
.text-reported           → Color utilities
```

### Home Classes (in home.css)
```
.landing-hero-container  → Main container
.hero-headline           → Main title
.auth-card               → Login/register card
.action-submit-btn       → Buttons
```

### Dashboard Classes (in dashboard.css)
```
.dashboard-container     → Main container
.main-stats-strip        → Stats grid
.admin-card              → Card styling
.custom-table            → Table styling
```

### Admin Classes (in admin.css)
```
.admin-action-btn        → Admin buttons
.admin-filters           → Filter controls
.status-badge            → Status display
```

### Report Classes (in report.css)
```
.workspace               → Map + sidebar layout
#map                     → Leaflet map
.control-sidebar         → Form sidebar
.media-dropzone          → File upload
.live-pulse              → Animation
```

---

## ✨ Key Features

### 1. **Global Styles** (global.css)
- Consistent colors & typography
- Shared header/footer
- Standard form elements
- Used by ALL pages

### 2. **Page-Specific Styles** 
- Home page: Hero section, login form
- Dashboard: Stats & tables
- Admin: Control buttons, filters
- Report: Map & form sidebar

### 3. **CSS Variables**
```css
--bg-universe: #0b1329    (background)
--brand-mint: #5bc0be     (accent)
--danger-rose: #ff3366    (errors)
--success-emerald: #00f5d4 (success)
```

### 4. **Responsive Design**
- Mobile: Single column layouts
- Tablet: Adjusted spacing
- Desktop: Full multi-column layouts

---

## 🚀 How to Use This Structure

### Adding a New Page Style:

1. Create `newpage.css` in frontend folder
2. Add page-specific styles
3. Link in HTML: `<link rel="stylesheet" href="global.css">`
4. Then: `<link rel="stylesheet" href="newpage.css">`

### Modifying Existing Styles:

- **Change header?** → Edit `global.css`
- **Change home layout?** → Edit `home.css`
- **Change dashboard?** → Edit `dashboard.css`
- **Add admin feature?** → Edit `admin.css`
- **Change report form?** → Edit `report.css`

### Debugging Styles:

1. Check if style is in `global.css` (shared)
2. Check if style is in page-specific CSS
3. Use browser DevTools to verify CSS is loaded
4. Check CSS cascade (later files override earlier)

---

## 📊 CSS File Sizes

```
global.css    : ~400 lines  | ~10 KB
home.css      : ~300 lines  | ~8 KB
dashboard.css : ~150 lines  | ~4 KB
admin.css     : ~200 lines  | ~6 KB
report.css    : ~250 lines  | ~7 KB
─────────────────────────────────
TOTAL         : ~1,300 lines | ~35 KB
```

---

## ✅ Organization Benefits

✓ **Easy to Find** - Styles organized by page
✓ **Easy to Maintain** - Change one page without affecting others
✓ **Fast Loading** - Load only necessary CSS
✓ **Team Friendly** - Multiple people can work on different CSS files
✓ **Scalable** - Easy to add new pages
✓ **Debuggable** - Easier to find styling issues
✓ **Consistent** - Global styles ensure brand consistency

---

## 🎯 Quick Navigation

**Need to style the login form?**
→ Edit `home.css` (.auth-card, .auth-form-module)

**Need to change dashboard stats?**
→ Edit `dashboard.css` (.main-stats-strip, .admin-card)

**Need to add admin button?**
→ Edit `admin.css` (.admin-action-btn)

**Need to modify report map?**
→ Edit `report.css` (#map, .workspace)

**Need to change colors everywhere?**
→ Edit `global.css` (:root variables)

---

Happy Styling! 🎨
