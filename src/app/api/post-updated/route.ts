import {revalidatePath, revalidateTag} from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.payload?.slug || !body?.payload?.slug['en-US']) {
    return new Response('Missing slug', { status: 400 });
  }

  const slug = body.payload.slug['en-US'];

  revalidatePath('/' + slug)
  revalidateTag('posts')
  return new Response('OK');
}