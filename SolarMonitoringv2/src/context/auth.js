import React, { useReducer, createContext } from 'react';
import { useContext } from 'react';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
};

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  updateUser: (userData) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        stores: [],
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  function login(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
  }
  function updateUser(userData) {
    let user = JSON.parse(localStorage.getItem('user'));
    let updateUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updateUser));
    dispatch({
      type: 'UPDATE',
      payload: userData,
    });
  }
  function logout() {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        stores: state.stores,
        login,
        logout,
        updateUser,
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
export const useAuthContext = () => {
  return useContext(AuthContext);
};
