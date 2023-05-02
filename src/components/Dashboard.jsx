import { getAuth } from 'firebase/auth';
import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import StateContextProvider from '../context/StateContext';
import VideoContextProvider from '../context/VideoContext';
import { createCheckoutSession } from '../stripe/createCheckoutSession';
import './Dashboard.css';
import Footer from './UI/Footer';
import Header from './UI/Header';
import useLoadingState from './hooks/useLoadingState';
import ListHoverContent from './util/ListHoverContent';
import { getVideoUrls } from './util/videoUtil';
import { getThumbnails } from './util/youtubeUtils';

const Dashboard = () => {
  // Context Management
  const { favouriteVideos, searchedVideos, searchedText } = useContext(StateContextProvider);
  const { seriesVideos } = useContext(VideoContextProvider);

  const trendingVideos = seriesVideos.filter((vid) => vid.type === 'movies');
  const tvShows = seriesVideos.filter((vid) => vid.type === 'tv-shows');

  // Custom Hooks
  const [user] = useAuthState(getAuth());
  const loadingState = useLoadingState();

  // getting the urls
  const trendingVidUrls = getVideoUrls(trendingVideos);
  const tvShowUrls = getVideoUrls(tvShows);
  const favouriteVideoUrls = getVideoUrls(favouriteVideos);
  const searchedVideosUrls = getVideoUrls(searchedVideos);

  // Getting thumbnail from video Urls
  const trendingVidThumbnail = getThumbnails(trendingVidUrls);
  const tvshowsThumbnail = getThumbnails(tvShowUrls);
  const favouriteVidThumbnail = getThumbnails(favouriteVideoUrls);
  const searchedVideosThumbnail = getThumbnails(searchedVideosUrls);

  return (
    <>
      {!user && loadingState}
      {user && (
        <>
          <Header />
          <Container
            as='section'
            id={'videos-container'}
            className='fontFamily hide-scroll'
            style={{ overflow: 'hidden visible', paddingBottom: '8rem' }}
          >
            {/* Searched Videos List */}
            {searchedVideos.length > 0 && (
              <>
                <Row className='mt-5' id='searched-videos'>
                  <Col className='mt-5 text-light'>
                    <h1>Results for {searchedText}</h1>
                  </Col>
                </Row>
                <ListHoverContent videos={searchedVideos} thumbnail={searchedVideosThumbnail} />
              </>
            )}
            {/* Top trending videos list */}

            <Row style={{ marginTop: '8rem' }} id={'top-trending'}>
              <Col className='text-light'>
                <h1>Top Trending</h1>
              </Col>
            </Row>

            <ListHoverContent videos={trendingVideos} thumbnail={trendingVidThumbnail} />

            {/* Favourite Videos List */}
            <Row style={{ marginTop: '8rem' }} id={'my-list'}>
              <Col className='text-light'>
                <h1>My List</h1>
              </Col>
            </Row>

            <ListHoverContent videos={favouriteVideos} thumbnail={favouriteVidThumbnail} />

            <Row className='mt-5' id='tv-shows'>
              <Col className='mt-5 text-light'>
                <h1>TV Shows</h1>
              </Col>
            </Row>

            <ListHoverContent videos={tvShows} thumbnail={tvshowsThumbnail} />
            {/* {tvShows.length <= 0 ? (
              <Row>{status}</Row>
            ) : tvShows.length <= 4 ? (
              <div
                className='d-flex justify-content-start ms-3'
                style={{
                  gap: '4rem',
                  marginLeft: '2.5rem',
                  marginBottom: '4rem',
                  flexWrap: 'wrap',
                }}
              >
                {tvShows.map((el, idx) => (
                  <TvShowCard imgSrc={tvshowsThumbnail[idx]} videoDetails={el} />
                ))}
              </div>
            ) : (
              <Slide>
                {tvShows.map((el, idx) => (
                  <div
                    className='slide'
                    key={Math.random() + idx}
                    style={{ width: size > 500 ? '400px' : '300px' }}
                  >
                    <TvShowCard imgSrc={tvshowsThumbnail[idx]} videoDetails={el} />
                  </div>
                ))}
              </Slide>
            )} */}

            {/* <TvShowCard videos={tvshows} thumbnail={tvshowsThumbnail} /> */}

            <Row className='mt-5' id='movies'>
              <Col className='mt-5 text-light'>
                <h1>Top Movies</h1>
              </Col>
            </Row>

            <Row className='mt-5' id='environment'>
              <Col className='mt-5 text-light'>
                <h1>Environment</h1>
              </Col>
            </Row>
          </Container>
          <Footer />
        </>
      )}
    </>
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
