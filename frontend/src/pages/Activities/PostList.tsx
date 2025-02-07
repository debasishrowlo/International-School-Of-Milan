import { Link } from 'react-router-dom';

import { createSingleNewsRoute } from "@/router"
import * as u from "@/utils" 

import { Post } from "@/types"

const PostList = ({
  posts,
} : {
  posts: Post[],
}) => {
  return (
    <div className="mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32">
      {posts.map((post) => (
        <Link
          to={createSingleNewsRoute(post.id)}
          key={post.id}
          className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="relative">
            <img
              src={post.coverImageUrl}
              className="h-288 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-20 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300">
                {post?.title}
              </h2>
              <p className="text-sm text-gray-500 mt-8">
                {u.trimWithEllipsis(post.description)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PostList