import Clutter from "gi://Clutter";
import Shell from "gi://Shell";
import St from "gi://St";

import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";

const ROLE = "launcher-app-name";

// Shows the icon and name of the focused app in the top bar, next to the
// workspace indicator.
export class AppName {
  enable() {
    this._tracker = Shell.WindowTracker.get_default();

    this._icon = new St.Icon({ style_class: "launcher-app-name-icon" });
    this._label = new St.Label({ y_align: Clutter.ActorAlign.CENTER });

    const box = new St.BoxLayout({ style_class: "launcher-app-name" });
    box.add_child(this._icon);
    box.add_child(this._label);

    this._button = new PanelMenu.Button(0.5, "Focused application", true);
    // Display only: no hover highlight, not a keyboard navigation stop.
    this._button.setSensitive(false);
    this._button.add_child(box);
    Main.panel.addToStatusArea(ROLE, this._button, 1, "left");

    this._tracker.connectObject("notify::focus-app", () => this._update(), this);
    this._update();
  }

  disable() {
    this._tracker.disconnectObject(this);
    this._tracker = null;

    this._button.destroy();
    this._button = null;
    this._icon = null;
    this._label = null;
  }

  _update() {
    // Null while no window has focus, e.g. in the overview.
    const app = this._tracker.focus_app;

    this._button.visible = !!app;
    if (!app) return;

    this._icon.gicon = app.get_icon();
    this._label.text = app.get_name();
  }
}
