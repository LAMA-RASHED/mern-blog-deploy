import { useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import Card from '../components/Card';

export default function Details() {
  const { id } = useParams();

  const { getBlog, currentBlog } = useBlog();

  useEffect(() => {
    if (id) getBlog(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="container max-w-5xl mx-auto">
        {currentBlog && <Card blog={currentBlog} preview={false} />}
      </div>
    </Layout>
  );
}
