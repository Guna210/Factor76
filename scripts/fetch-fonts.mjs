// One-time asset preparation. Fonts are served locally by the finished site.
import { mkdir, writeFile } from 'node:fs/promises'
const fonts = [
  ['Barlow Condensed', 'barlow-condensed', [500, 600, 700, 800, 900]],
  ['DM Sans', 'dm-sans', [400, 500, 600, 700]],
  ['IBM Plex Mono', 'ibm-plex-mono', [400, 500, 600]],
]
await mkdir(new URL('../public/fonts/', import.meta.url), { recursive: true })
let stylesheet = ''
for (const [family, slug, weights] of fonts) {
  const licenseResponse = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${slug.replaceAll('-', '')}/OFL.txt`)
  if (!licenseResponse.ok) throw new Error(`Font license download failed: ${family}`)
  await writeFile(new URL(`../public/fonts/${slug}-LICENSE.txt`, import.meta.url), await licenseResponse.text())
  for (const weight of weights) {
    const cssResponse = await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(' ', '+')}:wght@${weight}&display=swap`)
    if (!cssResponse.ok) throw new Error(`Font stylesheet failed: ${family} ${weight}`)
    const css = await cssResponse.text()
    const url = css.match(/url\((https:[^)]+)\)/)?.[1]
    if (!url) throw new Error(`No font URL: ${family}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Font download failed: ${family} ${weight}`)
    const filename = `${slug}-${weight}-latin.ttf`
    await writeFile(new URL(`../public/fonts/${filename}`, import.meta.url), Buffer.from(await response.arrayBuffer()))
    stylesheet += `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('./${filename}') format('truetype')}\n`
    console.log(`Saved ${filename}`)
  }
}
await writeFile(new URL('../public/fonts/fonts.css', import.meta.url), stylesheet)
