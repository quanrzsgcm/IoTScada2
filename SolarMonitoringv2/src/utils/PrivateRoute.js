import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth';

export default function PrivateRoute(props) {
  const { children } = props;
  const { user } = useAuthContext();
  if (user) {
    return children;
  } else {
    return (
      <Navigate
        to={{
          pathname: '/',
        }}
      />
    );
  }
}
