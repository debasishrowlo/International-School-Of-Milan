import { useState } from 'react'
import { useDeleteUserMutation, useGetUserProfileQuery } from '../../../redux/features/auth/authapi'
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import UpdateUserModel from './UpdateUserModel';
import Modal from '@/components/Modal';
import "./CreateUser.css";
import axios from 'axios'
import { useSelector } from 'react-redux';
const ManageUsers = () => {
  const { user } = useSelector((state) => state.auth);
  const currentLoggedUser = user
  const [selectedUser, setSelectedUser] = useState(null);
  const [file, setFile] = useState(null)
  const [isModelOpen, setIsModelOpen] = useState();
  const [isExcelModelOpen, setIsExcelModelOpen] = useState(false);
  const { data, error, isLoading, refetch } = useGetUserProfileQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [users, setUsers] = useState([{ name: '', surname: '', grade: '', role: 'student' }]); // Liste des utilisateurs à créer
  const [showModal, setShowModal] = useState(false); // Pour contrôler l'affichage de la modal


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
  const handleDelete = async (id) => {
    try {
      const response = await deleteUser(id).unwrap();
      alert("User deleted successfully.");
      console.log("Repsonse", response)
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModelOpen(true);
  };

  const handleCloseModel = () => {
    setIsModelOpen(false);
    setSelectedUser(null);
  };
  const handleExcelModel = () => {
    setIsExcelModelOpen(true);
  }

  const handleAddUserField = () => {
    setUsers([...users, { username: '', grade: '', role: '' }]);
  };

  const handleUserChange = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index][field] = value;
    setUsers(newUsers); // Mettre à jour l'utilisateur dans la liste
  };

  const createMultipleUsers = async () => {
    try {
      const multiUserData = handleCreateUsers();
      if (!multiUserData) {
        return "No User Data Found";
      }
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/multiRegisterRoute`, multiUserData, {
        withCredentials: true
      })
      refetch();
      console.log("Resposne ", response)
    } catch (error) {
      throw new Error('Error creating users:', error);
    }

  }
  const handleCreateUsers = () => {
    const createdUsers = users.map(user => ({
      username: `${user.name}${user.surname}${user.grade}`,
      grade: user.grade,
      role: user.role
    }));
    setUsers([{ name: '', surname: '', grade: '', role: 'student' }]);
    setShowModal(false);
    return createdUsers;

  };

  const closemodal = () => {
    setShowModal(false);
    setUsers([{ name: '', surnname: '', grade: '', role: 'student' }]);
  }

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
                </div>                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
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
                      User Name
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
                  {
                    data?.users && data.users.map((currentuser, index) => (<tr key={index}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {index + 1}
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {currentuser?.username}
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
                                handleDelete(currentuser.id);
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
            {users.map((currentUser, index) => (
              <div key={index} className="cr-user-input">
                <input
                  className='cr-input'
                  type="text"
                  placeholder="Name"
                  value={currentUser.name}
                  onChange={(e) => handleUserChange(index, 'name', e.target.value)}
                />
                <input
                  className='cr-input'
                  type="text"
                  value={currentUser.surname}
                  placeholder="Surname"
                  onChange={(e) => handleUserChange(index, 'surname', e.target.value)}
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
      {
        isModelOpen && <UpdateUserModel user={selectedUser} onClose={handleCloseModel} onRoleUpdate={refetch} />
      }
    </>
  )
}

export default ManageUsers
