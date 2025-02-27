import {
  Link,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'
import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import { motion } from 'framer-motion'

import './tailwind.css'

import { BackgroundGradient } from './components/background-gradient'
import { SidebarContent, SidebarGroup, SidebarLink } from './components/sidebar'
import { createMetaTags } from './meta'
import { RecipeService } from './recipes/recipe-service.sever'
import { PageHeader } from './components/page-header'
import { Button } from './components/ui/button'
import { MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

export const loader: LoaderFunction = async () => {
  const recipeService = new RecipeService()

  const recipes = await recipeService.listRecipes()

  return { recipes }
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

export const meta: MetaFunction = () =>
  createMetaTags('Remix Palette', {
    description: 'All the colors you need to build an awesome Remix app.'
  })

export function Layout({ children }: { children: React.ReactNode }) {
  const { recipes } = useLoaderData<typeof loader>()

  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <Meta />
        <Links />
      </head>
      <body className="flex min-h-full bg-white dark:bg-zinc-900 font-serif antialiased">
        <div className="w-full">
          <div className="h-full lg:ml-72 xl:ml-80">
            <header
              className={`
                lg:fixed lg:inset-0 lg:z-40 
                lg:flex  
                lg:pointer-events-none
              `}
            >
              <div
                className={`
                  lg:pointer-events-auto
                  lg:block lg:w-72 xl:w-80 
                  lg:overflow-y-auto
                  lg:border-r lg:border-zinc-900/10 lg:dark:border-white/10  
                  lg:px-6 lg:pt-4 lg:pb-8
                  text-zinc-900 dark:text-white
                `}
              >
                <div className="hidden lg:flex">
                  <Link
                    className="flex items-center gap-2 text-lg font-bold tracking-tight"
                    to="/"
                  >
                    Remix Palette
                  </Link>
                </div>

                <PageHeader>
                  <div className="flex items-center gap-2 lg:hidden">
                    <Button
                      aria-label="Toggle navigation"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setIsMobileNavigationOpen(!isMobileNavigationOpen)
                      }
                    >
                      {isMobileNavigationOpen ? (
                        <XIcon className="size-3" />
                      ) : (
                        <MenuIcon className="size-3" />
                      )}
                    </Button>

                    <Link
                      className="flex items-center gap-2 text-base font-bold tracking-tight"
                      to="/"
                    >
                      Remix Palette
                    </Link>
                  </div>
                </PageHeader>

                <SidebarContent>
                  <SidebarGroup title="Getting Started">
                    <SidebarLink
                      to="/"
                      end
                    >
                      Introduction
                    </SidebarLink>
                  </SidebarGroup>

                  <SidebarGroup title="Recipes">
                    {recipes.map((recipe) => (
                      <SidebarLink
                        key={recipe.slug}
                        to={`/recipes/${recipe.slug}`}
                      >
                        {recipe.title}
                      </SidebarLink>
                    ))}
                  </SidebarGroup>
                </SidebarContent>
              </div>

              <motion.div
                className="fixed z-50 left-0  bottom-0 top-14 w-full bg-white dark:bg-zinc-900 overflow-hidden"
                initial={{ left: '-100%' }}
                animate={{ left: isMobileNavigationOpen ? 0 : '-100%' }}
              >
                <div className="p-6">
                  <div>
                    <ul className="flex flex-col gap-6">
                      <SidebarGroup title="Getting Started">
                        <SidebarLink
                          to="/"
                          end
                        >
                          Introduction
                        </SidebarLink>
                      </SidebarGroup>

                      <SidebarGroup title="Recipes">
                        {recipes.map((recipe) => (
                          <SidebarLink
                            key={recipe.slug}
                            to={`/recipes/${recipe.slug}`}
                            onClick={() => setIsMobileNavigationOpen(false)}
                          >
                            {recipe.title}
                          </SidebarLink>
                        ))}
                      </SidebarGroup>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </header>

            <div
              className={`
                relative 
                h-full
                flex flex-col
                px-6 lg:px-8 pt-24
              `}
            >
              <main className="flex-auto">
                <article className="flex flex-col h-full pb-10">
                  <div className="flex-auto prose dark:prose-invert [html_:where(&>*)]:mx-auto [html_:where(&>*)]:max-w-2xl lg:[html_:where(&>*)]:mx-[calc(50%-min(50%,var(--container-lg)))] lg:[html_:where(&>*)]:max-w-3xl pb-32 min-h-[80vh]">
                    <BackgroundGradient />

                    {children}
                  </div>
                </article>
              </main>

              <footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
                <div className="text-sm text-gray-500">
                  Made with ❤️ in Barcelona
                </div>
              </footer>
            </div>
          </div>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
