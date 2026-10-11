# Launcher

GNOME Shell extension with an app launcher, shortcuts that launch or focus apps, fixed rules for placing new windows, and shortcuts for sizing the focused window and moving focus between windows. It also flashes a ring around an already open window when the launcher or one of the shortcuts switches focus to it.

Personal extension, used only by me and not published to extensions.gnome.org. There is no preferences UI; app shortcuts are defined in `appShortcuts.js`, rules in `windowRules.js`, and window shortcuts in `windowSize.js` and `windowFocus.js`.

## Launcher

`Super`+`/` opens a search dialog listing all applications, most used first as tracked by GNOME. Type to filter, pick with `Up`/`Down` or the mouse, and press `Enter` or click to launch the app or focus it if it is already running. `Esc` or a click outside closes the dialog.

## App shortcuts

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

## Window shortcuts

| Shortcut                        | Action                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `Super`+`=`                     | Widen the window to the next 10% step of the work area                         |
| `Super`+`-`                     | Narrow the window to the previous 10% step of the work area                    |
| `Super`+`F`                     | Fill the whole work area without maximizing the window                         |
| `Super`+`R`                     | Set 75% width and full height at the right edge; press again for the left edge |
| `Super`+`Ctrl`+`Left` / `Right` | Focus the topmost window on the monitor to the left / right                    |
| `Super`+`Ctrl`+`Down` / `Up`    | Focus the next / previous window on the current monitor                        |

Switching monitors also moves the pointer to the center of the target monitor, so the next app launched opens there.

## Install

```bash
ln -s "$PWD" ~/.local/share/gnome-shell/extensions/launcher@adaspt
```

Log out and back in, then enable it with `gnome-extensions enable launcher@adaspt`.
