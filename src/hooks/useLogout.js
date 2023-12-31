import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context";

export function useLogout() {
    const navigate = useNavigate()
    const {setIsAuth} = useContext(AuthContext)

    function logout() {
        setIsAuth(false)
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('auth')
        navigate('/main')
    }

    return logout
}