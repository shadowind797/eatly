import {useState} from "react";
import api from "../api.js"
import {useNavigate} from "react-router-dom";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants.js";
import LogSlider from "./LogIn_SignUp/Slider.jsx";

import google from "../assets/google.svg"
import github from "../assets/github.svg"

function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const name = method === "login" ? "Log In" : "Sign Up"
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        if (password === password2 || method === "login") {
            if (email.includes("@") && email.includes(".") || email.length === 0) {
                if (phone.includes("+") && phone.length > 0 || phone === "") {
                    if (username.length > 0) {
                        if (password.length > 0) {
                            try {
                                const res = await api.post(route, {username, password, email, phone})
                                if (method === "login") {
                                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                                    navigate("/")
                                } else {
                                    navigate("/login")
                                }
                            } catch (error) {
                                if (error.response.data.detail) {
                                    setError(error.response.data.detail)
                                } else if (error.response.data.username[0]) {
                                    setError(error.response.data.username[0])
                                }
                            } finally {
                                setLoading(false)
                            }
                        } else {
                            setError("Password is required")
                        }
                    } else {
                        setError("Username is required")
                    }
                } else {
                    setError("Invalid phone number")
                }
            } else {
                setError("Invalid email address")
            }
        } else {
            setError(`Passwords aren't match`)
        }
    }

    const fields = [
        {
            id: 1,
            placeholder: 'USERNAME',
            type: 'text',
            value: username,
            onChange: e => {
                setUsername(e.target.value)
            }
        },
        {
            id: 2,
            placeholder: 'EMAIL',
            type: 'text',
            value: email,
            onChange: e => {
                setEmail(e.target.value)
            }
        },
        {
            id: 3,
            placeholder: 'PHONE (OPTIONAL)',
            type: 'text',
            value: phone,
            onChange: e => {
                setPhone(e.target.value)
            }
        },
        {
            id: 4,
            placeholder: 'PASSWORD',
            type: 'password',
            value: password,
            onChange: e => {
                setPassword(e.target.value)
            }
        },
        {
            id: 5,
            placeholder: 'REPEAT PASSWORD',
            type: 'password',
            value: password2,
            onChange: e => {
                setPassword2(e.target.value)
            }
        },
    ]

    return(
        <div id="log">
            <div id="form">
                <h1>{name} to EATLY</h1>
                <div id="foreign-log">
                    <button id="google"><img src={google} alt=""/></button>
                    <button id="git-hub"><img src={github} alt=""/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div id="inputs">
                        {fields.map(field => {
                            if (method === "login") {
                                if (field.id === 2 || field.id === 3 || field.id === 5) {
                                    return <div></div>
                                } else {
                                    return (
                                        <div id="input">
                                            <input key={field.id}
                                                   value={field.value}
                                                   onChange={field.onChange}
                                                   type={field.type}
                                                   placeholder={field.placeholder}
                                            />
                                        </div>
                                    )
                                }
                            } else {
                                return (
                                    <div id="input">
                                        <input key={field.id}
                                               value={field.value}
                                               onChange={field.onChange}
                                               type={field.type}
                                               placeholder={field.placeholder}
                                        />
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div id="action">
                        <p className="auth-error">{error.length > 0 ? error : ""}</p>
                        <button type="submit">{name}</button>
                        <p className="another">
                            {method === "login" ? "Don't have an account? " : "Already have an account? "}
                            <a href={`/${method === "login" ? "register" : "login"}`}>
                            {name === "Log In" ? "Sign Up" : "Log In"}
                            </a>
                        </p>
                    </div>
                </form>
                <div id="footer">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <p>Made by shadowind in 2024</p>
                </div>
            </div>
            <div id="decor">
                <LogSlider />
            </div>
        </div>
    )

}

export default Form;
