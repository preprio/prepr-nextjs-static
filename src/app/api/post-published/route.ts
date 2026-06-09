import {revalidatePath, revalidateTag} from "next/cache";

export async function POST() {
  revalidatePath('/')
  // Next.js 16 requires a cacheLife profile as the second argument.
  revalidateTag('post', 'max')
  return new Response(null, {status: 200})
}
