import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './dist/fontawesome.min.css';
import './index.css';

import App from './App';
import { AuthContext } from './context/AuthContext';
import { StateContext } from './context/StateContext';
import { VideoContext } from './context/VideoContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContext>
    <VideoContext>
      <StateContext>
        <App />
      </StateContext>
    </VideoContext>
  </AuthContext>
);
