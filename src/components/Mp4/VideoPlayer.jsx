import React from 'react';
import { Player, ControlBar } from 'video-react';
//import 'video-react/styles/scss/video-react.scss';

export function MyVideoPlayer()  {
  return (
    <Player autoPlay src="./splash-4.mp4">
      <ControlBar autoHide={false} className="my-class" />
    </Player>
  );
};