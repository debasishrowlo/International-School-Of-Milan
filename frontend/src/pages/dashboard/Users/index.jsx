import { useEffect, useState } from 'react'
import { MdEdit } from "react-icons/md";
import axios from 'axios'
import { useSelector } from 'react-redux';

import { apiRoutes } from "@/router"
import { useDeleteUserMutation, useGetUserProfileQuery } from '../../../redux/features/auth/authapi'
import UpdateUserModel from './UpdateUserModel';

import Modal from '@/components/Modal';
import "./CreateUser.css";

const roles = [
  "admin",
  "moderator",
  "creator",
  "student",
]

const emptyUser = {
  firstName: '', 
  lastName: '', 
  grade: '', 
  role: 'student',
}

const ManageUsers = () => {
  const { user } = useSelector((state) => state.auth);

  const [editingUser, setEditingUser] = useState(null);
  const [file, setFile] = useState(null)
  const [isExcelModelOpen, setIsExcelModelOpen] = useState(false);
  const [users, setUsers] = useState([])
  const [newUsers, setNewUsers] = useState([{ ...emptyUser }])
  console.log(newUsers)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("No file selected.");
      return;
    }

    // Validate file type
    const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a valid Excel file (.xls or .xlsx).");
      return;
    }

    setFile(selectedFile); // Update the state with the selected file
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/bulkRegister`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `${localStorage.getItem('token')}`
        },

      })
      alert("File uploaded successfully!");
      setFile(null);
      setIsExcelModelOpen(false)
      refetch()

    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleDelete = async (id, index) => {
    try {
      const response = await axios.delete(
        apiRoutes.users.delete(id),
        { withCredentials: true }
      )
      
      if (response.status === 200) {
        setUsers([
          ...users.slice(0, index),
          ...users.slice(index + 1),
        ])
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUser = () => {
    const userIndex = users.findIndex(user => user.id === editingUser.id)

    if (userIndex !== -1) {
      setUsers([
        ...users.slice(0, userIndex),
        { ...editingUser },
        ...users.slice(userIndex + 1),
      ])
      setEditingUser(null)
    }
  }

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleExcelModel = () => {
    setIsExcelModelOpen(true);
  }

  const handleAddUserField = () => {
    setNewUsers([...newUsers, { ...emptyUser }])
  }

  const handleUserChange = (index, field, value) => {
    const changedNewUsers = [...newUsers]
    changedNewUsers[index][field] = value
    setNewUsers(changedNewUsers)
  }

  const handleCreateUsers = () => {
    const createdUsers = newUsers.filter(user => (
      user.firstName !== "" &&
      user.lastName !== "" &&
      user.grade !== ""
    ))
    setNewUsers([{ ...emptyUser }]);
    setShowModal(false);
    return createdUsers;
  }

  const createMultipleUsers = async () => {
    try {
      const multiUserData = handleCreateUsers();
      if (!multiUserData) {
        return "No User Data Found";
      }
      const response = await axios.post(
        apiRoutes.bulkCreateUsers,
        multiUserData,
        { withCredentials: true },
      )
      if (response.status === 201) {
        await fetchUsers()
      }
    } catch (error) {
      throw new Error('Error creating users:', error);
    }
  }

  const closemodal = () => {
    setShowModal(false);
    setNewUsers([{ ...emptyUser }]);
  }

  const fetchUsers = async () => {
    const response = await axios.get(apiRoutes.users.list, {
      withCredentials: true,
    })
    
    if (response.status === 200) {
      setUsers(response.data.users)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const refetch = () => {}

  return (
    <>
      {
        isLoading && <p>Loading...</p>
      }
      <section className="py-1 bg-blueGray-50">
        <div className="w-full  mb-12 xl:mb-0 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">All Users</h3>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">See all</button>
                </div>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                    onClick={handleExcelModel}
                  >Upload Excel Sheet</button>
                </div>

                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button
                    className="bg-[#1E73EE] text-white active:bg-[#1E73BE] text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(true)}
                  >Create users</button>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse ">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Sl No.
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Name
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      User Role
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Edit or Manage
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((currentuser, index) => (
                    <tr key={index}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {index + 1}
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {currentuser.firstName} {currentuser.lastName}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {currentuser?.role}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <button onClick={() => handleEdit(currentuser)} className='hover:text-blue-700'>
                          <span className='flex gap-1 items-center justify-center'>
                            <MdEdit /> Edit
                          </span>
                        </button>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">

                        <button
                          className='bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none'
                          onClick={() => {
                            // Check if the current user is an admin or a moderator with valid permissions
                            if (user.role === 'admin' && (currentuser.role !== 'admin') ||
                              (user.role === 'moderator' && (currentuser.role === 'student' || currentuser.role === 'creator'))) {

                              if (window.confirm('Are you sure you want to delete this User?')) {
                                handleDelete(currentuser.id, index);
                              }

                            } else {
                              alert("You don't have permission to delete this user.");
                            }
                          }}
                        >
                          Delete
                        </button>

                      </td>
                    </tr>))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal isOpen={showModal} onClose={() => closemodal()}>
          <h2>Create Users</h2>
          <div>
            {newUsers.map((currentUser, index) => (
              <div key={index} className="cr-user-input">
                <input
                  className='cr-input'
                  type="text"
                  placeholder="Name"
                  value={currentUser.firstName}
                  onChange={(e) => handleUserChange(index, 'firstName', e.target.value)}
                  autoFocus
                />
                <input
                  className='cr-input'
                  type="text"
                  value={currentUser.lastName}
                  placeholder="Surname"
                  onChange={(e) => handleUserChange(index, 'lastName', e.target.value)}
                />
                <input
                  className='cr-input'
                  type="text"
                  value={currentUser.grade}
                  placeholder="Grade"
                  onChange={(e) => handleUserChange(index, 'grade', e.target.value)}
                />
                <select
                  className="cr-input"
                  value={currentUser.role}
                  onChange={(e) => handleUserChange(index, 'role', e.target.value)}
                >
                  {user && user.role === 'admin' ? (
                    <>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="creator">Creator</option>
                      <option value="student">Student</option>
                    </>
                  ) : user && user.role === 'moderator' ? (
                    <>
                      <option value="creator">Creator</option>
                      <option value="student">Student</option>
                    </>
                  ) : null}
                </select>
              </div>
            ))}
          </div>
          <button className='cr-button' onClick={handleAddUserField}>+</button>
          <button className='cr-button' onClick={createMultipleUsers}>Create</button>
        </Modal>
        <Modal isOpen={isExcelModelOpen} onClose={() => setIsExcelModelOpen(false)}>
          <h2>Upload Excel File</h2>
          <form onSubmit={handleFileSubmit}>
            <div className="cr-user-input">
              <input
                className="cr-input"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              <button
                className="cr-button"
                type="submit"
                disabled={!file} // Disable button if no file is selected
              >
                Upload
              </button>
            </div>
          </form>
        </Modal>
      </section>
      {(editingUser !== null) && (
        <UpdateUserModel
          user={user} 
          editingUser={editingUser} 
          setEditingUser={setEditingUser} 
          updateUser={updateUser}
        />
      )}
    </>
  )
}

export default ManageUsers
