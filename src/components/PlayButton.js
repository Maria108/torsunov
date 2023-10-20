import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components';
import { Context } from '../context';

export function PlayButton({ enter = false }) {
  const context = useContext(Context);

  useEffect(() => {
    if (enter) {
      const handleKeyPress = (e) => {
        if (e.key === " ") { // Spacebar key
          context.handles.setPlaying(!context.state.playing);
        }
      }
      document.addEventListener('keydown', handleKeyPress);

      // Clean up the event listener when the component is unmounted
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      }
    }
  }, [enter, context]);

  return (
    <>
      <div className="x_player_control_play" onClick={() => context.handles.setPlaying(!context.state.playing)}>
        <div className="ico ico--40">
          {!context['state']['playing'] && <div>play_arrow</div>}
          {context['state']['playing'] && <div>pause</div>}
        </div>
      </div>
    </>
  )
}
