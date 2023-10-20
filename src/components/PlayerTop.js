import React, { useState, useCallback, useContext, useEffect, useRef, useLayoutEffect } from 'react';
import ReactWaves, { Regions } from '@dschoon/react-waves';
import './add.css';
import { Context } from '../context';



export function PlayerTop({ children }) {

  const wavesContainerRef = useRef(null);

  const context = useContext(Context);


  const [zoomLevel, setZoomLevel] = useState(1);


  const [wavesurfer, setWavesurfer] = useState(null);

  // const [playing, setPlaying] = useState(false);


  const [pos, setPos] = useState(0);
  const [regions, setRegions] = useState([...context['state']['zoomFragment']]);







  const onLoading = useCallback(({ wavesurfer, originalArgs = [] }) => {

      setWavesurfer(wavesurfer);

      // Get the duration of the audio
      const duration = wavesurfer.getDuration();

      // Calculate container width dynamically
      const containerWidth = wavesContainerRef.current ? wavesContainerRef.current.offsetWidth : 0;

      // Calculate the desired pixels per second
    const desiredPixelsPerSecond = duration > 0 ? containerWidth / duration : 1;


      setZoomLevel(desiredPixelsPerSecond);

  }, [wavesContainerRef]);




  const onPosChange = useCallback((newPos, wavesurfer) => {
    if (newPos !== pos) {
      setPos(newPos);
      setWavesurfer(wavesurfer);
    }
  }, [pos]);

  const secondsToPosition = useCallback((sec) => {
    return 1 / wavesurfer.getDuration() * sec;
  }, [wavesurfer]);

  const zoom = useCallback((direction) => {
    // if (!wavesurfer) return;  // Return early if wavesurfer is not defined

    const currentZoom = wavesurfer.params.minPxPerSec;
    if (direction === 'in') {
      wavesurfer.zoom(currentZoom + 1);
    } else if (direction === 'out' && currentZoom > 1) {
      wavesurfer.zoom(currentZoom - 1);
    }
  }, [wavesurfer]);

  const handleRegionClick = useCallback((e) => {
    setTimeout(() => {
      if (wavesurfer) wavesurfer.seekTo(secondsToPosition(e.originalArgs[0].start));
    }, 50);
  }, [wavesurfer, secondsToPosition]);


  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on('zoom', (zoom) => {
        console.log('Zoom updated to:', zoom);
      });
    }
  }, [wavesurfer]);


  const adjustZoom = () => {
    if (wavesurfer && wavesContainerRef.current) {
      // Get the current width of the container
      const containerWidth = wavesContainerRef.current.offsetWidth;

      // Adjust the zoom based on the container width
      const duration = wavesurfer.getDuration();
      const desiredPixelsPerSecond = duration > 0 ? containerWidth / duration : 1;

      wavesurfer.zoom(desiredPixelsPerSecond);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      adjustZoom();
      if (wavesurfer && typeof wavesurfer.drawBuffer === 'function') {
        wavesurfer.drawBuffer();
      }
    };

    // Add the event listener
    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [wavesurfer, wavesContainerRef]);

  useLayoutEffect(() => {
    adjustZoom();
  }, [wavesurfer, wavesContainerRef]);






  return (
    <div className="x_player0">

      <div className='x_player'>
        {/* <div className="x_player_control">
          <div className="x_player_control_play" onClick={() => setPlaying(!playing)}>
            {playing
              ? <div className="ico ico--40"><div>pause</div></div>
              : <div className="ico ico--40"><div>play_arrow</div></div>}
          </div>
        </div> */}
        <div className="x_player_timeline0" ref={wavesContainerRef}>
          {children}
        <ReactWaves
            audioFile={context.state['mp3']}
          className={'react-waves'}
          //   options={{
          //   height: 100,
          //     hideScrollbar: true,
          //     responsive: true,
          // }}
            volume={0}
            options={{
              // barGap: 3,
              // barWidth: 4,
              barHeight: 2,
              barRadius: 3,
              cursorWidth: 0,
              height: 100,
              hideScrollbar: true,
              progressColor: '#ff7606',
              responsive: true,
              waveColor: '#D1D6DA',
            }}
            zoom={zoomLevel}
            pos={pos}
            // playing={context['state']['playing']}
          // onPosChange={onPosChange}
          // onLoading={onLoading}
        >
          <Regions
            onSingleRegionUpdate={(e) => {
              // console.log('e.region = ', e);
              // console.log('e.region.start = ', e.region.start);
              // console.log('e.region.end = ', e.region.end);

              // setRegions({ [e.region.id]: e.region })
              if (e.region.start !== regions[0] || e.region.end !== regions[1]) {
                setRegions([e.region.start, e.region.end]);
                context.handles['setZoomFragment']([Math.round(e.region.start), Math.round(e.region.end)])
              }
            }}
            onRegionClick={handleRegionClick}
              onRegionOut={() => context.handles.setPlaying(false)}
              regions={
                {
                  // One: {
                  //   id: 'One',
                  //   start: regions[0],
                  //   end: regions[1],
                  //   color: 'rgba(100, 149, 240, 0.3)',
                  // },
                }
              }
          />
          </ReactWaves>
        </div>

        {/* <div className='x_player_view'>
          <div className="x_player_zoom0">
            <div onClick={() => zoom('out')} className="x_player_zoom_button">
              <div className="ico ico--40"><div>zoom_out</div></div>
            </div>
            <div onClick={() => zoom('in')} className="x_player_zoom_button">
              <div className="ico ico--40"><div>zoom_in</div></div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
