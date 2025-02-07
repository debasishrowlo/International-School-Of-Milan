import React from "react";
import { useFetchRelatedPostsQuery } from "@/redux/features/posts/PostsApi";
import { Link, useParams } from "react-router-dom";

const RelatedPosts = () => {
  const { id } = useParams();
  const { data: posts = [], error, isLoading } = useFetchRelatedPostsQuery(id);
  console.log(posts);

  return (
    <div>
      <h3 className="text-2xl font-medium pt-8 px-8 pb-5">Related Posts</h3>
      <hr />
      {isLoading ? (
        <div className="p-8">Loading...</div>
      ) : error ? (
        <div className="p-8">Error fetching related posts</div>
      ) : posts.length > 0 ? (
        <div className="space-y-4 mt-5">
          {posts.map((post) => (
            <Link
              to={`/Posts/${post._id}`}
              key={post._id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm px-8 py-4"
            >
              <div className="h-16 w-16 flex-shrink-0">
                <img
                  src={post.coverImg}
                  alt={post.title}
                  className="h-full w-full rounded-full ring-1 ring-blue-700 transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div>
                <h4 className="font-medium text-[#1E73BE]">
                  {post?.title.substring(0, 50)}
                </h4>
                <p>{post?.description.substring(0, 50)}...</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8">No Related Posts Found</div>
      )}
    </div>
  );
};

export default RelatedPosts;
