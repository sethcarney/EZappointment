import Navbar from './Navbar';
import { useState, useEffect } from "react";
import './Appointments.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { HiPencil } from "react-icons/hi2";

function EditFields({ setLocation, setNotes, setDidSubmit }) {
  const [apptLocation, setApptLocation] = useState("")
  const [apptNotes, setApptNotes] = useState("")

  function updateFields() {
    setLocation(apptLocation)
    setNotes(apptNotes)
    setDidSubmit(true)
    alert("Success! The details have been updated")
  }
  return (
    <>
      <div className='location-container'>
        <Label className="location-form-label" for="locationinput">
          Location
        </Label>
        <Input
          className='input-field'
          id="locationinput"
          key={"input-location"}
          type="text"
          name='location-input'
          value={apptLocation}
          maxLength={100}
          onChange={(e) => setApptLocation(e.target.value)}
        />
      </div>
      <div className='notes-container'>
        <Label className="location-form-label" for="notesinput">
          Appointment Notes
        </Label>
        <textarea 
          className='input-field'
          id="notesinput"
          key={"input-notes"}
          rows="3"
          name='notes-input'
          value={apptNotes}
          maxLength={200}
          onChange={(e) => setApptNotes(e.target.value)}
        />
      </div>
      <div className="appointment-info-submit-container">
        <button type="submit" className="profile-submit-button" onClick={() => updateFields()}>Update</button>
      </div>
    </>
  )
}


