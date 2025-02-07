import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFormik, FormikValues } from "formik"
import * as yup from "yup"

import Editor from "@/components/Editor"

//import { apiRoutes } from "@/router"
import { clearUserData } from "@/common"
import { logout as clearUserDataFromRedux } from '@/redux/features/auth/authSlice';

import { Post } from "@/types"
import { RootState } from '@/redux/store';
import { useCreatePostMutation } from '@/redux/features/posts/PostsApi';

type NewPost = Omit<Post, 'id'>;

type ErrorResponse = {
  type: 'error';
  message: string;
};
type UnauthorizedErrorResponse = {
  type: 'unauthorized';
};
type SuccessResponse = {
  type: 'success';
  post: Post;
};

const inputProps = (form: FormikValues, fieldName: string) => {
  return {
    value: form.values[fieldName],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  };
};

const Error = ({ form, fieldName }: { form: FormikValues; fieldName: string }) => {
  if (form.touched[fieldName] && form.errors[fieldName]) {
    return <p className='mt-8 text-14 text-red-400'>{form.errors[fieldName]}</p>;
  }

  return null;
};

const AddPost = ({ addPostToList, closeModalOnSubmit: closeCreatePostModal }: { addPostToList: (post: Post) => void; closeModalOnSubmit: () => void }) => {
  const titleRef = useRef<HTMLInputElement>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [createPost] = useCreatePostMutation();
  const showLoadingIndicator = () => setIsLoading(true);
  const hideLoadingIndicator = () => setIsLoading(false);

  const dispatch = useDispatch();
  const createPostApi = async (newPost: NewPost): Promise<SuccessResponse | ErrorResponse | UnauthorizedErrorResponse> => {
    const response = await createPost(newPost).unwrap();
    if (!response.ok) {
      if (response.status === 401) {
        return {
          type: 'unauthorized',
        };
      }

      return {
        type: 'error',
        message: 'Something went wrong',
      };
    }

    const jsonResponse = await response.json();

    return {
      type: 'success',
      post: jsonResponse.post,
    };
  };

  const logout = () => {
    clearUserData();
    dispatch(clearUserDataFromRedux());
  };

  const form = useFormik({
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
        showLoadingIndicator();

        const result = await createPostApi({
          title: values.title,
          coverImageUrl: values.coverImageUrl,
          content: values.content,
          description: values.description,
          author: {
            username: user?.username || '',
            id: user?.id || '',
          },
          username: user?.username || '',
        });

        if (result.type === 'success') {
          addPostToList(result.post);
          closeCreatePostModal();
        } else if (result.type === 'unauthorized') {
          logout();
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.log('Failed to submit Post', error);
      } finally {
        hideLoadingIndicator();
      }
    },
  });
  console.log({ content: form.values.content });

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);
  //todo  Navigate to login
  if (user === null) return null;
  return (
    <div className='bg-white md:p-32 p-8'>
      <form onSubmit={form.handleSubmit} className='space-y-20 pt-24'>
        <div>
          <label className='font-semibold text-20'>Post Title:</label>
          <input
            type='text'
            ref={titleRef}
            placeholder='Ex: Importance of STEM Education...'
            className='mt-32 w-full inline-block bg-gray-50 focus:outline-none px-20 py-12'
            name='title'
            {...inputProps(form, 'title')}
            autoFocus
          ></input>
          <Error form={form} fieldName='title' />
        </div>

        <div className='flex flex-col md:flex-row justify-between items-start gap-16'>
          <div className='md:w-2/3 w-full'>
            <p className='font-semibold text-20 mb-20 text-zinc-800'>Content Section</p>
            <Editor content={form.values.content} setContent={(newContent) => form.setFieldValue('content', newContent)} />
            <Error form={form} fieldName='content' />
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
                {...inputProps(form, 'coverImageUrl')}
              ></input>
              <Error form={form} fieldName='coverImageUrl' />
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
                {...inputProps(form, 'description')}
              ></textarea>
              <Error form={form} fieldName='description' />
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

        <button type='submit' disabled={isLoading} className='w-full mt-20 bg-gray-900 hover:bg-indigo-500 text-white font-medium py-12 rounded-md'>
          Post Your Content
        </button>
      </form>
    </div>
  );
};

export default AddPost
