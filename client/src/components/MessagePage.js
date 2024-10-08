import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avtar from './Avtar';
import { HiDotsVertical } from 'react-icons/hi';
import { FaAngleLeft } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';
import { FaPlus, FaImage, FaVideo } from 'react-icons/fa';
import uploadFile from '../helpers/uploadFile';
import { IoClose } from 'react-icons/io5';
import Loading from './Loading';
import backroundImage from '../assets/wallpaper.jpeg';
import moment from 'moment';

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const [dataUser, setDataUser] = useState({
    name: '',
    email: '',
    profile_pic: '',
    online: false,
    _id: '',
  });

  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);

  const [loading, setLoading] = useState(false);

  const [allMessage, setAllMessage] = useState([]);
  const [groupedMessages, setGroupedMessages] = useState({});
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [groupedMessages]);

  const getDateLabel = (date) => {
    const today = moment().startOf('day');
    const messageDate = moment(date).startOf('day');

    if (messageDate.isSame(today, 'day')) return 'Today';
    if (messageDate.isSame(today.subtract(1, 'day'), 'day')) return 'Yesterday';

    return messageDate.format('D MMMM YYYY');
  };

  const groupMessagesByDate = useCallback((messages) => {
    return messages.reduce((acc, message) => {
      const dateLabel = getDateLabel(message.createdAt);
      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }
      acc[dateLabel].push(message);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    if (allMessage.length > 0) {
      setGroupedMessages(groupMessagesByDate(allMessage));
    }
  }, [allMessage, groupMessagesByDate]);

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadedPhoto = await uploadFile(file);
    setLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadedPhoto?.url,
      };
    });
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: '',
      };
    });
  };

  const handleUploadVideo = async (event) => {
    const file = event.target.files[0];
    setOpenImageVideoUpload(false);
    setLoading(true);
    const uploadedVideo = await uploadFile(file);
    setLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadedVideo?.url,
      };
    });
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: '',
      };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params?.userId);

      socketConnection.emit('seen', params?.userId);
      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setMessage((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params?.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: '',
          imageUrl: '',
          videoUrl: '',
        });
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backroundImage})` }}
      className='bg-no-repeat bg-cover'
    >
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={'/'} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avtar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>
              {dataUser?.name}
            </h3>
            <p className='-my-2 text-sm'>
              {dataUser.online ? (
                <span className='text-primary'>online</span>
              ) : (
                <span className='text-slate-400'>offline</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        {/**all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {Object.keys(groupedMessages).map((dateLabel) => (
            <div key={dateLabel}>
              <h3 className='text-lg font-semibold text-center my-2'>
                {dateLabel}
              </h3>
              <div className='flex flex-col gap-2 py-2 mx-2'>
                {groupedMessages[dateLabel].map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                      user._id === msg?.msgByUserId
                        ? 'ml-auto bg-teal-100'
                        : 'bg-white'
                    }`}
                  >
                    <div className='w-full relative'>
                      {msg?.imageUrl && (
                        <img
                          src={msg?.imageUrl}
                          alt='uploaded'
                          className='w-full h-full object-scale-down'
                        />
                      )}
                      {msg?.videoUrl && (
                        <video
                          src={msg.videoUrl}
                          className='w-full h-full object-scale-down'
                          controls
                        />
                      )}
                    </div>
                    <p className='px-2'>{msg.text}</p>
                    <p className='text-xs ml-auto w-fit'>
                      {moment(msg.createdAt).format('hh:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div
              className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'
              onClick={handleClearUploadImage}
            >
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img
                src={message.imageUrl}
                alt='uploadImage'
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
              />
            </div>
          </div>
        )}

        {/**upload video display */}
        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div
              className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'
              onClick={handleClearUploadVideo}
            >
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video
                src={message.videoUrl}
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
            <Loading size={8} />
          </div>
        )}
      </section>

      {/**send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative '>
          <button
            onClick={() => setOpenImageVideoUpload(!openImageVideoUpload)}
            className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'
          >
            <FaPlus size={20} />
          </button>

          {/**video and image */}
          {openImageVideoUpload && (
            <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
              <form>
                <label
                  htmlFor='uploadImage'
                  className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'
                >
                  <div className='text-primary'>
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor='uploadVideo'
                  className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'
                >
                  <div className='text-purple-500'>
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type='file'
                  id='uploadImage'
                  onChange={handleUploadImage}
                  className='hidden'
                />

                <input
                  type='file'
                  id='uploadVideo'
                  onChange={handleUploadVideo}
                  className='hidden'
                />
              </form>
            </div>
          )}
        </div>

        {/**input box */}
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full'
            name='text'
            value={message?.text}
            onChange={handleOnChange}
          />
          <button className='text-primary hover:text-secondary'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
