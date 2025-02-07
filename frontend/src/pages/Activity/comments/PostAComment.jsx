import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { usePostCommentMutation } from '../../../redux/features/comments/commentApi';
import { useFetchPostByIdQuery } from '../../../redux/features/posts/PostsApi';

const PostAComment = () => {
    const {id} = useParams();
    const [comment, setComment] = useState('');
    const {user} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    // console.log(user);
    const [postComment] = usePostCommentMutation()
    const {refetch} = useFetchPostByIdQuery(id, {skip: !id});

    const handleSubmit = async (e) => {
      e.preventDefault();
      if(!user) {
        alert('Please Login to Comment');
        navigate('/login');
        return;
      }

      const newComment = {
        comment: comment,
        user: user?._id,
        postId: id 
      }
      // console.log(newComment);
      try {
        const respone = await postComment(newComment).unwrap();
        console.log(respone);
        alert('Comment posted successfully');
        setComment('');
        refetch()
      } catch (error) {
        alert('An error occurred while posting the comment')
      }

    };

  return (
    <div className = 'mt-8'  >
        <h3 className='text-lg font-medium mb-8'>Leave a Comment</h3>
        <form onSubmit={handleSubmit}>
            <textarea
              name="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              cols="30"
              rows="10"
              placeholder='Share your comment'
              className='w-full bg-gray-50 focus:outline-none p-5'
            />
            <button type='submit' className='bg-gray-900 text-white font-medium py-2 px-4 rounded-lg mt-5'>Submit</button>
        </form>

    </div>
  )
}

export default PostAComment