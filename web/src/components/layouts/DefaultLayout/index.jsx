import { Layout, Menu, Avatar, Dropdown } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";
import "./style.scss"; // Import SCSS

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const profileMenu = (
    <Menu>
      <Menu.Item key="1">Profile</Menu.Item>
      <Menu.Item key="2">Settings</Menu.Item>
      <Menu.Item key="3">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="main-layout">
      <Header className="main-header">
        <div className="header-left">
          <AppstoreOutlined className="header-icon" />

          <img
            src="/images/logo.png"
            alt="logo"
            style={{ width: "36px", height: "36px", marginRight: "10px" }}
          ></img>
        </div>
        <div className="header-right">
          <img src="/images/bell.png" alt="bell" className="header-icon"/>
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <Link
              to=""
              onClick={(e) => e.preventDefault()}
              className="header-avatar-dropdown"
            >
              <Avatar icon={<UserOutlined />} className="header-avatar" />
              <DownOutlined className="header-down-icon" />
            </Link>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="main-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["myTrelloBoard"]}
            className="sider-menu"
          >
            {/* My Trello board với icon Boards */}
            <Menu.Item
              key="myTrelloBoard"
              icon={
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.71418 2.42859L7.28561 2.42859C6.95047 2.42859 6.67847 2.70059 6.67847 3.03573L6.67847 13.9643C6.67847 14.2994 6.95047 14.5714 7.28561 14.5714H9.71418C10.0493 14.5714 10.3213 14.2994 10.3213 13.9643L10.3213 3.03573C10.3213 2.70059 10.0493 2.42859 9.71418 2.42859Z"
                    fill="#4989FD"
                  />
                  <path
                    d="M4.25007 9.10718H1.8215C1.48636 9.10718 1.21436 9.37918 1.21436 9.71432L1.21436 13.9643C1.21436 14.2995 1.48636 14.5715 1.8215 14.5715H4.25007C4.58521 14.5715 4.85721 14.2995 4.85721 13.9643L4.85721 9.71432C4.85721 9.37918 4.58521 9.10718 4.25007 9.10718Z"
                    fill="#4989FD"
                  />
                  <path
                    d="M15.1785 6.07141L12.75 6.07141C12.4148 6.07141 12.1428 6.34341 12.1428 6.67855L12.1428 13.9643C12.1428 14.2994 12.4148 14.5714 12.75 14.5714H15.1785C15.5137 14.5714 15.7857 14.2994 15.7857 13.9643L15.7857 6.67855C15.7857 6.34341 15.5137 6.07141 15.1785 6.07141Z"
                    fill="#4989FD"
                  />
                </svg>
              }
            >
              <Link to="/boards">Boards</Link>
            </Menu.Item>
  
            <Menu.Item key="allMembers" icon={<img src="/images/member.png" alt="member"/>}>
              <Link to="/members">All Members</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="content-layout">
          <Content className="main-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
