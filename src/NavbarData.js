import React from "react";
import { AiFillHome, AiOutlineFieldTime, AiOutlineSearch } from 'react-icons/ai';
import { IconName } from "react-icons/fa";
import { ImProfile, ImCalendar } from 'react-icons/im';
import { CgLogOut } from 'react-icons/cg';
import { BiTime } from "react-icons/bi";

export const NavbarData = [
    {
        page: "Home",
        path: "/home",
        icon: <AiFillHome />,
        className: "nav-item-label",
        access: ["Provider", "Patient"],
    },
    {
        page: "Availability",
        path: "/availability",
        icon: <ImCalendar />,
        className: "nav-item-label",
        access: ["Provider"]
    },
    {
        page: "Find a Provider",
        path: "/search",
        icon: <AiOutlineSearch />,
        className: "nav-item-label",
        access: ["Patient"]
    },
    {
        page: "Appointments",
        path: "/appointments",
        icon: <BiTime />,
        className: "nav-item-label",
        access: ["Provider", "Patient"]
    },
    {
        page: "Profile",
        path: "/profile",
        icon: <ImProfile />,
        className: "nav-item-label",
        access: ["Provider", "Patient"]
    },
    {
        page: "Logout",
        path: "/",
        icon: <CgLogOut />,
        className: "nav-item-label",
        access: ["Provider", "Patient"]
    }
]