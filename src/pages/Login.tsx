
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2, User, ShieldCheck, Zap, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, createAdminAccount } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      // Error is handled in the login function
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await createAdminAccount();
      toast({
        title: "تم",
        description: "تم إنشاء حساب الإدارة بنجاح. البريد الإلكتروني: admin@admin.com، كلمة المرور: admin"
      });
    } catch (error) {
      // Error is handled in the createAdminAccount function
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column - Form */}
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
                <h2 className="text-2xl font-bold mt-6 mb-2">مرحبًا بعودتك</h2>
                <p className="text-muted-foreground">
                  يرجى تسجيل الدخول إلى حسابك
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <label 
                        htmlFor="password" 
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        كلمة المرور
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-primary hover:underline"
                      >
                        هل نسيت كلمة المرور؟
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري تسجيل الدخول...
                      </>
                    ) : (
                      <>
                        تسجيل الدخول
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  ليس لديك حساب؟{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    إنشاء حساب
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={handleCreateAdmin}
                  className="w-full"
                >
                  <User className="ml-2 h-4 w-4" />
                  إنشاء حساب الإدارة
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  سيتم إنشاء حساب إدارة مع البريد الإلكتروني: admin@admin.com وكلمة المرور: admin
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
        
        {/* Right Column - Image & Text */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary to-blue-700"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1579762593131-b8945254345c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-blue-700/80 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <div className="max-w-md text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4">The #1 Marketplace for Digital Products</h2>
                <p className="text-white/80 mb-8">
                  Join thousands of users buying and selling digital items, accounts, and virtual goods.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Secure Transactions</h3>
                      <p className="text-sm text-white/70">All payments are secure and encrypted</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Instant Delivery</h3>
                      <p className="text-sm text-white/70">Get your digital products immediately</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Trusted Community</h3>
                      <p className="text-sm text-white/70">Join a community of trusted buyers and sellers</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
