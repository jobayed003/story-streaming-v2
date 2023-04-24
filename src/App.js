import { Suspense, lazy } from 'react';
import { Image, Row, Spinner } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import logo from './components/Icons/StorySaloon_Logo.svg';

import { Test } from './components/Dashboard';

const Landing = lazy(() => import('./components/Landing'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Viewing = lazy(() => import('./components/Viewing'));
const Settings = lazy(() => import('./components/Settings'));
const AddContent = lazy(() => import('./components/AddContent'));

const App = () => (
  <Router>
    <Suspense
      fallback={
        <Row className='justify-content-center align-items-center' style={{ height: '100vh' }}>
          <Image src={logo} alt='' style={{ width: '300px', height: '80px' }} />
        </Row>
      }
    >
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/watch/:movieID' element={<Viewing />} />
        <Route path='/upload' element={<AddContent />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </Suspense>
    <ToastContainer />
  </Router>
);

export default App;
