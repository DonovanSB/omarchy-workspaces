import QtQuick
import QtQuick.Shapes
import Quickshell
import qs.Commons
import "AppSymbols.js" as Symbols

Item {
  id: root
  required property var toplevel
  property color tint: Color.foreground
  property bool monochrome: true
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
  readonly property string appName: desktopEntry ? desktopEntry.name :
    (appClass || "Application")
  readonly property string symbol: Symbols.category(
    appClass,
    desktopEntry ? desktopEntry.categories : [])
  readonly property string iconSource: {
    var icon = desktopEntry ? desktopEntry.icon : ""
    if (icon.indexOf("file://") === 0 || icon.indexOf("image://") === 0) return icon
    if (icon.charAt(0) === "/") return Util.fileUrl(icon)
    return icon ? Quickshell.iconPath(icon, true) : ""
  }

  Image {
    id: appImage
    anchors.fill: parent
    source: root.monochrome ? "" : root.iconSource
    sourceSize.width: Math.round(width * Screen.devicePixelRatio)
    sourceSize.height: Math.round(height * Screen.devicePixelRatio)
    fillMode: Image.PreserveAspectFit
    visible: !root.monochrome
  }

  Text {
    anchors.centerIn: parent
    visible: root.monochrome && root.useNerd
    text: Symbols.nerdGlyph(root.appClass,
      root.desktopEntry ? root.desktopEntry.id : "", root.desktopEntry ? root.desktopEntry.categories : [])
    textFormat: Text.PlainText
    color: root.tint
    font.family: root.nerdFamily
    font.pixelSize: Math.min(root.width, root.height)
    font.weight: Font.Normal
    renderType: Text.NativeRendering
  }

  Item {
    anchors.centerIn: parent
    width: 16
    height: 16
    scale: Math.min(root.width, root.height) / 16
    visible: root.monochrome && !root.useNerd
    Shape {
      anchors.fill: parent
      preferredRendererType: Shape.CurveRenderer
      ShapePath {
        strokeColor: root.tint
        strokeWidth: 1.5
        fillColor: "transparent"
        capStyle: ShapePath.RoundCap
        joinStyle: ShapePath.RoundJoin
        PathSvg { path: Symbols.path(root.symbol) }
      }
    }
  }

  // Keep unknown applications visible without depending on an icon font.
  Rectangle {
    anchors.centerIn: parent
    width: parent.width - 2
    height: parent.height - 4
    radius: 2
    color: "transparent"
    border.width: 1
    border.color: root.tint
    visible: !root.monochrome && appImage.status !== Image.Ready
    Rectangle {
      x: 2; y: 3
      width: parent.width - 4; height: 1
      color: root.tint
    }
  }
}
