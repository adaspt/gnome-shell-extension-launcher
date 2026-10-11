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

import { AppShortcuts } from "./appShortcuts.js";
import { FocusRing } from "./focusRing.js";
import { Launcher } from "./launcher.js";
import { WindowFocus } from "./windowFocus.js";
import { WindowRules } from "./windowRules.js";
import { WindowSize } from "./windowSize.js";

export default class LauncherExtension extends Extension {
  enable() {
    this._windowRules = new WindowRules();
    this._windowRules.enable();

    this._appShortcuts = new AppShortcuts();
    this._appShortcuts.enable();

    this._launcher = new Launcher();
    this._launcher.enable();

    this._windowSize = new WindowSize();
    this._windowSize.enable();

    this._windowFocus = new WindowFocus();
    this._windowFocus.enable();

    this._focusRing = new FocusRing();
    this._focusRing.enable();
  }

  disable() {
    this._focusRing.disable();
    this._focusRing = null;

    this._windowFocus.disable();
    this._windowFocus = null;

    this._windowSize.disable();
    this._windowSize = null;

    this._launcher.disable();
    this._launcher = null;

    this._appShortcuts.disable();
    this._appShortcuts = null;

    this._windowRules.disable();
    this._windowRules = null;
  }
}
