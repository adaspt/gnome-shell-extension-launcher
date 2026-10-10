# Launcher

GNOME Shell extension with an app launcher, shortcuts that launch or focus apps, and fixed rules for placing new windows.

Personal extension, used only by me and not published to extensions.gnome.org. There is no preferences UI; shortcuts are defined in `appShortcuts.js` and rules in `windowRules.js`.

## Launcher

`Super`+`/` opens a search dialog listing all applications. Type to filter, pick with `Up`/`Down` or the mouse, and press `Enter` or click to launch the app or focus it if it is already running. `Esc` or a click outside closes the dialog.

## Shortcuts

Each shortcut launches the app, or focuses its most recent window if it is already running, switching workspace when needed.

| Shortcut                 | App         |
| ------------------------ | ----------- |
| `Super`+`Enter`          | Ghostty     |
| `Super`+`Shift`+`Enter`  | VS Code     |
| `Super`+`Shift`+`W`      | Chrome      |
| `Super`+`Shift`+`A`      | Claude      |
| `Super`+`Shift`+`I`      | ChatGPT     |
| `Super`+`Shift`+`M`      | Teams (PWA) |
| `Super`+`Shift`+`N`      | Text Editor |

## Window rules

| App         | Placement                                                     |
| ----------- | ------------------------------------------------------------- |
| Ghostty     | Leftmost monitor, 75% width at the right edge and full height |
| Claude      | Leftmost monitor, 75% width at the right edge and full height |
| ChatGPT     | Leftmost monitor, 75% width at the right edge and full height |
| Text Editor | Middle monitor, 50% width at the right edge and full height   |
| VS Code     | Middle monitor, maximized                                     |
| Chrome      | Rightmost of three monitors, maximized                        |
| Teams (PWA) | Leftmost monitor, maximized                                   |

Every new window of the app is placed, not only the first one.

## Install

```bash
ln -s "$PWD" ~/.local/share/gnome-shell/extensions/launcher@adaspt
```

Log out and back in, then enable it with `gnome-extensions enable launcher@adaspt`.
