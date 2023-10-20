import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components';

export function Preloader(props) {
  return (
    <>
      <Preloader0>
        <PreloaderGif />
        Загрузка...
      </Preloader0>
      {/* <div className="">
        Loading...
      </div> */}
    </>
  )
}



export const Preloader0 = styled.div`
  height: ${({ height }) => (height ? height : "40svh")};
  display: flex;
  z-index: 100;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // row-gap: 1em;
`;

export const PreloaderGif = styled.div`
  height: 80px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://res.cloudinary.com/du6naw4zf/image/upload/v1697827495/misha/Spinner-1.5s-244px_v98d12.gif');
  background-repeat: no-repeat;
  background-size: 200%;
  background-position: 50% 50%;
`;
