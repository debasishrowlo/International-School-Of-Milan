import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list';
import Header from '@editorjs/header'; 
import {  useFetchPostByIdQuery, useUpdatePostMutation } from '../../../redux/features/posts/PostsApi';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePost = () => {
    const {id} = useParams()
    const editorRef = useRef(null);
    const [title, setTitle] = useState(""); 
    const [coverImg, setCoverImg] = useState(""); 
    const [metadesc, setMetadesc] = useState(""); 
    const [category, setCategory] = useState(""); 
    const [rating, setRating] = useState(0); 
    const [message, setMessage] = useState(""); 
    const [updatePost] = useUpdatePostMutation(); 
    const {user} = useSelector((state) => state.auth);
    const {data: post={}, error, isLoading, refetch} = useFetchPostByIdQuery(id);
    useEffect(() => {
        if(post.post) {
            const editor = new EditorJS({
                holder: 'editorjs',
                onReady: () => {
                  editorRef.current = editor;
                  
                },
                autofocus: true,
                tools: {
                  header: {
                    class: Header, 
                    inlineToolbar: true
                  }, 
                  list: {
                    class: List,
                    inlineToolbar: true,
                  },
                },
                data: post.post.content
              });

              return () => {
                editor.destroy();
                editorRef.current = null;
              }
        }
  

    }, []);
  
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const content = await editorRef.current.save();
        const updateePost = {
          title: title || post.post.title,
          coverImg: coverImg || post.post.coverImg,
          content,
          description: metadesc || post.post.description,
          category: category || post.post.category,
          author: user?._id,
          rating,
        }
  
        // console.log(updateePost)
        const response = await updatePost({id, ...updateePost}).unwrap();
        console.log(response);
        alert("Content Updated successfully!");
        navigate('/posts');
        refetch();
  
      } catch (error) {
        console.log('Failed to Update Post', error);
        setMessage("Failed to Update Post. Please try again!");
      }
    }
  return (
    <div className='bg-white md:p-8 p-2'>
    <h2 className='text-2xl font-semibold'>Update this Post</h2>
    <form onSubmit={handleSubmit} className='space-y-5 pt-8'>
      <div className='space-y-4'>
        <label className='font-semibold text-xl'>Post Title:</label>
        <input type="text" placeholder='Ex: Importance of STEM Education...' required 
        className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
        defaultValue={post?.post?.title}
        onChange={(e) => setTitle(e.target.value)} 
        ></input>
      </div>

      {/* Post Details */}
      <div className='flex flex-col md:flex-row justify-between items-start gap-4'>
        {/* Left side */}
        <div className='md:w-2/3 w-full'>
        <p className='font-semibold text-xl mb-5'>Content Section</p>
        <p className='text-xs italic'>Write your Post below here</p>
        <div id="editorjs">

        </div>
        </div>

        {/* Right Side */}
        <div className='md:w-1/3 w-full border p-5 space-y-5'>
        <p className='text-xl font-semibold'>Choose Post Format</p>
        {/* For images */}
        <div className='space-y-4'>
        <label className='font-semibold'>Post Cover:</label>
        <input type="text" placeholder='https://unsplash.com/cover-image-of-post.png...' required 
        className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
        defaultValue={post?.post?.coverImg}
        onChange={(e) => setCoverImg(e.target.value)} 
        ></input>
      </div>

      {/* Category */}
      <div className='space-y-4'>
        <label className='font-semibold'>Category:</label>
        <input type="text" placeholder='Technology/Education/etc...' required 
        className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
        defaultValue={post?.post?.category}
        onChange={(e) => setCategory(e.target.value)} 
        ></input>
      </div>

      {/* Meta Description */}
      <div className='space-y-4'>
        <label className='font-semibold'>Meta Description:</label>
        <textarea type="text" cols={4} rows={4} placeholder='Write your Post meta description' required 
        className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
        defaultValue={post?.post?.description}
        onChange={(e) => setMetadesc(e.target.value)} 
        ></textarea>
      </div>

      {/* Rating */}
      <div className='space-y-4'>
        <label className='font-semibold'>Rating:</label>
        <input type="number"  required 
        className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
        defaultValue={post?.post?.rating}
        onChange={(e) => setRating(e.target.value)} 
        ></input>
      </div>

      {/* Author */}
      <div className='space-y-4'>
        <label className='font-semibold'>Author:</label>
        <input type="text"  disabled 
        className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
        value={user.username}
        placeholder={`{user.username} (not editable)`}
        ></input>
      </div>

        </div>

      </div>

      {
        message && <p className='text-red-500'>{message}</p>
      }
      <button type="submit" 
      disabled={isLoading}
      className='w-full mt-5 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-3 rounded-md'
      >Update The Post</button>

    </form>
  </div>
  )
}

export default UpdatePost