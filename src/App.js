import { Suspense, lazy } from 'react';
import { Image, Row } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import logo from './assets/Icons/StorySaloon_Logo.svg';
import Category from './components/pages/Category';
import { Test } from './components/pages/Dashboard';

const Landing = lazy(() => import('./components/pages/Landing'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const Viewing = lazy(() => import('./components/pages/Viewing'));
const Settings = lazy(() => import('./components/pages/Settings'));
const AddContent = lazy(() => import('./components/pages/AddContent'));
const Movies = lazy(() => import('./components/pages/Genres/Movies'));
const TVShows = lazy(() => import('./components/pages/Genres/TVShows'));
const MyList = lazy(() => import('./components/pages/Genres/MyList'));
const Documentary = lazy(() => import('./components/pages/Genres/Documentary'));
const MusicAndPodcast = lazy(() => import('./components/pages/Genres/MusicAndPodcast'));
const Landing2 = lazy(() => import('./components/pages/Landing2'));

const App = () => (
  <Router>
    <Suspense
      fallback={
        <Row className='justify-content-center align-items-center' style={{ height: '100dvh' }}>
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
        <Route path='/categories' element={<Category />} />
        <Route path='/tv-shows' element={<TVShows />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/documentary' element={<Documentary />} />
        <Route path='/music&podcast' element={<MusicAndPodcast />} />
        <Route path='/my-list' element={<MyList />} />
        <Route path='/test' element={<Test />} />
        <Route path='/landing' element={<Landing2 />} />
      </Routes>
    </Suspense>
    <ToastContainer />
  </Router>
);

export default App;
