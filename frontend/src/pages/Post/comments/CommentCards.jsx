import React, { useEffect, useState } from 'react'
import { formatDate } from '../../../utility/formatDate'
import PostAComment from './PostAComment'
import { useSelector } from 'react-redux'
import Avatar from '../../../components/Avatar/Avatar'
import { useDeleteCommentMutation } from '../../../redux/features/comments/commentApi'
import { useFetchPostByIdQuery } from '../../../redux/features/posts/PostsApi';
import { useParams } from 'react-router-dom'

const CommentCards = ({ comments: initialComments }) => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [deleteComment] = useDeleteCommentMutation();
  console.log("user", user)
  // Use local state to manage comments
  const [comment, setComments] = useState(initialComments);
  const { refetch } = useFetchPostByIdQuery(id, { skip: !id })

  const handleDeleteComment = async (comment) => {
    try {
      if (comment.user.id !== user._id && user.role !== "admin" && user.role !== "moderator") {
        alert("You are not authorized to delete this comment");
        return;
      }

      const response = await deleteComment(comment._id).unwrap();
      alert(response.message);

      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== comment._id)
      );
    } catch (e) {
      console.log(e);
      alert("Failed to delete the comment. Please try again.");
    }

  }
  useEffect(() => {
    refetch()
  }, [comment])
  return (
    <div className='my-6 bg-white p-8 mb-[5rem]'>
      <div>
        {
          comment?.length >= 0 ? <div>
            <h3 className='text-lg font-medium'>All Comments</h3>
            <div>
              {
                comment.map((item, index) => (
                  <div key={index} className='mt-4'>
                    <div className='flex gap-4 items-center'>
                      <Avatar username={item?.user?.username || ''} />
                      <div>
                        <p className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>{item?.user?.username}</p>
                        <p className='text-[12px] italic'>{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    {/* Commnt details */}
                    <div className='text-gray-600 flex mt-5 border p-8'>
                      <p className='md:w-4/5'>{item.comment}</p>
                      <button onClick={() => handleDeleteComment(item)} className='bg-red-400 py-3 px-3  rounded-md'>Delete Comment</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div> : <div className='text-lg font-medium'>No Comments Found.</div>
        }
      </div>
      {/* Add Comment */}
      <PostAComment />
    </div >
  )
}

export default CommentCards
