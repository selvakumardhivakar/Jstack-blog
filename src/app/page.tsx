import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { RecentPost } from "./components/post"
import { client } from "./lib/client"

export default async function Home() {
  const res = await client.post.recent.$get()
  const recentPost = await res.json()

  /**
   * This is the intended way to prefetch data on the server to have it immediately available in the client.
   * But: you could also just pass the post as a prop instead of using the `HydrationBoundary`
   */
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryFn: () => recentPost,
    queryKey: ["get-recent-post"],
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-medium font-heading tracking-tight sm:text-[5rem]">
            <span className="text-brand-700">Vuelancer </span>Blog
          </h1>
          <p className="text-center max-w-prose text-balance">
            New, modern, minimal blog for developers to share ideas developed using 
            Jstack.
          </p>
          <RecentPost />
        </div>
      </main>
    </HydrationBoundary>
  )
}
