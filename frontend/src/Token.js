/*
Courtesy of:

Author: Faruq Abdulsalam
Date: 12/21/2021
Publisher: dev.to
Link: https://dev.to/nagatodev/how-to-add-login-authentication-to-a-flask-and-react-application-23i7
*/

import { useState } from 'react';

function Token() {

  function getToken() {
    const userToken = localStorage.getItem('user_token');
    return userToken && userToken
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem('user_token', userToken);
    setToken(userToken);
  };

  function removeToken() {
    localStorage.removeItem("user_token");
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
    removeToken
  }

}

export default Token;