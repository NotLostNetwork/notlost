import { useLaunchParams } from "@telegram-apps/sdk-react"
import { NodeObject } from "react-force-graph-2d"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"

export const drawTagNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement,
  platform: string,
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

  const textWidth = ctx.measureText(titleText).width
  const textHeight = usernameFontSize

  // text background
  const padding = 1
  const cornerRadius = 2
  ctx.fillStyle = hexToRgba("#232e3c", 1)

  ctx.beginPath()
  const x = node.x! - textWidth / 2 - padding * 2
  const y = node.y! + 7 - padding
  const width = textWidth + padding * 4
  const height = textHeight + padding * 2

  ctx.moveTo(x + cornerRadius, y)
  ctx.arcTo(x + width, y, x + width, y + height, cornerRadius)
  ctx.arcTo(x + width, y + height, x, y + height, cornerRadius)
  ctx.arcTo(x, y + height, x, y, cornerRadius)
  ctx.arcTo(x, y, x + width, y, cornerRadius)
  ctx.closePath()
  ctx.fill()

  const textOpacity = Math.min(globalScale / 3, 1)
  ctx.fillStyle = hexToRgba("#6ab3f3", textOpacity)

  // on ios / mac os text is lower than should be
  switch (platform) {
    case "macos":
      ctx.fillText(titleText, node.x!, node.y! + 6)
      break
    case "ios":
      ctx.fillText(titleText, node.x!, node.y! + 5.5)
      break
    default:
      ctx.fillText(titleText, node.x!, node.y! + 7)
  }

  // icon
  ctx.fillStyle = "#fff"
  if (img) {
    const imgSize = 4

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
