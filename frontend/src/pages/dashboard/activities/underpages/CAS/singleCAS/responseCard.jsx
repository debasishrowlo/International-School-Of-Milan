import React from 'react'
import { formatDate } from '../../../../../../utility/formatDate'
import { useSelector } from 'react-redux'
import PostACasResponse from './createAResponse'
import Avatar from '../../../../../../components/Avatar/Avatar'

const ResponseCards = ({response}) => {
    const user = useSelector((state) => state.auth.user);

  return (
    <div className='my-6 bg-white p-8'>
        <div>
            {
                response?.length > 0 ? <div>
                    <h3 className='text-lg font-medium'>All Response</h3>
                    <div>
                        {
                            response.map((rep, index) => (
                                <div key={index} className='mt-4'>
                                    <div className='flex gap-4 items-center'>
                                        <Avatar username={rep?.user?.username}/>
                                        <div>
                                            <p className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>{rep?.user?.username}</p>
                                            <p className='text-[12px] italic'>{formatDate(rep.createdAt)}</p>
                                        </div>
                                    </div>
                                    {/* Commnt details */}
                                    <div className='text-gray-600 mt-5 border p-8'>
                                        <p className='md:w-4/5'>{rep?.content}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div> : <div className='text-lg font-medium'>No Response Found.</div>
            }
        </div>
        <PostACasResponse/>
    </div>
  )
}

export default ResponseCards