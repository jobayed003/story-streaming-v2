import { getAuth } from 'firebase/auth';
import { Suspense, lazy, useContext } from 'react';
import { Route, BrowserRouter as Router, Routes, redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Test } from './components/Dashboard';
import AuthProvider from './context/AuthContext';

const Landing = lazy(() => import('./components/Landing'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Viewing = lazy(() => import('./components/Viewing'));
const Settings = lazy(() => import('./components/Settings'));
const AddContent = lazy(() => import('./components/AddContent'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
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
