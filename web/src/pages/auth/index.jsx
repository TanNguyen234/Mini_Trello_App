// AuthLayout.jsx
import { Typography, Form } from "antd";
import "./style.scss";

const { Paragraph } = Typography;

const AuthLayout = ({ children }) => {
  return (
    <div className="login-page">
      <Form className="login-form">
        {children}
        <div className="privacy-info">
          <Paragraph>Privacy Policy</Paragraph>
          <Paragraph>
            This site is protected by reCAPTCHA and the Google
          </Paragraph>
          <Paragraph> Privacy Policy and Terms of Service apply.</Paragraph>
        </div>
      </Form>

      <img
        src="/images/img_image_39.png"
        alt="Corner Left"
        className="corner-image left"
      />
      <img
        src="/images/img_image_40.png"
        alt="Corner Right"
        className="corner-image right"
      />
    </div>
  );
};

export default AuthLayout;
