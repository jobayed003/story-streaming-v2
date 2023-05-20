import { getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import StateContextProvider from '../../context/StateContext';
import VideoContextProvider from '../../context/VideoContext';
import { createCheckoutSession } from '../../stripe/createCheckoutSession';
import Layout from '../UI/Layout';
import CardContainer from '../VideoCards/CardContainer';
import useLoadingState from '../hooks/useLoadingState';
import './Dashboard.css';

const Dashboard = () => {
  // Context Management
  const { favouriteVideos, searchedVideos, searchedText } = useContext(StateContextProvider);
  const { seriesVideos, tvShows, movies } = useContext(VideoContextProvider);

  // Custom Hooks
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  const rowStyle = { marginTop: '9rem', scrollMargin: '8rem' };

  return (
    <>
      {!user && loadingState}
      {user && (
        <Layout>
          <Container
            as='section'
            id={'videos-container'}
            className='fontMagneto hide-scroll'
            style={{ overflow: 'hidden visible', paddingBottom: '20vh' }}
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
            <CardContainer videos={seriesVideos} />

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
          </Container>
        </Layout>
      )}
    </>
  );
};

export default Dashboard;
