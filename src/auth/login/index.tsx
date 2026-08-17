import LoginContainer from "./_login-container"
import upImg from "../../assets/up-image.png";


export default function LoginPage () {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="left-container flex w-[40%] items-center justify-center bg-white">
                <LoginContainer />
            </div>
            <div className="right-container h-screen w-[60%] bg-red-300">
                <img src={upImg} alt="University of Puthisastra" className="h-full w-full object-cover" />
            </div>
        </div>
    )
}