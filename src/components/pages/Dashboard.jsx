import { getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import StateContextProvider from '../../context/StateContext';
import VideoContextProvider from '../../context/VideoContext';
import { createCheckoutSession } from '../../stripe/createCheckoutSession';
import Footer from '../UI/Footer';
import Header from '../UI/Header';
import useLoadingState from '../hooks/useLoadingState';
import CardContainer from '../util/CardContainer';
import './Dashboard.css';

const Dashboard = () => {
  // Context Management
  const { favouriteVideos, searchedVideos, searchedText } = useContext(StateContextProvider);
  const { seriesVideos } = useContext(VideoContextProvider);

  const trendingVideos = seriesVideos.filter((vid) => vid.type === 'others');
  const tvShows = seriesVideos.filter((vid) => vid.type === 'tv-shows');
  const movies = seriesVideos.filter((vid) => vid.type === 'movies');
  const environment = seriesVideos.filter((vid) => vid.type === 'environment');

  // Custom Hooks
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  const rowStyle = { marginTop: '8rem', scrollMargin: '8rem' };

  return (
    <Container as='main'>
      {!user && loadingState}
      {user && (
        <>
          <Header />
          <Container
            as='section'
            id={'videos-container'}
            className='custom_font hide-scroll'
            style={{ overflow: 'hidden visible', paddingBottom: '8rem' }}
          >
            {/* Searched Videos List */}
            {searchedText !== '' && (
              <>
                <Row className='mt-5' id='searched-videos'>
                  <Col className='mt-5 text-light'>
                    <h1>Results for "{searchedText}"</h1>
                  </Col>
                </Row>
                <CardContainer videos={searchedVideos} />
              </>
            )}
            {/* Top trending videos list */}

            <Row style={{ ...rowStyle }} id={'top-trending'}>
              <Col className='text-light'>
                <h1>Top Trending</h1>
              </Col>
            </Row>

            <CardContainer videos={trendingVideos} />

            {/* Favourite Videos List */}
            <Row style={{ ...rowStyle }} id={'my-list'}>
              <Col className='text-light'>
                <h1>My List</h1>
              </Col>
            </Row>

            <CardContainer videos={favouriteVideos} />

            {/* TV SHOWS LIST */}
            <Row style={{ ...rowStyle }} id='tv-shows'>
              <Col className='text-light'>
                <h1>TV Shows</h1>
              </Col>
            </Row>

            <CardContainer videos={tvShows} />

            {/* TOP MOVIES LIST */}
            <Row style={{ ...rowStyle }} id='movies'>
              <Col className='mt-5 text-light'>
                <h1>Top Movies</h1>
              </Col>
            </Row>
            <CardContainer videos={movies} />

            {/* ENVIRONMENT LIST */}
            <Row style={{ ...rowStyle }} id='environment'>
              <Col className='mt-5 text-light'>
                <h1>Environment</h1>
              </Col>
            </Row>
            <CardContainer videos={environment} />
          </Container>
          <Footer />
        </>
      )}
    </Container>
  );
};

export default Dashboard;

export const Test = () => {
  const [user, userLoading] = useAuthState(getAuth());

  return (
    <div>
      {user && !userLoading && (
        <>
          <h1>Hello, {user.displayName}</h1>
          <button onClick={() => createCheckoutSession(user.uid)}>Upgrade to premium!</button>
        </>
      )}
    </div>
  );
};
