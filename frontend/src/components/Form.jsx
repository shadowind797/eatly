import {useState} from "react";
import api from "../api.js"
import {useNavigate} from "react-router-dom";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants.js";

function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Sign Up"

    const [status, setStatus] = useState(5)

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();

        if (password === password2 || method === "login") {
            try {
                const res = await api.post(route, {username, password, email, phone, status})
                if (method === "login") {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access)
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
                    navigate("/")
                } else {
                    navigate("/login")
                }
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false)
            }
        } else {
            alert(`Passwords aren't match`)
        }
    }

    if (method === "register") {
        return <form onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value)
                }}
            />
            <input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
            />
            <input
                placeholder="Phone (optional)"
                type="text"
                value={phone}
                onChange={(e) => {
                    setPhone(e.target.value)
                }}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
            />
            <input
                placeholder="Confirm password"
                type="password"
                value={password2}
                onChange={(e) => {
                    setPassword2(e.target.value)
                }}
            />
            <button type="submit">{name}</button>
        </form>
    } else {
        return <form onSubmit={handleSubmit}>
            <h1>{name}</h1>
            <input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value)
                }}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
            />
            <button type="submit">{name}</button>
        </form>
    }

}

export default Form;
