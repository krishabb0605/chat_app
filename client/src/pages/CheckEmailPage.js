import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/users.service';
import toast from 'react-hot-toast';
import { PiUserCircle } from 'react-icons/pi';
import { Loading } from '../components';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: '',
  });

  const [isEmailChecking, setIsEmailChecking] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsEmailChecking(true);

    try {
      const response = await UserService.checkEmail(data);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: '',
        });
        navigate('/password', { state: response?.data.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log({ error });
    }
    setIsEmailChecking(false);
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full  max-w-md rounded overflow-hidden p-4 mx-auto '>
        <div className='w-fit mx-auto mb-2'>
          <PiUserCircle size={80} />
        </div>
        <h3>Welcome to Chat App !</h3>
        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg  px-4 py-1 rounded mt-2 font-bold leading-relaxed tracking-wide text-white hover:bg-secondary h-[40px]'>
            {isEmailChecking ? <Loading size={8} /> : `Let's Go`}
          </button>
        </form>
        <p className='my-3 text-center'>
          New User ?{' '}
          <Link to='/register' className='hover:text-primary font-semibold '>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
