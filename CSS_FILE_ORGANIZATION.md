# 📂 CSS File Organization Summary

## 🏗️ Directory Structure
```
community-hero/
├── frontend/
│   ├── css/
│   │   ├── global.css      ✅ Shared styles (ALL pages)
│   │   ├── home.css        ✅ Home page (index.html)
│   │   ├── dashboard.css   ✅ Dashboard layout (dashboard.html, admin.html)
│   │   ├── report.css      ✅ Report page (report.html)
│   │   └── admin.css       ✅ Admin features (admin.html)
│   │
│   ├── index.html          ✅ Links: css/global.css, css/home.css
│   ├── dashboard.html      ✅ Links: css/global.css, css/dashboard.css
│   ├── admin.html          ✅ Links: css/global.css, css/dashboard.css, css/admin.css
│   ├── report.html         ✅ Links: css/global.css, css/report.css
│   │
│   ├── script.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── report.js
│   └── uploads/
│
├── CSS_BEST_PRACTICES.md   ✅ NEW: Comprehensive CSS guide
└── README.md
```

---

## 📊 CSS File Breakdown

### **1. global.css** (SHARED BY ALL PAGES)
**File Size:** ~300 lines | **Load:** Once per page

**Loaded by:** `index.html`, `dashboard.html`, `admin.html`, `report.html`

**Contains:**
```
✓ CSS Custom Properties (:root variables)
  - 20+ color variables (--bg-universe, --brand-mint, etc.)
  - 6 spacing scale variables (--space-xs to --space-2xl)
  - Font sizes, shadows, transitions

✓ Global Reset & Normalize
  - * { margin: 0; padding: 0; }
  - body, html base styles
  - Color, font-family setup

✓ App Header (.app-header)
  - Navigation bar styling
  - Logo/branding
  - Hamburger menu (mobile)
  - Active state indicators

✓ App Footer (.app-footer)
  - Status indicators
  - Copyright/links
  - Responsive layout

✓ Form Elements
  - .form-field (inputs, textareas, selects)
  - Focus states with animations
  - Placeholder styling
  - Error/success states

✓ Badges & Status
  - .badge (generic)
  - .badge-pending, .badge-success, etc.
  - Status colors

✓ Utility Classes
  - .hidden, .text-center, .flex-gap, etc.
  - Helper classes for layout

✓ Responsive Utilities
  - Mobile/tablet/desktop adjustments
  - Breakpoint-specific utilities
```

**Key Classes Used Everywhere:**
```css
.app-header { }
.app-footer { }
.form-field { }
.badge { }
.live-status-dot { }
.pulse-success { animation }
```

---

### **2. home.css** (HOME PAGE SPECIFIC)
**File Size:** ~320 lines | **Load:** Only on index.html

**Purpose:** Landing page, authentication forms, registration

**Contains:**
```
✓ Landing Hero Container
  - Main grid layout (1 col mobile, 2 col desktop)
  - Hero text section (headline, badge, subtext)
  - Responsive behavior

✓ Hero Text Section
  - .hero-headline { font-size: 2.5rem; }
  - .hero-badge { display: inline-flex; }
  - .hero-subtext { color: var(--text-muted); }
  - Metric pills for stats display

✓ Authentication Card
  - .auth-card (main container)
  - Toggle tabs for Login/Register
  - Transitions and hover effects
  - Border color change on interaction

✓ Auth Form Modules
  - .auth-form-module (flex container)
  - .form-header (h3 + description)
  - .field-group (label + input)
  - .hidden (toggle display)

✓ Action Buttons
  - .action-submit-btn (primary button)
  - .register-variant (success variant)
  - Hover effects with transform
  - Active/disabled states
  - Loading animation support

✓ Responsive Design
  - 992px: Two-column layout
  - 768px: Adjust font sizes
  - 576px: Stack vertically
  - Mobile buttons get smaller padding
```

**Key Classes Used Only Here:**
```css
.landing-hero-container { }
.auth-card { }
.toggle-tab-action { }
.action-submit-btn { }
.metrics-row { }
```

---

### **3. dashboard.css** (SHARED DASHBOARD LAYOUT)
**File Size:** ~240 lines | **Load:** Both dashboard.html AND admin.html

