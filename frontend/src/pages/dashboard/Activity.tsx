import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { FaPen, FaTrash } from "react-icons/fa"
import { useFormik, FormikValues } from "formik"
import * as yup from "yup"
import axios from "axios"

import AddButton from '@/components/AddButton/AddButton'
import Editor from "@/components/Editor"
import Modal from '@/components/Modal'

import { logout as clearUserDataFromRedux } from '@/redux/features/auth/authSlice'
import { apiRoutes, createActivityRoute } from "@/router"
import { backendUrl } from "@/constants"
import * as u from '@/utils'

import { Cas, Post } from '@/types'
import { RootState } from '@/redux/store'

const inputProps = (form: FormikValues, fieldName: string) => {
  return {
    value: form.values[fieldName],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  }
}

const Error = ({ form, fieldName }: { form: FormikValues; fieldName: string }) => {
  if (form.touched[fieldName] && form.errors[fieldName]) {
    return <p className='mt-8 text-14 text-red-400'>{form.errors[fieldName]}</p>
  }

  return null
}

const DashboardActivity = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)

  const titleRef = useRef<HTMLInputElement>(null)

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const editModalOpen = editingPost !== null

  const createForm = useFormik({
    initialValues: {
      title: '',
      content: '',
      coverImageUrl: '',
      description: '',
    },
    validationSchema: yup.object().shape({
      title: yup.string().max(50).required('Title is required'),
      content: yup.string().required('Content is required'),
      coverImageUrl: yup.string().required('Cover image is required'),
      description: yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true)
        
        const response = await axios.post(apiRoutes.createActivity, {
          type: slug,
          title: values.title,
          coverImageUrl: values.coverImageUrl,
          content: values.content,
          description: values.description,
        }, {
          withCredentials: true,
        })

        const post = await response.data.post
        setPosts([...posts, post])
        setCreateModalOpen(false)
        resetForm()
      } catch (error) {
        console.log('Failed to submit Post', error)
      } finally {
        setIsLoading(false)
      }
    },
  })

  const editForm = useFormik({
    initialValues: {
      title: '',
      content: '',
      coverImageUrl: '',
      description: '',
    },
    validationSchema: yup.object().shape({
      title: yup.string().max(50).required('Title is required'),
      content: yup.string().required('Content is required'),
      coverImageUrl: yup.string().required('Cover image is required'),
      description: yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      try {
        if (editingPost === null) { return }

        setIsLoading(true)

        const response = await axios.put(
          apiRoutes.updatePost(editingPost),
          {
            title: values.title,
            coverImageUrl: values.coverImageUrl,
            content: values.content,
            description: values.description,
          },
          { withCredentials: true },
        )

        if (response.status === 200) {
          const updatedPost = await response.data

          const updatedPosts = posts.map(post => {
            if (post.id === updatedPost.id) {
              return { ...updatedPost }
            }

            return post
          })

          setPosts(updatedPosts)
          setEditingPost(null)
        }

      } catch (error) {
        console.log('Failed to submit Post', error)
      } finally {
        setIsLoading(false)
      }
    },
  })

  const logout = () => {
    dispatch(clearUserDataFromRedux())
  }

  const removeActivityFromList = (activity: Cas) => {
    setPosts(posts.filter(a => a.id !== activity.id))
  }

  const editActivity = (activity: any) => {
    setEditingPost({ ...activity })
    editForm.setFieldValue('title', activity.title)
    editForm.setFieldValue('content', activity.content)
    editForm.setFieldValue('coverImageUrl', activity.coverImageUrl)
    editForm.setFieldValue('description', activity.description)
  }

  const closeEditModal = () => {
    setEditingPost(null)
  }

  const localLogout = () => {
    dispatch(clearUserDataFromRedux())
  }

  const deleteActivity = async (activity: Cas) => {
    console.log("Activity", activity)
    const url = `${backendUrl}/cas/${activity.id}/`
    if (confirm('Are you sure you want to delete this activity?')) {

      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          localLogout()
        }

        return
      }

      removeActivityFromList(activity)
    }
  }

  const fetchData = async () => {
    const response = await axios.get(apiRoutes.getPosts, {
      params: { type: slug },
      withCredentials: true,
    })

    setPosts(response.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  if (user === null) return null

  return (
    <div className='mt-32 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-32'>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {posts && (posts.length > 0) ? (
            <>
              {posts && posts.map((activity: any) => (
                <div className='relative' key={activity.id}>
                  <div className='absolute top-12 right-12 flex'>
                    <button
                      type='button'
                      className='group size-36 flex items-center justify-center border-2 border-black hover:border-white hover:bg-black rounded-full transition duration-150'
                      onClick={() => editActivity(activity)}
                    >
                      <FaPen className='group-hover:text-white text-black transition duration-150' />
                    </button>
                    <button
                      type='button'
                      className='group ml-8 size-36 flex items-center justify-center border-2 border-black hover:border-white hover:bg-black rounded-full transition duration-150'
                      onClick={() => deleteActivity(activity)}
                    >
                      <FaTrash className='group-hover:text-white text-black transition duration-150' />
                    </button>
                  </div>
                  <Link to={createActivityRoute(activity.id)}>
                    <div>
                      <img
                        src={activity.coverImageUrl}
                        className='h-288 w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105'
                      />
                      <div className='p-20 bg-white'>
                        <h2 className='text-lg font-semibold text-gray-800 group-hover:text-[#1E73BE] transition-colors duration-300'>
                          {activity.title}
                        </h2>
                        <p className='text-sm text-gray-500 mt-8'>{u.trimWithEllipsis(activity.description)}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </>
          ) : (
            <p>No activities found</p>
          )}
        </>
      )}
      <AddButton onClick={() => setCreateModalOpen(true)} />
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)}>
        <h2 className='text-24 font-semibold'>Create a new Post</h2>
        <div className='bg-white md:p-32 p-8'>
          <form onSubmit={createForm.handleSubmit} className='space-y-20 pt-24'>
            <div>
              <label className='font-semibold text-20'>Post Title:</label>
              <input
                type='text'
                ref={titleRef}
                placeholder='Ex: Importance of STEM Education...'
                className='mt-32 w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                name='title'
                {...inputProps(createForm, 'title')}
                autoFocus
              ></input>
              <Error form={createForm} fieldName='title' />
            </div>

            <div className='flex flex-col md:flex-row justify-between items-start gap-16'>
              <div className='md:w-2/3 w-full'>
                <p className='font-semibold text-20 mb-20 text-zinc-800'>Content Section</p>
                <Editor
                  content={createForm.values.content}
                  setContent={(content) => createForm.setFieldValue('content', content)}
                />
                <Error form={createForm} fieldName='content' />
              </div>
              <div className='md:w-1/3 w-full border p-20 space-y-20' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <p className='text-20 font-semibold'>Choose Post Format</p>
                {/* For images */}
                <div className='space-y-16'>
                  <label className='font-semibold'>Post Cover:</label>
                  <input
                    type='text'
                    placeholder='https://unsplash.com/cover-image-of-post.png...'
                    className='w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                    name='coverImageUrl'
                    {...inputProps(createForm, 'coverImageUrl')}
                  ></input>
                  <Error form={createForm} fieldName='coverImageUrl' />
                </div>

                {/* Meta Description */}
                <div className='space-y-16'>
                  <label className='font-semibold'>Meta Description:</label>
                  <textarea
                    cols={4}
                    rows={4}
                    placeholder='Write your Post meta description'
                    className='w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                    name='description'
                    {...inputProps(createForm, 'description')}
                  ></textarea>
                  <Error form={createForm} fieldName='description' />
                </div>

                {/* Author */}
                <div className='space-y-16'>
                  <label className='font-semibold'>Author:</label>
                  <input
                    type='text'
                    className='w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                    value={user.username}
                    placeholder={`Name of the Author`}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-20 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-12 rounded-md'
            >
              Post Your Content
            </button>
          </form>
        </div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <h2 className='text-24 font-semibold'>Edit Post</h2>
        <div className='bg-white md:p-32 p-8'>
          <form onSubmit={editForm.handleSubmit} className='space-y-20 pt-24'>
            <div>
              <label className='font-semibold text-20'>Post Title:</label>
              <input
                type='text'
                ref={titleRef}
                placeholder='Ex: Importance of STEM Education...'
                className='mt-32 w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                name='title'
                {...inputProps(editForm, 'title')}
                autoFocus
              ></input>
              <Error form={editForm} fieldName='title' />
            </div>

            <div className='flex flex-col md:flex-row justify-between items-start gap-16'>
              <div className='md:w-2/3 w-full'>
                <p className='font-semibold text-20 mb-20 text-zinc-800'>Content Section</p>
                <Editor content={editForm.values.content} setContent={(content) => editForm.setFieldValue('content', content)} />
                <Error form={editForm} fieldName='content' />
              </div>
              <div className='md:w-1/3 w-full border p-20 space-y-20' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <p className='text-20 font-semibold'>Choose Post Format</p>
                {/* For images */}
                <div className='space-y-16'>
                  <label className='font-semibold'>Post Cover:</label>
                  <input
                    type='text'
                    placeholder='https://unsplash.com/cover-image-of-post.png...'
                    className='w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                    name='coverImageUrl'
                    {...inputProps(editForm, 'coverImageUrl')}
                  ></input>
                  <Error form={editForm} fieldName='coverImageUrl' />
                </div>

                {/* Meta Description */}
                <div className='space-y-16'>
                  <label className='font-semibold'>Meta Description:</label>
                  <textarea
                    cols={4}
                    rows={4}
                    placeholder='Write your Post meta description'
                    className='w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                    name='description'
                    {...inputProps(editForm, 'description')}
                  ></textarea>
                  <Error form={editForm} fieldName='description' />
                </div>

                {/* Author */}
                <div className='space-y-16'>
                  <label className='font-semibold'>Author:</label>
                  <input
                    type='text'
                    className='w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
                    value={user.username}
                    placeholder={`Name of the Author`}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-20 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-12 rounded-md'
            >
              Update Post
            </button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default DashboardActivity