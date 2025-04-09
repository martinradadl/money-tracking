import Toastify from "toastify-js";

type ToastifyOptionsI = {
  text: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  style?: React.CSSProperties;
  gravity?: "top" | "bottom";
  position?: "left" | "center" | "right";
};
// Not all CSS properties work, please check it before
interface OptionStylesI {
  [props: string]: React.CSSProperties;
}

const defaultStyles: OptionStylesI = {
  error: { background: "red" },
  success: { background: "green" },
  warning: { background: "yellow", color: "blue" },
  info: { background: "blue" },
};

export const createToastify = (options: ToastifyOptionsI) => {
  Toastify({
    text: options.text,
    duration: options.duration || 3000,
    //@ts-expect-error override type
    style: { ...defaultStyles[options.type || "error"], ...options.style },
    gravity: options.gravity || "top",
    position: options.position || "right",
  }).showToast();
};