**Purpose:** Dashboard layout, tables, cards, stats

**Contains:**
```
✓ Dashboard Container
  - Flex layout: column direction
  - Full-height scrolling
  - Responsive padding (xl → lg → md)

✓ Stats Strip (Top Metrics)
  - Auto-fit grid: minmax(240px, 1fr)
  - Responsive: 2 columns on mobile
  - Gap adjustment for screen size

✓ Dashboard Card (.admin-card)
  - Background: var(--bg-card)
  - Border: 2px solid var(--slate-border)
  - Hover: border-color changes to mint + shadow lift
  - Responsive padding adjustments

✓ Issues Table (.custom-table)
  - Sticky header
  - Alternating row colors
  - Hover row highlight
  - Responsive font-size
  - Overflow-x for mobile

  Sections:
  - <thead>: Uppercase labels, mint color
  - <th>: 2px bottom border
  - <td>: Standard padding with border-bottom
  - <tbody tr:hover>: Subtle background change

✓ Interactive Visuals Grid
  - 1 col mobile, 1.2fr/0.8fr desktop
  - Chart placeholder cards
  - Dashed borders, hover effects

✓ Responsive Design
  - 992px: 1.2fr 0.8fr grid
  - 768px: Reduce all padding
  - 576px: 2-column stat grid
```

**Key Classes Used by Both Pages:**
```css
.dashboard-container { }
.main-stats-strip { }
.admin-card { }
.custom-table { }
.table-wrapper { }
.mock-chart-element { }
```

---

### **4. report.css** (REPORT PAGE SPECIFIC)
**File Size:** ~380 lines | **Load:** Only on report.html

**Purpose:** Map interface, location selection, issue reporting form

**Contains:**
```
✓ Workspace Layout
  - Flex: row direction (map + sidebar)
  - Responsive: switches to column on mobile
  - Gap: var(--space-xl) → var(--space-lg)

✓ Map Element (#map)
  - Leaflet.js integration
  - Border: 2px solid var(--slate-border)
  - Flex: 1 (takes available space)
  - Responsive height: 300px → 250px → 200px

✓ Control Sidebar
  - Fixed width: 360px desktop
  - Full width: tablet/mobile
  - Max-height: 50vh on tablet
  - Overflow-y: auto for form scrolling
  - Box-shadow: left side on desktop

✓ Form Title Area
  - H2: headline
  - P: descriptive text
  - Border-bottom separator
  - Padding-bottom adjustment

✓ Input Wrapper
  - Flex column layout
  - Gap between label and input
  - Custom textarea with focus states
  - Min-height for textarea

✓ Media Dropzone (File Upload)
  - Dashed border (2px)
  - Flex column: center alignment
  - Hidden file input (display: none)
  - Hover: border-color mint + background glow
  - Active: enhanced glow effect

✓ Geolocation Tracker
  - Flex: space-between
  - Monospace font for coordinates
  - Hover state with mint border

✓ Animations
  - @keyframes pulse-danger (red pulse)
  - @keyframes pulse-success (mint pulse)
  - Applied to .live-pulse element

✓ Hero Button (Submit)
  - Background: var(--brand-mint)
  - Full width with padding
  - Hover: translateY(-2px) + shadow
  - Active: translateY(0)
  - Disabled: muted appearance

✓ Responsive Layout
  - 1024px: Switch workspace flex-direction
  - 768px: Reduce map height
  - 576px: Mobile optimization
```

**Key Classes Used Only Here:**
```css
.workspace { }
#map { }
.control-sidebar { }
.media-dropzone { }
.geo-tracker-box { }
.live-pulse { }
.hero-btn { }
.custom-textarea { }
```

---

### **5. admin.css** (ADMIN FEATURES ONLY)
**File Size:** ~290 lines | **Load:** Only on admin.html

**Purpose:** Admin controls, status management, filters, action buttons

