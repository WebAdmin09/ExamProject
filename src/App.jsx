import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./components/layout/admin";
import Userlayout from "./components/layout/user";
import DashboardPage from "./pages/admin/dashboard";
import PortfoliosPage from "./pages/admin/portfolios/Portfolio";
import SkillsPage from "./pages/admin/skills";
import UsersPage from "./pages/admin/users";
import HomePage from "./pages/front/HomePage";
import RegisterPage from "./pages/front/Register";
// import ContactPage from './pages/user/contact/ContactPage'
import EducationPage from "./pages/user/education/Education";
import Experience from "./pages/user/experience/Experience";
import UserHomePage from "./pages/user/home/UserHomePage";
import Message from "./pages/user/message/Message";
import UserPortfolioPage from "./pages/user/portfolio/UserPortfolioPage";
import UserSkillsPage from "./pages/user/skills/UserSkillsPage";
import UserPanel from "./pages/user/userpanel/UserPanel";
// import 'bootstrap/dist/css/bootstrap. css';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <HomePage />
          }
        />
        <Route path="/login" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/userpanel" element={<UserPanel />} />
        <Route path="/" element={<Userlayout />}>
          <Route path="userskills" element={<UserSkillsPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="experience" element={<Experience />} />
          <Route path="userportfolio" element={<UserPortfolioPage />} />
          <Route path="message" element={<Message />} />
        </Route>
        <Route path="userhome" element={<UserHomePage />} />
        {isAuthenticated ? (
          <Route path="/" element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/portfolios" element={<PortfoliosPage />} />
          </Route>
        ) : null}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
