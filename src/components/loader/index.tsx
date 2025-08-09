import React from 'react'
import Spinner from './spinner'
import { cn } from '@/lib/utils'

type Props = {
  state: boolean
  className?: string
  children?: React.ReactNode
  color?: string
}

const Loader = ({ state, className, children, color }: Props) => {
  if (state) {
    return (
      <div className={cn(className)}>
        <Spinner color={color} />
      </div>
    )
  }
  return <>{children}</>
}

export default Loader
