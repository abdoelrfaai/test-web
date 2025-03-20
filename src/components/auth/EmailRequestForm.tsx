
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { sendPasswordResetCode } from '@/services/emailService';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

interface EmailRequestFormProps {
  onCodeSent: (email: string) => void;
}

export const EmailRequestForm = ({ onCodeSent }: EmailRequestFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetCode(email);
      
      toast({
        title: "تم",
        description: "تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
      });
      
      onCodeSent(email);
    } catch (error: any) {
      console.error('Error sending reset code:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إرسال رمز إعادة التعيين",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendResetCode}>
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
              جاري الإرسال...
            </>
          ) : (
            <>
              إرسال رمز التحقق
              <ArrowRight className="mr-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
