import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios"

import { apiRoutes } from "@/router"

import { formatDate } from "../../../utility/formatDate";
import Avatar from "../../../components/Avatar/Avatar";

const PostAComment = ({ post, addComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      apiRoutes.posts.comments.create(post.id), 
      { comment }, 
      { withCredentials: true },
    )

    if (response.status === 201) {
      const comment = response.data
      addComment(comment)
      setComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-8">Leave a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          name="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          cols="30"
          rows="10"
          placeholder="Share your comment"
          className="w-full bg-gray-50 focus:outline-none p-5"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white font-medium py-2 px-4 rounded-lg mt-5"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

const CommentCards = ({ post, comments, addComment }) => {
  return (
    <div className="my-6 bg-white p-8">
      <div>
        {comments.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium">All Comments</h3>
            <div>
              {comments.map((comment, index) => (
                <div key={index} className="mt-4">
                  <div className="flex gap-4 items-center">
                    <Avatar username={comment.user.username} />
                    <div>
                      <p className="text-lg font-medium underline capitalize underline-offset-4 text-blue-400">
                        {comment?.user?.username}
                      </p>
                      <p className="text-[12px] italic">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-600 mt-5 border p-8">
                    <p className="md:w-4/5">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-lg font-medium">No Comments Found.</div>
        )}
      </div>
      <PostAComment post={post} addComment={addComment} />
    </div>
  );
};

export default CommentCards;
