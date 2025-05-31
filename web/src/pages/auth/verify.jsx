// VerifyPage.jsx
import { useState } from "react";
import { Input, Button, Typography, Form } from "antd";
import AuthLayout from "./index";

const { Title } = Typography;

const VerifyPage = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Submit logic
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