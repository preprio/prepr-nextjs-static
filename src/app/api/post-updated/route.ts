import {revalidatePath, revalidateTag} from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.payload?.slug) {
    return new Response('Missing slug', { status: 400 });
  }

  body.payload.slug.map((slug: string) => revalidatePath('/' + slug))
  // Next.js 16 requires a cacheLife profile as the second argument.
  revalidateTag('posts', 'max')

  return new Response('OK');
}