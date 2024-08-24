import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
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