function Appointments(props) {
  const [appointments, setAppointments] = useState()
  const [selectedAppointment, setSelectedAppointment] = useState()
  const events = []
  const localizer = momentLocalizer(moment)
  const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [editClick, setEditClick] = useState(false)
  const [didSubmit, setDidSubmit] = useState(false)

  useEffect(() => {
    document.body.style.background = "#f9f7f6";
  });

  useEffect(() => {
    loadAppointmentData()

    //refreshing bookings every minute (60,000 milliseconds)
    const interval = setInterval(() => {
      loadAppointmentData()
    }, 60000);

    return () => clearInterval(interval);

  }, [])

  const loadAppointmentData = () => {
    //clear events
    events.splice(0, events.length)

    const options = {
      method: 'GET',
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + props.token
      }
    }
    fetch("http://127.0.0.1:5000/getSchedule", options)
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log("This came from the backend: ", data)

      if (data !== undefined) {
        for (let i = 0; i < data.length; i++) {
          events.push({
            id: data[i][0],
            start:moment(data[i][1]).toDate(),
            end:moment(data[i][2]).toDate(),
            title: props.userType === "Patient" ? data[i][5] : data[i][4],
            location: data[i][7],
            notes: data[i][8]
          })
      }

      setAppointments(events)
    }
    })
    .catch(error => console.log(error))
  }

  const getAppointmentIndex = () => {
    for(let i = 0; i < appointments.length; i++) {
      if (appointments[i].id === selectedAppointment.id) {
        return i
      }
    }
  }

  function editAppointment() {
    setEditClick(true)
  }

  function deleteAppointment() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + props.token
      },
      body: JSON.stringify({
        "id": selectedAppointment.id
      })
    }
    fetch("http://127.0.0.1:5000/cancelAppointment", options)
    .then(response => {
        alert("Success! Your appointment has been cancelled")
        return response.json()
    })
    .then(data => {
      console.log("This came from the backend: ", data)

      //refresh appointments list
      const index = getAppointmentIndex()
      const updated_appointments = appointments
      updated_appointments.splice(index, 1)
      setAppointments(updated_appointments)

      //hide details view
      setSelectedAppointment(undefined)
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    if (didSubmit) {
      console.log("Calling update function")
      updateAppointmentInformation()
      setDidSubmit(false)
    }
  }, [didSubmit])

  function updateAppointmentInformation() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + props.token
      },
      body: JSON.stringify({
        "id": selectedAppointment.id,
        "location": location === "" || location === undefined ? "N/A" : location,
        "notes": notes === "" || notes === undefined ? "N/A" : notes
      })
    }
    fetch("http://127.0.0.1:5000/editAppointment", options)
    .then(response => {
        return response.status
    })
    .then(data => {
      console.log("This came from the backend: ", data)

      if(data === 200) //successful update 
      {
        //refresh appointments list
        const index = getAppointmentIndex()
        const updated_appointments = appointments
        updated_appointments[index].location = location === "" || location === undefined ? "N/A" : location
        updated_appointments[index].notes = notes === "" || notes === undefined ? "N/A" : notes
        setAppointments(updated_appointments)

        //hide details view
        setSelectedAppointment(undefined)
        setEditClick(false)
        setLocation("")
        setNotes("")
      }
    })
    .catch(error => console.log(error))
  }

  function changeSelectedAppointment(event) {
    setEditClick(false)
    setSelectedAppointment(event)
    setLocation("")
    setNotes("")
  }


  function AppointmentsView(props) {
    return (
      <>
        <div className='profile-form-container'>
          <div className='profile-form'>
            <h1 className='profile-title'>Appointments</h1>
            <hr className="profile-title-line"/>
            <div className='calendar-container'>
              <Calendar
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                events={appointments}
                selected={selectedAppointment}
                onSelectEvent={(event) => changeSelectedAppointment(event)}
                style={{ height: 800 }}
              />
            </div>
            
            { selectedAppointment !== undefined &&
              <>
              <div className='appointment-info-container'>
                <div className="edit-appointment">
                  <div className='appointment-info-header'>Details</div>
                  { props.userType === "Provider" &&
                    <button className='edit-appointment-button' onClick={() => editAppointment()}>
                      <HiPencil size={21} />
                    </button>
                  } 
                </div>
                  <div className='appointment-info'>
                    { props.userType === "Patient" &&
                      <div className="appointment-styling">
                        <span className="details-header">Therapist: </span>
                        <span className="details-info">{selectedAppointment.title}</span>
                      </div>
                    }
                    { props.userType === "Provider" &&
                      <div className="appointment-styling">
                        <span className="details-header">Patient: </span>
                        <span className="details-info">{selectedAppointment.title}</span>
                      </div>
                    }

                    <div className="appointment-styling">
                      <span className="details-header">Start: </span>
                      <span className="details-info">{selectedAppointment.start.toLocaleDateString('en-US', options)}</span>
                    </div>

                    <div className="appointment-styling">
                      <span className="details-header">End: </span>
                      <span className="details-info">{selectedAppointment.end.toLocaleDateString('en-US', options)}</span>
                    </div>

                    { selectedAppointment.location !== "N/A" &&
                      <div className="appointment-styling">
                        <span className="details-header">Location: </span>
                        <span className="details-info">{selectedAppointment.location}</span>
                      </div>
                    }
                    { selectedAppointment.notes !== "N/A" &&
                      <div className="appointment-styling">
                        <span className="details-header">Appointment Notes: </span>
                        <span className="details-info">{selectedAppointment.notes}</span>
                      </div>
                    }
                  </div>  
                      <button type="button" className='cancel-appointment-button' onClick={() => deleteAppointment()}>
                        Cancel Appointment
                      </button>

                    { editClick === true &&
                      <>
                      <EditFields setLocation={setLocation} setNotes={setNotes} setDidSubmit={setDidSubmit} />
                      </>
                    }
                </div>
              </>
            }
          </div>
        </div>
      </>
    )
  }

  return (
    <>
        <div id="appointments" className="profile-container">
            <Navbar token={props.token}  setUserType={props.setUserType} setUserName={props.setUserName} setToken={props.setToken} removeToken={props.removeToken} userType={props.userType} userName={props.userName}/>
            <AppointmentsView token={props.token} setUserName={props.setUserName} userType={props.userType} setToken={props.setToken}/>
        </div>
    </>
  )

}


export default Appointments;