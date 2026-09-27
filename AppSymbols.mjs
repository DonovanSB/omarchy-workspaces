import * as AppRules from "./AppRules.mjs"

// Codepoints from the official Nerd Fonts glyph catalog; fonts are not bundled.
export function appCandidates(ipc, waylandId) {
  var data = ipc || {}
  var candidates = [waylandId, data.class, data.initialClass]
  var result = []
  for (var i = 0; i < candidates.length; i++) {
    var value = String(candidates[i] || "").trim()
    if (value && result.indexOf(value) < 0) result.push(value)
  }
  return result
}

export function nerdGlyph(appClass, desktopId, categories) {
  var matched = AppRules.resolve(appClass, desktopId)
  if (matched) return matched
  var glyphs = {
    terminal: "\uf489", code: "\uf121",
    browser: "\uf0ac", folder: "\uf07b", chat: "\uf075", mail: "\uf0e0",
    music: "\uf001", video: "\uf008", image: "\uf03e", game: "\uf11b",
    window: "\udb81\ude14"
  }
  return glyphs[category(appClass, categories)] || glyphs.window
}

export function category(appClass, categories) {
  var name = String(appClass || "").toLowerCase()
  if (/^tui[.-]|foot|kitty|alacritty|ghostty|wezterm|konsole|terminal/.test(name)) return "terminal"
  if (/code|codium|zed|sublime|jetbrains|idea/.test(name)) return "code"
  var rules = [["TerminalEmulator", "terminal"], ["WebBrowser", "browser"],
    ["Development", "code"], ["TextEditor", "code"], ["FileManager", "folder"],
    ["InstantMessaging", "chat"], ["Email", "mail"], ["Audio", "music"],
    ["Video", "video"], ["Graphics", "image"], ["Game", "game"]]
  for (var i = 0; i < rules.length; i++)
    if (categories && categories.indexOf(rules[i][0]) >= 0) return rules[i][1]
  return "window"
}
