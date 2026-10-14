# // JCL Generator Studio
Developed by **Nagraj Naik** 

Web-based **IBM z/OS Job Control Language (JCL)** generator and syntax validator. Build job cards, chain multi-step utilities, configure DD allocations, and validate strict 80-column punched-card syntax in real time — with zero backend servers, build steps, or external dependencies.

---

## ✨ Features

* **10 Built-in Mainframe Utilities** — Pre-configured smart defaults and control card templates for `IEFBR14`, `IEBGENER`, `IDCAMS`, `SORT` (DFSORT), `IEBCOPY`, `IKJEFT01` (TSO/DB2), `IEBCOMPR`, `IEBUPDTE`, `ICEGENER`, and `CUSTOM PGM` (COBOL/Assembler).
* **Live 80-Column Terminal Preview** — Real-time syntax highlighting, synchronized line numbers, and an 80-column punched-card ruler (`Cols 1–71 Code | Col 72 Continuation | Cols 73–80 Sequence`).
* **Strict z/OS Column-71 Engine & Validator** — Automatically wraps long `JOB`, `EXEC`, and `DD` parameters onto valid continuation lines (`//             `) before column 71 and flags any manual edits or control cards that violate z/OS syntax rules.
* **In-Place Multi-Step Job Pipeline** — Add, duplicate, reorder (`↑`/`↓`), and edit multiple job steps in place while watching the complete JCL deck update on every keystroke.
* **Quick Job Starters** — One-click multi-step templates:
  * **Single Step (`IEFBR14`)** — Default dataset allocation/deletion starter.
  * **3-Step (`Alloc → Sort → Copy`)** — `IEFBR14` cleanup, `SORT` processing, and conditional `IEBGENER` copy.
  * **2-Step (`VSAM Define → REPRO`)** — `IDCAMS` KSDS cluster definition followed by `REPRO` dataset load.
* **Conditional Execution Support** — Configure step-level `COND=` parameters (`(RC,OP)`, `EVEN`, `ONLY`) and `IF / THEN / ELSE / ENDIF` constructs with fallback error steps.
* **Editable Output Deck** — Type directly inside the generated JCL preview for last-minute tweaks, with one-click **Revert edits**, **Copy**, and **Download `.jcl`**.
* **Light & Dark Themes** — High-contrast mainframe terminal aesthetic with persistent theme selection saved in `localStorage`.
* **100% Air-Gap & Privacy Friendly** — Runs entirely in your browser; nothing you enter ever leaves your machine.

---

## 📁 Project Structure

```text
.
├── index.html              # Main application UI & workspace layout
├── README.md               # Project documentation
└── assets/
    ├── css/
    │   └── style.css       # Responsive layout, Light/Dark themes & 80-column terminal styles
    └── js/
        ├── engine.js       # Client-side z/OS JCL generator, templates & strict Col-71 validator
        └── app.js          # UI state controller, live multi-step pipeline & event bindings