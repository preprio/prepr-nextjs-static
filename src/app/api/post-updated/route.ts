import {revalidatePath, revalidateTag} from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.payload?.slug) {
    return new Response('Missing slug', { status: 400 });
  }

  body.payload.slug.map((slug: string) => revalidatePath('/' + slug))
  revalidateTag('posts')

  return new Response('OK');
}