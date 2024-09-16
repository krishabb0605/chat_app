import React, { useRef, useState } from 'react';
import Avtar from './Avtar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import UserService from '../service/users.service';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import Loading from './Loading';

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user.name,
    profile_pic: user?.profile_pic,
  });

  const [isSaveData, setIsSaveData] = useState(false);
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOpenUploadPhoto = (event) => {
    event.preventDefault();
    event.stopPropagation();

    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    const uploadPhoto = await uploadFile(file);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSaveData(true);
    try {
      const response = await UserService.updateUser(
        localStorage.getItem('token'),
        data
      );
      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error('Error while updating data', error?.response?.data?.message);
    }
    setIsSaveData(false);
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profle Details</h2>
        <p className='text-sm'>Edit user details</p>
        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name :</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data?.name}
              onChange={handleChange}
              className='w-full py-1 px-2 focus:outline-primary border-0.5 '
            />
          </div>
          <div>
            <div>Photo :</div>
            <div className='my-1 flex items-center gap-4'>
              <Avtar
                width={40}
                height={40}
                imageUrl={data.profile_pic}
                name={data?.name}
                userId={user?._id}
              />
              <label htmlFor='profile_pic'>
                <button
                  className='font-semibold'
                  onClick={handleOpenUploadPhoto}
                >
                  Change photo
                </button>
                <input
                  id='profile_pic'
                  type='file'
                  className='hidden'
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />

          <div className='flex gap-2 w-fit ml-auto '>
            <button
              className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'
              onClick={onClose}
            >
              Cancle
            </button>
            <button
              className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary w-20'
              onClick={handleSubmit}
            >
              {isSaveData ? <Loading size={6} /> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
