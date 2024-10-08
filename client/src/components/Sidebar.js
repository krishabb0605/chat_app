import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { FaUserPlus, FaImage, FaVideo } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { NavLink, useNavigate } from 'react-router-dom';
import Avtar from './Avtar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from 'react-icons/fi';
import SearchUser from './SearchUser';
import { logout } from '../redux/userSlice';
import Loading from './Loading';

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const [isFetching, setIsFetching] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetching(true);
    if (socketConnection && user) {
      socketConnection.emit('sidebar', user?._id);
      socketConnection.on('conversation', (data) => {
        const conversationUserData = data?.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          } else if (conversationUser?.receiver._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });

        setAllUser(conversationUserData);
        setIsFetching(false);
      });
    }
  }, [socketConnection, user]);

  if (isFetching) {
    return (
      <div className='fixed top-0 bottom-0 left-0 right-0 bg-white flex justify-center items-center z-10'>
        <div className='z-20'>
          <Loading size={8} />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/email');
  };

  return (
    <div className='w-full h-full grid grid-rows-[48px,1fr] lg:grid-cols-[48px,1fr] bg-white'>
      <div className=' bg-slate-100 w-full lg:w-12 h-24 lg:h-dvh rounded-tr-lg rounded-br-lg py-5 pb-0 lg:pb-5 text-slate-600 flex lg:flex-col justify-between fixed lg:static bottom-0'>
        <div className='flex flex-row lg:flex-col items-center'>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && 'bg-slate-200'
              }`
            }
            title='Chat'
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>

          <div
            title='add friend'
            className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className='flex flex-row lg:flex-col items-center'>
          <button
            className='mx-auto'
            title={user.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avtar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title='logout'
            className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'
            onClick={handleLogout}
          >
            <span className='-ml-2'>
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className='w-full h-full'>
        <div className=' h-16 flex items-center'>
          <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
        </div>
        <div className='bg-slate-200 p-[0.5px]'></div>
        <div className='h-[calc(100vh-131px)] overflow-x-hidden overflow-y-auto scrollbar '>
          {allUser.length === 0 && (
            <div className='mt-12'>
              <div className='flex justify-center items-center my-4 text-slate-500'>
                <FiArrowUpLeft size={50} />
              </div>
              <p className='text-lg text-center text-slate-400'>
                Explore users to start a converdation with.
              </p>
            </div>
          )}

          {allUser?.map((conv, index) => {
            return (
              <NavLink
                to={'/' + conv?.userDetails?._id}
                key={conv._id}
                className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'
              >
                <div>
                  <Avtar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    height={40}
                    width={40}
                    userId={conv?.userDetails?._id}
                  />
                </div>

                <div>
                  <h3 className='text-ellipsis line-clamp-1 font-semibold text-base '>
                    {conv?.userDetails?.name}
                  </h3>
                  <div className='text-slate-500 text-xs flex items-center gap-1'>
                    <div className='flex items-centers gap-1'>
                      {conv?.lastMsg?.imageUrl && (
                        <div className='flex items-centers gap-1'>
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className='flex items-centers gap-1'>
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className='text-ellipsis line-clamp-1'>
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>

                {conv?.unseenMsg > 0 && (
                  <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* edit user details */}

      {editUserOpen && user.name && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* search user */}

      {openSearchUser && user.name && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
