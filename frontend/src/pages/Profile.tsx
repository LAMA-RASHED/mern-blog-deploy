import Layout from '../components/Layout';
import ProfileComponent from '../components/ProfileComponent';
import ProfilePasswordComponent from '../components/ProfilePasswordComponent';

const Profile = () => {
  return (
    <Layout>
      <ProfileComponent />
      <ProfilePasswordComponent />
    </Layout>
  );
};

export default Profile;
