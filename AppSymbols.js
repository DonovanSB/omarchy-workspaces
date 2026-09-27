// Small, original outline symbols designed on a 16px grid.
// Codepoints from the official Nerd Fonts glyph catalog; fonts are not bundled.
function appCandidates(ipc, waylandId) {
  var data = ipc || {}
  var candidates = [waylandId, data.class, data.initialClass]
  var result = []
  for (var i = 0; i < candidates.length; i++) {
    var value = String(candidates[i] || "").trim()
    if (value && result.indexOf(value) < 0) result.push(value)
  }
  return result
}

function nerdGlyph(appClass, desktopId, categories) {
  var name = String(appClass || "").toLowerCase()
  var id = String(desktopId || "").toLowerCase()
  var rules = [
    [/spotify/, "\uf1bc"], [/whatsapp/, "\uf232"], [/telegram/, "\uf2c6"],
    [/discord|vesktop/, "\uf1ff"], [/firefox|librewolf|zen-browser/, "\uf269"],
    [/chrome|chromium/, "\uf268"], [/code|codium/, "\ue8da"],
    [/steam/, "\uf1b6"], [/foot|kitty|alacritty|ghostty|wezterm|konsole|terminal/, "\uf489"]
  ]
  for (var i = 0; i < rules.length; i++)
    if (rules[i][0].test(name) || rules[i][0].test(id)) return rules[i][1]
  var glyphs = {
    spotify: "\uf1bc", chrome: "\uf268", terminal: "\uf489", code: "\uf121",
    browser: "\uf0ac", folder: "\uf07b", chat: "\uf075", mail: "\uf0e0",
    music: "\uf001", video: "\uf008", image: "\uf03e", game: "\uf11b",
    window: "\udb81\ude14"
  }
  return glyphs[category(appClass, categories)] || glyphs.window
}

function category(appClass, categories) {
  var name = String(appClass || "").toLowerCase()
  if (/spotify/.test(name)) return "spotify"
  if (/chrome|chromium/.test(name)) return "chrome"
  if (/foot|kitty|alacritty|ghostty|wezterm|konsole|terminal/.test(name)) return "terminal"
  if (/code|codium|zed|sublime|jetbrains|idea/.test(name)) return "code"
  var rules = [["TerminalEmulator", "terminal"], ["WebBrowser", "browser"],
    ["Development", "code"], ["TextEditor", "code"], ["FileManager", "folder"],
    ["InstantMessaging", "chat"], ["Email", "mail"], ["Audio", "music"],
    ["Video", "video"], ["Graphics", "image"], ["Game", "game"]]
  for (var i = 0; i < rules.length; i++)
    if (categories && categories.indexOf(rules[i][0]) >= 0) return rules[i][1]
  return "window"
}

function path(kind) {
  var circle = "M 14.5 8 A 6.5 6.5 0 1 1 1.5 8 A 6.5 6.5 0 1 1 14.5 8 Z "
  var window = "M 2 2.5 H 14 V 13.5 H 2 Z "
  var paths = {
    spotify: circle + "M 4 5.5 Q 8 4.3 12 6 M 4.6 8 Q 8 6.9 11.4 8.5 M 5.2 10.5 Q 8 9.6 10.7 11",
    chrome: circle + "M 11 8 A 3 3 0 1 1 5 8 A 3 3 0 1 1 11 8 Z M 8 5 H 13.7 M 5.4 9.5 L 2.6 4.5 M 9.5 10.6 L 6.8 14.4",
    terminal: window + "M 4.5 5.5 L 7 8 L 4.5 10.5 M 9 10.5 H 11.5",
    code: "M 5.5 4.5 L 2 8 L 5.5 11.5 M 10.5 4.5 L 14 8 L 10.5 11.5 M 9 2.5 L 7 13.5",
    browser: circle + "M 1.5 8 H 14.5 M 8 1.5 C 3.5 5 3.5 11 8 14.5 C 12.5 11 12.5 5 8 1.5 Z",
    folder: "M 1.5 4 V 12.5 H 14.5 V 5 H 7 L 5.5 3 H 1.5 Z M 2 6 H 14",
    chat: "M 2 2.5 H 14 V 11.5 H 6 L 2 14 Z M 4.5 5.5 H 11.5 M 4.5 8.5 H 9.5",
    mail: "M 1.5 3.5 H 14.5 V 12.5 H 1.5 Z M 2 4 L 8 9 L 14 4",
    music: "M 6 11 V 3 L 13 1.5 V 9.5 M 6 5.5 L 13 4 M 6 11 C 5 8.5 1 9.5 2 12 C 3 14 6 13 6 11 Z M 13 9.5 C 12 7 8 8 9 10.5 C 10 12.5 13 11.5 13 9.5 Z",
    video: window + "M 6.5 5 L 11 8 L 6.5 11 Z",
    image: window + "M 2 11 L 6 7 L 9 10 L 11 8 L 14 11 M 10 5 H 11",
    game: "M 4 4 H 12 Q 14 5 14.5 11 Q 14.5 14 11 11 H 5 Q 1.5 14 1.5 11 Q 2 5 4 4 Z M 5 6 V 10 M 3 8 H 7 M 10 7 H 10.5 M 12 9 H 12.5",
    window: window + "M 2 5.5 H 14 M 4 4 H 4.5"
  }
  return paths[kind] || paths.window
}
