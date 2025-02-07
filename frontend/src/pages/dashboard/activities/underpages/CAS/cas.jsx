import React, { useState } from 'react'
import SearchCAS from '../../searchCas'
import { useFetchCasQuery } from '../../../../../redux/features/activities/casApi';
import { Link } from 'react-router-dom';
import AddButton from '../../../../../components/AddButton/AddButton';
import Modal from '@/components/Modal';
import AddCAS from './AddCAS';

const Activities = () => {
    const [search, setSearch]= useState('');
    const [category, setCategory]= useState('');
    const [query, setQuery]= useState({search: "", category: ""});
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get data using redux
    const {data: cas = [], error, isLoading} = useFetchCasQuery(query);
    const handleSearchChange = (e) => setSearch(e.target.value);
    const handleSearch =  () => setQuery({search, category});

    //Open close Modal handler
    const closeModal = () => setIsModalOpen(false);
    const openModal = () => setIsModalOpen(true);

    return(
    <div className='mt-16 container mx-auto'>
         <SearchCAS 
        search={search} 
        handleSearchChange={handleSearchChange} 
        handleSearch={handleSearch} 
        />

        {isLoading && <div>Loading....</div>}
        {error && <div>{error.toString()}</div>}
        
        <div style={{display:'flex',justifyContent:'center', alignItems:'center', gap: '20px'}}>
        <div className='mt-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
       
          {
            cas.map(cas => (
              <Link 
              to={`/cas/${cas._id}`} //TOCHANGE Link
              key={cas._id} 
              className='group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'
              >
                <div className='relative'>
                  <img src={cas?.coverImg}  className='h-72 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105' />
                  <div className='p-5 bg-white'>
                    <h2 className='text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300'>
                      {cas?.title}
                    </h2>
                    <p className='text-sm text-gray-500 mt-2'>
                      {cas?.description?.substring(0, 60)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))
          }
          
        </div>
        <AddButton onClick={openModal}/>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className='text-2xl font-semibold'>Create a new CAS</h2>
          <AddCAS closeModalOnSubmit={closeModal}/>
        </Modal>
        </div>
    </div>) 
}
export default Activities;