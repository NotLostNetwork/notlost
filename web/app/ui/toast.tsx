import toast from "react-hot-toast"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"

const toastConfig = {
  style: {
    borderRadius: "32px",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "2px",
    top: "0px !important",
    paddingBottom: "2px",
    fontWeight: "500",
    color: getCssVariableValue("--tg-theme-accent-text-color"),
    background: "#232e3c",
    marginBottom: 84,
  },
  iconTheme: {
    primary: "#232e3c",
    secondary: getCssVariableValue("--tg-theme-accent-text-color"),
  },
}

export const toastSuccess = (message: string) => {
  toast.success(message, toastConfig)
}
