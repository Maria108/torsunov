import React, { Fragment, useEffect, useState, useContext } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Context } from '../context';
import { Layout } from './Layout';
import { Start } from './Start';


export function RoutesMain(props) {

  const context = useContext(Context);


  return (
    <>

      <Router>
        <Routes>



          <Route
            path="/:mediaId"
            element={<Layout />}
          />


          <Route
            exact path="/"
            element={
              <Navigate to='/9020231925e711eebf6302420a000003?name=Олег_Геннадьевич_Торсунов_Короткая%20лекция&lang=english' />
            }
          />



        </Routes>


      </Router>
      <img src="https://app.netlify.com/access-control/bb-api/api/v1/badges/21d7ff1d-7d29-402e-8bf6-97ed7fa7fc25/deploy-status" alt="Deploy status badge" height={20} />

    </>
  )
}