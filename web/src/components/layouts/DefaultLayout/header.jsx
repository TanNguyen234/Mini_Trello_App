//Antd
import { MenuOutlined } from '@ant-design/icons';
import { Button, Grid, Layout } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { logout } from '../../../redux/userSlice';
const { Header } = Layout;

const path = {
    '/': 'Tổng quan',
    '/skill': 'Kỹ năng',
    '/logs': 'Lịch sử',
    '/stat': 'Thống kê'
}
const { useBreakpoint } = Grid;


function HeaderComponent({ onOpenDrawer }) {
    const location = useLocation();
    // const dispatch = useDispatch();
    const navigate = useNavigate()
    const screens = useBreakpoint(); // lấy trạng thái responsive
    const { access_token } = useSelector((state) => state.user);
    const isLogin = access_token ? true : false;

    const handleClick = () => {
        // dispatch(logout());
        navigate('/login')
    }

    return <Header className='default-layout__header'>
        {/* Chỉ hiển thị menu icon khi có onOpenDrawer */}
      {!screens.md &&  onOpenDrawer && (
        <button className="menu-btn" onClick={onOpenDrawer}>
          <MenuOutlined />
        </button>
      )}
        <div className='default-layout__header--title'>
            {location.pathname in path && path[location.pathname]}
        </div>
        <div className='default-layout__header--login'>
            {isLogin ? <Button onClick={() => handleClick()}>
                Đăng xuất
            </Button>: <>
                <Link to="/login">
                    Đăng nhập
                </Link>
            </>}
        </div>
    </Header>
}

export default HeaderComponent;