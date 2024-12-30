import { NodeObject } from "react-force-graph-2d"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"

export const drawTagNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement,
) => {
  const titleText = node.id!.toString()
  const usernameFontSize = Math.min(4, (24 * globalScale) / 8)

  // circle
  const radius = 5
  ctx.beginPath()
  ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = hexToRgba("#5288c1", 1)
  ctx.fill()

  // title
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.font = `400 ${usernameFontSize}px Sans-Serif`

  // Calculate text width and height to fit the background
  const textWidth = ctx.measureText(titleText).width
  const textHeight = usernameFontSize

  // Draw the background rectangle with rounded corners
  const padding = 1 // padding around the text
  const cornerRadius = 2 // radius for rounded corners
  ctx.fillStyle = hexToRgba("#232e3c", 1) // background color

  // Start drawing the rounded rectangle
  ctx.beginPath()
  const x = node.x! - textWidth / 2 - padding * 2
  const y = node.y! + 8 - padding
  const width = textWidth + padding * 4
  const height = textHeight + padding * 2

  // Draw rounded corners
  ctx.moveTo(x + cornerRadius, y) // top-left corner
  ctx.arcTo(x + width, y, x + width, y + height, cornerRadius) // top-right corner
  ctx.arcTo(x + width, y + height, x, y + height, cornerRadius) // bottom-right corner
  ctx.arcTo(x, y + height, x, y, cornerRadius) // bottom-left corner
  ctx.arcTo(x, y, x + width, y, cornerRadius) // top-left corner
  ctx.closePath()
  ctx.fill()

  // Draw the text over the background
  const textOpacity = Math.min(globalScale / 3, 1)
  ctx.fillStyle = hexToRgba("#6ab3f3", textOpacity)
  ctx.fillText(titleText, node.x!, node.y! + 8)

  // icon
  ctx.fillStyle = "#fff"
  if (img) {
    const imgSize = 4

    ctx.save()
    // Directly draw the image without circular clipping
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
