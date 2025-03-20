
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await register(username, email, password);
      toast({
        title: "تم",
        description: "تم إنشاء حسابك بنجاح. تحقق من بريدك الإلكتروني للتأكيد."
      });
    } catch (error) {
      // Error is handled in the register function
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "" };
    
    let strength = 0;
    let text = "ضعيفة";
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength === 4) text = "قوي";
    else if (strength === 3) text = "متوسط";
    else if (strength === 2) text = "ضعيفة";
    
    return { strength, text };
  };
  
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <div className="flex-1 flex flex-col lg:flex-row">
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
                <h2 className="text-2xl font-bold mt-6 mb-2">إنشاء حساب</h2>
                <p className="text-muted-foreground">
                  انضم إلى سوقنا للمنتجات الرقمية
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label 
                      htmlFor="username" 
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      اسم المستخدم
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="اسم المستخدم"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="email" 
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="password" 
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      كلمة المرور
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                    
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Password strength:</span>
                          <span className={
                            passwordStrength.strength === 4 ? "text-green-500" :
                            passwordStrength.strength >= 2 ? "text-amber-500" : 
                            "text-red-500"
                          }>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-secondary rounded overflow-hidden">
                          <div 
                            className={
                              passwordStrength.strength === 4 ? "bg-green-500" :
                              passwordStrength.strength >= 2 ? "bg-amber-500" : 
                              "bg-red-500"
                            }
                            style={{ width: `${passwordStrength.strength * 25}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label 
                      htmlFor="confirm-password" 
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      تأكيد كلمة المرور
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      disabled={isLoading}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        كلمات المرور غير متطابقة
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري إنشاء الحساب...
                      </>
                    ) : (
                      <>
                        إنشاء حساب
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  لديك حساب بالفعل؟{" "}
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
        
        <div className="hidden lg:flex flex-1 relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1559081395-9439d0fec726?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 to-primary/80 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <div className="max-w-md text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4">انضم إلى سوقنا الرقمية</h2>
                <p className="text-white/80 mb-8">
                  انشئ حسابًا لبدء شراء وبيع المنتجات الرقمية.
                </p>
                
                <div className="space-y-4">
                  {[
                    "الوصول إلى المنتجات الرقمية المفيدة",
                    "طرق دفع آمنة",
                    "الشحن على الفور بعد الشراء",
                    "دعم العملاء المتخصص",
                    "نظام التحقق من الموردين"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="bg-white/20 p-1 rounded-full">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
