# 🌸 Sakura Cleaner (桜クリーナー)
> **Kawaii PC Disk Space Visualizer & Smart Cleaner** (✿◡‿◡)

[![Download Portable Windows Executable](https://img.shields.io/badge/Download-Sakura%20Cleaner%20v1.0.0%20(Portable%20.exe)-f43f68?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/LuckyVNN/sakura-cleaner/releases/download/v1.0.0/Sakura.Cleaner.1.0.0.exe)
[![GitHub Releases](https://img.shields.io/github/v/release/LuckyVNN/sakura-cleaner?style=for-the-badge&color=ff8fa3)](https://github.com/LuckyVNN/sakura-cleaner/releases)

A cute, high-performance disk space analyzer and cleaning tool with an interactive Drill-Down Pie Chart, Treemap, Full PC Multi-Drive Scanning, Trilingual support (EN / VN / JP), and safe smart cleaning presets.

---

## ✨ Features

- **🌸 Cute Pink / Anime UI/UX**: Soft sakura pastels (`#fff0f3`, `#ffe3e8`, `#f43f68`), glassmorphism cards, glowing badges, custom pastel scrollbars, and reactive chibi mascot reactions (`(◕‿◕)`, `(ง •̀_•́)ง`, `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`).
- **🥧 Interactive Fraction Drill-Down Pie Chart**:
  - High-performance Donut/Pie Chart powered by Apache ECharts (60 FPS).
  - Displays top 8 largest items + "Others" slice. Click any slice to drill down into subfolders smoothly.
  - Center navigation badge, "Go Up ⬆️" button, breadcrumbs, and clickable subfolder pills.
  - Also includes **Treemap 🔲** and **List 📋** views for full flexibility.
- **🌐 Trilingual Support (EN / VN / JP)**:
  - Cute animated Language Dropdown: `[ 🇬🇧 English | 🇻🇳 Tiếng Việt | 🇯🇵 日本語 ]`.
  - Seamless instant language switching with persistent `localStorage` memory.
- **💾 Full PC Multi-Drive Analysis**:
  - Auto-detects all mounted storage drives (`C:`, `D:`, `E:`, `F:`, etc.) with visual capacity indicators.
  - One-click `⚡ Full Scan (All Disks)` aggregates all drives into a unified "This PC" root tree.
  - Live streaming WebSocket scanner with real-time statistics (files/sec, elapsed time, current path).
- **🧹 Smart Cleaner & Deep Browser Cache Presets**:
  - Deep recursive multi-profile scan for **Chrome**, **Microsoft Edge**, and **Discord** caches (`Cache_Data`, `Code Cache`, `GPUCache`).
  - One-click safe cleanup for User Temp, System Temp, Windows Update Cache, and Crash Dumps.
- **🛡️ Safety-First Deletion**:
  - All deletions are safely routed to the **Windows Recycle Bin** via native Windows COM/VisualBasic API (restorable at any time).
  - One-click "Reveal in File Explorer" for manual inspection.
- **ℹ️ About & AMA Modal**:
  - Built-in information dialog with Author profile, AMA (Ask Me Anything) feedback, and direct repository links.

---

## 🚀 Running for Development

```bash
# Install dependencies
npm install

# Start backend server & frontend dev server
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 📦 Building Standalone Windows `.exe`

To package Sakura Cleaner into a standalone, portable Windows executable:

```bash
npm run pack:exe
```

The resulting executable will be generated at:
`dist_exe/Sakura Cleaner 1.0.0.exe` (Portable single-file executable, ~78 MB)

---

## 🛠️ Tech Stack

- **Desktop Framework**: Electron 33
- **Frontend**: React 18, Vite, Tailwind CSS
- **Charts**: Apache ECharts 5, echarts-for-react
- **Icons**: Lucide React
- **Backend API**: Node.js, Express, WebSocket (`ws`)
- **System Integration**: PowerShell, Windows Shell COM (`Shell.Application`), `Win32_LogicalDisk`

---

## 📄 License

MIT License. Free and open source with love & Sakura petals 🌸.
