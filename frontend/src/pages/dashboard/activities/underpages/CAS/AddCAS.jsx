import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list';
import Header from '@editorjs/header'; 
import { useCreateCasMutation } from '../../../../../redux/features/activities/casApi';
import { useNavigate } from 'react-router-dom';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';

const AddCAS = ({closeModalOnSubmit}) => {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(""); 
  const [coverImg, setCoverImg] = useState(""); 
  const [metadesc, setMetadesc] = useState(""); 
  const [category, setCategory] = useState(""); 
  const [rating, setRating] = useState(0); 
  const [message, setMessage] = useState("");
  const {user} = useSelector((state) => state.auth);
  const [username, setUsername] = useState(user.username);
  
  const [createCas, {isLoading}] = useCreateCasMutation();
  useEffect(() => {
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
        image: {
          class: ImageTool,
          config:{
            field: 'image',
            types: 'image/*',
            captionPlaceholder:'Image',
            uploader: {
              uploadByUrl: async (url) => {
                return new Promise((resolve, reject) => {
                  // Retourner simplement l'URL de l'image en tant qu'objet
                  resolve({ success: 1, file: { url: url } });
                });
              },
            }
          },
          inlineToolbar:true
        },
        link: {
          class: LinkTool,
          inlineToolbar:true
        },
        inlineToolbar:true,
      }
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    }
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const content = await editorRef.current.save();
      console.log(content)
      const newPost = {
        title: title,
        coverImg: coverImg,
        content: content,
        description: metadesc,
        author: username,
      }

      // console.log(newPost)
      const response = await createCas(newPost).unwrap();
      console.log(response);
      closeModalOnSubmit();
      navigate('/cas');
      
    } catch (error) {
      console.log('Failed to submit Post', error);
      setMessage("Failed to submit Post. Please try again!");
    }
  }



  return (
    <div className='bg-white md:p-8 p-2'>
      <form onSubmit={handleSubmit} className='space-y-5 pt-8'>
        <div className='space-y-4'>
          <label className='font-semibold text-xl'>CAS Title:</label>
          <input type="text" placeholder='Ex: Importance of STEM Education...' required 
          className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          ></input>
        </div>

        {/* Post Details */}
        <div className='flex flex-col md:flex-row justify-between items-start gap-4'>
          {/* Left side */}
          <div className='md:w-2/3 w-full' >
          <p className='font-semibold text-xl mb-5'>Content Section</p>
          <p className='text-xs italic'>Write your CAS below here</p>
          <div id="editorjs" style={{maxHeight:'400px',overflowY:"scroll"}}></div>
        </div>

          {/* Right Side */}
          <div className='md:w-1/3 w-full border p-5 space-y-5'>
          <p className='text-xl font-semibold'>Choose CAS Format</p>
          {/* For images */}
          <div className='space-y-4'>
          <label className='font-semibold'>CAS Cover:</label>
          <input type="text" placeholder='https://unsplash.com/cover-image-of-post.png...' required 
          className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
          value={coverImg}
          onChange={(e) => setCoverImg(e.target.value)} 
          ></input>
        </div>

        {/* Meta Description */}
        <div className='space-y-4'>
          <label className='font-semibold'>Meta Description:</label>
          <textarea type="text" cols={4} rows={4} placeholder='Write your Post meta description' required 
          className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
          value={metadesc}
          onChange={(e) => setMetadesc(e.target.value)} 
          ></textarea>
        </div>

        {/* Author */}
        <div className='space-y-4'>
          <label className='font-semibold'>Author:</label>
          <input type="text"  
          className='w-full inline-block bg-gray-50 focus:outline-none px-5 py-3'
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          placeholder={`Name of the Author`}
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
        >Post Your CAS</button>

      </form>
    </div>
  )
}

export default AddCAS