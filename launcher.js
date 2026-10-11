import Clutter from "gi://Clutter";
import GObject from "gi://GObject";
import Shell from "gi://Shell";
import St from "gi://St";

import { ensureActorVisibleInScrollView } from "resource:///org/gnome/shell/misc/animationUtils.js";
import * as ModalDialog from "resource:///org/gnome/shell/ui/modalDialog.js";

import { clamp } from "./geometry.js";

const ACCELERATOR = "<Super>slash";
const ICON_SIZE = 32;

// Most used first, as tracked by the shell; then by name.
function getApps() {
  const appSystem = Shell.AppSystem.get_default();
  const usage = Shell.AppUsage.get_default();

  return appSystem
    .get_installed()
    .filter((info) => info.should_show())
    .map((info) => appSystem.lookup_app(info.get_id()))
    .filter((app) => app)
    .sort(
      (a, b) =>
        usage.compare(a.get_id(), b.get_id()) || a.compare_by_name(b),
    );
}

const LauncherDialog = GObject.registerClass(
  class LauncherDialog extends ModalDialog.ModalDialog {
    _init(focus) {
      super._init({ styleClass: "launcher-dialog" });

      this.buttonLayout.hide();

      this._focus = focus;
      this._apps = getApps();
      this._results = [];
      this._selected = 0;

      this._entry = new St.Entry({
        style_class: "launcher-entry",
        hint_text: "Search applications",
        can_focus: true,
      });
      this.contentLayout.add_child(this._entry);
      this.setInitialKeyFocus(this._entry.clutter_text);

      this._list = new St.BoxLayout({
        orientation: Clutter.Orientation.VERTICAL,
        x_expand: true,
      });
      this._scrollView = new St.ScrollView({
        style_class: "launcher-list",
        overlay_scrollbars: true,
        hscrollbar_policy: St.PolicyType.NEVER,
        child: this._list,
      });
      this.contentLayout.add_child(this._scrollView);

      this._entry.clutter_text.connect("text-changed", () =>
        this._updateList(),
      );
      this._entry.clutter_text.connect("key-press-event", (_text, event) =>
        this._onKeyPress(event),
      );
      this.connect("button-press-event", (_actor, event) =>
        this._onButtonPress(event),
      );

      this._updateList();
    }

    // Matches like the overview, but only to filter: the order stays by usage.
    _findApps(query) {
      if (!query) return this._apps;

      const ids = new Set(Shell.AppSystem.search(query).flat());

      return this._apps.filter((app) => ids.has(app.get_id()));
    }

    _updateList() {
      this._results = this._findApps(this._entry.text.trim());

      this._list.destroy_all_children();
      for (const [index, app] of this._results.entries())
        this._list.add_child(this._createRow(app, index));

      this._select(0);
    }

    _createRow(app, index) {
      const content = new St.BoxLayout({
        style_class: "launcher-row-content",
        x_align: Clutter.ActorAlign.START,
        x_expand: true,
      });
      content.add_child(app.create_icon_texture(ICON_SIZE));
      content.add_child(
        new St.Label({
          text: app.get_name(),
          y_align: Clutter.ActorAlign.CENTER,
        }),
      );

      const row = new St.Button({
        style_class: "launcher-row",
        child: content,
      });
      row.connect("clicked", () => this._activate(app));
      // Unlike hover, motion ignores rows scrolling under a resting pointer.
      row.connect("motion-event", () => {
        if (index !== this._selected) this._select(index, false);
        return Clutter.EVENT_PROPAGATE;
      });

      return row;
    }

    _select(index, reveal = true) {
      const rows = this._list.get_children();
      if (rows.length === 0) return;

      rows[this._selected]?.remove_style_pseudo_class("selected");
      this._selected = clamp(index, 0, rows.length - 1);
      rows[this._selected].add_style_pseudo_class("selected");

      if (reveal)
        ensureActorVisibleInScrollView(this._scrollView, rows[this._selected]);
    }

    _onKeyPress(event) {
      switch (event.get_key_symbol()) {
        case Clutter.KEY_Down:
          this._select(this._selected + 1);
          return Clutter.EVENT_STOP;
        case Clutter.KEY_Up:
          this._select(this._selected - 1);
          return Clutter.EVENT_STOP;
        case Clutter.KEY_Return:
        case Clutter.KEY_KP_Enter:
        case Clutter.KEY_ISO_Enter:
          this._activate(this._results[this._selected]);
          return Clutter.EVENT_STOP;
        case Clutter.KEY_Escape:
          this.close();
          return Clutter.EVENT_STOP;
        default:
          return Clutter.EVENT_PROPAGATE;
      }
    }

    // Closes the dialog on a click outside of its box.
    _onButtonPress(event) {
      const box = this.contentLayout.get_parent();
      const [x, y] = event.get_coords();
      const [left, top] = box.get_transformed_position();
      const [width, height] = box.get_transformed_size();

      if (x < left || x >= left + width || y < top || y >= top + height)
        this.close();

      return Clutter.EVENT_PROPAGATE;
    }

    _activate(app) {
      this.close();
      this._focus.activateApp(app);
    }
  },
);

export class Launcher {
  constructor(shortcuts, focus) {
    this._focus = focus;

    shortcuts.add(ACCELERATOR, () => this._open());
  }

  destroy() {
    this._dialog?.destroy();
  }

  _open() {
    if (this._dialog) return;

    // The dialog destroys itself when it closes.
    this._dialog = new LauncherDialog(this._focus);
    this._dialog.connect("destroy", () => (this._dialog = null));
    this._dialog.open();
  }
}
