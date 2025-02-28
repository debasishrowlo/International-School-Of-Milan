import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"

import { apiRoutes } from "@/router"

import PostList from './PostList'
import SearchPost from './SearchPost'

import { Activity } from "@/types"

const Activities = () => {
  const { type } = useParams()

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [query, setQuery] = useState({ search: "", category: "" })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)
  const handleSearch = () => setQuery({ search, category })

  const fetchData = async () => {
    const response = await axios.get(apiRoutes.getPosts, {
      params: { type },
      withCredentials: true,
    })

    const activities = response.data

    setActivities(activities)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [type])

  return (
    <div className="mt-64 container mx-auto">
      {/* <SearchPost
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      /> */}
      {loading ? (
        <div>Loading....</div>
      ) : (
        <>
          {(activities.length > 0) ? (
            <PostList posts={activities} />
          ) : (
            <p>No activities found</p>
          )}
        </>
      )}
      {/* <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-24 font-semibold">Create a new Post</h2>
        <AddPost closeModalOnSubmit={closeModal} />
      </Modal> */}
    </div>
  )
}

export default Activities
