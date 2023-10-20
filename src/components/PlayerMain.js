import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import ReactWaves, { Regions } from '@dschoon/react-waves';
import { Context } from '../context';

export function PlayerMain({ mp3 }) {
  const wavesContainerRef = useRef(null);
  const context = useContext(Context);

  const [wavesurfer, setWavesurfer] = useState(null);
  // const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  const onLoading = useCallback(({ wavesurfer }) => {
    setWavesurfer(wavesurfer);
    const duration = wavesurfer.getDuration(); // in seconds

    // Extract zoom fragment from context
    const [startTime, endTime] = context.state['zoomFragment'].map(time => time / 1000); // Convert to seconds
    const fragmentDuration = endTime - startTime;

    if (duration > 0 && fragmentDuration > 0) {
      const containerWidth = wavesContainerRef.current ? wavesContainerRef.current.offsetWidth : 0;
      const pixelsPerSecondForFragment = containerWidth / fragmentDuration;
      wavesurfer.zoom(pixelsPerSecondForFragment);
      wavesurfer.seekTo(startTime / duration);
    }
  }, [wavesContainerRef, context.state['zoomFragment']]);

  const onPosChange = useCallback((newPos, wavesurfer) => {
    if (newPos !== pos) {
      setPos(newPos);
    }
  }, [pos]);


  useEffect(() => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration(); // in seconds
      const [startTime, endTime] = context.state['zoomFragment'].map(time => time / 1000); // Convert to seconds
      const fragmentDuration = endTime - startTime;

      if (duration > 0 && fragmentDuration > 0) {
        const containerWidth = wavesContainerRef.current ? wavesContainerRef.current.offsetWidth : 0;
        const pixelsPerSecondForFragment = containerWidth / fragmentDuration;
        wavesurfer.zoom(pixelsPerSecondForFragment);

        // Adjusting starting position
        const zoomStartInSeconds = startTime;
        const relativePosition = zoomStartInSeconds / duration;
        if (relativePosition >= 0 && relativePosition <= 1) {
          wavesurfer.seekTo(relativePosition);
        }

        // Adjusting scroll position
        if (wavesContainerRef.current) {
          const totalWaveformWidth = wavesContainerRef.current.scrollWidth;
          const newScrollPosition = totalWaveformWidth * relativePosition;
          wavesContainerRef.current.scrollLeft = newScrollPosition;
        }
      }

      // wavesurfer.on('audioprocess', (time) => {
      //   context.handles.setPlaybackTime(time);
      // });

    }
  }, [wavesurfer, context.state['zoomFragment'], context.state['audioDuration']]);



  return (
    <div className="x_player0 x_player0--100">
      <div className='x_player'>

        {/* <div className="x_player_control">
          <div className="x_player_control_play" onClick={() => setPlaying(!playing)}>
            {playing
              ? <div className="ico ico--40"><div>pause</div></div>
              : <div className="ico ico--40"><div>play_arrow</div></div>}
          </div>
        </div> */}

        <div className="" ref={wavesContainerRef}
          style={{
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          <ReactWaves
            audioFile={context.state['mp3']}
            className={'react-waves'}
            options={{
              barGap: 3,
              barWidth: 4,
              barHeight: 2,
              barRadius: 3,
              cursorWidth: 0,
              height: 100,
              hideScrollbar: true,
              progressColor: '#ff7606',
              responsive: true,
              waveColor: '#D1D6DA',
            }}
            volume={0.5}
            pos={pos}
            playing={context['state']['playing']}
            onPosChange={onPosChange}
            onLoading={onLoading}
          >
            <Regions
              regions={{}}
            />
          </ReactWaves>
        </div>
      </div>
    </div>
  );
}
