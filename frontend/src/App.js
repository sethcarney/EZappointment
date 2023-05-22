import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './Login';
import Home from './Home';
import Token from './Token';
import Profile from './Profile';
import Availability from './Availability';
import Appointments from './Appointments';
import Search from './Search';

function App() {
  const { token, removeToken, setToken } = Token();
  const [ userType, setUserType ] = useState("")
  const [ userName, setUserName ] = useState("")

  useEffect(() => {
    getUserCredentials()
  }, [])

  const getUserCredentials = () => {
    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    }
    if(token !== null && token !== "" && token !== undefined)
    { 
    fetch("http://127.0.0.1:5000/getUserCredentials", options)
    .then(response => {
      if (response.status === 200)
        return response.json()
    })
    .then(data => {
      console.log("This came from the backend: ", data)
      if (data !== undefined) {
        if ("access_token" in data)
          setToken(data.access_token)
        if ("userType" in data)
          setUserType(data.userType)
        if ("userName" in data)
          setUserName(data.userName)
      }
    })
    .catch(error => console.log(error))
  }
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={token && token !== "" && token !== undefined && userName && userName !== "" && userName !== undefined
        && userType && userType !== "" && userType !== undefined?
          (<Navigate replace to={"/home"}   />):
          (<Login setToken={setToken} setUserType={setUserType} setUserName={setUserName}/>)
        }
        />
        <Route path="/home" element={ token && token !== "" && token !== undefined ? 
          (<Home token={token} setToken={setToken} setUserType={setUserType} setUserName={setUserName} removeToken={removeToken} userType={userType}  userName={userName}/>) :
          (<Navigate replace to={"/"} />)
          }
        />
        <Route path="/profile" element={ token && token !== "" && token !== undefined ? 
          (<Profile token={token}  setUserType={setUserType} setUserName={setUserName}  setToken={setToken} removeToken={removeToken} userType={userType} userName={userName}/>) :
          (<Navigate replace to={"/"} />)
          }
        />
        <Route path="/availability" element={ token && token !== "" && token !== undefined ? 
          (<Availability token={token}  setUserType={setUserType} setUserName={setUserName}  setToken={setToken} removeToken={removeToken} userType={userType} userName={userName}/>) :
          (<Navigate replace to={"/"} />)
          }
        />
        <Route path="/appointments" element={ token && token !== "" && token !== undefined ? 
          (<Appointments token={token}  setUserType={setUserType} setUserName={setUserName} setToken={setToken} removeToken={removeToken} userType={userType} userName={userName}/>) :
          (<Navigate replace to={"/"} />)
          }
        />
        <Route path="/search" element={ token && token !== "" && token !== undefined ? 
          (<Search token={token}  setUserType={setUserType} setUserName={setUserName} setToken={setToken} removeToken={removeToken} userType={userType} userName={userName}/>) :
          (<Navigate replace to={"/"} />)
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
