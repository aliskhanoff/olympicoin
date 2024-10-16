import { getColorStyles, getElementSizeClass, type StyleColor } from '@typo/utils'
import type {  DetailedHtmlElementProps, ElementSize } from '@typo/props'
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react'

type CommonProps = { 
  size?: ElementSize
  className?: string
  rounded?: boolean
  colorStyle?:StyleColor
}

type ButtonProps = { type?: "button" | "reset" | "submit" } & CommonProps & DetailedHtmlElementProps<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>
type AnchorButtonProps = { href: string } & CommonProps & DetailedHtmlElementProps<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>

const getComputedClassName = ({ size, rounded, colorStyle, className = "" }: CommonProps) => `transition-all ${ getColorStyles(colorStyle) } ${rounded ? "rounded-full" : "rounded-sm"} ${getColorStyles(colorStyle)} ${getElementSizeClass(size)} ${className}`

export const Button = ({ children, className = "", colorStyle = "primary", type = "button", rounded = false,  size="md", ...rest }: ButtonProps) => {

  const defaultButtonClass = getComputedClassName({ className, colorStyle, size, rounded  })

  return (
    <button  type={type} {...rest} className={defaultButtonClass}>{ children }</button>
  )
}

export const AnchorButton = ({ children, href, colorStyle = "primary", rounded = false, className = "", size="md", ...rest }: AnchorButtonProps) => {

  const defaultButtonClass = getComputedClassName({ className,  colorStyle, size, rounded  })

  return (
    <a  href={href} {...rest} className={defaultButtonClass}>{ children }</a>
  )
}

export const ButtonDark = (props: ButtonProps) => (<Button colorStyle="dark" {...props} />)
export const ButtonLight = (props: ButtonProps) => (<Button colorStyle="light" {...props} />)
export const ButtonPrimary = (props: ButtonProps) => (<Button colorStyle="primary" {...props} />)
export const ButtonSuccess = (props: ButtonProps) => (<Button colorStyle="success" {...props} />)
export const ButtonInfo = (props: ButtonProps) => (<Button colorStyle="info" {...props} />)
export const ButtonWarning = (props: ButtonProps) => (<Button colorStyle="warning" {...props} />)
export const ButtonDanger = (props: ButtonProps) => (<Button colorStyle="danger" {...props} />)

export const AnchorDark = (props: AnchorButtonProps) => (<AnchorButton colorStyle="dark" {...props} />)
export const AnchorLight = (props: AnchorButtonProps) => (<AnchorButton colorStyle="light" {...props} />)
export const AnchorPrimary = (props: AnchorButtonProps) => (<AnchorButton colorStyle="primary" {...props} />)
export const AnchorSuccess = (props: AnchorButtonProps) => (<AnchorButton colorStyle="success" {...props} />)
export const AnchorInfo = (props: AnchorButtonProps) => (<AnchorButton colorStyle="info" {...props} />)
export const AnchorWarning = (props: AnchorButtonProps) => (<AnchorButton colorStyle="warning" {...props} />)
export const AnchorDanger = (props: AnchorButtonProps) => (<AnchorButton colorStyle="danger" {...props} />)


export default Button