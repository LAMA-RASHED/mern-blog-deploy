import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import FormComponent from '../components/FormComponent';
import { useAuth } from '../context/AuthContext';
import { FormikHelpers } from 'formik';

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };
  const { login } = useAuth();
  const navigate = useNavigate();
  // validation
  const loginSchema = object().shape({
    email: string().email('Invalid Email').required('Email is required!'),
    password: string()
      .min(5, 'Min 5 characters')
      .required('Password is required!'),
  });

  const handleSubmit = (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    console.log(values);
    actions.setSubmitting(false);
    login(values, navigate);
    actions.resetForm();
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
        ValidationSchema={loginSchema}
        title="Login"
        inputs={[
          {
            name: 'email',
            label: 'Email',
            inputType: 'email',
          },
          {
            name: 'password',
            label: 'Password',
            inputType: 'password',
          },
        ]}
        buttonText="Login"
        bottomText1="Don't have an account?"
        bottomText2="Sign Up"
        bottomLink="/auth/register"
      />
    </section>
  );
}
