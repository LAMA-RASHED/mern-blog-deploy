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

// Debug form state

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]); // Runs on component mount or when state changes

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
        // Only check Formik's hasFile and image value
        return (
          this.parent.hasFile ||
          (!!value &&
            typeof value === 'string' &&
            /^https?:\/\/.+\..+/.test(value))
        );
      }
    ),
    categoryId: string().required('Category is required'),
    hasFile: mixed(), // not validated, just for logic
  });

  const handleSubmit = (
    values: IBlogForm & { hasFile: boolean },
    { setSubmitting }: FormikHelpers<IBlogForm & { hasFile: boolean }>
  ) => {
    console.log(
      'Form submission - values:',
      values,
      'selectedFile:',
      selectedFile
    );

    // Safety check - if a file is selected, make sure hasFile is true
    // This helps if somehow the form state got out of sync
    const updatedValues = {
      ...values,
      hasFile: selectedFile ? true : values.hasFile,
    };

    if (!isEditMode) {
      createBlog(updatedValues, navigate, selectedFile);
    } else {
      updateBlog(updatedValues, navigate, state._id, selectedFile);
    }
    setSubmitting(false);
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
          {(formikProps) => (
            <Form>
              <InputComponent
                errors={formikProps.errors}
                touched={formikProps.touched}
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
                {formikProps.errors.categoryId &&
                formikProps.touched.categoryId ? (
                  <div className="text-red-500 text-sm">
                    {formikProps.errors.categoryId}
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
                    formikProps.setFieldValue('content', data);
                  }}
                />
                {formikProps.errors.content && formikProps.touched.content ? (
                  <div className="text-red-500 text-sm">
                    {formikProps.errors.content}
                  </div>
                ) : null}
              </div>

              <ImageUploader
                onImageSelected={(file) => {
                  setSelectedFile(file);
                  formikProps.setFieldValue('hasFile', !!file);
                  formikProps.setFieldValue('image', file ? 'dummy' : '');
                }}
                onUrlEntered={(url) => {
                  formikProps.setFieldValue('image', url);
                  formikProps.setFieldValue('hasFile', false);
                }}
                initialImageUrl={blog.image}
              />
              {formikProps.errors.image && formikProps.touched.image ? (
                <div className="text-red-500 text-sm">
                  {formikProps.errors.image}
                </div>
              ) : null}

              {/* Debug form state */}
              <div className="mt-4 mb-2 p-2 bg-gray-100 rounded text-xs">
                <h4 className="font-bold">Debug Info:</h4>
                <p>
                  Selected File:{' '}
                  {selectedFile
                    ? `${selectedFile.name} (${Math.round(
                        selectedFile.size / 1024
                      )} KB)`
                    : 'None'}
                </p>
                <p>
                  hasFile in form:{' '}
                  {formikProps.values.hasFile ? 'true' : 'false'}
                </p>
                <p>image in form: {formikProps.values.image}</p>
                <p>Errors: {JSON.stringify(formikProps.errors)}</p>
              </div>

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