**Contains:**
```
✓ Admin Badge
  - Background: rgba(255, 51, 102, 0.1) (red tint)
  - Color: var(--danger-rose)
  - Inline display with padding
  - Used in table/header

✓ Admin Action Buttons
  - Base: .admin-action-btn
  - Variants: .danger, .secondary, .disabled
  - Smaller: 0.4rem padding vs full buttons
  - Hover: transform translateY(-1px)
  - Danger variant: red background

✓ Admin Controls
  - Flex row with gap
  - Wrap on mobile
  - Responsive gap adjustment

✓ Admin Stats Cards
  - Similar to .admin-card but smaller
  - Min-width: 200px → 150px → 120px
  - .stat-value: Large font (2.5rem → 1.5rem)
  - .stat-label: Small uppercase text
  - Hover: lift effect

✓ Admin Filters
  - Flex layout with gaps
  - <select> elements with styling
  - Custom focus state (mint border + shadow)
  - Responsive: wrap and adjust padding

✓ Admin Table Actions
  - .action-cell: flex row with buttons
  - Multiple button types: view (blue), delete (red), edit (gold)
  - Tight padding for table context
  - Hover states per button type

✓ Status Indicators
  - .status-badge: inline-flex container
  - Variants: pending (gold), active (blue), resolved (mint), rejected (red)
  - .status-dot: animated indicator
    - pending: pulse-warning
    - active: pulse-info
    - resolved: solid color
    - rejected: solid color
  - Color-coded backgrounds and text

✓ Animations
  - @keyframes pulse-warning (50% opacity oscillation)
  - @keyframes pulse-info (expanding box-shadow)
  - Applied to status dots

✓ Responsive Admin Layout
  - 768px: Smaller buttons, reduced gaps
  - 576px: Minimal spacing for mobile admin
```

**Key Classes Used Only Here:**
```css
.admin-badge { }
.admin-action-btn { }
.admin-stat-card { }
.admin-filters { }
.action-cell { }
.status-badge { }
.status-dot { }
.admin-controls { }
```

---

## 🔗 Relationship Map

```
HTML Files                 CSS Dependencies
─────────────────────────────────────────────────

index.html                 ├─ global.css
(Login/Register)           └─ home.css

dashboard.html             ├─ global.css
(User Dashboard)           └─ dashboard.css

admin.html                 ├─ global.css
(Admin Dashboard)          ├─ dashboard.css
                           └─ admin.css

report.html                ├─ global.css
(Issue Reporting)          └─ report.css
```

---

## 📈 CSS Load Performance

| File | Size | HTTP Requests | Used On |
|------|------|---------------|---------|
| global.css | ~10KB | 1 | ALL pages |
| home.css | ~11KB | 1 | index.html |
| dashboard.css | ~8KB | 1 | dashboard.html, admin.html |
| report.css | ~13KB | 1 | report.html |
| admin.css | ~10KB | 1 | admin.html |

**Total for any page:** 19-44 KB (global.css always loaded + 1-3 page-specific)

---

## 🎯 CSS Development Workflow

### **When to edit each file:**

| File | Edit When... |
|------|--------------|
| **global.css** | Colors, fonts, spacing, form elements, header, footer need updating |
| **home.css** | Landing page, login, register forms need changes |
| **dashboard.css** | Dashboard layout, tables, stats need adjustment |
| **report.css** | Map, form, file upload, report page needs changes |
| **admin.css** | Admin buttons, filters, status indicators, controls need changes |

### **To add new page:**

1. Create new `page-name.html`
2. Link `<link rel="stylesheet" href="css/global.css">`
3. Create `css/page-name.css` if page has unique styles
4. Link `<link rel="stylesheet" href="css/page-name.css">`
5. Use CSS variables from global.css
6. Follow same section structure

---

## ✨ Key Features

✅ **Modular:** Each file has a single responsibility  
✅ **Consistent:** All files follow same naming conventions  
✅ **Responsive:** Mobile-first approach throughout  
✅ **Accessible:** Good color contrast, clear focus states  
✅ **Maintainable:** Clear sections with documentation  
✅ **Scalable:** Easy to add new pages/components  
✅ **Optimized:** Minimal redundancy between files  

---

## 📚 Documentation Files

- **CSS_BEST_PRACTICES.md** - Complete guide to CSS structure, variables, components, best practices
- **FILE_STRUCTURE.md** - This file - file organization and relationships
- **README.md** - Project overview

---

## 🚀 Next Steps

1. ✅ All CSS files restructured and organized
2. ✅ Documentation complete
3. ✅ Ready for production deployment
4. ✅ Easy maintenance and future updates
5. 🎉 Project looks professional!
