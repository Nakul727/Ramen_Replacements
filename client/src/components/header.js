import React from 'react';
import { Link } from "react-router-dom";
import logo_img from "../assets/logo.png"

const Header = ({ leftChildren, rightChildren }) => {
    return (
        <header className="fixed top-0 w-full bg-slate-100 z-10">
            <div className="flex items-left sm:items-center justify-between p-4">
                <div className="flex items-center sm:mx-5 sm:mb-0">
                    {leftChildren}
                </div>
                <div className="flex items-center justify-end">
                    {rightChildren}
                </div>
            </div>
        </header>
    );
};

// alligned to the left inside <div>
const Logo_Name = () => {
    return (
        <div className="flex items-center">
            <Link to="/">
                <img src={logo_img} className="h-14 w-auto mx-1 sm:mx-4" alt="Logo" />
            </Link>
            <h1 className="text-md sm:text-xl md:text-2xl">Ramen_Replacements</h1>
        </div>
    );
};

// alligned to the right inside the <div>
const Links = ({ linkData }) => {
    return (
        <div>
            {linkData.map((link, index) => (
                <div className="w-16 sm:w-20 md:w-24 mr-2 sm:mr-4 float-right text-center h-9 sm:h-12 bg-slate-200 pt-1 sm:pt-2">
                    <Link key={index} to={link.to} className="text-sm sm:text-lg md:text-xl">
                        {link.text}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export { Header, Logo_Name, Links };