import { NodeObject } from "react-force-graph-2d"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"

export const drawTopicNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement,
  platform: string,
) => {
  //const titleText = node.title!.toString()
  const titleText = ""

  // circle
  const radius = getTopicRadius(globalScale)

  const usernameFontSize = radius

  ctx.beginPath()
  ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = hexToRgba(
    getCssVariableValue("--tg-theme-secondary-bg-color"),
    1,
  )
  ctx.fill()

  // circle stroke
  ctx.lineWidth = 1
  ctx.strokeStyle = hexToRgba("#6ab2f2", 1)
  ctx.stroke()

  // topic title
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.font = `400 ${usernameFontSize}px Sans-Serif`

  const textWidth = ctx.measureText(titleText).width
  const textHeight = usernameFontSize

  // text background
  const padding = 1
  const cornerRadius = 3
  ctx.fillStyle = hexToRgba("#232e3c", 0)

  ctx.beginPath()
  const x = node.x! - textWidth / 2 - padding * 2
  const y = node.y! + (radius + 2) - padding + 2
  const width = textWidth + padding * 4
  const height = textHeight + padding * 2

  ctx.moveTo(x + cornerRadius, y)
  ctx.arcTo(x + width, y, x + width, y + height, cornerRadius)
  ctx.arcTo(x + width, y + height, x, y + height, cornerRadius)
  ctx.arcTo(x, y + height, x, y, cornerRadius)
  ctx.arcTo(x, y, x + width, y, cornerRadius)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = hexToRgba("#6ab3f3", 1)

  // on ios / mac os text is lower than should be
  if (["macos", "ios"].includes(platform)) {
    ctx.fillText(titleText, node.x!, node.y! + radius + 1 + 1)
  } else {
    ctx.fillText(titleText, node.x!, node.y! + radius + 2 + 2)
  }

  // text outline
  /* ctx.strokeStyle = hexToRgba("#ffffff", 0.2)
  ctx.lineWidth = 0.5
  ctx.strokeText(titleText, node.x!, node.y! + 8)
 */
  // icon
  if (img) {
    const imgSize = radius + 5

    ctx.save()
    ctx.drawImage(
      img,
      node.x! - imgSize / 2,
      node.y! - imgSize / 2,
      imgSize,
      imgSize,
    )
    ctx.restore()
  }
}

export const getTopicRadius = (globalScale: number): number => {
  const minScale = 0.5 // Smallest global scale (e.g., zoomed out)
  const maxScale = 1.0 // Largest global scale (e.g., zoomed in)
  const minRadius = 36 // Radius when global scale is small
  const maxRadius = 8 // Radius when global scale is large

  const radius = Math.max(
    maxRadius,
    Math.min(
      minRadius,
      maxRadius +
        ((maxScale - globalScale) / (maxScale - minScale)) *
          (minRadius - maxRadius),
    ),
  )

  return radius
}
