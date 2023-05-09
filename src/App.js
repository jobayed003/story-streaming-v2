import { Suspense, lazy } from 'react';
import { Image, Row } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import logo from './assets/Icons/StorySaloon_Logo.svg';
import { Test } from './components/pages/Dashboard';

const Landing = lazy(() => import('./components/pages/Landing'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const Viewing = lazy(() => import('./components/pages/Viewing'));
const Settings = lazy(() => import('./components/pages/Settings'));
const AddContent = lazy(() => import('./components/pages/AddContent'));
const Landing2 = lazy(() => import('./components/pages/Landing2'));

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
        <Route path='/landing' element={<Landing2 />} />
      </Routes>
    </Suspense>
    <ToastContainer />
  </Router>
);

export default App;
