import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout, setUser } from '../redux/userSlice';
import { Sidebar } from '../components';
import UserService from '../service/users.service';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('user', user);

  const fetchUserDetails = async () => {
    try {
      const response = await UserService.userDetail(
        localStorage.getItem('token')
      );

      dispatch(setUser(response.data.data));

      if (response.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      console.log('error while fetching details', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className='bg-white'>
        <Sidebar />
      </section>
      {/* mesage component */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
