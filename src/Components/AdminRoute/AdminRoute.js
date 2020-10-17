import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useState } from 'react';

const AdminRoute = ({children, ...rest}) => {
  const [isAdmin, setIsAdmin] = useState({});
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);



  
  useEffect(() => {
    fetch('http://localhost:8000/isAdmin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: loggedInUser.email })
    })
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data)
        });
}, [])

console.log(isAdmin);



    return (
        <Route
      {...rest}
      render={({ location }) =>
        (isAdmin) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/admin-login",
              state: { from: location }
            }}
          />
        )
      }
    />
    );
};

export default AdminRoute;