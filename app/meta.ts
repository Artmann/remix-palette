import { MetaDescriptor } from '@remix-run/react'

interface CreateMetaTagOptions {
  // @username of the content creator.
  creatorTwitterHandle?: string
  // Description of the content (maximum 200 characters).
  description?: string
  // URL of the image to be used when sharing the content on social media. This must be an absolute URL.
  imageUrl?: string
  // Instructions for search engine robots.
  robots?: 'follow, index' | 'noindex' | 'nofollow' | 'none'
  // @username of the website.
  siteTwitterHandle?: string
  // Type of content (e.g. article, website).
  type?:
    | 'website'
    | 'article'
    | 'book'
    | 'profile'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
    | 'video.movie'
    | 'video.episode'
    | 'video.tv_show'
    | 'video.other'
  // Type of Twitter card to use.
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  // URL of the website.
  url?: string
}

/**
 *
 * @param title Title of the content (max 70 characters).
 * @param options
 * @returns
 */
export function createMetaTags(
  title: string,
  {
    creatorTwitterHandle,
    description = `The headless CMS that makes it easy to create, manage, and publish content with Next.js.`,
    imageUrl,
    robots = 'follow, index',
    siteTwitterHandle,
    type = 'website',
    twitterCard = 'summary_large_image',
    url
  }: CreateMetaTagOptions = {}
): MetaDescriptor[] | undefined {
  const tags = [
    { title },
    { name: 'title', content: title },
    { name: 'description', content: description },

    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:type', content: type },

    { name: 'twitter:card', content: twitterCard },

    { name: 'robots', content: robots }
  ]

  if (url) {
    tags.push({ name: 'og:url', content: url })
  }

  if (creatorTwitterHandle) {
    tags.push({ name: 'twitter:creator', content: creatorTwitterHandle })
  }

  if (siteTwitterHandle) {
    tags.push({ name: 'twitter:site', content: siteTwitterHandle })
  }

  if (imageUrl) {
    tags.push({ name: 'og:image', content: imageUrl })
    tags.push({ name: 'og:image:alt', content: title })
    tags.push({ name: 'twitter:image', content: imageUrl })
  }

  return tags
}
