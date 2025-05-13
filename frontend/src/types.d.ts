//! Auth Type Definitions
interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  _id?: string;
  password?: string;
  password2?: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

interface ICurrentUser extends IUser {
  token: string;
  first_name: string;
  last_name: string;
}

//! Blog Type Definitions
interface IBlog {
  _id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  published_date: string;
  comment_count: number;
  comments: string[];
  has_liked: boolean;
  isowner: boolean;
  view_count: number;
  like_count: number;
  likes: string[];
  views: number;
  isPublish: boolean;
  countOfVisitors: number;
  author: IBlogUser;
  userId: IBlogUser;
  id: string;
}

interface IBlogForm {
  categoryId: string;
  title: string;
  content: string;
  image: string;
}

// type IBlogForm = Omit<
//   IBlog,
//   '_id',
//   'comments',
//   'isPublish',
//   'likes',
//   'countOfVisitors',
//   'createdAt',
//   'updatedAt',
//   'userId'
// >;

interface IBlogs {
  error: string;
  data: IBlog[];
  details: {
    totalRecords: number;
    pages: {
      next: number | boolean;
      previous: number | boolean;
    };
  };
}

interface IBlogUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface IBlogCategory {
  _id: string;
  name: string;
}

interface IBlogComment {
  _id: string;
  blogId: string;
  userId: IBlogUser;
  content: string;
  createdAt: string;
}

interface ISingleBlog {
  _id: string;
  title: string;
  content: string;
  image: string;
  userId: IBlogUser;
  author: IBlogUser;
  createdAt: string;
  updatedAt: string;
  slug: string;
  published_date: string;
  comment_count: number;
  comments: IBlogComment[];
  hasLiked: boolean;
  isOwner: boolean;
  view_count: number;
  like_count: number;
  likes: string[];
  views: number;
  countOfVisitors: number;
  id: string;
}

interface IPaginationData {
  count: number;
  next: number | boolean;
  previous: number | boolean;
  totalPages: number;
}
