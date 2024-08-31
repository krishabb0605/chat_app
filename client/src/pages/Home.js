import axios from 'axios';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;

  const fetchUserDetails = async () => {
    try {
      const response = await axios({
        url: URL,
        withCredentials: true,
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      console.log('user details', response.data.data);
    } catch (error) {
      console.log('error while fetching details', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <div>
      Home Page
      {/* mesage component */}
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
