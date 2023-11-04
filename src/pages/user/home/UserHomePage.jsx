import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import request from "../../../api";
import Loading from "../../../components/loading/Loading";
import portfolioimg from "../../../assets/images/portfoliimg.jpg";
import telegram from "../../../assets/images/telegram.png";
import logout from "../../../assets/images/logout.svg";
import instagram from "../../../assets/images/insta.png";
import git from "../../../assets/images/git.png";
import aboutimg from "../../../assets/images/about.jpg";
import { ENDPOINT, USERID } from "../../../constants";
import "./home.css";
import { message } from "antd";
import { Link } from "react-router-dom";

const UserHomePage = () => {
  const [userID, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState(null);
  const [skills, setSkills] = useState(null);
  const [portfolios, setPortfolios] = useState(null);

  console.log(userID);
  console.log(total);
  useEffect(() => {
    getUserData();
    getSkills();
    getDataPortfolios();
  }, []);

  const getUserData = async () => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      setUserId(userID);
    }
    setLoading(true);
    try {
      const { data } = await request.get(`users/${userID}`);
      setUsers(data);
      console.log(data);
    } catch (error) {
      message.error("Maybe Api is not work");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  const getSkills = async () => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      setUserId(userID);
    }
    setLoading(true);
    try {
      const {
        data: { pagination, data },
      } = await request.get(`skills`, {
        params: {
          user: userID,
        },
      });
      setTotal(pagination.total);
      setSkills(data);
    } catch (error) {
      message.error("Maybe Api is not work");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  const getDataPortfolios = async () => {
    const userID = Cookies.get(USERID);
    if (userID !== undefined) {
      setUserId(userID);
    }
    setLoading(true);
    try {
      const {
        data: { pagination, data },
      } = await request.get(`portfolios`, {
        params: {
          user: userID,
        },
      });
      setTotal(pagination.total);
      setPortfolios(data);
    } catch (error) {
      message.error("Maybe Api is not work");
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="homebody">
          <div className="homenavbar">
            <div className="container">
              <div className="wrapper__home">
                <div className="home__logo">
                  <a className="heading__home" href="#">
                    <h1 className="heading__home">
                      <i>ABOUT ME</i>
                    </h1>
                  </a>
                </div>
                <div className="homenav__ul-item">
                  <ul className="homenav__ul">
                    <a className="home__ul-li" href="#">
                      <li className="home__ul-li">Home</li>
                    </a>
                    <a className="home__ul-li" href="#about">
                      <li className="home__ul-li">About</li>
                    </a>
                    <a className="home__ul-li" href="#contact">
                      <li className="home__ul-li">Contact</li>
                    </a>
                    <a className="home__ul-li" href="#skills">
                      <li className="home__ul-li">Skills</li>
                    </a>
                    <a className="home__ul-li" href="#portfolios">
                      <li className="home__ul-li">Portfolios</li>
                    </a>
                  </ul>
                </div>
                <Link to="/login">
                  <img src={logout} alt="dcscd" />
                </Link>
              </div>
              {
                <div className="homehead">
                  <div className="homehead__text">
                    <span className="homehead__span">Hello!</span>
                    <h2 className="homehead__h2">
                      I am {users?.firstName} {users?.lastName}
                    </h2>
                    <p className="homehead__title">
                      My username is {users?.username}
                    </p>
                    <h6 className="homehead__h6">
                      A small river named Duden flows by their place and
                      supplies it with the necessary regelialia
                    </h6>
                  </div>
                  <div className="homehead__image">
                    <img
                      className="homeheadimg"
                      src={portfolioimg}
                      alt="fdvdvdfvd"
                    />
                    {/* <img className='imgportfolio' src={`${ENDPOINT}upload/${users?.photo?._id}.${
                        users?.photo?.name?.split(".")[1]
                      }`} alt="sd" /> */}
                  </div>
                </div>
              }
            </div>
          </div>
          <section className="about__section" id="about">
            <div className="aboutimg">
              <img className="about-img" src={aboutimg} alt="dsdscdsc" />
            </div>
            <div className="about__text">
              <h2>About me</h2>
              <ul className="about__ul">
                <li className="about__li">
                  FullName: {users?.firstName} {users?.lastName}
                </li>
                <li className="about__li">
                  Birthday: {users?.createdAt?.split("T")[0]}
                </li>
                <li className="about__li">Age: 21</li>
                <li className="about__li">Role: {users?.role}</li>
              </ul>
            </div>
          </section>
          <section className="contact__section" id="contact">
            <div className="contact__text">
              <h2>Contact</h2>
              <ul className="contact__ul">
                <li className="contact__li">Phone: +99899123456789</li>
                <li className="contact__li">Email: example@mail.com</li>
              </ul>
              <div className="contact__img">
                <img className="contactimg" src={telegram} alt="sscaasc" />
                <img className="contactimg" src={instagram} alt="sscaasc" />
                <img className="contactimg" src={git} alt="sscaasc" />
              </div>
            </div>
          </section>
          <section className="skills__section" id="skills">
            <div className="skills__text">
              <h2 className="skills-h2">Skills</h2>
              <div className="skills-card">
                {skills?.map((el) => (
                  <div key={el._id} className="skills-card-item">
                    <div className="li__new-about">{el?.name}</div>
                    <div className="li__new-about">{`${el?.percent}%`}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="portfolios__section" id="portfolios">
            <div className="portfolios__text">
              <h2 className="portfolios-h2">Portfolios</h2>
              <div className="portfolios-card">
                {portfolios?.map((el) => (
                  <div key={el._id} className="portfolios-card-item">
                    <div className="li__new-port">
                      <img
                        className="portfolioimg"
                        src={`${ENDPOINT}upload/${el?.photo?._id}.${
                          el?.photo?.name.split(".")[1]
                        }`}
                        alt="sd"
                      />
                    </div>
                    <div className="li__new-port">{el?.name}</div>
                    <div className="li__new-port">{el?.url}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </Fragment>
  );
};

export default UserHomePage;
