export type Themes = "dark" | "light"
export type StyleColor = "dark" | "light" | "success" | "danger" | "warning" | "info" | "primary"

export type DefaultColorMap = {
    dark?: string,
    light?: string,
    primary: string, //default color must be set
    success?: string,
    info?: string,
    warning?: string,
    danger?: string,
}

export const defaultColorStyles: DefaultColorMap = {
    dark: "text-slate-50 bg-slate-500 active:bg-slate-200 active:text-slate-600 hover:bg-slate-600 hover:ring-2 ring-slate-600/25",
    light: "text-slate-600 bg-slate-50 active:bg-slate-600 active:text-slate-200 hover:bg-slate-200 hover:ring-2 ring-slate-200/50",
    primary: "text-slate-50 bg-blue-500 active:bg-blue-300 active:text-blue-800 hover:bg-blue-600 hover:ring-2 ring-blue-600/25",
    success: "text-slate-50 bg-emerald-500 active:bg-emerald-400 active:text-emerald-800 hover:bg-emerald-600 hover:ring-2 hover:ring-emerald-600/25",
    info: "text-slate-50 bg-cyan-500 active:bg-cyan-400 active:text-cyan-800 hover:bg-cyan-600 hover:ring-2 hover:ring-cyan-600/25",
    warning: "text-slate-50 bg-orange-500 active:bg-orange-400 active:text-orange-800 hover:bg-orange-600 hover:ring-2 hover:ring-orange-600/25",
    danger: "text-slate-50 bg-red-500 active:bg-red-400 active:text-red-800 hover:bg-red-600 hover:ring-2 hover:ring-red-600/25",
}

export const getColorStyles = (style: StyleColor = "primary", colorStyles: DefaultColorMap = defaultColorStyles) => colorStyles[style] || colorStyles[style] || defaultColorStyles.primary