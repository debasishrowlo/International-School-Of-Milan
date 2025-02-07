import React from 'react'
import { IoSearch } from "react-icons/io5";

const SearchCAS = ({search, handleSearchChange, handleSearch}) => {
    const handleKeyPress = (event)  => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

  return (
    <div className='w-full flex'>
        <input type="text" 
        value ={search} 
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        placeholder='Example Post Name'
        className='py-2 px-4 mr-5 w-full bg-[#f7f8f9] focus:outline-none focus:border'
         />
         <button
         onClick={handleSearch} 
         className='bg-[#1F2937] px-4 py-2 text-[#F9FAFB] rounded-lg'>
         <IoSearch />
         </button>

    </div>
  )
}

export default SearchCAS