import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setUser } from '../redux/userSlice';
import { Sidebar } from '../components';
import UserService from '../service/users.service';
import logo from '../assets/logo.png';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === '/';

  const fetchUserDetails = async () => {
    try {
      const response = await UserService.userDetail(
        localStorage.getItem('token')
      );

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
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
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>
      {/* mesage component */}
      <section className={`${basePath && 'hidden'} `}>
        <Outlet />
      </section>

      <div
        className={` justify-center items-center flex-col gap-2 hidden ${
          !basePath ? 'hidden' : 'lg:flex'
        } `}
      >
        <div>
          <img src={logo} width={250} alt='logo' />
        </div>
        <p className='text-lg mt-2 text-slate-500'>
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
