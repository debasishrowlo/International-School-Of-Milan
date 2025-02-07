import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from "react-redux"

// import { useFetchPostByIdQuery } from '@/redux/features/posts/PostsApi';
import SinglePostCard from './singlePostCard';
import CommentCards from './comments/CommentCards';

import { useFetchPostByIdQuery } from '../../redux/features/posts/PostsApi';
import { trimWithEllipsis } from "@/utils"

import { apiRoutes, createSingleNewsRoute } from "@/router"
import { clearUserData } from "@/common"
import { logout as clearUserDataFromRedux } from '@/redux/features/auth/authSlice'

import { Post } from "@/types"

const SinglePost = () => {
  const { id } = useParams();
  const { refetch } = useFetchPostByIdQuery(id, { skip: !id })
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  console.log(relatedPosts)

  const logout = () => {
    clearUserData()
    dispatch(clearUserDataFromRedux());
  }

  const fetchData = async () => {
    if (!id) {
      return
    }

    const response = await fetch(apiRoutes.findPost(id), {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        logout()
      }

      return
    }

    const post = await response.json()

    setPost(post)
    setIsLoading(false)

    const relatedPostsResponse = await fetch(apiRoutes.getRelatedPosts(id), {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!relatedPostsResponse.ok) {
      if (relatedPostsResponse.status === 401) {
        logout()
      }

      return
    }

    const relatedPosts = await relatedPostsResponse.json()

    setRelatedPosts(relatedPosts)
  }

  useEffect(() => {
    fetchData()
  }, [id])
  return (
    <div className='text-gray-900 container mx-auto mt-8'>
      <div>
        {isLoading && <div>Loading...</div>}
        {post && (
          <div className='flex flex-col lg:flex-row justify-between items-start md:gap-12 gap-8'>
            <div className='lg:w-2/3 w-full'>
              <SinglePostCard post={post} />
            </div>
            {(relatedPosts.length > 0) && (
              <div className='bg-white lg:w-1/3 w-full'>
                <div>
                  <h3 className="text-2xl font-medium pt-8 px-8 pb-5">Related Posts</h3>
                  <hr />
                  <div className="space-y-4 mt-5">
                    {relatedPosts.map((post) => (
                      <Link
                        to={createSingleNewsRoute(post.id)}
                        key={post.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm px-8 py-4"
                      >
                        <div className="h-16 w-16 flex-shrink-0">
                          <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="h-full w-full rounded-full ring-1 ring-blue-700 transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#1E73BE]">
                            {post.title}
                          </h4>
                          <p>{trimWithEllipsis(post.description, 50)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePost
