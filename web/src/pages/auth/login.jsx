// LoginPage.jsx
import { useState } from "react";
import { Input, Button, Typography, Form } from "antd";
import AuthLayout from "./index";

const { Title } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Submit logic
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