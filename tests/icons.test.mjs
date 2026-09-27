import assert from "node:assert/strict";
import * as rules from "../AppRules.mjs";
import * as icons from "../AppSymbols.mjs";

const candidates = (...args) => Array.from(icons.appCandidates(...args));
const vscode = String.fromCodePoint(0xf0a1e);

// A new window can have an empty IPC snapshot while Wayland already knows its app.
assert.equal(icons.nerdGlyph(candidates({}, 'code')[0], '', []), vscode);
assert.equal(icons.nerdGlyph(candidates({class: 'code'}, '')[0], '', []), vscode);
assert.equal(icons.nerdGlyph(candidates({initialClass: 'Code'}, null)[0], '', []), vscode);
assert.deepEqual(candidates({class: 'old-app', initialClass: 'launcher'}, 'code'), ['code', 'old-app', 'launcher']);
assert.deepEqual(candidates({class: 'code', initialClass: 'code'}, 'code'), ['code']);
assert.deepEqual(candidates(null, null), []);
assert.equal(icons.nerdGlyph(candidates({}, 'google-chrome')[0], '', []), String.fromCodePoint(0xf02af));
assert.equal(icons.nerdGlyph(candidates({}, 'foot')[0], '', []), String.fromCodePoint(0xf018d));
// Brand collisions must not turn editors into VS Code or Flatpaks into GitHub.
assert.equal(icons.nerdGlyph('slack', '', []), String.fromCodePoint(0xf04b1));
assert.equal(icons.nerdGlyph('com.slack.Slack', '', []), String.fromCodePoint(0xf04b1));
assert.equal(icons.nerdGlyph('org.gnome.Nautilus', '', []), String.fromCodePoint(0xf0770));
assert.equal(icons.nerdGlyph('obsidian', '', []), '\ue6bb');
assert.equal(icons.nerdGlyph('com.obsproject.Studio', '', []), String.fromCodePoint(0xf040d));
assert.equal(icons.nerdGlyph('ai.opencode.desktop', '', []), '\uf140');
assert.notEqual(icons.nerdGlyph('codeblocks', '', []), vscode);
assert.equal(icons.nerdGlyph('io.github.unknown.App', '', ['Graphics']), '\uf03e');
assert.equal(icons.nerdGlyph('unknown', '', ['FileManager']), '\uf07b');
assert.equal(icons.nerdGlyph('', '', []), String.fromCodePoint(0xf0614));
assert.equal(icons.nerdGlyph('chrome-mail.google.com__-Default', '', []), String.fromCodePoint(0xf02ab));
assert.equal(icons.nerdGlyph('', 'org.telegram.desktop', []), String.fromCodePoint(0xf0626));
assert.equal(icons.nerdGlyph('Slack', 'code', []), String.fromCodePoint(0xf04b1));
assert.equal(rules.resolve('slacker', ''), '');
assert.equal(rules.resolve('frozen', ''), '');
for (const rule of rules.rules) {
  assert.equal(Array.from(rule.icon).length, 1, 'Each rule must contain one decoded glyph');
  assert.doesNotThrow(() => new RegExp(rule.pattern, 'i'));
}
// Desktop IDs and StartupWMClass aliases from the application coverage audit.
const applicationCases = [
  [
    "1password",
    "\udb82\udc81"
  ],
  [
    "com.onepassword.OnePassword",
    "\udb82\udc81"
  ],
  [
    "aether",
    "\uefcc"
  ],
  [
    "li.oever.aether.url-handler",
    "\uefcc"
  ],
  [
    "com.cloudflare.WarpTaskbar",
    "\ue792"
  ],
  [
    "warp-taskbar",
    "\ue792"
  ],
  [
    "com.cloudflare.warp",
    "\ue792"
  ],
  [
    "com.raspberrypi.rpi-imager",
    "\ue722"
  ],
  [
    "dev.tensaku.Tensaku",
    "\udb84\udde3"
  ],
  [
    "io.github.nozwock.Packet",
    "\uf1e0"
  ],
  [
    "packet",
    "\uf1e0"
  ],
  [
    "org.inkscape.Inkscape",
    "\ue801"
  ],
  [
    "minecraft-launcher",
    "\udb80\udf73"
  ],
  [
    "com.mojang.minecraft",
    "\udb80\udf73"
  ],
  [
    "omacut",
    "\uf0c4"
  ],
  [
    "org.gnome.Loupe",
    "\uf03e"
  ],
  [
    "org.gnome.DiskUtility",
    "\udb80\udeca"
  ],
  [
    "Disk Usage",
    "\udb80\udeca"
  ],
  [
    "gnome-disk-image-writer",
    "\udb80\udeca"
  ],
  [
    "gnome-disk-image-mounter",
    "\udb80\udeca"
  ],
  [
    "org.gnome.seahorse.Application",
    "\uf084"
  ],
  [
    "org.gnupg.pinentry-qt",
    "\uf084"
  ],
  [
    "org.kde.ksecretd",
    "\uf084"
  ],
  [
    "gcr-prompter",
    "\uf084"
  ],
  [
    "signon-ui",
    "\uf084"
  ],
  [
    "gcr-viewer",
    "\uf0a3"
  ],
  [
    "libreoffice-base",
    "\uf377"
  ],
  [
    "libreoffice-draw",
    "\uf379"
  ],
  [
    "libreoffice-impress",
    "\uf37a"
  ],
  [
    "libreoffice-math",
    "\uf37b"
  ],
  [
    "libreoffice-xsltfilter",
    "\uf376"
  ],
  [
    "system-config-printer",
    "\udb81\udc2a"
  ],
  [
    "voxtype",
    "\uf130"
  ],
  [
    "voxtype-configure",
    "\uf130"
  ],
  [
    "xdvi",
    "\udb80\ude19"
  ],
  [
    "Google Calendar",
    "\uf073"
  ],
  [
    "chrome-calendar.google.com__-Default",
    "\uf073"
  ],
  [
    "brave-calendar.google.com__-Default",
    "\uf073"
  ],
  [
    "Google Contacts",
    "\udb81\udecb"
  ],
  [
    "brave-contacts.google.com__-Default",
    "\udb81\udecb"
  ],
  [
    "Crunchyroll",
    "\udb80\udf81"
  ],
  [
    "chrome-www.crunchyroll.com__-Default",
    "\udb80\udf81"
  ],
  [
    "Fizzy",
    "\ueb67"
  ],
  [
    "brave-app.fizzy.do__-Default",
    "\ueb67"
  ],
  [
    "The Karters 2 Turbo Charged",
    "\udb83\udd79"
  ],
  [
    "steam_app_2269950",
    "\udb83\udd79"
  ],
  [
    "X",
    "\ueb72"
  ],
  [
    "ktelnetservice6",
    "\uf489"
  ],
  [
    "org.freedesktop.Xwayland",
    "\udb80\udf79"
  ],
  [
    "org.quickshell",
    "\udb80\udf79"
  ],
  [
    "xdg-desktop-portal-gtk",
    "\udb80\udf79"
  ],
  [
    "org.gnome.Zenity",
    "\uf05a"
  ],
  [
    "org.kde.kiod6",
    "\uf07b"
  ],
  [
    "user-dirs-update-gtk",
    "\uf07b"
  ],
  [
    "org.kde.knewstuff-dialog6",
    "\uf019"
  ],
  [
    "wheelmap-geo-handler",
    "\uf193"
  ]
];
for (const [id, expected] of applicationCases)
  assert.equal(icons.nerdGlyph(id, '', []), expected, id);
assert.equal(icons.nerdGlyph('brave-app.slack.com__-Default', '', []), String.fromCodePoint(0xf04b1));
assert.equal(icons.nerdGlyph('brave-youtube.com__-Default', '', []), String.fromCodePoint(0xf05c3));
assert.equal(icons.nerdGlyph('imv-dir', '', []), String.fromCodePoint(0xf02f9));
assert.equal(icons.nerdGlyph('TUI.float', '', []), '\uf489');
assert.equal(rules.resolve('my-packetizer', ''), '');
assert.equal(rules.resolve('x-com', ''), '');
console.log(`Icon identity, category, webapp, and ${applicationCases.length} application alias checks passed; ${rules.rules.length} rules validated.`);
