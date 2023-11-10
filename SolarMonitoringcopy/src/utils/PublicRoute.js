import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute(props) {
  const { children } = props;
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return children;
  } else {
    return (
      <Navigate
        to={{
          pathname: '/home',
        }}
      />
    );
  }
}

export default PublicRoute;
