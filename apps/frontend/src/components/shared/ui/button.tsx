import type React from 'react'

type Props = {
    children?: React.ReactNode
}

export const Button = (props: Props) => {
  return (
    <button className='border-2 border-slate-500 px-2 py-1 rounded-sm hover:bg-slate-500 hover:text-slate-100 transition-colors' type='button'>{ props.children }</button>
  )
}

export default Button