import { NodeObject } from "react-force-graph-2d"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"

export const drawTopicNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement,
  platform: string,
) => {
  const titleText = node.title!.toString()
  const usernameFontSize = Math.min(5, (24 * globalScale) / 8)

  // circle
  const radius = 6
  ctx.beginPath()
  ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = hexToRgba("#5288c1", 1)
  ctx.fill()

  // circle stroke
  /* ctx.lineWidth = 1.5
  ctx.strokeStyle = hexToRgba("#6ab2f2", 1)
  ctx.stroke() */

  // topic title
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.font = `400 ${usernameFontSize}px Sans-Serif`

  const textWidth = ctx.measureText(titleText).width
  const textHeight = usernameFontSize

  // text background
  const padding = 1
  const cornerRadius = 3
  ctx.fillStyle = hexToRgba("#232e3c", 1)

  ctx.beginPath()
  const x = node.x! - textWidth / 2 - padding * 2
  const y = node.y! + 8 - padding
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
    ctx.fillText(titleText, node.x!, node.y! + 7)
  } else {
    ctx.fillText(titleText, node.x!, node.y! + 8)
  }

  // text outline
  /* ctx.strokeStyle = hexToRgba("#ffffff", 0.2)
  ctx.lineWidth = 0.5
  ctx.strokeText(titleText, node.x!, node.y! + 8)
 */
  // icon
  if (img) {
    const imgSize = 6

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
