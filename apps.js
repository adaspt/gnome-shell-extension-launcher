import { RIGHT_HALF, RIGHT_THREE_QUARTERS } from "./geometry.js";

// app is the desktop file the accelerator launches or focuses; wmClass matches
// the app's new windows, which go to monitor, counted from left to right
// starting at 0. There they are either maximized or given a placement in
// fractions of that monitor's work area.
export const APPS = [
  {
    app: "com.mitchellh.ghostty.desktop",
    wmClass: "com.mitchellh.ghostty",
    accelerator: "<Super>Return",
    monitor: 0,
    placement: RIGHT_THREE_QUARTERS,
  },
  {
    app: "com.microsoft.VSCode.desktop",
    wmClass: "com.microsoft.VSCode",
    accelerator: "<Shift><Super>Return",
    monitor: 1,
    maximized: true,
  },
  {
    app: "google-chrome.desktop",
    wmClass: "google-chrome",
    accelerator: "<Shift><Super>w",
    monitor: 2,
    maximized: true,
  },
  {
    app: "com.anthropic.Claude.desktop",
    wmClass: "com.anthropic.Claude",
    accelerator: "<Shift><Super>a",
    monitor: 0,
    placement: RIGHT_THREE_QUARTERS,
  },
  {
    app: "chatgpt.desktop",
    wmClass: "Chatgpt",
    accelerator: "<Shift><Super>i",
    monitor: 0,
    placement: RIGHT_THREE_QUARTERS,
  },
  {
    // Microsoft Teams PWA
    app: "chrome-ompifgpmddkgmclendfeacglnodjjndh-Default.desktop",
    wmClass: "chrome-ompifgpmddkgmclendfeacglnodjjndh-Default",
    accelerator: "<Shift><Super>m",
    monitor: 0,
    maximized: true,
  },
  {
    app: "org.gnome.TextEditor.desktop",
    wmClass: "org.gnome.TextEditor",
    accelerator: "<Shift><Super>n",
    monitor: 1,
    placement: RIGHT_HALF,
  },
];
