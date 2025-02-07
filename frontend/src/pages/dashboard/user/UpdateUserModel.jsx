import React, { useState } from 'react'
import { useUpdateUserRoleMutation } from '../../../redux/features/auth/authapi';

const UpdateUserModel = ({user, onClose, onRoleUpdate}) => {
    const [role, setRole] = useState(user?.role);
    const [updateUserRole] = useUpdateUserRoleMutation();
    const handleUpdateRole = async () => {
        try {
            await updateUserRole({userId: user._id, role}).unwrap();
            alert("Role updated successfully");
            onRoleUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='bg-white p-4 rounded shadow-lg w-1/3'>
        <h2 className='text-xl mb-4'>Update User</h2>
        <div className='mb-4 space-y-4'>
            <label className='block text-gray-700 text-sm mb-2' htmlFor='name'>Email:</label>
            <input className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' type='text' value={user?.email} placeholder='John Doe' readOnly />
        </div>

        <div className='mb-4 space-y-4'>
            <label className='block text-gray-700 text-sm mb-2' htmlFor='name'>Role:</label>
            <select className='block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded' value={role} onChange={(e) => setRole(e.target.value)}>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
            </select>
        </div>

        <div className='flex justify-end space-x-4'>
            <button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600' onClick={handleUpdateRole}>Update</button>
            <button className='px-4 py-2 text-gray-700 rounded hover:text-gray-800' onClick={onClose}>Cancel</button>
        </div>

        </div>
    </div>
  )
}

export default UpdateUserModel