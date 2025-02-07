import React from 'react'
import { useParams } from 'react-router-dom'
import SingleCASCard from './singleCasCard';
//import CommentCards from '../comments/CommentCards';
//import RelatedPosts from './RelatedPosts';
import { useFetchCasByIdQuery } from '../../../../../../redux/features/activities/casApi';
import ResponseCards from './responseCard';


const SingleCAS = () => {
  // Fetch data from API and display post details here
  const {id} = useParams(); 
  // console.log(id);
  const {data: cas, error, isLoading} = useFetchCasByIdQuery(id);
  console.log(cas);
  return (
    <div className='text-gray-900 container mx-auto mt-8'>
      <div>
        {isLoading && <div>Loading...</div>}
        {error && <div>Something Went Wrong...</div>}
        {
          cas?.post && (
            <div className='flex flex-col lg:flex-row justify-between items-start md:gap-12 gap-8'>
              <div className='lg:w-3/3 w-full'>
                <SingleCASCard post={cas.post}/>
                <ResponseCards response={cas?.response}/>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default SingleCAS