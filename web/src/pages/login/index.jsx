import { useState, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import "../styles/index.scss"

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const frameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scaleFrame = () => {
      const frame = frameRef.current;
      const container = containerRef.current;

      if (!frame || !container) return;

      const scaleX = window.innerWidth / (frame.offsetWidth + 40);
      const scaleY = window.innerHeight / (frame.offsetHeight + 40);
      const scale = Math.min(scaleX, scaleY, 1);

      frame.style.transform = `scale(${scale})`;
      container.style.width = `${frame.offsetWidth * scale}px`;
      container.style.height = `${frame.offsetHeight * scale}px`;
    };

    window.addEventListener('load', scaleFrame);
    window.addEventListener('resize', scaleFrame);
    scaleFrame();

    return () => {
      window.removeEventListener('load', scaleFrame);
      window.removeEventListener('resize', scaleFrame);
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContinue = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Authentication initiated for: ${email}`);
    }, 1500);
  };

  const handlePrivacyPolicyClick = () => {
    alert('Privacy Policy clicked - would redirect to privacy policy page');
  };

  const handleTermsClick = () => {
    alert('Terms of Service clicked - would redirect to terms page');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0] m-0 p-0">
      <div
        id="container"
        ref={containerRef}
        className="relative max-w-full max-h-screen overflow-auto"
      >
        <div
          id="frame"
          ref={frameRef}
          className="w-[1440px] h-[697px] relative bg-white origin-top-left shadow-[0_3px_6px_rgba(18,15,40,0.12)]"
          data-x="0"
          data-y="0"
          data-type="FRAME"
        >
          {/* Main Login Card */}
          <div className="absolute left-[544px] top-[193px] w-[351px] h-[311px] bg-[#fffeff] rounded-[2px] shadow-[0_0_1px_rgba(23,26,31,0.15)] p-8">
            {/* Company Logo */}
            <div className="absolute left-[149px] top-[19px] w-[56px] h-[55px]">
              <img
                src="/images/img_image_9.png"
                alt="S Analytics Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Login Header Text */}
            <div className="absolute left-[135px] top-[83px] w-[82px] h-[21px]">
              <p className="text-[11px] font-catamaran font-normal leading-[19px] text-center text-[#29354f] m-0">
                Log in to continue
              </p>
            </div>

            {/* Email Input Field */}
            <div className="absolute left-[33px] top-[114px] w-[283px] h-[38px]">
              <InputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className="w-full h-full bg-[#f9fafb] border border-[#565d6d] rounded-[2px] px-3 text-[12px] font-catamaran text-[#565d6d] placeholder:text-[#565d6d]"
                required
              />
            </div>

            {/* Continue Button */}
            <div className="absolute left-[34px] top-[156px] w-[282px] h-[38px]">
              <Button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full h-full bg-[#0e50e1] rounded-[2px] text-[10px] font-catamaran font-normal leading-[17px] text-white border-none"
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </Button>
            </div>

            {/* Privacy Policy Link */}
            <div className="absolute left-[146px] top-[203px] w-[62px] h-[21px]">
              <button
                onClick={handlePrivacyPolicyClick}
                className="text-[11px] font-catamaran font-normal leading-[19px] text-left text-[#3f4c67] bg-transparent border-none cursor-pointer hover:underline"
              >
                Privacy Policy
              </button>
            </div>

            {/* reCAPTCHA Text */}
            <div className="absolute left-[44px] top-[221px] w-[271px] h-[16px]">
              <p className="text-[11px] font-catamaran font-normal leading-[19px] text-center text-[#536488] m-0">
                This site is protected by reCAPTCHA and the Google Privacy
              </p>
            </div>

            {/* Terms Text */}
            <div className="absolute left-[100px] top-[238px] w-[154px] h-[16px]">
              <button
                onClick={handleTermsClick}
                className="text-[11px] font-catamaran font-normal leading-[19px] text-center text-[#305cbb] bg-transparent border-none cursor-pointer hover:underline"
              >
                Policy and Terms of Service apply.
              </button>
            </div>
          </div>

          {/* Right Background Image */}
          <div className="absolute left-[1128px] top-[325px] w-[312px] h-[365px]">
            <img
              src="/images/img_image_39.png"
              alt="Data Analytics Illustration"
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>

          {/* Left Background Image */}
          <div className="absolute left-[0px] top-[391px] w-[306px] h-[302px]">
            <img
              src="/images/img_image_40.png"
              alt="Team Collaboration Illustration"
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;