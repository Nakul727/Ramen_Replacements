
import logo_img from "../assets/logo.png"

function Header() {
    return (
        <div>
            <img src={logo_img} className="m-8 w-28 float-left"></img>
            <h1 className="text-4xl float-left m-5">Ramen Replacements</h1>
        </div>
    );
}

export {Header};