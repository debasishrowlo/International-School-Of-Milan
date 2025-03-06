import axios from "axios";

import { apiRoutes } from "../../../router"

const UpdateUserModel = ({ user, editingUser, setEditingUser, updateUser }) => {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await axios.put(
      apiRoutes.users.update(editingUser.id),
      { user: editingUser },
      { withCredentials: true }
    )

    if (response.status === 200) {
      updateUser()
    }
  }

  const closeModal = () => {
    setEditingUser(null)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg w-1/3">
          <h2 className="text-xl mb-4">Update User</h2>
          <div className="mb-4 space-y-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="name">
              First Name:
            </label>
            <input
              className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded"
              type="text"
              value={editingUser.firstName}
              onChange={e => setEditingUser({ ...editingUser, firstName: e.target.value })}
              placeholder="First Name"
              autoFocus
            />
          </div>
          <div className="mb-4 space-y-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="name">
              Last Name:
            </label>
            <input
              className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded"
              type="text"
              value={editingUser.lastName}
              onChange={e => setEditingUser({ ...editingUser, lastName: e.target.value })}
              placeholder="Last Name"
            />
          </div>
          <div className="mb-4 space-y-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="name">
              Grade:
            </label>
            <input
              className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded"
              type="text"
              value={editingUser.grade}
              onChange={e => setEditingUser({ ...editingUser, grade: e.target.value })}
              placeholder="Grade"
            />
          </div>
          <div className="mb-4 space-y-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="name">
              Role:
            </label>
            <select
              className="block w-full px-3 py-2 text-gray-700 border border-gray-300 rounded"
              value={editingUser.role}
              onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
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
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              className="px-4 py-2 text-gray-700 rounded hover:text-gray-800"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateUserModel;
