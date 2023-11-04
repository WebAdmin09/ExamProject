import { message } from "antd";
import Cookies from "js-cookie";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import request from "../../api";
import { TOKEN, USERID } from "../../constants";
import { controlAuthenticated } from "../../redux/slices/authSlice";
import useAuth from "../../redux/store/auth";
import "./RegisterPage.scss";
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginauth = useAuth((state) => state.login);
  window.addEventListener("keyup", (e) => {
    if (e.isComposing || e.keyCode === 32) {
      const closehome = document.querySelector(".home");
      closehome.classList.add("homeclose");
    }
  });
  const submit = async (e) => {
    e.preventDefault();
    let user = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      username: e.target.username.value,
      password: e.target.password.value,
    };
    try {
      let { data } = await request.post("auth/register", user);
      console.log(data.token);
      if (data.user.role === "user") {
        window.location.href = "/userpanel";
        dispatch(controlAuthenticated(true));
        message.success("You are User");
      } else {
        message.error("You are not Admin");
      }
    } catch (error) {
      message.error("Invalid Username or Password");
    }
  };

  return (
    <div className="main__wrapper-register">
      <div className="wrapper-register">
        <div className="container">
          <div className="links">
            <Link className="log-out" to="/userskills">
              LogOut
            </Link>
            <Link className="loginlink" to="/login">
              Login
            </Link>
          </div>
          <div className="login__wrapper-register">
            <div className="login__wrapper__left-register"></div>
            <div className="login__wrapper__texts-register">
              <h2 className="login__heading-register">Register</h2>
              <form onSubmit={submit}>
                <div className="login__form-register">
                  <h4>FirstName</h4>
                  <input
                    name="firstName"
                    className="textinput-register"
                    type="text"
                    placeholder="firstname"
                  />
                  <h4>LastName</h4>
                  <input
                    name="lastName"
                    className="textinput-register"
                    type="text"
                    placeholder="lastname"
                  />
                  <h4>Username</h4>
                  <input
                    name="username"
                    className="textinput-register"
                    type="text"
                    placeholder="username"
                  />
                  <h4>Password</h4>
                  <input
                    name="password"
                    className="passwordinput-register"
                    type="password"
                    placeholder="password"
                  />
                </div>
                <button className="login__btn-register" type="submit">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
