# Launcher

GNOME Shell extension that places new windows according to fixed rules.

Personal extension, used only by me and not published to extensions.gnome.org. There is no preferences UI; rules are defined in `windowRules.js`.

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
