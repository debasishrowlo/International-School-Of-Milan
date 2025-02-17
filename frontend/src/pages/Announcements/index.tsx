import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useFormik } from "formik"
import * as yup from "yup"

import Modal from "@/components/Modal"
import Editor from "@/components/Editor"
import Avatar from "../../components/Avatar/Avatar"
import RichTextPostCreator from "../../components/RichTextEditor/RichTextEditor"

import { clearUserData } from "../../common"
import { routes } from "@/router"

import "./Announcement.css"

type Annoucement = {
  id: string,
  content: string,
  author: {
    username: string,
  },
}

const Announcements = () => {
  const navigate = useNavigate()

  const [announcements, setAnnouncements] = useState<Annoucement[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newComment, setNewComment] = useState("")

  const localLogout = () => {
    clearUserData()
    navigate(routes.login)
  }

  const form = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: yup.object().shape({
      content: yup.string().trim().required('Content is required'),
    }),
    onSubmit: async (values, form) => {
      try {
        setLoading(true);

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/announcements', {
          method: 'POST',
          body: JSON.stringify({ content: values.content }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localLogout();
          }

          return;
        }

        const jsonResponse: {
          message: string;
          announcement: Annoucement;
        } = await response.json();

        setAnnouncements([{ ...jsonResponse.announcement }, ...announcements]);
        form.resetForm();
        form.setFieldValue('content', '');
      } catch (error) {
        console.log('Failed to submit Post', error);
      } finally {
        setLoading(false);
      }
    },
  });

  console.log(form.values);

  const openCommentsModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
    setNewComment(''); // Réinitialise le champ de saisie
    setIsModalOpen(false);
  };

  const addComment = () => {
    // if (!newComment.trim()) return
    // const updatedPosts = posts.map((post) => {
    //   if (post.id === selectedPost.id) {
    //     const updatedPost = {
    //       ...post,
    //       comments: [
    //         ...post.comments,
    //         {
    //           id: Date.now(),
    //           content: newComment,
    //           author: {
    //             username: "CurrentUser",
    //             avatar: `https://i.pravatar.cc/40?u=CurrentUser${Date.now()}`,
    //           },
    //         },
    //       ],
    //     }
    //     // Ensure selectedPost is updated to reflect the changes
    //     setSelectedPost(updatedPost)
    //     return updatedPost
    //   }
    //   return post
    // })
    // setPosts(updatedPosts)
    // setNewComment("")
  };

  const fetchAnnouncements = async () => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/announcements")

    if (!response.ok) {
      if (response.status === 401) {
        localLogout()
      }

      return
    }

    setAnnouncements(await response.json())
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  return (
    <div className="Ann">
      <div className="ann-create-post">
        <form onSubmit={form.handleSubmit}>
          <Editor
            content={form.values.content}
            setContent={content => form.setFieldValue("content", content)}
            autoFocus
          />
          {(form.touched.content && form.errors.content) && (
            <p className="mt-8 text-14 text-red-400">{form.errors.content}</p>
          )}
          <button type="submit" className="mt-12">Post</button>
        </form>
        {/* <RichTextPostCreator
          value={content}
          onChange={handleContentChange}
          handleSubmit={handleSubmit}
        /> */}
      </div>
      {announcements.map((announcement) => (
        <div key={announcement.id} className="ann-post">
          <div className="ann-post-header">
            <Avatar username={announcement.author?.username || ""} />
            <span className="ann-username" style={{ marginLeft: "10px" }}>
              {announcement.author?.username || ""}
            </span>
          </div>
          <div
            className="tiptap post-content"
            style={{ minHeight: "auto" }}
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          ></div>
          {/* <button onClick={() => openCommentsModal(annoucement)} className="ann-comment-button">
            💬 {annoucement.comments.length}
          </button> */}
        </div>
      ))}
      {/* {selectedPost && (
        <Modal isOpen={isModalOpen} onClose={closeCommentsModal}>
          <div className="ann-modal-post">
            <div className="ann-post-header">
              <Avatar username={selectedPost.author.username} />
              <span className="ann-username" style={{marginLeft:"10px"}}>{selectedPost.author.username}</span>
            </div>
            <p>{selectedPost.content}</p>
          </div>

          <div className="ann-comments-section">
            <h3>Comments</h3>
            {selectedPost.comments.map((comment) => (
              <div key={comment.id} className="ann-comment">
                <Avatar username={comment.author.username}/>
                <div className="ann-comment-content">
                  <span className="ann-username" style={{marginLeft:"10px"}}>{comment.author.username}</span>
                  <p style={{marginLeft:"10px"}}>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ann-add-comment">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={addComment}>Post</button>
          </div>
        </Modal>
      )} */}
    </div>
  )
}

export default Announcements
