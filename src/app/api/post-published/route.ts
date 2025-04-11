import {revalidatePath} from "next/cache";

export async function POST() {
  revalidatePath('/')
  return new Response(null, {status: 200})
}