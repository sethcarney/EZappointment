import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import './Profile.css';
import { FaRegEdit } from 'react-icons/fa';


function ProfileForm(props) {
    const [submit, setSubmit] = useState(false)
    const [dataError, setDataError] = useState(false)    
    const credentialsList = ["LCPC", "LMHC", "LPC", "MD", "NP", "PHD", "PsyD"]
    const specialtiesList = [
        "Anger Management", "Anxiety Disorders", "Eating Disorders", 
        "Mood Disorders", "Personality Disorders", "Post-traumatic stress (PTSD)", 
        "Psychotic Disorders", "Relationships"
    ];
    const statesList = ["AL", "AK", "AZ", "AR", "AS", "CA", "CO", "CT", "DE", "DC", "FL",
        "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
        "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH",
        "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "TT", "UT", "VT", "VA", "VI",
        "WA", "WV", "WI", "WY"]
    const genderList = ["Male", "Female", "Prefer not to say", "Other"]

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [biography, setBiography] = useState("")
    const [state, setState] = useState("")
    const [gender, setGender] = useState("")
    const [LCPC, setLCPC] = useState(false)
    const [LMHC, setLMHC] = useState(false)
    const [LPC, setLPC] = useState(false)
    const [MD, setMD] = useState(false)
    const [NP, setNP] = useState(false)
    const [PHD, setPHD] = useState(false)
    const [PsyD, setPsyD] = useState(false)
    const [AngerManagementSpecialty, setAngerManagementSpecialty] = useState(false)
    const [AnxietySpecialty, setAnxietySpecialty] = useState(false)
    const [EatingSpecialty, setEatingSpecialty] = useState(false)
    const [MoodSpecialty, setMoodSpecialty] = useState(false)
    const [PersonalitySpecialty, setPersonalitySpecialty] = useState(false)
    const [PTSDSpecialty, setPTSDSpecialty] = useState(false)
    const [PsychoticSpecialty, setPsychoticSpecialty] = useState(false)
    const [RelationshipSpecialty, setRelationshipSpecialty] = useState(false)
    
    //Get a user's data on profile component render
    useEffect(() => {
        loadProfileData()
    }, [])

    function loadProfileData()
    {
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.token
            }
        }
        fetch("http://127.0.0.1:5000/profile", options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log("This came from the backend: ", data)
            
            // check if new token was returned
            if (data.length === 21)
            {
                props.setToken(data[data.length - 1])
                console.log("New token: ", props.token)
            }

            setEmail(data[0])
            setName(data[1])
            setBiography(data[2] === null ? "" : data[2])
            setState(data[3] === null ? "" : data[3])
            setGender(data[4] === null ? "" : data[4])
            setLCPC(data[5])
            setLMHC(data[6])
            setLPC(data[7])
            setMD(data[8])
            setNP(data[9])
            setPHD(data[10])
            setPsyD(data[11])
            setAngerManagementSpecialty(data[12])
            setAnxietySpecialty(data[13])
            setEatingSpecialty(data[14])
            setMoodSpecialty(data[15])
            setPersonalitySpecialty(data[16])
            setPTSDSpecialty(data[17])
            setPsychoticSpecialty(data[18])
            setRelationshipSpecialty(data[19])
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        handleProfileFormSubmission()
    }, [submit])


    const checkSubmittedData = (e) => {
      e.preventDefault()
      if(name === "" || name === undefined) {
        setDataError(true)
        setSubmit(false)
        return;
      }

      if(!statesList.includes(state)) {
        setDataError(true)
        setSubmit(false)
        return;
      }

      if(!genderList.includes(gender)) {
        setDataError(true)
        setSubmit(false)
        return;
      }
      
      setDataError(false)
      setSubmit(true)
      alert("Success! Your profile has been set")
    }

    const handleProfileFormSubmission = () => {
      if(submit && !dataError) {
        const options = {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + props.token
          },
          body: JSON.stringify({
            "email": email,
            "name": name,
            "password": password,
            "biography": biography,
            "state": state,
            "gender": gender,
            "LCPC": LCPC,
            "LMHC": LMHC,
            "LPC": LPC,
            "MD": MD,
            "NP": NP,
            "PHD": PHD,
            "PsyD": PsyD,
            "AngerManagementSpecialty": AngerManagementSpecialty,
            "AnxietySpecialty": AnxietySpecialty,
            "EatingSpecialty": EatingSpecialty,
            "MoodSpecialty": MoodSpecialty,
            "PersonalitySpecialty": PersonalitySpecialty,
            "PTSDSpecialty": PTSDSpecialty,
            "PsychoticSpecialty": PsychoticSpecialty,
            "RelationshipSpecialty": RelationshipSpecialty
          })
        }

      fetch("http://127.0.0.1:5000/setProfile", options)
        .then(response => {
          if(response.status === 200)
            return response.json()
        })
        .then(data => {
          console.log("This came from the backend: ", data)
          setPassword("")
          props.setUserName(name)
          setSubmit(false)
        })
        .catch(error => console.log(error))
      }

      else {
        return;
      }
    }

    const getChecked = (arg) => {
      if(arg === "LCPC")
          return LCPC
      if(arg === "LMHC")
          return LMHC
      if(arg === "LPC")
          return LPC
      if(arg === "MD")
          return MD
      if(arg === "NP")
          return NP
      if(arg === "PHD")
          return PHD
      if(arg === "PsyD")
          return PsyD
      if(arg === "Anger Management")
          return AngerManagementSpecialty
      if(arg === "Anxiety Disorders")
          return AnxietySpecialty
      if(arg === "Eating Disorders")
          return EatingSpecialty
      if(arg === "Mood Disorders")
          return MoodSpecialty
      if(arg === "Personality Disorders")
          return PersonalitySpecialty
      if(arg === "Post-traumatic stress (PTSD)")
          return PTSDSpecialty
      if(arg === "Psychotic Disorders")
          return PsychoticSpecialty
      if(arg === "Relationships")
          return RelationshipSpecialty
    }

    const handleCheck = (arg) => {
      if(arg === "LCPC")
        setLCPC(!LCPC)
      if(arg === "LMHC")
        setLMHC(!LMHC)
      if(arg === "LPC")
        setLPC(!LPC)
      if(arg === "MD")
        setMD(!MD)
      if(arg === "NP")
        setNP(!NP)
      if(arg === "PHD")
        setPHD(!PHD)
      if(arg === "PsyD")
        setPsyD(!PsyD)
      if(arg === "Anger Management")
        setAngerManagementSpecialty(!AngerManagementSpecialty)
      if(arg === "Anxiety Disorders")
        setAnxietySpecialty(!AnxietySpecialty)
      if(arg === "Eating Disorders")
        setEatingSpecialty(!EatingSpecialty)
      if(arg === "Mood Disorders")
        setMoodSpecialty(!MoodSpecialty)
      if(arg === "Personality Disorders")
        setPersonalitySpecialty(!PersonalitySpecialty)
      if(arg === "Post-traumatic stress (PTSD)")
        setPTSDSpecialty(!PTSDSpecialty)
      if(arg === "Psychotic Disorders")
        setPsychoticSpecialty(!PsychoticSpecialty)
      if(arg === "Relationships")
        setRelationshipSpecialty(!RelationshipSpecialty)
    }

    return (
        <>
          <div className="profile-form-container">
            <Form className="profile-form">
              <FormGroup>
                <h1 className="profile-title">Profile</h1>
                <hr className="profile-title-line"/>
                <Label className="profile-form-label" for="nameinput">
                  Name<span className="required">*</span>
                </Label>
                <Input
                  required
                  className="input"
                  id="nameinput"
                  name="name"
                  value={name}
                  type="text"
                  onChange={(e) => {
                      setName(e.target.value)
                    }
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label className="profile-form-label" for="passwordinput">
                  Password
                </Label>
                <Input 
                  className="input"
                  id="passwordinput"
                  name="password"
                  value={password}
                  type="password"
                  onChange={(e) => 
                      setPassword(e.target.value)
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label className="profile-form-label" for="bioinput">
                  About me
                </Label>
                <textarea
                  className="input"
                  id="bioinput"
                  name="bio"
                  value={biography}
                  rows="5"
                  onChange={(e) => {
                      setBiography(e.target.value)
                    }
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label className="profile-form-label" for="stateinput">
                  State<span className="required">*</span>
                </Label>
                <Input
                  required
                  className="input state-input"
                  id="stateinput"
                  name="state"
                  value={state}
                  type="text"
                  list="states"
                  maxLength={2}
                  onChange={(e) => {
                      setState(e.target.value.toUpperCase())
                    }
                  }
                />
                <datalist id="states">
                    {statesList.map((state) => (
                    <option key={state} value={state} />
                    ))}
                </datalist>
              </FormGroup>
              <FormGroup>
                <Label className="profile-form-label" for="genderinput">
                  Gender<span className="required">*</span>
                </Label>
                <Input
                  style={{ width: '200px' }}
                  required
                  className="input state-input"
                  id="genderinput"
                  name="gender"
                  value={gender}
                  type="select"
                  onChange={(e) => {
                      setGender(e.target.value)
                    }
                  }
                >
                <option value="">-Select One-</option>
                {genderList.map((gender) => (
                    <option key={gender} value={gender}>
                        {gender}
                    </option>
                ))}
                </Input>
              </FormGroup>
              { props.userType === "Provider" &&
              <FormGroup>
                <Label className="profile-form-label">
                  Credentials
                </Label>
                {credentialsList.map((item, index) => (
                    <div key={index}>
                        <input value={item} type="checkbox" checked={getChecked(item)} onChange={() => handleCheck(item)}/>
                        <span className="checkbox-item" style={{color: "#252733"}}>{item}</span>
                    </div>
                ))}
              </FormGroup>
              }
              { props.userType === "Provider" &&
              <FormGroup>
                <Label className="profile-form-label">
                  Specializations
                </Label>
                {specialtiesList.map((item, index) => (
                    <div key={index}>
                        <input value={item} type="checkbox" className="checkbox" checked={getChecked(item)} onChange={() => handleCheck(item)} />
                        <span className="checkbox-item" style={{color: "#252733"}}>{item}</span>
                    </div>
                ))}
              </FormGroup>
              }
              <div className="profile-submit-container">
                <button type="submit" className="profile-submit-button" onClick={checkSubmittedData}>Update</button>
                { dataError && 
                    <div className="profile-error-message">*Invalid entry. Check input and try again.</div>
                }
              </div>
            </Form>
          </div>
        </>
      )
}


function Profile(props) {
    useEffect(() => {
        document.body.style.background = "#f9f7f6";
    });

    return (
      <>
        <div id="#profile" className="profile-container">
          <Navbar token={props.token}  setUserType={props.setUserType} setUserName={props.setUserName} setToken={props.setToken} removeToken={props.removeToken} userType={props.userType} userName={props.userName}/>
          <ProfileForm token={props.token} setUserName={props.setUserName} userType={props.userType} setToken={props.setToken}/>
        </div>
      </>
    )
}

export default Profile;