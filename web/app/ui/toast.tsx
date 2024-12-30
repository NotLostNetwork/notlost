import toast from "react-hot-toast"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"

const toastConfig = {
  style: {
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    color: getCssVariableValue("--tg-theme-accent-text-color"),
    background: "#232e3c",
  },
  iconTheme: {
    primary: "#232e3c",
    secondary: getCssVariableValue("--tg-theme-accent-text-color"),
  },
}

export const toastSuccess = (message: string) => {
  toast.success(message, toastConfig)
}
