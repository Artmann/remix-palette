import { NavLink } from '@remix-run/react'
import { ReactElement, ReactNode } from 'react'

export function SidebarContent({
  children
}: {
  children: ReactNode
}): ReactElement {
  return (
    <nav className="hidden lg:block lg:mt-10">
      <ul className="flex flex-col gap-6">{children}</ul>
    </nav>
  )
}

export function SidebarGroup({
  children,
  title
}: {
  children: ReactNode
  title: string
}): ReactElement {
  return (
    <li className="relative">
      <h2 className="text-xs font-semibold">{title}</h2>
      <div className="relative mt-3 pl-2">
        <ul className="border-l border-transparent">{children}</ul>
      </div>
    </li>
  )
}

export function SidebarLink({
  children,
  end,
  to
}: {
  children: ReactNode
  end?: boolean
  to: string
}): ReactElement {
  return (
    <li className="relative">
      <NavLink
        className={({ isActive }) => `
          flex justify-between gap-2
          py-1 pr-3 pl-4
          text-sm
          transition  
          text-zinc-900 dark:text-white
          border-l
          ${isActive ? 'border-purple-500' : 'border-zinc-900/10 dark:border-white/5'} 
        `}
        end={end}
        to={to}
      >
        <span className="truncate">{children}</span>
      </NavLink>
    </li>
  )
}
