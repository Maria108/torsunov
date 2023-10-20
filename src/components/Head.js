import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components';
import { Context } from '../context';
import { PlayButton } from './PlayButton';

const languages = {
  'english': {
    title: 'английский'
  }
}

export function Head(props) {
  const context = useContext(Context);
  const fixName = (name) => {
    if (name && typeof name === 'string') {
      name = name.replaceAll('_', ' ')
      return name
    } else {
      return 'Лекция без имени'
    }
  }
  const fixLang = (lang) => {
    return lang ? `перевод на ${languages[lang]['title']}` : ''
  }
  return (
    <>
      <div className="x_head0">
        <div className="x_head_l">
          <div className="x_head_logo">
            <PlayButton enter={true} />
            {/* <div className="x_head_logo_logo">
              <div>💬</div>
            </div> */}
            &nbsp;
            <div className="x_head_logo_text">{fixName(context.state['name'])}</div>
            <div className="x_head_logo_lang">{fixLang(context.state['lang'])}</div>
          </div>
          <div className='x_head_center'>

          </div>
        </div>
        <div className="x_head_r" />
      </div>

    </>
  )
}