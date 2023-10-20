import React, { useContext, useEffect, useState, useRef } from 'react';
import { Context } from '../context';
import { PlayerChapters } from './PlayerChapters';

export default function PlayerScrubbr() {
  const context = useContext(Context);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const scrubberRef = useRef(null);

  const handleMouseDown = (event) => {
    setDragging(true);
    setStartX(event.clientX);
  };

  const handleMouseMove = (event) => {
    if (!dragging) return;

    if (scrubberRef.current && context.state['audioDuration']) {
      const scrubberTotalWidth = scrubberRef.current.offsetWidth;
      const segmentDurationInMs = (context.state['audioDuration'] * context.state['activeSegmentLength']) / 100;
      const width = (scrubberTotalWidth * segmentDurationInMs) / context.state['audioDuration'];

      const deltaX = event.clientX - startX;
      let newX = x + deltaX;

      if (newX < 0) newX = 0;
      if (newX + width > scrubberTotalWidth) newX = scrubberTotalWidth - width;
      setX(newX);
      setStartX(event.clientX);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  useEffect(() => {
    if (scrubberRef.current && context.state['audioDuration']) {
      const scrubberTotalWidth = scrubberRef.current.offsetWidth;
      const positionRatio = context.state['zoomFragment'][0] / context.state['audioDuration'];
      const newStartX = positionRatio * scrubberTotalWidth;
      setX(newStartX);
      setStartX(newStartX);
    }
  }, [context.state['zoomFragment']]);

  useEffect(() => {
    if (scrubberRef.current && context.state['audioDuration']) {
      const scrubberTotalWidth = scrubberRef.current.offsetWidth;
      const segmentDurationInMs = (context.state['audioDuration'] * context.state['activeSegmentLength']) / 100;
      const width = (scrubberTotalWidth * segmentDurationInMs) / context.state['audioDuration'];

      const positionRatio = x / scrubberTotalWidth;
      const startTimeInMs = positionRatio * context.state['audioDuration'];

      const widthRatio = width / scrubberTotalWidth;
      const scrubberDurationInMs = widthRatio * context.state['audioDuration'];
      const endTimeInMs = startTimeInMs + scrubberDurationInMs;

      if (context.state['zoomFragment'][0] !== startTimeInMs) {
        context.handles['setZoomFragment']([Math.round(startTimeInMs), Math.round(endTimeInMs)]);
      }
    }
  }, [x, context.state['activeSegmentLength'], context.state['audioDuration']]);

  function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="x_player_timeline_scrubber" ref={scrubberRef}>

      <PlayerChapters />

      <div className="x_player_timeline_select0" onMouseDown={handleMouseDown} style={{ top: '0.8em', left: x, width: `${context.state['activeSegmentLength']}%` }}>
        <div className="x_player_timeline_select" style={{ width: `100%` }}></div>
        <div className="x_player_timeline_select_time">
          <div>{msToTime(context.state['zoomFragment'][0])}</div>
          <div>–</div>
          <div>{msToTime(context.state['zoomFragment'][1])}</div>
        </div>
      </div>


    </div>
  );
}
