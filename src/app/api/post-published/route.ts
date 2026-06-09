import {revalidatePath, revalidateTag} from "next/cache";

export async function POST() {
  revalidatePath('/')
  revalidateTag('post')
  return new Response(null, {status: 200})
}
