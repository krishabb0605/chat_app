import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Avtar } from '../components';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
import UserService from '../service/users.service';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: '',
  });
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!state?.name) {
      navigate('/email');
    }
  }, []);

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

    try {
      const response = await UserService.checkPassword({
        userId: state?._id,
        password: data.password,
      });

      toast.success(response.data.message);

      if (response.data.success) {
        localStorage.setItem('token', response?.data?.token);
        dispatch(setToken(response?.data?.token));

        setData({
          password: '',
        });
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log({ error });
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full  max-w-md rounded overflow-hidden p-4 mx-auto '>
        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          <Avtar
            name={state?.name}
            width={70}
            height={70}
            imageUrl={state?.profile_pic}
            userId={state?._id}
          />
          <h2 className='font-semibold text-lg mt-1'>{state?.name}</h2>
        </div>
        <h3>Welcome to Chat App !</h3>
        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg  px-4 py-1 rounded mt-2 font-bold leading-relaxed tracking-wide text-white hover:bg-secondary'>
            Login
          </button>
        </form>
        <p className='my-3 text-center'>
          <Link
            to='/forgot-password'
            className='hover:text-primary font-semibold '
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
