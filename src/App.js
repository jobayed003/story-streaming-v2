import { getAuth } from 'firebase/auth';
import { Suspense, lazy, useContext } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes, redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
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
        <Row className='mb-5 mt-5 justify-content-center'>
          <Spinner animation='border' role='status' style={{ width: '50px', height: '50px' }} />
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
