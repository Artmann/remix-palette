import type { ReactElement, ReactNode } from 'react'

export function PageHeader({
  children
}: {
  children: ReactNode
}): ReactElement {
  return (
    <div
      className={`
        fixed inset-x-0 top-0 lg:left-72 xl:left-80 z-50 lg:z-30
        flex items-center justify-between gap-12 lg:hidden
        h-14 
        px-4 sm:px-6 lg:px-8
        transition
        backdrop-blur-xs dark:backdrop-blur-sm
      bg-white/[0.5] dark:bg-zinc-900/[0.2] dark:bg-zinc-900 dark:bg-opacity-90 dark:text-white  
      `}
    >
      <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/7.5 dark:bg-white/7.5" />

      {children}
    </div>
  )
}
