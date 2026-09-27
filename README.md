<h1 align="center">Workspaces</h1>

<p align="center">Animated workspace indicators with app icons for the Omarchy shell bar.</p>

Workspace numbers, monochrome app icons, and a sliding active highlight that
follows your Omarchy theme. Replaces the built-in workspace widget in place.

## Requirements

- Omarchy 4 with its Quickshell bar
- A Nerd Font, such as Omarchy's default JetBrainsMono Nerd Font

## Install

```bash
omarchy plugin add https://github.com/DonovanSB/omarchy-workspaces.git --enable --yes
```

## Using it

Click a workspace to switch, or use the mouse wheel to move between workspaces.
Each monitor highlights its own active workspace. Supports horizontal and vertical bars.

Shows five workspace slots by default, plus any additional regular workspaces in use.
Each group displays up to three window icons, with a `+N` counter for the rest.
Special workspaces remain accessible through Omarchy's shortcuts.

## Settings

Available in the bar editor or through
`omarchy bar set donovan.workspaces <key> <value> --json`:

| Key | Default | Purpose |
|---|---|---|
| `persistentWorkspaces` | `5` | Always show the first 1–20 workspaces |
| `showNumbers` | `true` | Numbers instead of shapes |
| `showBackground` | `false` | Background behind all workspaces |
| `showAppIcons` | `true` | Open window icons |
| `maxAppIcons` | `3` | Maximum icons per workspace |
| `monochromeIcons` | `true` | Nerd Font icons instead of original app icons |
| `animations` | `true` | Animate the active highlight |
| `scrollToSwitch` | `true` | Switch using the mouse wheel |

## Restore the original

```bash
omarchy plugin disable donovan.workspaces
```

To uninstall, use `omarchy plugin remove donovan.workspaces`.

## Development

```bash
node tests/model.test.cjs
node tests/icons.test.cjs
omarchy plugin validate .
```

## License

MIT.
Icons use the installed [Nerd Fonts](https://www.nerdfonts.com/) font; no fonts are bundled.
