import Layout from '../components/Layout';
import Card from '../components/Card';
import { useBlog } from '../context/BlogContext';
import { useEffect } from 'react';
import PaginationComponent from '../components/PaginationComponent';

export default function Home() {
  const { blogs, getBlogs, getCategories } = useBlog();

  useEffect(() => {
    getBlogs();
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      {blogs.length === 0 && (
        <div className="flex justify-center items-center">
          <p>No Posts , Add one</p>
        </div>
      )}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
        {blogs.map((item) => (
          <Card
            key={item?._id}
            blog={item as unknown as ISingleBlog}
            preview={true}
          />
        ))}
      </div>

      <PaginationComponent />
    </Layout>
  );
}
