import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';

import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css'

export const Scroll = ({ children }) => {
  return (
    <ScrollContainer>
      {children}
    </ScrollContainer>
  )
};