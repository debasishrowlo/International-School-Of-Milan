import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchCasByIdQuery } from '../../../../../../redux/features/activities/casApi';
import {useCreateCASResponseMutation} from '../../../../../../redux/features/activities/casResponseApi'

const PostACasResponse = () => {
    const {id} = useParams();
    const [content, setContent] = useState('');
    const {user} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const {refetch} = useFetchCasByIdQuery(id, {skip: !id});
    const [createResponse] = useCreateCASResponseMutation()
    // console.log(user);
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(!user) {
        alert('Please Login to Comment');
        navigate('/login');
        return;
      }

      const newResponse = {
        content: content,
        user: user?._id,
        casId: id 
      }
      // console.log(newResponse);
      try {
        const respone = await createResponse(newResponse).unwrap();
        setContent('');
        refetch(id);
        
      } catch (error) {
        alert(`An error occurred while posting the response ${JSON.stringify(error)}`)
      }

    };

  return (
    <div className = 'mt-8'  >
        <h3 className='text-lg font-medium mb-8'>Leave a Response</h3>
        <form onSubmit={handleSubmit}>
            <textarea name="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            cols="30"
            rows="10"
            placeholder='Apply'
            className='w-full bg-gray-50 focus:outline-none p-5'
            />
            <button type='submit' className='bg-gray-900 text-white font-medium py-2 px-4 rounded-lg mt-5'>Submit</button>
        </form>

    </div>
  )
}

export default PostACasResponse