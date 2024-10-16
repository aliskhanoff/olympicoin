import type { ElementSize } from "../props"

export type DefaultSizeMap = {
    sm?:  string,
    md:   string, // default size, must be set
    lg?:  string,
    xl?:  string,
}

export const defaultSizes: DefaultSizeMap = {
    sm:  "px-3.5 py-1.5 text-[0.75rem]",
    md:  "px-4 py-2 text-[1rem]",
    lg:  "px-4 py-2 text-lg",
    xl:  "px-5 py-2.5 text-[1.4rem]",
}

export const getElementSizeClass = (size: ElementSize = "md", sizeMap: DefaultSizeMap = defaultSizes) => sizeMap[size] || sizeMap.md