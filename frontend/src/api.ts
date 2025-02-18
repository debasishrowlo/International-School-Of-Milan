import { Activity, Post } from "@/types"
import axios from "axios"

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const fetchPosts = async (search = ""): Promise<Post[]> => {
  let url = `${backendUrl}/posts`

  if (search) {
    url += `?search=${search}`
  }

  const response = await axios.get(url, {
    withCredentials:true
    //headers: {
    //  Authorization: `${localStorage.getItem('token')}`
    //}

  })

  if (!response) {
    return []
  }

  return await response.data
}
// @ts-ignore
export const fetchActivities = async (search = ""): Promise<Activity[]> => {
  const url = `${backendUrl}/activities`
  const response = await fetch(url)

  if (!response.ok) {
    return []
  }

  return await response.json()
}
