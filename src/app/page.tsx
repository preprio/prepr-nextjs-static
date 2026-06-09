import client from "@/apollo-client";

import Link from "next/link";
import Image from "next/image";
import {GetPostsQuery, GetPostsDocument} from "@/gql/graphql";
import {unstable_cache} from "next/cache";

// Posts are stored under a `blog/` prefix in Prepr; the demo uses clean routes.
function toRoute(slug?: string | null) {
  return '/' + (slug ?? '').replace(/^blog\//, '');
}

async function getData() {
  const {data} = await client.query<GetPostsQuery>({
    query: GetPostsDocument,
    variables: {limit: 100},
  });

  return data?.Posts?.items;
}

const getCachedPosts = unstable_cache(
  async () => {
    return await getData();
  },
  [],
  {
    tags: ['post'],
    revalidate: 86400
  }
)

export default async function Home() {
  const posts = await getCachedPosts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-primary-600 text-sm font-semibold uppercase tracking-wide">
          Acme Lease
        </p>
        <h1 className="mt-1 text-3xl font-bold text-secondary-700 sm:text-4xl">
          The Blog
        </h1>
        <p className="mt-2 max-w-2xl text-secondary-500">
          Tips, guides and news on car leasing — statically generated with Next.js
          and Prepr.
        </p>
      </header>

      {!posts?.length ? (
        <p className="text-secondary-500">No posts found</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <Link
                href={toRoute(post._slug)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-sm transition duration-200 ease-in-out hover:border-primary-600"
              >
                {/* Cover */}
                <div className="bg-primary-100 relative h-48">
                  {post.cover?.url && (
                    <Image
                      src={post.cover.url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      style={{objectFit: 'cover'}}
                    />
                  )}
                  {post.categories.length > 0 && (
                    <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2">
                      {post.categories.map((category) => (
                        <span
                          key={category._slug}
                          className="bg-primary-50 text-secondary-700 rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex grow flex-col gap-4 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <span className="bg-primary-100 relative h-7 w-7 overflow-hidden rounded-full">
                          {post.author.image?.url && (
                            <Image
                              src={post.author.image.url}
                              alt=""
                              fill
                              sizes="28px"
                              style={{objectFit: 'cover'}}
                            />
                          )}
                        </span>
                        <span className="text-sm font-medium text-secondary-700">
                          {post.author.name}
                        </span>
                      </div>
                    )}
                    {typeof post._read_time === 'number' && (
                      <span className="text-sm text-secondary-500">
                        {post._read_time} min read
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-medium text-secondary-700">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-secondary-500 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <span className="text-primary-600 group-hover:text-primary-700 mt-auto inline-flex items-center gap-1 text-sm font-medium group-hover:underline">
                    Read more
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
