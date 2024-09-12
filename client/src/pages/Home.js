import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from '../redux/userSlice';
import { Sidebar } from '../components';
import UserService from '../service/users.service';
import logo from '../assets/logo.png';
import io from 'socket.io-client';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === '/';

  const fetchUserDetails = useCallback(async () => {
    try {
      if (!localStorage.getItem('token')) {
        navigate('/email');
        return;
      }
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
  }, [dispatch, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // socket connction

  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    dispatch(setSocketConnection(socketConnection));

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

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
