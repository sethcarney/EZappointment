import './Login.css';
import { Form, FormGroup, Input, Label, FormText } from 'reactstrap';
import { useState, useEffect } from "react";
import { GiBrain } from "react-icons/gi";

function Login(props) {
  const { setToken, setUserType, setUserName } = props

  useEffect(() => {
    document.body.style.background = "#252733";
  });

  const [loginState, setLoginState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isProvider, setProvider] = useState(false)
  const [isLoginError, setLoginError] = useState(false)
  const [isRegisterError, setRegisterError] = useState(false)

  function switchLoginState() {
    if(loginState === "login"){
      setLoginState("register")
      setName("")
      setEmail("")
      setPassword("")
      setRegisterError(false)
    }
    else{
      setLoginState("login")
      setEmail("")
      setPassword("")
      setLoginError(false)
    }
  }

  const handleLoginFormSubmission = (e) => {
    if(email && password) {
      e.preventDefault()
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      }
      fetch("http://127.0.0.1:5000/login", options)
      .then(response => {
        if(response.status === 200)
          return response.json()
        if(response.status === 401)
          setLoginError(true)
      })
      .then(data => {
        console.log("This came from the backend: ", data)
        setToken(data.access_token)
        setUserType(data.usertype)
        setUserName(data.username)
      })
      .catch(error => console.log(error))
    }
  }

  const handleRegisterFormSubmission = (e) => {
    if(name && email && password){
      e.preventDefault()
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "name": name,
          "email": email,
          "password": password,
          "usertype": isProvider
        })
      }
      fetch("http://127.0.0.1:5000/addUser", options)
      .then(response => {
        if(response.status === 200) {
          alert("Success!")
          switchLoginState()
        }
        if(response.status === 401) {
          setRegisterError(true)
        }
      })
      .then()
      .catch(error => console.log(error))
    }
  }

  if(loginState === "login") {
    return (
      <>
        <div className="form-container">
          <Form className="form">
            <div className="login-title-container">
              <h3> 
                <GiBrain/>
                <span>MIND</span>MATCH
              </h3>
            </div>
            <h2 className="form-header">
              Welcome!
            </h2>
            <FormGroup>
              <Label className="form-label" for="emailinput">
                Email
              </Label>
              <Input
                required
                id="emailinput"
                name="email"
                value={email}
                placeholder="example@mail.com"
                type="email"
                onChange={(e) => 
                    setEmail(e.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label" for="passwordinput">
                Password
              </Label>
              <Input 
                required
                id="passwordinput"
                name="password"
                value={password}
                placeholder="••••••••"
                type="password"
                onChange={(e) => 
                    setPassword(e.target.value)
                }
              />
            </FormGroup>
            <button type="submit" className="submit-button" onClick={handleLoginFormSubmission}>Login</button>
            { isLoginError && 
                <div className="error-message">*Invalid email/password</div>
            }
            <div className="switch-auth-mode">
              <FormText>
                New User?
              </FormText>
              <button className="login-type-button"
                  onClick={switchLoginState}>Create an account</button>
            </div>
          </Form>
        </div>
      </>
    )
  }
 
  else {
    return (
      <>
        <div className="form-container">
          <Form className="form">
            <div className="login-title-container">
              <h3> 
                <GiBrain/>
                <span>MIND</span>MATCH
              </h3>
            </div>
            <h2 className="form-header">
              Create an account
            </h2>
            <FormGroup>
              <Label className="form-label" for="nameinput">
                Full Name
              </Label>
              <Input
                required
                id="nameinput"
                name="name"
                value={name}
                placeholder="Your name"
                type="text"
                onChange={(e) => 
                    setName(e.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label" for="emailinput">
                Email
              </Label>
              <Input
                required
                id="emailinput"
                name="email"
                value={email}
                placeholder="example@mail.com"
                type="email"
                onChange={(e) => 
                    setEmail(e.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label" for="passwordinput">
                Password
              </Label>
              <Input
                required
                id="passwordinput"
                name="password"
                value={password}
                placeholder="••••••••"
                type="password"
                onChange={(e) => 
                    setPassword(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label className="form-label" for="usertypeinput">
                I am a provider 
              </Label>
              <Input
                id="usertypeinput"
                name="usertype"
                type="checkbox"
                className="checkbox"
                onChange={() => 
                    setProvider(!isProvider)
                }
              />
            </FormGroup>
            <button type="submit" className="submit-button" onClick={handleRegisterFormSubmission}>Sign up</button>
            {
              isRegisterError &&
                <div className="error-message">*An account already exists with this email</div>
            }
            <div className="switch-auth-mode">
              <FormText>
                Already have an account?
              </FormText>
              <button className="login-type-button"
                  onClick={switchLoginState}>Sign in</button>
            </div>
          </Form>
        </div>
      </>
    )
  }

}

export default Login;