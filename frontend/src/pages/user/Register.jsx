import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../redux/features/auth/authapi';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [registernewUser] = useRegisterUserMutation();
    const navigate = useNavigate();
    
    const createUser = async(e) =>{
      e.preventDefault();

      const newUser = {
        username : username,
        email : email,
        password : password,
      }

      try {
        const response = await registernewUser(newUser).unwrap();
        console.log(response);
        alert("User Created successfully!");
        navigate('/');

      }catch (error) {
        console.log('Failed to Register', error);
        setMessage(`Failed to Register. Please try again! ${error}`);
      }
      
    }



  return (
    <div className='max-w-sm bg-white mx-auto p-8 mt-36'>
    <h2 className='text-2xl font-semibold pt-5'>Please Register</h2>
    <form onSubmit={createUser} className='space-y-5 max-w-sm mx-auto pt-8'>
        <input type="text" value={username} 
        placeholder='Username'
        required
        className='w-full bg-gray-50 focus:outline-none px-5 py-3'
        onChange={(e) => setUsername(e.target.value)}
        />
        <input type="email" value={email} 
        placeholder='Email'
        required
        className='w-full bg-gray-50 focus:outline-none px-5 py-3'
        onChange={(e) => setEmail(e.target.value)}
        />
        <input type="password" value={password} 
        placeholder='Password'
        required
        className='w-full bg-gray-50 focus:outline-none px-5 py-3'
        onChange={(e) => setPassword(e.target.value)}
        />
        {
            message && <p className='text-red-500'>{message}</p>
        }
        <button type='sumbit' className='w-full mt-5 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-3 rounded-md'>Register</button>
    </form>
    <p className='my-5 text-center'>Already Have an Account? <Link to="/login" className='text-red-700 italic'>Login</Link> Here </p>
</div>
  )
}

export default Register