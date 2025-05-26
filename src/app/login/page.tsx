import React from "react"

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <form className="flex flex-col space-y-6">
        <input className="py-1 px-3 rounded-md" placeholder="username"/>
        <input placeholder="password"/>
        <button>Log in</button>
      </form>
    </div>
  )
}

export default page
