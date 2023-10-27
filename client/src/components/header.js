import React from 'react';
import { Link } from "react-router-dom";
import logo_img from "../assets/logo.png"

const Header = ({ leftChildren, rightChildren }) => {
    return (
        <header className="fixed top-0 w-full bg-slate-100 z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4">
                <div className="flex items-center sm:mx-5 mb-3 sm:mb-0">
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
                <img src={logo_img} className="h-14 w-auto mx-4" alt="Logo" />
            </Link>
            <p>Ramen_Replacements</p>
        </div>
    );
};

// alligned to the right inside the <div>
const Links = ({ linkData }) => {
    return (
        <div>
            {linkData.map((link, index) => (
                <Link key={index} to={link.to} className="mx-4">
                    {link.text}
                </Link>
            ))}
        </div>
    );
};

export { Header, Logo_Name, Links };