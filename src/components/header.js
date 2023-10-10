
import { Link } from "react-router-dom";
import logo_img from "../assets/logo.png"

function Header() {
    return (
        <div>
            <Link to="/">
                <img src={logo_img} className="m-8 w-1/12 float-left"></img>
            </Link>
            <h1 className="text-xl md:text-2xl xl:text-4xl float-left m-3 w-2/12">Ramen Replacements</h1>
        </div>
    );
}

export {Header};