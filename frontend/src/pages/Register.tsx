import { useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';
import FormComponent from '../components/FormComponent';
import { useAuth } from '../context/AuthContext';
import { FormikHelpers } from 'formik';

type RegisterFormValues = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  password2: string;
};

export default function Register() {
  const initialValues: RegisterFormValues = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    password2: '',
  };
  const { register } = useAuth();
  const navigate = useNavigate();

  // validation
  const registerSchema = object().shape({
    username: string().required('Username is required!'),
    email: string().email('Invalid Email').required('Email is required!'),
    firstName: string().required('First name is required!'),
    lastName: string().required('Last name is required!'),
    password: string()
      .min(8, 'Min 8 characters')
      .required('Password is required!'),
    password2: string()
      .required('Password is required!')
      .oneOf([ref('password')], 'Password does not match'),
  });

  const handleSubmit = (
    values: RegisterFormValues,
    actions: FormikHelpers<RegisterFormValues>
  ) => {
    register(values, navigate);
    actions.setSubmitting(false);
  };

  return (
    <section className="flex items-center min-h-screen">
      <img
        src="https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
        className="hidden lg:block w-7/12 h-screen object-cover"
        alt="login page image"
      />
      <FormComponent
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        ValidationSchema={registerSchema}
        title="Sign Up"
        inputs={[
          { name: 'username', label: 'Username', placeholder: 'johndoe' },
          {
            name: 'email',
            label: 'Email',
            placeholder: 'john@clarusway.com',
            inputType: 'email',
          },
          { name: 'firstName', label: 'First Name', placeholder: 'John' },
          { name: 'lastName', label: 'Last Name', placeholder: 'Doe' },
          {
            name: 'password',
            label: 'Password',
            placeholder: '********',
            inputType: 'password',
          },
          {
            name: 'password2',
            label: 'Confirm Password',
            placeholder: '********',
            inputType: 'password',
          },
        ]}
        buttonText="Sign Up"
        bottomText1="Already have an account?"
        bottomLink="/auth/login"
        bottomText2="Sign In"
      />
    </section>
  );
}
