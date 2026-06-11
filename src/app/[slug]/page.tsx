import client from "@/apollo-client";
import {GetPostQuery, GetPostDocument, GetPostsQuery, GetPostsDocument} from "@/gql/graphql";
import Image from "next/image";
import Link from "next/link";
import {unstable_cache} from "next/cache";

// Posts live under a `blog/` prefix in Prepr; the demo exposes clean routes,
// so we strip the prefix for params and re-add it when querying a single post.
const PREFIX = 'blog/';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const {data} = await client.query<GetPostsQuery>({
    query: GetPostsDocument,
    variables: {
      limit: 100
    }
  })

  return (data?.Posts?.items ?? []).map((post) => ({
    slug: (post._slug ?? '').replace(/^blog\//, '')
  }))
}

async function getData(slug: string) {
  const {data} = await client.query<GetPostQuery>({
    query: GetPostDocument,
    variables: {
      slug: PREFIX + slug
    },
    fetchPolicy: 'no-cache'
  })

  return data?.Post
}

const HEADING_FORMATS = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

// Extract a YouTube video id from a watch / share / embed URL.
function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? match[1] : null;
}

export default async function PostPage({params}: {params: Promise<{ slug: string }>}) {
  const {slug} = await params;

  const getCachedData = unstable_cache(
    async () => {
      return await getData(slug);
    },
    [slug],
    {
      tags: ['post'],
    }
  )

  const post = await getCachedData()

  return (
    <main className="mx-auto max-w-prose px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="text-primary-600 hover:text-primary-700 mb-8 inline-flex items-center gap-1 text-sm font-medium hover:underline"
      >
        <span aria-hidden>←</span> Back to the blog
      </Link>

      {/* Meta */}
      {post?.categories?.length ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <span
              key={category._slug}
              className="bg-primary-50 text-secondary-700 rounded-full px-3 py-1 text-xs font-medium"
            >
              {category.name}
            </span>
          ))}
        </div>
      ) : null}

      <h1 className="text-3xl font-bold text-secondary-700 sm:text-4xl">
        {post?.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-secondary-500">
        {post?.author && (
          <div className="flex items-center gap-2">
            <span className="bg-primary-100 relative h-8 w-8 overflow-hidden rounded-full">
              {post.author.image?.url && (
                <Image
                  src={post.author.image.url}
                  alt=""
                  fill
                  sizes="32px"
                  style={{objectFit: 'cover'}}
                />
              )}
            </span>
            <span className="font-medium text-secondary-700">{post.author.name}</span>
          </div>
        )}
        {typeof post?._read_time === 'number' && <span>{post._read_time} min read</span>}
      </div>

      {post?.cover?.url && (
        <div className="relative my-8 aspect-[2/1] overflow-hidden rounded-2xl">
          <Image
            fill
            src={post.cover.url}
            alt={post.title || ''}
            sizes="(min-width: 800px) 50rem, 100vw"
            style={{objectFit: 'cover'}}
            priority
          />
        </div>
      )}

      {/* Content blocks */}
      <article className="prose prose-lg prose-headings:text-secondary-700 prose-a:text-primary-600 max-w-none">
        {post?.content?.map((contentType) => {

          // Rich text — render headings as semantic tags, body as HTML
          if (contentType?.__typename === 'Text') {
            if (contentType.format && HEADING_FORMATS.includes(contentType.format)) {
              const Heading = contentType.format.toLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
              return <Heading key={contentType._id}>{contentType.text || contentType.body}</Heading>;
            }
            return (
              <div
                key={contentType._id}
                dangerouslySetInnerHTML={{__html: contentType.body || ''}}
              />
            );
          }

          // Image asset(s)
          if (contentType?.__typename === 'Assets' && contentType.items?.length) {
            return (
              <div className="not-prose my-8 space-y-2" key={contentType.items[0]?._id}>
                {contentType.items.map((asset) => asset?.url && (
                  <figure key={asset._id}>
                    <Image
                      width={1000}
                      height={600}
                      src={asset.url}
                      alt={asset.caption || post?.title || ''}
                      className="h-auto w-full rounded-2xl"
                      style={{objectFit: 'cover'}}
                    />
                    {asset.caption && (
                      <figcaption className="mt-2 text-center text-sm text-secondary-500">
                        {asset.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            );
          }

          // YouTube embed
          if (contentType?.__typename === 'YouTubePost') {
            const id = youtubeId(contentType.url);
            if (!id) return null;
            return (
              <div className="not-prose my-8 aspect-video overflow-hidden rounded-2xl" key={contentType._id}>
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${id}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }

          return null;
        })}
      </article>
    </main>
  )
}
