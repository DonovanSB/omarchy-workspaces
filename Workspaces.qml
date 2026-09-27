import QtQuick
import Quickshell
import Quickshell.Hyprland
import qs.Commons
import qs.Ui
import "WorkspaceModel.js" as Model

BarWidget {
  id: root
  moduleName: "donovan.workspaces"

  readonly property var screen: root.QsWindow.window ? root.QsWindow.window.screen : null
  readonly property var monitor: screen ? Hyprland.monitorFor(screen) : null
  readonly property int activeId: monitor && monitor.activeWorkspace ? monitor.activeWorkspace.id :
    (Hyprland.focusedWorkspace ? Hyprland.focusedWorkspace.id : 1)
  readonly property var ids: Model.workspaceIds(setting("persistentWorkspaces", 5), Hyprland.workspaces.values, activeId)
  readonly property int activeIndex: ids.indexOf(activeId)
  readonly property bool animated: setting("animations", true)
  readonly property bool numbers: setting("showNumbers", true)
  readonly property bool showIcons: setting("showAppIcons", true)
  readonly property int maxIcons: Math.max(1, Math.min(8, Number(setting("maxAppIcons", 3)) || 3))
  readonly property real iconStep: Style.space(18)
  readonly property real iconSize: Style.space(14)
  readonly property var geometry: Model.slotLayout(ids.map(function(id) {
    var ws = root.workspace(id)
    return ws ? ws.toplevels.values.length : 0
  }), maxIcons, showIcons, cell, iconStep, Style.space(4), numbers ? activeIndex : -1)
  readonly property real cell: Style.space(22)
  readonly property real inset: Style.space(3)
  readonly property real thickness: Math.min(barSize - Style.space(4), Style.space(24))
  readonly property real length: geometry.reduce(function(total, slot) { return total + slot.extent }, 0) + inset * 2
  readonly property color ink: bar ? bar.barForeground : Color.foreground
  readonly property color accent: Color.accent
  readonly property color activeInk: (0.2126 * accent.r + 0.7152 * accent.g + 0.0722 * accent.b) > 0.52 ? "#181820" : "#ffffff"

  implicitWidth: vertical ? barSize : length + Style.space(4)
  implicitHeight: vertical ? length + Style.space(4) : barSize

  function workspace(id) {
    var values = Hyprland.workspaces.values
    for (var i = 0; i < values.length; i++) if (values[i].id === id) return values[i]
    return null
  }

  function focusWorkspace(id) {
    if (bar && id > 0)
      bar.run("hyprctl dispatch " + Util.shellQuote('hl.dsp.focus({ workspace = "' + id + '" })'))
  }

  function scroll(delta) {
    if (!setting("scrollToSwitch", true) || !delta || scrollGuard.running) return
    var target = Model.adjacentId(ids, activeId, delta)
    if (target !== activeId) {
      focusWorkspace(target)
      scrollGuard.start()
    }
  }

  Timer { id: scrollGuard; interval: 140 }

  // One bar instance refreshes the shared Hyprland snapshot for every screen.
  readonly property bool refreshOwner: monitor !== null && Hyprland.monitors.values[0] === monitor
  onRefreshOwnerChanged: if (refreshOwner) metadataRefresh.restart()
  Component.onCompleted: if (refreshOwner) metadataRefresh.restart()

  Timer {
    id: metadataRefresh
    interval: 80
    onTriggered: if (root.refreshOwner) Hyprland.refreshToplevels()
  }

  Connections {
    target: Hyprland
    enabled: root.refreshOwner
    function onRawEvent(event) {
      if (["openwindow", "closewindow", "movewindow", "movewindowv2",
           "windowtitle", "windowtitlev2"].indexOf(event.name) >= 0)
        metadataRefresh.restart()
    }
  }

  Rectangle {
    id: track
    anchors.centerIn: parent
    width: root.vertical ? root.thickness : root.length
    height: root.vertical ? root.length : root.thickness
    radius: Math.min(width, height) / 2
    color: root.setting("showBackground", false) ? Util.alpha(root.ink, 0.07) : "transparent"

    // The two edges catch up at different speeds, creating a soft stretch.
    Rectangle {
      id: indicator
      property real targetStart: root.inset + (root.activeIndex >= 0 ? root.geometry[root.activeIndex].offset : 0)
      property real targetExtent: root.activeIndex >= 0 ? root.geometry[root.activeIndex].extent : root.cell
      property real start: targetStart
      property real end: targetStart + targetExtent
      property bool forward: true
      property real previousStart: targetStart
      onTargetStartChanged: {
        forward = targetStart >= previousStart
        previousStart = targetStart
      }
      x: root.vertical ? root.inset : start
      y: root.vertical ? start : root.inset
      width: root.vertical ? track.width - root.inset * 2 : Math.max(root.cell, end - start)
      height: root.vertical ? Math.max(root.cell, end - start) : track.height - root.inset * 2
      radius: Math.min(width, height) / 2
      color: root.accent
      visible: root.activeIndex >= 0
      z: 1
      Behavior on start {
        enabled: root.animated
        NumberAnimation { duration: indicator.forward ? 300 : 190; easing.type: Easing.OutCubic }
      }
      Behavior on end {
        enabled: root.animated
        NumberAnimation { duration: indicator.forward ? 190 : 300; easing.type: Easing.OutCubic }
      }
      Behavior on color { ColorAnimation { duration: 160 } }
    }

    Repeater {
      model: root.ids

      Item {
        id: slot
        required property int modelData
        required property int index
        readonly property var ws: root.workspace(modelData)
        readonly property var metrics: root.geometry[index] || ({offset: 0, extent: root.cell, visible: 0, overflow: 0, iconStart: root.cell})
        readonly property var windows: ws ? ws.toplevels.values : []
        readonly property bool selected: root.activeId === modelData
        readonly property bool occupied: ws !== null && ws.toplevels.values.length > 0
        readonly property bool urgent: ws !== null && ws.urgent
        readonly property bool elsewhere: ws !== null && root.monitor !== null && ws.monitor !== root.monitor
        readonly property color markColor: selected ? root.activeInk : urgent ? Color.urgent : root.ink

        x: root.vertical ? root.inset : root.inset + metrics.offset
        y: root.vertical ? root.inset + metrics.offset : root.inset
        width: root.vertical ? track.width - root.inset * 2 : metrics.extent
        height: root.vertical ? metrics.extent : track.height - root.inset * 2
        z: 2

        Rectangle {
          anchors.fill: parent
          radius: Math.min(width, height) / 2
          color: root.ink
          opacity: !slot.selected && hit.tooltipHovered ? 0.12 : 0
          Behavior on opacity { NumberAnimation { duration: 120 } }
        }

        Rectangle {
          x: (root.vertical ? slot.width : root.cell) / 2 - width / 2
          y: (root.vertical ? root.cell : slot.height) / 2 - height / 2
          visible: !root.numbers
          width: Style.space(slot.selected ? 8 : slot.occupied ? 6 : 4)
          height: width
          radius: slot.selected || slot.occupied ? Style.space(2) : width / 2
          rotation: slot.selected ? 45 : 0
          color: slot.markColor
          opacity: slot.selected || slot.urgent ? 1 : slot.elsewhere ? 0.35 : slot.occupied ? 0.9 : 0.3
          Behavior on width { NumberAnimation { duration: root.animated ? 180 : 0 } }
          Behavior on radius { NumberAnimation { duration: root.animated ? 180 : 0 } }
          Behavior on rotation { NumberAnimation { duration: root.animated ? 240 : 0; easing.type: Easing.OutCubic } }
          Behavior on opacity { NumberAnimation { duration: 140 } }
          Behavior on color { ColorAnimation { duration: 140 } }
        }

        Text {
          x: (root.vertical ? slot.width : root.cell) / 2 - width / 2
          y: (root.vertical ? root.cell : slot.height) / 2 - height / 2
          visible: root.numbers && !slot.selected
          text: slot.modelData
          color: slot.markColor
          opacity: slot.occupied ? 1 : 0.4
          font.family: root.bar ? root.bar.fontFamily : Style.font.family
          font.pixelSize: Style.font.body
        }

        Repeater {
          model: root.showIcons ? slot.windows.slice(0, root.maxIcons) : []
          delegate: Item {
            id: appSlot
            required property var modelData
            required property int index
            x: root.vertical ? 0 : slot.metrics.iconStart + index * root.iconStep
            y: root.vertical ? slot.metrics.iconStart + index * root.iconStep : 0
            width: root.vertical ? slot.width : root.iconStep
            height: root.vertical ? root.iconStep : slot.height
            AppIcon {
              anchors.centerIn: parent
              width: root.iconSize
              height: width
              toplevel: appSlot.modelData
              tint: slot.markColor
              opacity: slot.elsewhere && !slot.selected ? 0.8 : 1
            }
          }
        }

        Text {
          x: root.vertical ? 0 : slot.metrics.iconStart + slot.metrics.visible * root.iconStep
          y: root.vertical ? slot.metrics.iconStart + slot.metrics.visible * root.iconStep : 0
          width: root.vertical ? slot.width : root.cell
          height: root.vertical ? root.cell : slot.height
          visible: slot.metrics.overflow > 0
          text: "+" + slot.metrics.overflow
          horizontalAlignment: Text.AlignHCenter
          verticalAlignment: Text.AlignVCenter
          color: slot.markColor
          font.family: root.bar ? root.bar.fontFamily : Style.font.family
          font.pixelSize: Style.font.bodySmall
        }

        WidgetButton {
          id: hit
          anchors.fill: parent
          bar: root.bar
          hasVisualContent: true
          labelVisible: false
          Accessible.role: Accessible.Button
          Accessible.name: "Workspace " + slot.modelData
          Accessible.onPressAction: root.focusWorkspace(slot.modelData)
          onPressed: function(button) { if (button === Qt.LeftButton) root.focusWorkspace(slot.modelData) }
          onWheelMoved: function(delta) { root.scroll(delta) }
        }
      }
    }
  }
}
