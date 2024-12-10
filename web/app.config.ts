import { defineConfig } from "@tanstack/start/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ["@telegram-apps/telegram-ui"],
    },
    plugins: [tsconfigPaths()],
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
