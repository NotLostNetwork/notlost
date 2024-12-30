// Declarations for importing SVGs as React components
declare module "*.svg?react" {
  import React from "react"
  const ReactComponent: React.VFC<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

// Declarations for importing SVGs without query parameters
declare module "*.svg" {
  import React from "react"
  const ReactComponent: React.VFC<React.SVGProps<SVGSVGElement>>
  export { ReactComponent }
  const src: string
  export default src
}
