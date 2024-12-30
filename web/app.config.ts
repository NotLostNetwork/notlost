import { defineConfig } from "@tanstack/start/config"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ["@telegram-apps/telegram-ui"],
    },
    plugins: [tsconfigPaths(), svgr()],
  },
  server: {
    preset: "vercel",
  },
  tsr: {
    customScaffolding: {
      routeTemplate: [
        "%%tsrImports%%",
        "\n\n",
        "function RouteComponent() { return <></> };\n\n",
        "%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n",
      ].join(""),
    },
  },
})
