import Navbar from './Navbar';
import './Availability.css'
import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

function AvailabilityForm(props) {
  const [dataError, setDataError] = useState(false)    

  const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

  useEffect(() => {
    document.body.style.background = "#f9f7f6";
  });

  function handleAvailabilitySubmission(event) {
    event.preventDefault();
    var code = "Bearer " + localStorage.getItem('user_token')
      const options = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": code
      },
        body: JSON.stringify({
          "monday_start" : event.target.form.monday_start.value,
          "monday_end" : event.target.form.monday_end.value,
          "tuesday_start" : event.target.form.tuesday_start.value,
          "tuesday_end" : event.target.form.tuesday_end.value,
          "wednesday_start" : event.target.form.wednesday_start.value,
          "wednesday_end" : event.target.form.wednesday_end.value,
          "thursday_start" : event.target.form.thursday_start.value,
          "thursday_end" : event.target.form.thursday_end.value,
          "friday_start" : event.target.form.friday_start.value,
          "friday_end" : event.target.form.friday_end.value,
          "saturday_start" : event.target.form.saturday_start.value,
          "saturday_end" : event.target.form.saturday_end.value,
          "sunday_start" : event.target.form.sunday_start.value,
          "sunday_end" : event.target.form.sunday_end.value,
          "duration_length" : event.target.form.duration_length.value,
          "numweeks" : event.target.form.numweeks.value,
        })
      }

      fetch("http://127.0.0.1:5000/setSchedule", options)
      .then(response => {
        if(response.status === 200)
          alert("Success! Your availability has been set")
          return response.json()
      })

      .then(data => {
        console.log("This came from the backend: ", data)
        event.target.reset();
      })
      .catch(error => console.log(error))
    }

    return (
      <>   
        <div className="profile-form-container">
          <Form className="profile-form">
            <FormGroup> 
              <h1 className="profile-title">Availablity</h1>
              <hr className="profile-title-line"/>
              <table>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="monday"
                        />
                        Monday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="monday_start"
                        name="monday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="monday_end"
                        name="monday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="tuesday"
                        />
                        Tuesday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="tuesday_start"
                        name="tuesday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="tuesday_end"
                        name="tuesday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="wednesday"
                        />
                        Wednesday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="wednesday_start"
                        name="wednesday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="wednesday_end"
                        name="wednesday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="thursday"
                        />
                        Thursday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="thursday_start"
                        name="thursday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="thursday_end"
                        name="thursday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="friday"
                        />
                        Friday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="friday_start"
                        name="friday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="friday_end"
                        name="friday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="saturday"
                        />
                        Saturday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="saturday_start"
                        name="saturday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="saturday_end"
                        name="saturday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormGroup check>
                      <Label check className="days-label">
                        <Input 
                          type="checkbox"
                          name="sunday"
                        />
                        Sunday
                      </Label>
                      <Input
                        className="time-input"
                        type="time"
                        id="sunday_start"
                        name="sunday_start" 
                      />
                      <span className="time-input-dash">—</span>
                      <Input
                        className="time-input"
                        type="time"
                        id="sunday_end"
                        name="sunday_end" 
                      />
                    </FormGroup>
                  </td>
                </tr>
              </table>
              <FormGroup className="duration">
                <Label>
                  Duration
                </Label>
                <Input
                  className="weeks-input"
                  type="select"
                  id="duration_length"
                  name="duration_length"
                >
                  {range(15, 60, 5).map((x,y) => (
                  <option key={y}>{x}</option> ))}
                </Input>
              </FormGroup>
              <FormGroup className="numWeeks">
                <Label>
                  Weeks
                </Label>
                <Input
                  className="weeks-input"
                  type="number"
                  id="numweeks"
                  name="numweeks"
                  min={0}
                  defaultValue={1}
                />
              </FormGroup>

              <div className="availability-submit-container">
                <button type="submit" name="submit" className="profile-submit-button" onClick={handleAvailabilitySubmission}>Update</button>
                {/* { dataError && 
                    <div className="profile-error-message">*Invalid entry. Check input and try again.</div>
                } */}
              </div>
            </FormGroup>
          </Form>
        </div>   
      </>
    )
}

function Availability(props) {
  useEffect(() => {
      document.body.style.background = "#f9f7f6";
  });

  return (
    <>
      <div id="#availability" className="profile-container">
        <Navbar token={props.token}  setUserType={props.setUserType} setUserName={props.setUserName} setToken={props.setToken} removeToken={props.removeToken} userType={props.userType} userName={props.userName}/>
        <AvailabilityForm token={props.token} setUserName={props.setUserName} userType={props.userType} setToken={props.setToken}/>
      </div>
    </>
  )
}

export default Availability;