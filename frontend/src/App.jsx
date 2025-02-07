import { Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'

// import './App.css'

function App() {
  return (
    <div className='bg-gray-50 min-h-screen flex flex-col'>
      <Navbar/>
      <div className='flex-grow'>
        <Outlet/>
      </div>
      <footer className="fixed z-10 bottom-0 w-full py-4 bg-gray-100 text-center text-12 text-neutral-600">
        <p>
          All rights reserved to The School of Milan © 
          <a href="/GeneralConditionsofUsefortheInternationalSchoolofMilanWebsite.pdf" download className="ml-10 font-bold text-blue-600">Download CGU</a>
        </p>
      </footer>
    </div>
  )
}

export default App