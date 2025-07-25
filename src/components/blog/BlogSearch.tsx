"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface BlogSearchProps {
  search: string
}

export default function BlogSearch({ search }: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [input, setInput] = useState(search)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (input) {
        params.set("search", input)
      } else {
        params.delete("search")
      }
      params.delete("page") // Reset to first page on new search
      router.push(`?${params.toString()}`)
    }, 400) // debounce to avoid too many requests

    return () => clearTimeout(timeout)
  }, [input])

  return (
    <div className="mb-7">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search blogs..."
        className="w-[365px] input"
      />
    </div>
  )
}
