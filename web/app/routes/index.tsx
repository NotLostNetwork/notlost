import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Route as EventsRoute } from "@/routes/app/_tab-bar/events/index"

function RouteComponent() {
  const navigate = useNavigate()

  navigate({ to: EventsRoute.to })

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
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

      <button
        style={{
          color: "#4da6ff",
          textDecoration: "none",
          fontWeight: "bold",
          marginTop: 20,
        }}
        onClick={() => navigate({ to: AppRoute.to })}
      >
        redirect to app
      </button>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
