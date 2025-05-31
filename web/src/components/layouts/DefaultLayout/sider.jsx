//Antd
import {
  DashboardOutlined,
  FileProtectOutlined,
//   PieChartOutlined,
  PlusOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";

import { Layout } from "antd";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const { Sider } = Layout;
function SiderComponent({ isDrawer = false }) {
    const location = useLocation();
    const noneactive = "default-layout__sider--submenu";
    const active = noneactive + " active";
  
    const [isMobile, setIsMobile] = useState(true);
  
    const content = (
      <>
        <div className="default-layout__sider--logo">
          <img src="/logo.png" alt="logo" />
        </div>
        <div className="default-layout__sider--menu">
          <Link to="/" className={location.pathname === "/" ? active : noneactive}>
            <DashboardOutlined />
            <span className="default-layout__sider--subtitle">Tổng quan</span>
          </Link>
          <Link to="/skill" className={location.pathname === "/skill" ? active : noneactive}>
            <SnippetsOutlined />
            <span className="default-layout__sider--subtitle">Kỹ năng</span>
          </Link>
          <Link to="/skill/add" className={location.pathname === "/skill/add" ? active : noneactive}>
            <PlusOutlined />
            <span className="default-layout__sider--subtitle">Thêm kĩ năng</span>
          </Link>
          <Link to="/logs" className={location.pathname === "/logs" ? active : noneactive}>
            <FileProtectOutlined />
            <span className="default-layout__sider--subtitle">Lịch sử</span>
          </Link>
        </div>
      </>
    );
  
    if (isDrawer) {
      return (
        <div
          className="default-layout__sider"
          style={{ width: 220, minWidth: 220, maxWidth: 220 }}
        >
          {content}
        </div>
      );
    }
  
    return (
      <Sider
        collapsible
        collapsed={isMobile}
        onCollapse={(val) => setIsMobile(val)}
        breakpoint="md"
        collapsedWidth="0"
        width={220}
        className="default-layout__sider"
      >
        {content}
      </Sider>
    );
  }

  export default SiderComponent;