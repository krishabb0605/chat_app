import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthLayouts from './layout';
import {
  CheckEmailPage,
  CheckPasswordPage,
  ForgotPassword,
  Home,
  RegisterPage,
} from './pages';
import { MessagePage } from './components';

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route element={<AuthLayouts />}>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/email' element={<CheckEmailPage />} />
          <Route path='/password' element={<CheckPasswordPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Route>
        <Route path='/' element={<Home />}>
          <Route path='/:userId' element={<MessagePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
