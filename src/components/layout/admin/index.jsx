import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    UserOutlined,
    MehOutlined,
    VideoCameraOutlined,
    LoginOutlined,
} from "@ant-design/icons";

import "./adminlayout.scss";

import { Layout, Menu, Button, theme } from "antd";
import Cookies from "js-cookie";
import { TOKEN } from "../../../constants";
import { useDispatch } from "react-redux";
import { controlAuthenticated } from "../../../redux/slices/authSlice";


const { Header, Sider, Content } = Layout;
const AdminLayout = () => {

    const dispatch = useDispatch()
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const logout = () => {
        Cookies.remove(TOKEN);
        dispatch(controlAuthenticated(false))
    }
    return (
        <Layout className="admin-layout">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="admin-logo">Friend/Group</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    items={[
                        {
                            key: "/dashboard",
                            icon: <UserOutlined />,
                            label: <Link to="/dashboard">Dashboard</Link>,
                        },
                        {
                            key: "/skills",
                            icon: <VideoCameraOutlined />,
                            label: <Link to="/skills">Skills</Link>,
                        },
                        {
                            key: "/users",
                            icon: <TeamOutlined />,
                            label: <Link to="/users">Users</Link>,
                        },
                        {
                            key: "/portfolios",
                            icon: <MehOutlined />,
                            label: <Link to="/portfolios">Portfolios</Link>,
                        },
                        {
                            icon: <LoginOutlined />,
                            label: <Button danger to="/" onClick={logout} >Log out</Button>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout