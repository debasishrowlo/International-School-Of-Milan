//import React from 'react'
//import EditorJSHTML from "editorjs-html"
//import { useNavigate } from 'react-router-dom';
//
//import { formatDate } from '@/utility/formatDate';
//import { useDeletePostMutation } from '@/redux/features/posts/PostsApi';
//
//import DeleteButtonWithConfirmation from '@/components/DeletionButton/DeletionButton';
//
// const editorJSHTML = EditorJSHTML();

const SinglePostCard = ({ post }) => {
  console.log(post)

  return (
    <div>
      <img src={post.coverImageUrl} alt="" />
      <h1 className="mt-24">{post.title}</h1>
      <p>{post.description}</p>
      {/* <p>{formatDate(post.createdAt)}</p> */}
      <div className="tiptap" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  )

  // return (
  //   <>
  //   <div className='bg-white shadow-lg rounded-lg p-8 overflow-hidden'>
  //     {/* Blog header */}
  //     <div>
  //       <h1 className='md:text-4xl text-3xl font-bold mb-4 text-gray-900'>{title}</h1>
  //       {/* TODO: Need to change author */}
  //       <p className='mb-6 text-gray-600 text-sm'>
  //         {formatDate(createdAt)} by <span className='text-[#1E73BE] cursor-pointer hover:underline'>Admin</span>
  //       </p>
  //     </div>
  //     {/* Blog cover image */}
  //     <div className='relative'>
  //       <img src={coverImg} alt="cover Image" className='w-full md:h-[520px] object-cover rounded-md hover:opacity-90 transition-opacity duration-300'/>
  //     </div>
  //     {/* Blog content */}
  //     <div className='mt-8 space-y-6'>
  //       <div dangerouslySetInnerHTML={{__html: htmlContent}} className='space-y-4 leading-relaxed text-gray-700 editorjsdiv' />
  //     </div>
  //     <div>
  //       <DeleteButtonWithConfirmation onDelete={() => handleDelete(post._id)}/>
  //     </div>
  //   </div>
  //   </>
  // )
}

export default SinglePostCard;
