import type { DetailedHTMLProps, HTMLAttributes } from "react"

export type CommonElementProps = {
    className?: string
    size?: ElementSize
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

export type DetailedHtmlElementProps<T extends HTMLElement, A extends HTMLAttributes<T>> = {
    className?: string
} & DetailedHTMLProps<A, T>

export type ElementSize = "sm" | "md" | "lg" | "xl";