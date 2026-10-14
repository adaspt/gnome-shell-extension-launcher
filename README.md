# Launcher

GNOME Shell extension with an app launcher, shortcuts that launch or focus apps, fixed rules for placing new windows, and shortcuts for sizing the focused window and moving focus between windows. It also flashes a ring around an already open window when the launcher or one of the shortcuts switches focus to it. The top bar shows the icon and name of the focused app.

Personal extension, used only by me and not published to extensions.gnome.org. There is no preferences UI; apps, with their shortcuts and window rules, are defined in `apps.js`, and window shortcuts in `windowSize.js` and `windowFocus.js`.

## Launcher

`Super`+`X` opens a search dialog listing all applications, most used first as tracked by GNOME. Type to filter, pick with `Up`/`Down`, `PgUp`/`PgDown` or the mouse, and press `Enter` or click to launch the app or focus it if it is already running. `Esc` or a click outside closes the dialog.

Press `Super`+`X` again while the dialog is open to switch to Logout, Restart, and Shutdown buttons. Use `Tab` or the arrow keys to move between buttons and `Enter` or a click to activate one, or press the letter shown on its right (`L`, `R` or `S`). Logout starts right away; Restart and Shutdown open GNOME's confirmation dialog. Another `Super`+`X` returns to applications. Each new opening starts with applications.

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

## App name

The icon and name of the focused app are shown in the top bar, right of the workspace indicator. They are hidden while no window has focus, such as in the overview.

## Chrome at logout

Chrome does not take part in GNOME's session management, so logging out with it open kills it, and it offers to restore tabs on its next start. The extension registers with the session manager instead, and once a logout, restart or shutdown is confirmed it quits Chrome, installed web apps included, as if from Chrome's menu, waiting up to 10 seconds before the session ends. Cancelling leaves Chrome open. To get the tabs back, set Chrome's "On startup" to "Continue where you left off".

## Install

```bash
ln -s "$PWD" ~/.local/share/gnome-shell/extensions/launcher@adaspt
```

Log out and back in, then enable it with `gnome-extensions enable launcher@adaspt`.
