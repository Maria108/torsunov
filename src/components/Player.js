import React, { useRef, useState, useCallback, useContext } from 'react';
import ReactWaves, { Regions } from '@dschoon/react-waves';
import './add.css';
import { Context } from '../context';
import { PlayButton } from './PlayButton';

export function Player({
  children,
  mp3,
  options = {
    barGap: 3,
    barWidth: 4,
    barHeight: 2,
    barRadius: 3,
    cursorWidth: 0,
    height: 60,
    hideScrollbar: true,
    progressColor: '#ff7606',
    responsive: true,
    waveColor: '#D1D6DA',
  }
}) {
  const context = useContext(Context);
  const wavesRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  // const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [regions, setRegions] = useState({
    // One: {
    //   id: 'One',
    //   start: 40,
    //   end: 140,
    //   color: 'rgba(100, 149, 240, 0.3)',
    // },
  });
  const onLoading = useCallback(({ wavesurfer, originalArgs = [] }) => {
    if (originalArgs[0] === 100) {
      setWavesurfer(wavesurfer);
    }
  }, []);

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
    const currentZoom = wavesurfer.params.minPxPerSec;
    if (direction === 'in') {
      wavesurfer.zoom(currentZoom + 1);
    } else if (direction === 'out' && currentZoom > 1) {
      wavesurfer.zoom(currentZoom - 1);
    }
  }, [wavesurfer]);

  const handleRegionClick = useCallback((e) => {
    setTimeout(() => {
      wavesurfer.seekTo(secondsToPosition(e.originalArgs[0].start));
    }, 50);
  }, [wavesurfer, secondsToPosition]);



  const handleResetAndToggle = (toggle) => {
    if (toggle) { context.handles.setPlaying(!context.state.playing) }
    else { context.handles.setPlaying(false) }

    if (wavesurfer) {
      wavesurfer.seekTo(0);
    }
  };

  return (

    <>
      <div style={{ zIndex: 0 }}>
        <ReactWaves
          ref={wavesRef}
          audioFile={mp3}
          className={'react-waves'}
          options={{ ...options }}
          volume={1}
          zoom={1}
          pos={pos}
          // playing={context['state']['playing']}
          onPosChange={onPosChange}
          onLoading={onLoading}
        >
          <Regions
            onSingleRegionUpdate={(e) => setRegions({ [e.region.id]: e.region })}
            onRegionClick={handleRegionClick}
            // onRegionOut={() => context.handles.setPlaying(false)}
            regions={regions}
          />
        </ReactWaves>
      </div>
      <div onClick={() => {
        handleResetAndToggle(true)
      }}>
        <div className="x_track_controls">

          <PlayButton />

        </div>
      </div>
    </>

  );
}
