import React from "react"
import { cibFacebook, cil4k, cilAccountLogout, cilAddressBook, cilAirplaneMode, cilAirplaneModeOff, cilAirplay, cilAlarm, cilAlbum } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const func = [
    {
        value: "Chức năng 1",
        title: "Chức năng 1 nè",
        color: "bg-primary bg-gradient text-white",
        to: "/cn1/cn11/",
        icon: <CIcon className="my-2" icon={cilAddressBook} height={80} />,
    },
    {
        value: "Chức năng 2",
        title: "Chức năng 2 nè",
        color: "bg-primary bg-gradient bg-opacity-50 text-white",
        to: "/dashboard",
        icon: <CIcon className="my-2" icon={cibFacebook} height={80} />,
    },
    {
        value: "Chức năng 3",
        title: "Chức năng 3 nè",
        color: "bg-success bg-gradient text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cil4k} height={80} />,
    },
    {
        value: "Chức năng 4",
        title: "Chức năng 4 nè",
        color: "bg-success bg-gradient bg-opacity-50 text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAccountLogout} height={80} />,
    },
    {
        value: "Chức năng 5",
        title: "Chức năng 5 nè",
        color: "bg-danger bg-gradient text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAirplaneMode} height={80} />,
    },
    {
        value: "Chức năng 6",
        title: "Chức năng 6 nè",
        color: "bg-danger bg-gradient bg-opacity-50 text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAlarm} height={80} />,
    },
    {
        value: "Chức năng 7",
        title: "Chức năng 7 nè",
        color: "bg-warning bg-gradient text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAlbum} height={80} />,
    },
    {
        value: "Chức năng 8",
        title: "Chức năng 8 nè",
        color: "bg-warning bg-gradient bg-opacity-50 text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAddressBook} height={80} />,
    },
    {
        value: "Chức năng 9",
        title: "Chức năng 9 nè",
        color: "bg-info bg-gradient text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAirplay} height={80} />,
    },
    {
        value: "Chức năng 10",
        title: "Chức năng 10 nè",
        color: "bg-info bg-gradient bg-opacity-50 text-white",
        to: "/cn1/cn11",
        icon: <CIcon className="my-2" icon={cilAirplaneModeOff} height={80} />,
    },
]

export default func;