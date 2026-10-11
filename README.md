# Calculator

A clean, modern, and accessible web-based calculator built with plain HTML, CSS, and JavaScript.

## Features

- **Basic Operations**: Performs addition, subtraction, multiplication, and division with precision handling.
- **Keyboard Support**: Full support for physical keyboard input including digits, operators, backspace, clear (`Esc`/`C`), and evaluation (`Enter`/`=`).
- **Responsive & Accessible Design**: Built with accessible ARIA attributes, focus states, responsive sizing, and support for `prefers-reduced-motion`.
- **Theme Awareness**: Automatically adapts to system dark or light color preferences (`prefers-color-scheme`).
- **Input Formatting**: Formats large numbers with thousands separators and dynamically scales display font sizes for long numbers.

## Getting Started

No installation or build setup required. Open `index.html` in any web browser to use the calculator.

```bash
# Simply open index.html in your browser or serve it using any HTTP server:
python3 -m http.server 8000
```

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0` – `9` | Digit input |
| `.` or `,` | Decimal point |
| `+`, `-`, `*`, `/` (or `x`) | Basic arithmetic operators |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape`, `Delete`, or `c` | Clear calculator |

## Project Structure

```
├── index.html   # Main HTML structure and ARIA attributes
├── style.css    # CSS styling, color variables, dark mode, and responsive layout
└── script.js    # Calculator state management, arithmetic evaluation, and event listeners
```
