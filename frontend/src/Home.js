import './Home.css';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import moment from "moment";

function Dashboard(props) {
    const currentDate = moment().format("ddd, D MMM YYYY");
    const [appointments, setAppointments] = useState();
    const events = []

    useEffect(() => {
        const showUpcomingAppointments = () => {
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
                    start: moment(data[i][1]).toDate(),
                    end: moment(data[i][2]).toDate(),
                    title: props.userType === "Patient" ? data[i][5] : data[i][4],
                })}

                    setAppointments(events)
                }})
                .catch(error => console.log(error))
            };
        
        showUpcomingAppointments();
    }, [props.token, props.userType]);


            return (
                <>
                    <div className="profile-form-container">
                        <div className="profile-form">
                            <h1 className="today-title">Today</h1>
                            <h5 className="date">{currentDate}</h5>
                            <hr className="profile-title-line"/>
                            <div className="view-appointments-container">
                                <h5 className="upcoming-appointments-title">Upcoming sessions</h5>
                                <a href="/appointments" className="view-all-link">View all</a>
                            </div>
                            <div>
                                {props.userType === "Patient" && appointments && appointments.map((appointment) =>
                                    <div key={appointment.id} className="box">
                                        <div className="appointment-container">
                                            <h4 className="appointment-name">{appointment.title}</h4>
                                            <p className="appointment-time">{moment(appointment.start).format("ddd, D MMM, h:mm A")}</p>
                                        </div>
                                    </div>
                                )}

                                {props.userType === "Provider" && appointments && appointments.map((appointment) =>
                                    <div key={appointment.id} className="box">
                                        <div className="appointment-container">
                                            <h4 className="appointment-name">{appointment.title}</h4>
                                            <p className="appointment-time">{moment(appointment.start).format("ddd, D MMM, h:mm A")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )
}

function Home(props) {
    useEffect(() => {
        document.body.style.background = "#f9f7f6";
    });
    
    return (
        <>
            <div id="#home" className="profile-container">
                <Navbar token={props.token} setToken={props.setToken} removeToken={props.removeToken} userType={props.userType} setUserType={props.setUserType} setUserName={props.setUserName} userName={props.userName}/>
                <Dashboard token={props.token} setUserName={props.setUserName} userType={props.userType} setToken={props.setToken}/>
            </div>
        </>
    )
}

export default Home;