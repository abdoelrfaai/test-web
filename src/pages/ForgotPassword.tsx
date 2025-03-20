
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EmailRequestForm } from '@/components/auth/EmailRequestForm';
import { ResetCodeVerification } from '@/components/auth/ResetCodeVerification';
import { ResetSuccessMessage } from '@/components/auth/ResetSuccessMessage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);

  const handleEmailSent = (emailAddress: string) => {
    setEmail(emailAddress);
    setStep(2);
  };

  const handleResetSuccess = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
            <div className="mb-6 text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                  ديجيتال ماركت
                </h1>
              </Link>
              
              <h2 className="text-2xl font-bold mt-6 mb-2">استعادة كلمة المرور</h2>
              <p className="text-muted-foreground">
                {step === 1 && "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور"}
                {step === 2 && "أدخل الرمز الذي تم إرساله وكلمة المرور الجديدة"}
                {step === 3 && "تم إعادة تعيين كلمة المرور بنجاح"}
              </p>
            </div>

            {step === 1 && <EmailRequestForm onCodeSent={handleEmailSent} />}
            {step === 2 && <ResetCodeVerification email={email} onSuccess={handleResetSuccess} />}
            {step === 3 && <ResetSuccessMessage />}

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                تذكرت كلمة المرور؟{" "}
                <Link to="/login" className="text-primary hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              &larr; العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
