import '../../../assets/css/styles.min.css'
import '../../../assets/scss/layouts/_header.scss'
import '../../../assets/scss/layouts/_layouts.scss'
import '../../../assets/scss/layouts/_sidebar.scss'
import darklogo from '../../../assets/images/logos/dark-logo.svg'
import user from '../../../assets/images/profile/user-1.jpg'
import rocket from '../../../assets/images/backgrounds/rocket.png'
import logout from '../../../assets/images/logout.svg'
import { Link, Outlet } from 'react-router-dom'
import { Fragment, useState } from 'react'
import './userlayout.css'

const Userlayout = () => {
  const [isModal, setIsModal] = useState(false);

  const opneModal = () =>{
    setIsModal(!isModal)
  }
  return (
    <Fragment>
    <div className='userlayout'>
    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
    data-sidebar-position="fixed" data-header-position="fixed">
    <aside className="left-sidebar">
      <div>
        <div className="brand-logo d-flex align-items-center justify-content-between">
          <Link to="/login" className="text-nowrap logo-img">
            <img src={darklogo} width="180" alt="sasfa" />
          </Link>
          <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
            <i className="ti ti-x fs-8"></i>
          </div>
        </div>
        <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
          <ul id="sidebarnav">
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">Links</span>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/userskills" aria-expanded="false">
                <span>
                  <i className="ti ti-layout-dashboard"></i>
                </span>
                <span className="hide-menu">Skills</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/education" aria-expanded="false">
                <span>
                  <i className="ti ti-article"></i>
                </span>
                <span className="hide-menu">Education</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/experience" aria-expanded="false">
                <span>
                  <i className="ti ti-home"></i>
                </span>
                <span className="hide-menu">Experience</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/userportfolio" aria-expanded="false">
                <span>
                  <i className="ti ti-cards"></i>
                </span>
                <span className="hide-menu">Portfolio</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/message" aria-expanded="false">
                <span>
                  <i className="ti ti-file-description"></i>
                </span>
                <span className="hide-menu">Messages</span>
              </Link>
            </li>
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">AUTH</span>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/login" aria-expanded="false">
                <span>
                  <i className="ti ti-login"></i>
                </span>
                <span className="hide-menu">Login</span>
              </Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/register" aria-expanded="false">
                <span>
                  <i className="ti ti-user-plus"></i>
                </span>
                <span className="hide-menu">Register</span>
              </Link>
            </li>
          </ul>
          <div className="unlimited-access hide-menu bg-light-primary position-relative mb-7 mt-5 rounded">
            <div className="d-flex">
              <div className="unlimited-access-title me-3">
                <h6 className="fw-semibold fs-4 mb-6 text-dark w-85">GO FLY</h6>
              </div>
              <div className="unlimited-access-img">
                <img src={rocket} alt="rocket" className="img-fluid"/>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </aside>
    <div className="body-wrapper">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item d-block d-xl-none">
              <a className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" to="javascript:void(0)">
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-icon-hover" to="javascript:void(0)">
                <i className="ti ti-bell-ringing"></i>
                <div className="notification bg-primary rounded-circle"></div>
              </a>
            </li>
          </ul>
          <button
          className='userbtn'
          onClick={opneModal}
           >
          <img className='user' src={user} alt="sacas" />
          </button>
        </nav>
        <div className='user__modal'
      id={isModal ? 'usermodal' : ''}>
        <button className='viewbtn'>
        {/* <i className="fas fa-user-circle"></i> */}
          <Link className='viewlink' to='/userhome'>
           View Profile
          </Link>
          </button>
        <button className='viewbtn'>
        {/* <i className="fas fa-log-out"></i> */}
          <Link className='viewlink' to='/login'>
          <img className='logout' src={logout} alt="logout" />
           Log Out
          </Link>
          </button>
      </div>
      </header>
    </div>
  </div>
    </div>
    <Outlet />
    </Fragment>
  );
};

export default Userlayout;
