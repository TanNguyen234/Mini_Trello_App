// VerifyPage.jsx
import { useState } from "react";
import { Input, Button, Typography, Form } from "antd";
import AuthLayout from "./index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginWithCode } from "../../redux/authSlice";

const { Title } = Typography;

const VerifyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(loginWithCode({ email, code })).unwrap();
      console.log(data)
      navigate("/boards");
    } catch (err) {
      console.log(err)
      alert("Mã xác nhận không đúng hoặc hết hạn!");
    }
  };
  return (
    <AuthLayout>
      <Title level={3} style={{ textAlign: "center" }} className="fix__title">
        Email Verification
      </Title>
      <Form.Item>
        <Input
          size="large"
          placeholder="Enter code verification"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
          Submit
        </Button>
      </Form.Item>
    </AuthLayout>
  );
};

export default VerifyPage;
