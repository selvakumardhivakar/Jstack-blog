"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { client } from "../lib/client"

export const RecentPost = () => {
  const [title, setTitle] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const queryClient = useQueryClient()

  const { data: recentPost, isPending: isLoadingPosts } = useQuery({
    queryKey: ["get-recent-post"],
    queryFn: async () => {
      const res = await client.post.recent.$get()
      return await res.json()
    },
  })

  const createPost = useMutation({
    mutationFn: async ({ title }: { title: string; description: string }) => {
      await client.post.create.$post({ title, description: desc })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-recent-post"] })
      setTitle("")
      setDesc("")
    },
  })

  return (
    <div className="w-full max-w-md">
      {isLoadingPosts ? (
        <p>Loading posts...</p>
      ) : recentPost ? (
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
          <div className="p-4">
            <h5 className="mb-2 text-brand-700 text-xl font-semibold">
              {recentPost.title}
            </h5>
            <p className="text-slate-600 leading-normal font-light">
              {recentPost.description}
            </p>

            <button
              className="rounded-md bg-slate-800 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Check all posts
            </button>
          </div>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createPost.mutate({ title, description: desc })
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md outline outline-2 outline-brand-300 h-12 px-4 py-2 text-black"
        />

        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full rounded-md outline outline-2 outline-brand-300 h-20 px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-md h-12 mt-5 px-10 py-3 bg-brand-700 text-brand-50 font-semibold transition hover:bg-brand-800"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
