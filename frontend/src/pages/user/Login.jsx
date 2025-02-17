/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { useLoginUserMutation, useLogoutUserMutation } from '../../redux/features/auth/authapi';
import { setUser } from '../../redux/features/auth/authSlice';

import "./customCheckbox.css"

const Login = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [grade, setGrade] = useState('');

  const dispatch = useDispatch();

  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  const { isLoggedIn } = useSelector(state => state.auth)

  const navigate = useNavigate();
  // console.log("Loging user Api", loginUser);

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = `${name}${surname}${grade}`;
    const data = {
      username,
      password,
    }

    try {
      const response = await loginUser(data).unwrap();
      const { user } = response;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('token', response.token);
      dispatch(setUser({ user, isLoggedIn: true, token: response.token }));
      navigate('/');
    } catch (err) {
      setMessage(`Please provide valid informations !`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  }, [])

  return (
    <div className="max-w-sm bg-white mx-auto p-32 mt-144">

      <h2 className="text-24 font-semibold pt-20">Please login</h2>
      <form
        onSubmit={handleLogin}
        className="space-y-20 max-w-sm mx-auto pt-32"
      >
        <input
          type="text"
          value={name}
          className="w-full bg-gray-50 focus:outline-none px-20 py-12"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          autoFocus
        />
        <input
          type="text"
          value={surname}
          className="w-full bg-gray-50 focus:outline-none px-20 py-12"
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Surname"
          required
        />
        <input
          type="text"
          value={grade}
          className="w-full bg-gray-50 focus:outline-none px-20 py-12"
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Grade"
          required
        />
        <input
          type="password"
          value={password}
          className="w-full bg-gray-50 focus:outline-none px-20 py-12"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {
          message && <p className="text-red-500">{message}</p> // Display error message if any
        }
        <button
          type="submit"
          disabled={loginLoading}
          className="w-full mt-20 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-12 rounded-md"
        >
          Login
        </button>
        <label className="custom-checkbox">
          <input type="checkbox" required />
          <span></span>
          <p className="my-20 text-center">
            {" "}
            I accept the use of cookies (it is only to stay logged in, even
            after closing your browser).
          </p>
        </label>
      </form>
    </div>
  );
}

export default Login;
