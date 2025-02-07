import React from 'react'
import { formatDate } from '../../../../../../utility/formatDate';
import EditorJSHTML from "editorjs-html"
import { useDeleteCasMutation } from '../../../../../../redux/features/activities/casApi';
import DeleteButtonWithConfirmation from '../../../../../../components/DeletionButton/DeletionButton';
import { useNavigate } from 'react-router-dom';

const editorJSHTML = EditorJSHTML();

const SingleCASCard = ({post}) => {
  const {title,description,content,coverImg,category,author,rating,createdAt} = post || {};
  const htmlContent = editorJSHTML.parse(content).join('');
  const [deleteCAS] = useDeleteCasMutation();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await deleteCAS(id).unwrap();
      navigate('/Cas');

    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  return (
    <>
    <div className='bg-white shadow-lg rounded-lg p-8 overflow-hidden'>
      {/* Blog header */}
      <div>
        <h1 className='md:text-4xl text-3xl font-bold mb-4 text-gray-900'>{title}</h1>
        {/* TODO: Need to change author */}
        <p className='mb-6 text-gray-600 text-sm'>
          {formatDate(createdAt)} by <span className='text-[#1E73BE] cursor-pointer hover:underline'>Admin</span>
        </p>
      </div>
      {/* Blog cover image */}
      
      {/* Blog content */}
      <div className='mt-8 space-y-6'>
        <div dangerouslySetInnerHTML={{__html: htmlContent}} className='space-y-4 leading-relaxed text-gray-700 editorjsdiv' />
      </div>
      <div>
      <DeleteButtonWithConfirmation onDelete={() => handleDelete(post._id)}/>
      </div>
    </div>
    </>
  )
}

export default SingleCASCard;
