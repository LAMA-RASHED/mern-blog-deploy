import { Route, Routes } from 'react-router-dom';
import {
  AddOrEditBlog,
  Details,
  Home,
  Login,
  Profile,
  Register,
} from '../pages';
import PrivateRouter from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/" element={<PrivateRouter />}>
        <Route path="/blog/add" element={<AddOrEditBlog />} />
        <Route path="/blog/edit/:id" element={<AddOrEditBlog />} />
        <Route path="/blog/details/:id" element={<Details />} />
        <Route path="/blog/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
