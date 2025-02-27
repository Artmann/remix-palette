import { LoaderFunction, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getMDXComponent } from 'mdx-bundler/client'
import { ReactElement } from 'react'
import invariant from 'tiny-invariant'
import { log } from 'tiny-typescript-logger'

import { createMetaTags } from '~/meta'
import {
  RecipeNotFoundError,
  RecipeService
} from '~/recipes/recipe-service.sever'

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug

  invariant(slug, 'No slug provided')

  const recipeService = new RecipeService()

  try {
    const recipe = await recipeService.loadRecipe(slug)

    return {
      recipe
    }
  } catch (error: any) {
    if (error instanceof RecipeNotFoundError) {
      return {}
    }

    log.error(error)

    return {
      error: error.message
    }
  }
}

export const meta: MetaFunction = ({ data }) => {
  const recipe = (data as any).recipe

  if (!recipe) {
    return createMetaTags('Recipe not found')
  }

  return createMetaTags(recipe.title, {
    description: recipe.description
  })
}

export default function RecipeRoute(): ReactElement {
  const { recipe, error } = useLoaderData<typeof loader>()

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
            Something went wrong
          </h1>

          <div className="max-w-2xl text-lg font-light text-foreground">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
            Page not found
          </h1>

          <div className="max-w-2xl text-lg font-light text-foreground">
            The page you are looking for does not exist.
          </div>
        </div>
      </div>
    )
  }

  const Component = getMDXComponent(recipe.code)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          {recipe.title}
        </h1>

        <div className="max-w-2xl text-lg font-light text-foreground">
          {recipe.description}
        </div>
      </div>

      <div className="prose prose-zinc">
        <Component />
      </div>
    </div>
  )
}
