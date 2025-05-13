import { useState } from 'react';
import { BiSolidComment, BiSolidLike } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';

interface CardProps {
  blog: ISingleBlog;
  preview?: boolean;
}

export default function Card({ blog, preview }: CardProps) {
  const [enteredComment, setEnteredComment] = useState('');
  const navigate = useNavigate();
  const { deleteBlog, addComment, addLike } = useBlog();
  const { userInfo } = useAuth();

  const isOwner = blog?.userId?._id === userInfo?._id;
  const isLiked = blog?.likes?.includes(userInfo?._id as string);

  const handleDelete = (id: string) => {
    deleteBlog(id, navigate);
  };

  const handleLike = (slug: string, id: string) => {
    addLike(slug, id);
  };

  const handleComment = (id: string) => {
    if (enteredComment.trim().length == 0)
      return toast.error('Please add the comment');
    addComment(id, enteredComment);
    setEnteredComment('');
  };

  return (
    <div className="border border-gray-200 shadow rounded-lg">
      {/* //* image */}
      <Link to={`/blog/details/${blog?._id}`}>
        <img src={blog?.image} className="h-[200px] object-cover w-full" />
      </Link>
      {/* //* card content */}
      <div className="flex flex-col p-5">
        {/* //* card title */}
        <Link to={`/blog/details/${blog?._id}`}>
          <h5 className="mb-2 text-2xl font-bold text-center">{blog?.title}</h5>
        </Link>
        {/* //* card details */}
        <div>
          <div className="flex justify-between">
            <p className="font-bold">Published On:</p>
            <p className="italic">{new Date(blog?.createdAt).toDateString()}</p>
          </div>
          {blog?.author?.email && (
            <div className="flex justify-between">
              <p className="font-bold">Author:</p>
              <p className="italic">{blog.author.email}</p>
            </div>
          )}
        </div>
        <hr />

        {/* //* blog content */}
        <div
          className={
            preview
              ? 'line-clamp-1 truncate whitespace-pre-wrap my-3 flex-1'
              : ''
          }
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        >
          {/* {blog?.content} */}
        </div>

        <hr />

        <div
          className={`flex space-x-10 pr-3 mt-5 ${
            preview ? 'justify-center' : 'justify-between'
          }`}
        >
          {/* //* Delete and Edit Buttons*/}
          {!preview && isOwner && (
            <div className="flex space-x-5 my-5">
              <button
                className="btn-danger"
                onClick={() => handleDelete(blog?._id)}
              >
                DELETE
              </button>
              <button
                className="btn-warning"
                onClick={() =>
                  navigate(`/blog/edit/${blog?._id}`, { state: blog })
                }
              >
                EDIT
              </button>
            </div>
          )}

          {/* //* Like, Comment, View Icons*/}
          <div className="flex space-x-5 my-5">
            <div className="relative">
              <BiSolidLike
                className={`text-2xl ${
                  isLiked ? 'text-blue-800' : 'text-blue-500'
                } relative cursor-pointer`}
                onClick={() => {
                  handleLike(blog?.slug, blog?._id);
                }}
              />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.likes.length}
              </div>
            </div>
            <div className="relative">
              <BiSolidComment className="text-2xl text-green-500 relative cursor-pointer" />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.comments.length}
              </div>
            </div>
            <div className="relative">
              <BsFillEyeFill className="text-2xl text-gray-500 relative cursor-pointer" />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.countOfVisitors}
              </div>
            </div>
          </div>
        </div>

        <hr />
        {/* //* Comments Section */}
        {!preview && blog?.comments.length !== 0 && (
          <>
            {blog?.comments.map((comment, index) => (
              <div
                key={index}
                className="flex justify-between items-center my-10"
              >
                <div className="flex space-x-5">
                  <p>{comment?.userId?.email}</p>
                  <p className="font-italic"> {comment?.content}</p>
                </div>
                <p>
                  {comment?.createdAt &&
                    new Date(comment?.createdAt).toDateString()}
                </p>
              </div>
            ))}
          </>
        )}

        {!preview && blog?.comments?.length == 0 && (
          <p className="text-center"> No comments add one</p>
        )}

        {/* //* Add Comment Section */}

        {!preview && (
          <div className="flex space-x-2">
            <input
              type="text"
              className="form-control"
              value={enteredComment}
              onChange={(e) => setEnteredComment(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => handleComment(blog?._id)}
            >
              {' '}
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
