import fs from 'fs/promises'
import { bundleMDX } from 'mdx-bundler'
import { join } from 'path'
import invariant from 'tiny-invariant'
import { log } from 'tiny-typescript-logger'

import { RecipeDto } from './glue'

export class RecipeService {
  async listRecipes(): Promise<RecipeDto[]> {
    const slugs = await this.listSlugs()

    const recipes = await Promise.all(
      slugs.map((slug) => {
        try {
          return this.loadRecipe(slug)
        } catch (error: any) {
          log.error(error)
        }
      })
    )

    return recipes.filter((recipe): recipe is RecipeDto => Boolean(recipe))
  }

  async listSlugs(): Promise<string[]> {
    const recipeDirectoryPath = this.getRecipeDirectoryPath()
    const fileNames = await fs.readdir(recipeDirectoryPath)

    return fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .sort((a, b) => a.localeCompare(b))
      .map((fileName) => fileName.replace(/\.mdx$/, ''))
  }

  async loadRecipe(slug: string): Promise<RecipeDto> {
    const recipePath = join(this.getRecipeDirectoryPath(), `${slug}.mdx`)
    const recipeExists = await this.checkIfFileExists(recipePath)

    if (!recipeExists) {
      throw new RecipeNotFoundError(slug)
    }

    const source = await fs.readFile(recipePath, 'utf8')

    const result = await bundleMDX({
      source,
      mdxOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? [])]
        options.rehypePlugins = [...(options.rehypePlugins ?? [])]

        return options
      }
    })

    const { title, description } = result.frontmatter

    invariant(title, 'The title is missing.')
    invariant(description, 'The description is missing.')

    return {
      code: result.code,
      description,
      slug,
      title
    }
  }

  private async checkIfFileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path)

      return true
    } catch {
      return false
    }
  }

  private getRecipeDirectoryPath(): string {
    return join(process.cwd(), 'recipes')
  }
}

export class RecipeNotFoundError extends Error {
  constructor(slug: string) {
    super(`Recipe with slug "${slug}" does not exist`)
  }
}
