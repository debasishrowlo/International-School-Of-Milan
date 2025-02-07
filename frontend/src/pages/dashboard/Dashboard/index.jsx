import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { FaUserFriends } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { LiaBlogSolid } from "react-icons/lia";
import { RiAdminFill } from "react-icons/ri";
import { FaComments } from "react-icons/fa";

import { useFetchPostsQuery } from '../../../redux/features/posts/PostsApi';
import { useGetCommentsQuery } from '../../../redux/features/comments/commentApi';
import { useGetUserProfileQuery } from '../../../redux/features/auth/authapi';

import PostsChart from './PostsChart';

const Dashboard = () => {
  const [query, setQuery] = useState({search: '', category: ''});
  const {user} = useSelector((state) => state.auth);

  const posts = []
  const isLoading = false
  const error = false

  // const {data: posts=[], error, isLoading} = useFetchPostsQuery(query);
  // console.log(posts)
  const {data: comments=[]} = useGetCommentsQuery();
  const {data: usersData = {}} = useGetUserProfileQuery();
  const usersList = usersData.users || [];
  const usersCount = usersList.length;
  const adminCounts = usersList.filter((user) => user.role === 'admin').length;
  // console.log(adminCounts);

  return (
    <>
      {isLoading && (<div>Loading...</div>)}
      <div className='space-y-24'>
        <div className='bg-gray-50 p-20'>
          <h1>Hi, {user?.username}!</h1>
          <p>Welcome to the admin dashboard</p>
          <p>Here you can manage your posts, users, and other related data</p>
        </div>
        <div className='flex flex-col md:flex-row justify-between gap-32 pt-32'>
          <div className='bg-indigo-100 py-24 w-full rounded-sm space-y-4 flex flex-col items-center'>
            <FaUserFriends className='size-32 text-indigo-600'/>
            <p>{usersCount} Users</p>
          </div>
          <div className='bg-red-100 py-24 w-full rounded-sm space-y-4 flex flex-col items-center'>
            <LiaBlogSolid className='size-32 text-red-600'/>
            <p>{posts.length} Blogs</p>
          </div>
          <div className='bg-lime-100 py-24 w-full rounded-sm space-y-4 flex flex-col items-center'>
            <RiAdminFill className='size-32 text-lime-600'/>
            <p>{adminCounts} Admin{adminCounts !==1 ? 's' : ''}</p>
          </div>
          <div className='bg-orange-100 py-24 w-full rounded-sm space-y-4 flex flex-col items-center'>
            <FaComments  className='size-32 text-orange-600'/>
            <p>{comments?.totalComments} Comments</p>
          </div>
        </div>
        <div className='py-20'>
          <PostsChart posts={posts} />
        </div>
      </div>
    </>
  )
}

export default Dashboard