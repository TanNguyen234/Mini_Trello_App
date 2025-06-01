import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

function Error_404() {
    const navigate = useNavigate();
        
    const handleBack = () => {
        navigate(-1); // quay lại 1 trang trước
    };
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Trang không tồn tại!"
        extra={<Button onClick={handleBack} type="primary">Quay trở lại!</Button>}
      />
    </>
  );
}

export default Error_404;