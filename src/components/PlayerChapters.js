import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components';
import { Context } from '../context';

export function PlayerChapters(props) {
  const context = useContext(Context);

  const segmentsQuantity = Math.round(100 / context.state['activeSegmentLength']);
  const segmentPercentage = context.state['activeSegmentLength'];

  const handleSegmentClick = (index) => {
    const startTimeInMs = (context.state['audioDuration'] * segmentPercentage * index) / 100;
    const endTimeInMs = startTimeInMs + (context.state['audioDuration'] * segmentPercentage) / 100;
    context.handles['setZoomFragment']([Math.round(startTimeInMs), Math.round(endTimeInMs)]);
  };

  return (
    <div className="x_player_timeline_presets" style={{ top: '0.8em' }}>
      {Array.from({ length: segmentsQuantity }).map((_, index) => (
        <div
          key={`${context.state['mediaId']}_${index}`}
          className="x_player_timeline_one-preset"
          onClick={() => handleSegmentClick(index)}
          style={{ width: `${segmentPercentage}%` }}
        />
      ))}
    </div>
  );
}