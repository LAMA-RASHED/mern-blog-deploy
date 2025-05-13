import { object, string } from 'yup';
import FormComponent from '../components/FormComponent';
import { useAuth } from '../context/AuthContext';
import { FormikHelpers } from 'formik';

const ProfileComponent = () => {
  const { userInfo: user } = useAuth();

  // Provide fallback values in case user is null
  const initialValuesProfile = {
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
  };
  const { updateUser } = useAuth();

  // validation
  const profileSchema = object().shape({
    username: string().required('Username is required!'),
    email: string().email('Invalid Email').required('Email is required!'),
    firstName: string().required('First name is required!'),
    lastName: string().required('Last name is required!'),
  });

  const handleSubmitProfile = (
    values: IUser,
    actions: FormikHelpers<IUser>
  ) => {
    updateUser({ ...values, _id: user?._id }, 'Profile updated successfully!');
    actions.setSubmitting(false);
  };
  return (
    <FormComponent
      initialValues={initialValuesProfile}
      ValidationSchema={profileSchema}
      handleSubmit={handleSubmitProfile}
      title="Profile"
      inputs={[
        {
          name: 'username',
          label: 'Username',
          inputType: 'text',
        },
        {
          name: 'email',
          label: 'Email',
          inputType: 'email',
        },
        {
          name: 'firstName',
          label: 'First Name',
          inputType: 'text',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          inputType: 'text',
        },
      ]}
      buttonText="Update Profile"
    />
  );
};

export default ProfileComponent;
