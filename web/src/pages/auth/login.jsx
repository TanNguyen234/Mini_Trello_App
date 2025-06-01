// LoginPage.jsx
import { useState } from "react";
import { Input, Button, Typography, Form } from "antd";
import AuthLayout from "./index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendVerificationCode } from "../../redux/authSlice";

const { Title } = Typography;

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendVerificationCode(email)).unwrap();
      localStorage.setItem("email", email); // tạm lưu để dùng ở bước tiếp theo
      navigate("/verify");
    } catch (err) {
      alert("Gửi mã thất bại: " + err);
    }
  };

  return (
    <AuthLayout>
      <img
        src="/images/img_image_9.png"
        alt="Login Banner"
        className="login-banner"
      />
      <Title level={5} style={{ textAlign: "center" }}>
        Log in to continue
      </Title>
      <Form.Item>
        <Input
          size="large"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoading}
          block
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </Form.Item>
    </AuthLayout>
  );
};

export default LoginPage;