export type Post = {
  id: string,
  title: string,
  description: string,
  coverImageUrl: string,
  content: string,
  author: {
    id: string,
    username: string,
  },
  username?: string
}

export type Activity = {
  id: string,
  type: string,
  title: string,
  description: string,
  coverImageUrl: string,
  content: string,
  username: string,
  author: {
    id: string
    username: string
  }
}
export type Cas = {
  _id: string,
  type: string,
  title: string,
  description: string,
  coverImageUrl: string,
  content: string,
  username: string,
  author: {
    id: string
    username: string
  }
}
