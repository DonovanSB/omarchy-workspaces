// Keep empty persistent slots and every live regular workspace reachable.
function workspaceIds(persistent, workspaces, activeId) {
  var count = Math.max(1, Math.min(20, Math.floor(Number(persistent) || 5)))
  var ids = []
  for (var i = 1; i <= count; i++) ids.push(i)
  for (var j = 0; j < workspaces.length; j++) {
    var id = workspaces[j].id
    if (id > 0 && ids.indexOf(id) === -1) ids.push(id)
  }
  if (activeId > 0 && ids.indexOf(activeId) === -1) ids.push(activeId)
  return ids.sort(function(a, b) { return a - b })
}

function adjacentId(ids, activeId, delta) {
  if (!ids.length || !delta) return activeId
  var index = ids.indexOf(activeId)
  if (index < 0) return ids[0]
  return ids[Math.max(0, Math.min(ids.length - 1, index + (delta < 0 ? 1 : -1)))]
}

// Shared geometry keeps icon groups and the sliding highlight aligned.
function slotLayout(counts, maxIcons, showIcons, cell, iconStep, padding, activeIndex) {
  var offset = 0
  return counts.map(function(count, index) {
    var visible = showIcons ? Math.min(count, maxIcons) : 0
    var overflow = showIcons ? Math.max(0, count - visible) : 0
    var hideLabel = index === activeIndex
    var iconStart = hideLabel && visible ? padding : cell
    var extent = Math.max(cell, iconStart + visible * iconStep + (overflow ? cell : 0) + (visible ? padding : 0))
    var slot = {offset: offset, extent: extent, visible: visible, overflow: overflow, iconStart: iconStart}
    offset += extent
    return slot
  })
}
