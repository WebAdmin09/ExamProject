import { message } from 'antd'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import request from '../../api'
import { TOKEN, USERID } from '../../constants'
import { controlAuthenticated } from '../../redux/slices/authSlice'
import useAuth from '../../redux/store/auth'
import './HomePage.scss'
const HomePage = () => {
    const loginauth = useAuth((state) => state.login)
    window.addEventListener('keyup', (e) => {
        if (e.isComposing || e.keyCode === 32) {
            const closehome = document.querySelector('.home')
            closehome.classList.add('homeclose')
        }
    })
    const [usernamevalue, setUserameValue] = useState('');
    const [passwordvalue, setPasswordValue] = useState([]);

    const handleUsernameChange = (e) => {
        const newValue = e.target.value
        setUserameValue(newValue)
    }
    const handlePasswordChange = (e) => {
        const newValue = e.target.value
        setPasswordValue(newValue)
    }
    const submit = (e) => {
        e.preventDefault();
    }
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const login = async () => {
        try {        
            let user = { username: usernamevalue, password: passwordvalue }
            let { data } = await request.post('auth/login', user);  
            console.log(data.token)
            if (data.user.role === 'admin') {
                navigate('/dashboard')
                dispatch(controlAuthenticated(true))
                Cookies.set(TOKEN, data.token)
                message.success('You are Admin')
            } else if(data.user.role === 'client'){
                Cookies.set(TOKEN, data.token)
                Cookies.set(USERID, data.user._id)
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '/userskills'
                loginauth(data.user)
                message.success('You are Client')
            } 
            else if(data.user.role === 'user'){
                window.location.href = '/userpanel'
                message.success('You are User')
            }
            else {
                message.error('You are not Admin')
            }
        } catch (error) {
            message.error('Invalid Username or Password')
        }
    }
    return (
        <div className="main__wrapper">
            <div className="wrapper">
                <div className="container">
                    <div className="home">
                        <div className='home__items'>
                            <h1 className='home__heading'>HELLO <br />WELCOME TO OUR SITE</h1>
                            <h2 className='home__title'>Please press space!</h2>
                        </div>
                    </div>
                    <div className="login__wrapper">
                        <div className="login__wrapper__left">
                        </div>
                        <div className='login__wrapper__texts'>
                            <h2 className='login__heading'>Login</h2>
                            <form onSubmit={submit}>
                                <div className='login__form'>
                                    <h4>Username</h4>
                                    <input onChange={handleUsernameChange} className='textinput' type="text" placeholder='username' />
                                    <h4>Password</h4>
                                    <input onChange={handlePasswordChange} className='passwordinput' type="password" placeholder='password' />
                                </div>
                                <button className='login__btn' type='submit' onClick={login}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage

