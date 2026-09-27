import QtQuick
import Quickshell
import qs.Commons
import "AppSymbols.mjs" as Symbols

Item {
  id: root
  required property var toplevel
  property color tint: Color.foreground
  readonly property string nerdFamily: {
    var families = Qt.fontFamilies()
    if (/Nerd Font| NF$/.test(Style.font.family)) return Style.font.family
    if (families.indexOf("JetBrainsMono Nerd Font") >= 0) return "JetBrainsMono Nerd Font"
    for (var i = 0; i < families.length; i++)
      if (/Nerd Font| NF$/.test(families[i])) return families[i]
    return ""
  }
  readonly property bool useNerd: nerdFamily !== ""
  // lastIpcObject is a snapshot. New windows can publish their app ID later.
  readonly property var appCandidates: Symbols.appCandidates(
    toplevel ? toplevel.lastIpcObject : null,
    toplevel && toplevel.wayland ? toplevel.wayland.appId : "")
  readonly property string appClass: appCandidates.length ? appCandidates[0] : ""
  readonly property var desktopEntry: {
    var candidates = root.appCandidates
    var entries = DesktopEntries.applications.values
    for (var c = 0; c < candidates.length; c++) {
      var name = String(candidates[c])
      if (!name) continue
      var entry = DesktopEntries.byId(name) || DesktopEntries.byId(name.toLowerCase())
      if (entry) return entry
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].startupClass && entries[i].startupClass.toLowerCase() === name.toLowerCase())
          return entries[i]
      }
      entry = DesktopEntries.heuristicLookup(name)
      if (entry) return entry
    }
    return null
  }
  Text {
    anchors.centerIn: parent
    visible: root.useNerd
    text: Symbols.nerdGlyph(root.appClass,
      root.desktopEntry ? root.desktopEntry.id : "", root.desktopEntry ? root.desktopEntry.categories : [])
    textFormat: Text.PlainText
    color: root.tint
    font.family: root.nerdFamily
    font.pixelSize: Math.min(root.width, root.height)
    font.weight: Font.Normal
    renderType: Text.NativeRendering
  }

  // Keep a visible window marker if no Nerd Font is installed.
  Rectangle {
    anchors.centerIn: parent
    width: parent.width - 2
    height: parent.height - 4
    radius: 2
    color: "transparent"
    border.width: 1
    border.color: root.tint
    visible: !root.useNerd
    Rectangle {
      x: 2; y: 3
      width: parent.width - 4; height: 1
      color: root.tint
    }
  }
}
