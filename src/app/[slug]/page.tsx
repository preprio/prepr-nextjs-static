import client from "@/apollo-client";
import {GetPostQuery, GetPostDocument, GetPostsQuery, GetPostsDocument} from "@/gql/graphql";
import Image from "next/image";
import {unstable_cache} from "next/cache";


export async function generateStaticParams(): Promise<any[]> {
  const {data} = await client.query<GetPostsQuery>({
    query: GetPostsDocument,
    variables: {
      limit: 100
    }
  })

  let params: any[] = []

  data.Posts?.items.map((post) => {
    params.push({
      params: {
        slug: post._slug
      }
    })
  })

  return params
}

async function getData(slug: string) {
  const {data} = await client.query<GetPostQuery>({
    query: GetPostDocument,
    variables: {
      slug
    },
    fetchPolicy: 'no-cache'
  })

  return data.Post
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
      <>
        <h1>
          {post?.title}
        </h1>

        {post?.cover && <div className="my-10">
          <Image
            width={300}
            height={250}
            src={post?.cover?.url || ''}
            alt={post?.title || ''}
          />
        </div>}

        {/* Loop through content types in article content */}

        {post?.content?.map((contentType) => {

          //Display image if it exists
          if (contentType?.__typename === 'Assets' && contentType?.items?.length) {
            return (
                <div className="my-10" key={contentType.items[0]?._id}>
                  <Image
                    width={300}
                    height={250}
                    src={contentType.items[0]?.url || ''}
                    alt={post?.title || ''}
                  />
                </div>
            )
          }

          //Display text as HTML

          if (contentType?.__typename === 'Text') {

            return (
                <div key={contentType._id} dangerouslySetInnerHTML={{__html: contentType.body || ''}}></div>
            )
          }
        })}
      </>
  )
}
