import { Slide, TypeOptions, toast } from "react-toastify"

export const notify = (message: string, type: TypeOptions, transition = Slide) => {
    toast(message, {
      position: "top-right",
      type: type,
      transition: transition,
      theme: "colored"
    })
  }