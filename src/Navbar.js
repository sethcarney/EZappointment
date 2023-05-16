import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';
import { Nav } from 'reactstrap';
import { NavbarData } from './NavbarData';
import { IconContext } from 'react-icons';
import { CgProfile } from 'react-icons/cg';
import { GiBrain } from "react-icons/gi";

function Navbar(props) {

    const [navbarOpen, setNavbarOpen] = useState(false);

    const navdata = []
    NavbarData.forEach((item, index) => {
        if(item.access.includes(props.userType)){
            navdata.push(item)
        }
    })

    const handleLinkClick = (item) => {

        if(item.page === "Logout") {
            const options = {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + props.token
                }
            }
            
            fetch("http://127.0.0.1:5000/logout", options)
            .then(response => {
                if(response.status === 200)
                    console.log("Successful logout request")
                    return response.json()
            })
            .then(data => {
                console.log(data)
                props.removeToken()
            })
            .catch(error => console.log(error))
        }
    }

  return (
    <>
    <IconContext.Provider value={ {color: "white"}}>
        <Nav className="navbar">
            <div className='logo-container'>
                <GiBrain/>
                <span>MIND</span>MATCH
            </div>
            <ul className="navbar-items-container">
                {navdata.map((item, index) => {
                    return (
                        <li key={index} className={item.className}>
                            <Link to={item.path} onClick={() => handleLinkClick(item)}>
                                {item.icon}<span className="item-name">{item.page}</span>
                            </Link>
                        </li>
                    )
        
                })}
            </ul>
            <div className='user-container'>
                <div className="image-container">
                    <CgProfile size={30}/> 
                </div> 
                <div className="username">{props.userName}</div>
            </div>
        </Nav>
    </IconContext.Provider>
    </>
  )
}

export default Navbar