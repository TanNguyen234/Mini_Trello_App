import "./style.scss";

//Component
import SiderComponent from "./sider";
import HeaderComponent from "./header";

//Package
import { Outlet, useLocation } from "react-router-dom";

//Antd
import { Layout, Grid, Drawer } from "antd";
import { useEffect, useState } from "react";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const DefaultLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const location = useLocation();

  useEffect(() => {
    if (!screens.md && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [location.pathname]);

  return (
    <Layout className="default-layout">
      {/* {screens.md && <SiderComponent />}

      {!screens.md && (
        <Drawer
          placement="left"
          closable
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={220}
          bodyStyle={{ padding: 0 , background: '#fff'}}
        >
          <SiderComponent isDrawer />
        </Drawer>
      )}
      <Layout className="default-layout__inner">
        <HeaderComponent onOpenDrawer={() => setDrawerOpen(true)}/>
        <Content
          className="default-layout__content"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#F4F4F4",
          }}
        >
          <Outlet />
        </Content>
      </Layout> */}
    </Layout>
  );
};
export default DefaultLayout;
