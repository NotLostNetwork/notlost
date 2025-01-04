import toast from "react-hot-toast"
import { getCssVariableValue } from "~/lib/utils/funcs/get-css-variable-value"

const toastConfig = {
  style: {
    borderRadius: "32px",
    paddingLeft: "0px",
    paddingRight: "12px",
    paddingTop: "2px",
    top: "0px !important",
    paddingBottom: "2px",
    fontWeight: "400",
    color: "white",
    background: getCssVariableValue("--tg-theme-button-color"),
    marginBottom: 84,
  },
  iconTheme: {
    primary: "white",
    secondary: "rgba(41, 144, 255, 0)",
  },
}

export const toastSuccess = (message: string) => {
  toast.success(message, toastConfig)
}
