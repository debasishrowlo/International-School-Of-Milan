import React from 'react'
import { formatDate } from '../../../utility/formatDate'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const FormatData = (posts) => {
  return posts.map(post => ({
    name: formatDate(post.createdAt),
    post: post.title.length,
    pv: post.pageViews || 0,
    amt: post.amt || 0
  }))
}
const PostsChart = ({posts}) => {
  const data = FormatData(posts);
  return (
    <div className='p-6 bg-gray-50 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4'>Posts Chart!</h2>
      <div className='h-80'>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Area type="monotone" dataKey="post" stroke='#8884d8' fill='#8884d8'/>

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PostsChart