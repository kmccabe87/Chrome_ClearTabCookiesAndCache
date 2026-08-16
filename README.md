# Clear Tab Cookies and Storage

A Chrome extension that clears the cookies and site storage for the currently active tab.

## Features

- Clears cookies and site (local) storage for the active tab's origin.
- One click, scoped to the current tab only.
- Manifest V3.

## Installation (Load unpacked)

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the **`Clear Tab Cookies and Storage`** folder in this repository (it contains `manifest.json`).
6. Open the tab you want to clear and click the toolbar icon.

## Repository layout

| Path | Description |
| --- | --- |
| `Clear Tab Cookies and Storage/manifest.json` | Extension manifest (MV3) |
| `Clear Tab Cookies and Storage/popup.html`, `popup.js` | Popup UI and clear logic |
| `Clear Tab Cookies and Storage/broom16.png`, `broom32.png` | Toolbar icons |

## License

MIT — see [LICENSE](LICENSE).
