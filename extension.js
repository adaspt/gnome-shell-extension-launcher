/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

import { AppName } from "./appName.js";
import { addAppShortcuts } from "./appShortcuts.js";
import { FocusRing } from "./focusRing.js";
import { Launcher } from "./launcher.js";
import { Shortcuts } from "./shortcuts.js";
import { addWindowFocusShortcuts } from "./windowFocus.js";
import { WindowRules } from "./windowRules.js";
import { addWindowSizeShortcuts } from "./windowSize.js";

export default class LauncherExtension extends Extension {
  enable() {
    const shortcuts = new Shortcuts();
    const focusRing = new FocusRing();

    addAppShortcuts(shortcuts, focusRing);
    addWindowSizeShortcuts(shortcuts);
    addWindowFocusShortcuts(shortcuts, focusRing);

    this._modules = [
      new WindowRules(),
      focusRing,
      shortcuts,
      new Launcher(shortcuts, focusRing),
      new AppName(),
    ];
  }

  disable() {
    for (const module of this._modules.reverse()) module.destroy();

    this._modules = null;
  }
}
