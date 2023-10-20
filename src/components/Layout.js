import React, { Fragment, useEffect, useState, useContext, useParams } from 'react'
import { Link, withRouter, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components';
import { Head } from './Head';
import { PlayerMain } from './PlayerMain';
import { Context } from '../context';

import { Tracks } from './Tracks';

import PlayerScrubbr from './PlayerScrubbr';
import { PlayerTop } from './PlayerTop';
import { Preloader } from './Preloader';
import { Start } from './Start';

export function LayoutComponent() {
  const context = useContext(Context);


  // const { mediaId } = useParams();
  const location = useLocation();
  const mediaId = location.pathname.split('/')[1];

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');
  const lang = queryParams.get('lang');


  useEffect(() => {
    if (mediaId && context.state['mediaId'] !== mediaId) {
      context.handles.setMediaId(mediaId)
      context.handles.setName(name)
      context.handles.setLang(lang)
    }
  }, [mediaId])



  return (
    <>

      <Start />

      <Head />

      {!context.state['mp3'] && <Preloader />}

      {context.state['mp3'] && <>
        <PlayerTop>

        <PlayerScrubbr />
      </PlayerTop>


        <PlayerMain />

        <Tracks />
      </>}

      <p>
      X1: {context.state['zoomFragment'][0]}&nbsp;|&nbsp;
      X2: {context.state['zoomFragment'][1]}&nbsp;|&nbsp;
        Length: {context.state['audioDuration']}&nbsp;|&nbsp;
        MediaId: {context.state['mediaId']}</p>
    </>
  )
}

export const Layout = React.memo(LayoutComponent);