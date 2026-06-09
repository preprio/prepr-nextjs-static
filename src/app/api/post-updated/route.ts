import {revalidatePath, revalidateTag} from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.payload?.slug) {
    return new Response('Missing slug', { status: 400 });
  }

  // Prepr slugs are prefixed with `blog/`; the demo serves them at clean routes.
  body.payload.slug.map((slug: string) =>
    revalidatePath('/' + slug.replace(/^blog\//, ''))
  )
  // Next.js 16 requires a cacheLife profile as the second argument.
  revalidateTag('post', 'max')

  return new Response('OK');
}
