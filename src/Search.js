import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import './Search.css';
import { GrNext, GrPrevious } from 'react-icons/gr';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Provider {
    constructor(email, name) {
      this.email = email;
      this.name = name;
      this.timeslots = {};
    }
}

function Search(props) {
    const providers = []
    const [providersList, setProvidersList] = useState([])
    const [resultsPerPage, setResultsPerPage] = useState(6)
    const [currentPage, setCurrentPage] = useState(0)
    const [bookingPageOpen, setBookingPageOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState(null)
    const options = { weekday: 'long', month: 'short', day: 'numeric' }

    useEffect(() => {
        document.body.style.background = "#f9f7f6";
    });

    function findProvider(timeslot) {
        for (let provider of providers){
            if (provider.email === timeslot[6]) {
                return provider
            } 
        }

        return null;
    }

    const populateProvidersData = (data) => {

        //clear data
        providers.splice(0, providers.length)

        data.forEach(timeslot => {
            if (Array.isArray(timeslot)) {
                let provider = findProvider(timeslot)
                if (provider !== null) {
                    if (timeslot[3] in provider.timeslots) {
                        provider.timeslots[timeslot[3]].push([timeslot[1], timeslot[2]])
                    }
                    else {
                        provider.timeslots[timeslot[3]] = []
                        provider.timeslots[timeslot[3]].push([timeslot[1], timeslot[2]])
                    }
                }
                else {
                    const newProvider = new Provider (timeslot[6], timeslot[5])
                    newProvider.timeslots[timeslot[3]] = []
                    newProvider.timeslots[timeslot[3]].push([timeslot[1], timeslot[2]])
                    providers.push(newProvider)
                }
            }
            else {
                //must be the new token
                props.setToken(timeslot)
            }
        });

        //change current page if needed (determine if there is enough providers to be on the currentpage)
        if (providers.length < (currentPage * resultsPerPage + 1)) {
            setCurrentPage(0)
        }
    }

    const refreshProviders = () => {
        const options = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + props.token
            },
            body: JSON.stringify({
            })
        }
  
        fetch("http://127.0.0.1:5000/getTimeslots", options)
          .then(response => {
              return response.json()
          })
          .then(data => {
            console.log("This came from the backend: ", data)
            populateProvidersData(data)
            console.log("Providers data restructured: ", providers)
            setProvidersList(providers)
          })
          .catch(error => console.log(error))
    }

    useEffect(() => {
        refreshProviders()

        //refreshing providers search page every minute (60,000 milliseconds)
        const interval = setInterval(() => {
            refreshProviders()
        }, 60000);

        return () => clearInterval(interval);

    }, [])

    const goToPreviousPage = () => {
        setCurrentPage(currentPage - 1)
    }

    const goToNextPage = () => {
        setCurrentPage(currentPage + 1)
    }

    const openBookingPage = (index) => {
        setSelectedProvider(providersList[(currentPage*resultsPerPage) + index])
        setBookingPageOpen(true)
    }
      
    const closeBookingPage = () => {
        setSelectedProvider(null)
        setBookingPageOpen(false)
    }

    return (
        <>
            <div id="#search">
                <Navbar token={props.token} setToken={props.setToken}  setUserType={props.setUserType} setUserName={props.setUserName}  removeToken={props.removeToken} userType={props.userType} userName={props.userName}/>
                { !bookingPageOpen &&
                <div className='search-page'>
                    <div className='search-results-container'>
                        <div className='search-results-header'>Providers</div>
                        <div className='navigation'>
                            { currentPage > 0 &&
                                <div className='previous-button'>
                                    <button onClick={() => goToPreviousPage()}><GrPrevious /></button>
                                </div>
                            }
                            { providersList.length > ((currentPage + 1) * resultsPerPage) &&
                                <div className='next-button'>
                                    <button onClick={() => goToNextPage()}><GrNext /></button>
                                </div>
                            }
                        </div>
                        {providersList.slice(currentPage*resultsPerPage, (currentPage*resultsPerPage)+resultsPerPage).map((provider, index) => {
                            return (
                                <div key={index} className='provider-box' onClick={() => openBookingPage(index)}>
                                    <img src='https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png' alt='grey provider icon' className='provider-photo' />
                                    <div className='provider-content'>
                                        {provider.name}
                                        <div className='next-available-label'>
                                            Next available date: {new Date(Object.keys(provider.timeslots).sort()[0] + "T00:00-0800").toLocaleDateString('en-us', options)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                }
                { bookingPageOpen &&
                <BookingModal token={props.token} setToken={props.setToken} selectedProvider={selectedProvider} closeBookingPage={closeBookingPage}/>
                }
            </div>
        </>
    )
}

function BookingModal(props) {

    const [timeslots, setTimeslots] = useState(props.selectedProvider.timeslots)
    const [credentials, setCredentials] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [biography, setBiography] = useState([])
    const [gender, setGender] = useState([])
    const [selectedDate, setSelectedDate] = useState(new Date())
    const dataCredentials = []
    const dataSpecialties = []

    useEffect(() => {
        loadProfileData()
    }, [])

    useEffect(() => {
        console.log("Selected date: ", selectedDate)
        console.log("Date key: ", getDate(selectedDate))
        console.log("Timeslots: ", props.selectedProvider.timeslots[getDate(selectedDate)])
        console.log("Timeslots type: ", Array.isArray(props.selectedProvider.timeslots[getDate(selectedDate)]))
        console.log("Today's date: ", new Date())
        console.log("Specific date: ", new Date("2023-05-03 11:00:00"))
    }, [selectedDate])


    function getLabel(index) {
        if (index === 5)
            return "LCPC"
        if (index === 6)
            return "LMHC"
        if (index === 7)
            return "LPC"
        if (index === 8)
            return "MD"
        if (index === 9)
            return "NP"
        if (index === 10)
            return "PHD"
        if (index === 11)
            return "PsyD"
        if (index === 12)
            return "Anger Management"
        if (index === 13)
            return "Anxiety"
        if (index === 14)
            return "Eating Disorders"
        if (index === 15)
            return "Mood Disorders"
        if (index === 16)
            return "Personality Disorders"
        if (index === 17)
            return "PTSD"
        if (index === 18)
            return "Psychotic Disorders"
        if (index === 19)
            return "Relationship Issues"
    }


    function loadProfileData()
    {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + props.token
            },
            body: JSON.stringify({
                "email": props.selectedProvider.email
            })
        }
        fetch("http://127.0.0.1:5000/getProviderProfile", options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log("This came from the backend: ", data)
            
            // Check if new token was returned
            if (data.length === 21)
            {
                props.setToken(data[data.length - 1])
                console.log("New token: ", props.token)
            }

            setBiography(data[2] === null ? "" : data[2])
            setGender(data[4] === null ? "" : data[4])

            for (let i = 5; i < 12; i++) {
                console.log(typeof data[i])
                console.log(data[i])
                if (data[i] === 1)
                    dataCredentials.push(getLabel(i))
            }
            setCredentials(dataCredentials)
            console.log(credentials)

            for (let i = 12; i < 20; i++) {
                if (data[i] === 1)
                    dataSpecialties.push(getLabel(i))
            }
            setSpecialties(dataSpecialties)
            console.log(specialties)
        })
        .catch(error => console.log(error))
    }

    const getDate = (date) => {
        return date.toLocaleDateString('en-us', {year: "numeric"}) + "-" +
        date.toLocaleDateString('en-us', {month: "2-digit"}) + "-" +
        date.toLocaleDateString('en-us', {day: "2-digit"})
    }

    const confirmAppointment = (date, index) => {
        console.log("Appointment date: ", date)
        console.log("Appointment index: ", index)
        if(window.confirm("Book appointment?") === true) {

            //confirm that the date has not already passed
            const today = new Date()
            const appointment_datetime = new Date(props.selectedProvider.timeslots[date][index][0])
            console.log("Today's date: ", today)
            console.log("Appointment date: ", appointment_datetime)
            if (appointment_datetime <= today) {
                console.log("Appointment has passed")
                alert("Booking failed")
                //refresh timeslots
                setSelectedDate(new Date())
                return;
            }
            else {
                console.log("Appointment has not passed")
            }
            
            //confirm that someone else hasn't booked the appointment already
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + props.token
                },
                body: JSON.stringify({
                    "email": props.selectedProvider.email,
                    "time": props.selectedProvider.timeslots[date][index][0]
                })
            }
            fetch("http://127.0.0.1:5000/checkAppointment", options)
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log("This came from the backend: ", data)

                if ("access_token" in data) {
                    console.log("New token: ", data["access_token"])
                    props.setToken(data["access_token"])
                }


                if (data["msg"] === "Free Appointment") {
                    console.log("This is a free appointment")

                    //Book appointment here
                    const options = {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + props.token
                        },
                        body: JSON.stringify({
                            "email": props.selectedProvider.email,
                            "time": props.selectedProvider.timeslots[date][index][0]
                        })
                    }
                    fetch("http://127.0.0.1:5000/bookAppointment", options)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        console.log("This came from the backend: ", data)
                        if ("access_token" in data) {
                            console.log("New token: ", data["access_token"])
                            props.setToken(data["access_token"])
                        }

                        //remove timeslot
                        const new_timeslots = timeslots
                        new_timeslots[date].splice(index, 1)
                        if (new_timeslots[date].length === 0) {
                            delete new_timeslots[date]
                        }

                        setTimeslots(new_timeslots)
                        console.log("New timeslots after booking: ", timeslots)
                        
                        //refresh timeslots
                        setSelectedDate(new Date())

                        alert("Success!")
                    })
                    .catch(error => console.log(error))                    
                }
                else {
                    console.log("This appointment is taken")
                    alert("Booking failed")
                    //refresh timeslots
                    setSelectedDate(new Date())
                }
            })
            .catch(error => console.log(error))
        }
        else
            console.log("Client cancelled booking")
    }


    return (
        <>
            <div className='booking-modal'>
                <div>
                    <button onClick={props.closeBookingPage}><GrPrevious /></button>
                </div>
                <div className='booking-content'>
                    <div className='booking-header'>
                        <img src='https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-zxne30hp.png' alt='grey provider icon' className='booking-provider-photo' />
                        <div className='provider-header'>
                            {props.selectedProvider.name}
                            <div className='gender-label'>
                                {gender}
                            </div>
                        </div>
                    </div>
                    <div className='booking-details'>
                        <div className='booking-sections-label'>
                            Biography
                        </div>
                        <div className='about-me-content'>
                        {biography}
                        </div>
                        <div className='booking-sections-label'>
                            Credentials
                        </div>
                        <div className='credentials-items'>
                            {credentials.map((credential, index) => {
                                return (
                                    <div key={index} className='credential-item'>
                                        {credential}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='booking-sections-label'>
                            Specialties
                        </div>
                        <div className='specialties-items'>
                            {specialties.map((specialty, index) => {
                                return (
                                    <div key={index} className='specialty-item'>
                                        {specialty}
                                    </div>
                                )
                            })}
                        </div>
                        <div className='booking-sections-label'>
                            Availability
                        </div>
                        <div className='availablity-container'>
                            <div className='calendar-container'>
                            <DatePicker 
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                includeDates={Object.keys(timeslots).map(available_date => available_date + "T00:00-0800").map(available_date => new Date(available_date))}
                            />
                            </div>
                            { Object.keys(timeslots).includes(getDate(selectedDate)) &&
                              timeslots[getDate(selectedDate)].length > 0 &&
                            <div className='timeslots-section'>
                                <div className='timeslots-header'>{selectedDate.toLocaleDateString('en-us', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                                <div className='timeslots-container'>
                                {timeslots[getDate(selectedDate)].map((timeslot, index) => {
                                    if (new Date(timeslot[0]) > new Date()) {
                                        return (
                                        <div key={index} className='timeslot-item' onClick={() => confirmAppointment(
                                            getDate(selectedDate), index
                                        )}>
                                            {new Date(timeslot[0]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                            -
                                            {new Date(timeslot[1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                        </div>
                                    )
                                    }
                                    else {
                                        return null;
                                    }
                                })}
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
      
export default Search;