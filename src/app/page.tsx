import client from "@/apollo-client";

import Link from "next/link";
import {GetPostsQuery, GetPostsDocument} from "@/gql/graphql";
import {unstable_cache} from "next/cache";

async function getData() {
  const {data} = await client.query<GetPostsQuery>({
    query: GetPostsDocument,
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

  if (!posts) {
    return <p>No posts found</p>
  }

  return (
    <div>
      <h1>My blog site</h1>
      <ul>
        {posts.map((post) => (

          //List the fetched articles
          <li key={post._id}>
            <Link href={post._slug!} className='text-blue-900 underline'>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
