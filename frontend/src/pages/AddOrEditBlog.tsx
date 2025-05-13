import Layout from '../components/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { object, string, mixed } from 'yup';
import { Field, Form, Formik } from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import InputComponent from '../components/InputComponent';
import ImageUploader from '../components/ImageUploader';

const AddOrEditBlog = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { createBlog, updateBlog, categories, getCategories } = useBlog();

  const [blog, setBlog] = useState<IBlogForm>({
    title: '',
    content: '',
    image:
      'https://revenuearchitects.com/wp-content/uploads/2017/02/Blog_pic-450x255.png',
    categoryId: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch categories when the component mounts
    getCategories();

    // If there's state (editing mode), update blog state and set edit mode
    if (state) {
      setBlog({
        title: state.title,
        content: state.content,
        image: state.image,
        categoryId: state.categoryId._id,
      });
      setIsEditMode(true);
    }
  }, [state, getCategories]); // Runs on component mount or when state changes

  // Add hasFile to initial values
  const initialValues = { ...blog, hasFile: false };

  const validationSchema = object({
    title: string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters long'),
    content: string().required('Content is required'),
    image: mixed().test(
      'image-required',
      'Image is required',
      function (value) {
        // Use hasFile from Formik values
        if (this.parent.hasFile) return true;
        return !!value && /^https?:\/\/.+\..+/.test(value);
      }
    ),
    categoryId: string().required('Category is required'),
    hasFile: mixed(), // not validated, just for logic
  });

  const handleSubmit = (
    values: IBlogForm & { hasFile: boolean },
    { setSubmitting }: FormikHelpers<IBlogForm & { hasFile: boolean }>
  ) => {
    if (!isEditMode) {
      createBlog(values, navigate, selectedFile);
    } else {
      updateBlog(values, navigate, state._id, selectedFile);
    }
    setSubmitting(false);
  };

  // Update hasFile in Formik when file is selected
  const handleImageSelected = (
    file: File | null,
    setFieldValue: (field: string, value: string | boolean | any) => void
  ) => {
    setSelectedFile(file);
    setFieldValue('hasFile', !!file as any);
  };

  const handleImageUrlEntered = (
    url: string,
    setFieldValue: (field: string, value: string | boolean | any) => void
  ) => {
    setFieldValue('image', url);
    setFieldValue('hasFile', false as any);
  };

  return (
    <Layout>
      <div className="w-full mx-auto p-6 max-w-[450px] md:max-w-[900px] bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-2xl text-center text-gray-800 mb-8">
          {isEditMode ? 'EDIT' : 'ADD'} POST
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <InputComponent
                errors={errors}
                touched={touched}
                label="Blog Title"
                name="title"
                inputType="text"
                placeholder="NYC Best Attractions"
              />

              <div className="my-4">
                <label htmlFor="categoryId" className="form-label">
                  Category:
                </label>
                <Field
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.categoryId && touched.categoryId ? (
                  <div className="text-red-500 text-sm">
                    {errors.categoryId}
                  </div>
                ) : null}
              </div>

              <div className="my-4">
                <label className="form-label">Post Content:</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={blog ? blog.content : ''}
                  onChange={(_, editor) => {
                    const data = editor.getData();
                    setFieldValue('content', data);
                  }}
                />
                {errors.content && touched.content ? (
                  <div className="text-red-500 text-sm">{errors.content}</div>
                ) : null}
              </div>

              <ImageUploader
                onImageSelected={(file) =>
                  handleImageSelected(file, setFieldValue)
                }
                onUrlEntered={(url) =>
                  handleImageUrlEntered(url, setFieldValue)
                }
                initialImageUrl={blog.image}
              />
              {errors.image && touched.image ? (
                <div className="text-red-500 text-sm">{errors.image}</div>
              ) : null}

              {/* Hidden field for hasFile */}
              <Field type="hidden" name="hasFile" />

              <div className="my-4 flex justify-center">
                <button className="btn-primary" type="submit">
                  {isEditMode ? 'EDIT' : 'ADD'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default AddOrEditBlog;
