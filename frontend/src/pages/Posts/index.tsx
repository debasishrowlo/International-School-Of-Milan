import { ChangeEvent, useEffect, useState } from 'react'

import PostList from './PostList'
import SearchPost from './SearchPost'

import { fetchPosts } from "@/api"
import { Post } from "@/types"

const Posts = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState({ search: "", category: "" });
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const handleSearchChange = (e:ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleSearch = () => setQuery({ search, category });

  const fetchData = async () => {
    const posts = await fetchPosts()
    setPosts(posts)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="mt-64 container mx-auto">
      <SearchPost
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div>Loading....</div>
      ) : (
        <PostList posts={posts} />
      )}
      {/* <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-24 font-semibold">Create a new Post</h2>
        <AddPost closeModalOnSubmit={closeModal} />
      </Modal> */}
    </div>
  );
};

export default Posts;