# Sales Dashboard — Rauf Sons

A lightweight, production-ready sales analytics dashboard deployable via **GitHub Pages** (zero backend required).

## Features

- **4 KPI Cards** — Avg Daily Volume, Avg Invoice Count, Avg OB Operated, Avg SKU/Shop
- **Order Booker × Date Heatmap** — Excel-style Red → Yellow → Green conditional formatting with data labels
- **Metric toggle** — Switch between Sales CTN and Invoice Count
- **Channel filter** — Filter by Retail, Wholesale, etc.
- **Fully data-driven** — edit `data.json` to update all visuals instantly

---

## Project Structure

```
sales-dashboard/
├── index.html      ← Dashboard UI (single file, no build step)
├── data.json       ← Your sales data (replace with full dataset)
└── README.md
```

---

## How to deploy on GitHub Pages

### 1. Create a GitHub repository
Go to [github.com/new](https://github.com/new) and create a new **public** repository (e.g. `sales-dashboard`).

### 2. Upload files
Upload `index.html`, `data.json`, and `README.md` to the repository root.

```bash
# Or via git CLI:
git init
git add .
git commit -m "Initial dashboard"
git remote add origin https://github.com/YOUR_USERNAME/sales-dashboard.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select `Deploy from a branch`
3. Choose **main** branch, **/ (root)** folder
4. Click **Save**

Your dashboard will be live at:
```
https://YOUR_USERNAME.github.io/sales-dashboard/
```

---

## Updating data

Replace `data.json` with your full dataset. The file must be a JSON array where each record has these fields:

| Field | Type | Example |
|---|---|---|
| `Distributor Name` | string | `"Rauf Sons"` |
| `Invoice Number` | string | `"D0002INV13730"` |
| `Order Booker Code` | string | `"D0002OB19"` |
| `Outlet Code` | string | `"N00000007906"` |
| `Channel` | string | `"Retail"` |
| `Category` | string | `"Nimko"` |
| `SKU Code` | string | `"SKU00039"` |
| `Date` | string (YYYY-MM-DD) | `"2026-04-01"` |
| `Sales CTN` | number | `0.083333` |

The dashboard auto-detects all unique dates, order bookers, and channels from the data.
