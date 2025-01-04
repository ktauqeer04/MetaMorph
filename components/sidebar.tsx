import React from 'react'
import Link from "next/link";

function sidebar() {
  return (
    <>
        <aside className="w-1/7 bg-gray-800 p-6 shadow-md">
        <nav className="space-y-4">
        <Link href="/home">
            <button className="w-full p-3 text-gray-300 border border-gray-600 rounded hover:bg-gray-700">
            Home
            </button>
        </Link>
        <Link href="/social-share">
            <button className="w-full p-3 text-gray-300 border border-gray-600 rounded hover:bg-gray-700">
            Social Share
            </button>
        </Link>
        <Link href="/video-upload">
            <button className="w-full p-3 text-gray-300 border border-gray-600 rounded hover:bg-gray-700">
            Video Upload
            </button>
        </Link>
        </nav>
    </aside>
  </>
  )
}

export default sidebar
