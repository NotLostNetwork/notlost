import { createFileRoute } from "@tanstack/react-router"

function RouteComponent() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#1e1e1e",
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "1.5em",
          color: "#f0f0f0",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        }}
      >
        App available at{" "}
        <a
          href="https://t.me/not_lost_bot"
          style={{
            color: "#4da6ff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          @not_lost_bot
        </a>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
