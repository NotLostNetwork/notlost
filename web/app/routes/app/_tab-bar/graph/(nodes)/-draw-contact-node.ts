import { NodeObject } from "react-force-graph-2d"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"
import { hexToRgba } from "~/lib/utils/funcs/hex-to-rgba"

export const drawContactNode = (
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number,
  img: HTMLImageElement,
) => {
  let imgSize = 20
  const firstNameFontSize = Math.min(3, (12 * globalScale) / 8)
  const usernameFontSize = Math.min(2, (12 * globalScale) / 8)
  const lineHeight = usernameFontSize * 1.2

  let textOpacity = Math.min(globalScale / 4, 1)

  if (globalScale < 4) {
    textOpacity = globalScale / 10
  }

  if (globalScale < 2) {
    textOpacity = 0
  }

  // contact first name
  ctx.font = `500 ${firstNameFontSize}px Sans-Serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.fillStyle = hexToRgba(
    getCssVariableValue("--tg-theme-text-color"),
    textOpacity,
  )
  ctx.fillText(node.firstName.toString(), node.x!, node.y! + imgSize / 4 + 1)

  // contact username
  ctx.font = `400 ${usernameFontSize}px Sans-Serif`
  ctx.fillStyle = hexToRgba(
    getCssVariableValue("--tg-theme-link-color"),
    textOpacity * 1,
  )

  ctx.fillText(
    "@" + node.username!,
    node.x!,
    node.y! + imgSize / 4 + 1 + lineHeight + 1,
  )

  // avatar
  if (img) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(
      img,
      node.x! - imgSize / 4,
      node.y! - imgSize / 4,
      imgSize / 2,
      imgSize / 2,
    )
    ctx.save()
    ctx.beginPath()
    ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false)
    ctx.lineWidth = 1
    ctx.strokeStyle = getCssVariableValue("--tg-theme-accent-text-color")
    ctx.stroke()
    ctx.restore()
  } else {
    const img = new Image()
    img.src =
      "https://www.shutterstock.com/shutterstock/videos/1093269629/thumb/4.jpg?ip=x480"
    ctx.save()
    ctx.beginPath()
    ctx.arc(node.x!, node.y!, imgSize / 4, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(
      img,
      node.x! - imgSize / 4,
      node.y! - imgSize / 4,
      imgSize / 2,
      imgSize / 2,
    )
  }
}
