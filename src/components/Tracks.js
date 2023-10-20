import React, { useState, useEffect, useContext, useRef } from 'react';

import torsunov1 from '../audio/torsunov.mp3';
import { Player } from './Player';
import { Context } from '../context';
import uniqid from "uniqid";

import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css'
import { Scroll } from './Scroll';



function TracksComponent(props) {

  const context = useContext(Context);

  const trackRef = useRef(null);  // Step 1: Create a ref

  // const [data, setData] = useState([])

  // // useEffect(() => {
  // //   fetch('https://flask.dev.transcribe.torsunov.ru/get_all_data_for_editing?media=829086844a3211eea42102420a000003')

  // //     .then(response => response.json())
  // //     .then(data => {
  // //       if (Array.isArray(data) && data.length > 0) {
  // //         setData(data[0]);
  // //       }
  // //     })
  // //     .catch(error => {
  // //       console.error("Error fetching data: ", error);
  // //     });
  // // }, []);

  const zoomLevel = 30;

  let dragStartX = 0;

  // const handleDragStart = (e, trackId) => {
  //   dragStartX = e.clientX;
  // };

  // const handleOnDrop = (e, trackId) => {
  //   const dragEndX = e.clientX;
  //   const dragDistance = (dragEndX - dragStartX) * zoomLevel;

  //   setData(prevData => {
  //     return prevData.map(track => {
  //       if (track.id === trackId) {
  //         return {
  //           ...track,
  //           start: track.start + dragDistance
  //         };
  //       }
  //       return track;
  //     });
  //   });
  // };


  useEffect(() => {
    // Step 2: Use the ref inside a useEffect to scroll based on audioTime
    if (trackRef.current) {
      const totalTrackWidth = trackRef.current.scrollWidth;
      const relativePosition = context.state.zoomFragment[0] / context.state.audioDuration;
      const newScrollPosition = totalTrackWidth * relativePosition;
      trackRef.current.scrollLeft = newScrollPosition;
    }
  }, [context.state.zoomFragment, context.state.audioDuration]);

  return (
    <div className="c c--bg">
      <div className="width width--100">
        <div className="x_tracks0">

          <div className="x_track"
            ref={trackRef}
          >

            <div className="x_track_playback"
              style={{
                width: context.state['zoomFragment'][0] ? `${context.state['zoomFragment'][0] / zoomLevel}px` : 'auto'
              }}
            />

            {/* <Scroll> */}
            <div
              className='x_track_all_fragments'
              style={{
                width: context.state['audioDuration'] ? `${context.state['audioDuration'] / zoomLevel + 20}px` : 'auto'
              }}>

              {context.state['translationData'].map(oneTrack => (
              <div
                  key={`${context.state['mediaId']}_${oneTrack['id']}`}
                className="x_track_fragment"
                draggable="true"
                // onDragStart={(e) => handleDragStart(e, oneTrack.id)}
                // onDragOver={(e) => e.preventDefault()}  // Required to allow dropping on this element
                // onDrop={(e) => handleOnDrop(e, oneTrack.id)}
                style={{
                  left: oneTrack['start'] / zoomLevel,
                  width: oneTrack['length'] / zoomLevel
                }}
              >
                <Player mp3={`https://flask.dev.transcribe.torsunov.ru/${oneTrack['file']}`}>
                </Player>
                <div className="x_track_cc">
                  {oneTrack['captions']}<br />
                  {/* {oneTrack['file']} */}
                </div>

              </div>
            ))}
            </div>
            {/* </Scroll> */}

          </div>


        </div>
      </div>
    </div>
  );
}


export const Tracks = React.memo(TracksComponent);