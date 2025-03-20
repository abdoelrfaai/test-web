
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { KeyRound, ArrowRight, Loader2 } from 'lucide-react';

interface ResetCodeVerificationProps {
  email: string;
  onSuccess: () => void;
}

export const ResetCodeVerification = ({ email, onSuccess }: ResetCodeVerificationProps) => {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetCode || !newPassword || !confirmPassword) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتي المرور غير متطابقتين",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verify the reset code directly with a query
      const { data: resetData, error: resetError } = await supabase
        .from('password_resets')
        .select('*')
        .eq('email', email)
        .eq('code', resetCode)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();
      
      if (resetError || !resetData) {
        throw new Error('الرمز غير صالح أو منتهي الصلاحية');
      }
      
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      // Delete the used reset code
      await supabase
        .from('password_resets')
        .delete()
        .eq('email', email)
        .eq('code', resetCode);
        
      toast({
        title: "تم",
        description: "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول."
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في إعادة تعيين كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="reset-code" 
            className="text-sm font-medium flex items-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            رمز التحقق
          </label>
          <Input
            id="reset-code"
            type="text"
            placeholder="000000"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            disabled={isLoading}
            maxLength={6}
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor="new-password" 
            className="text-sm font-medium flex items-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            كلمة المرور الجديدة
          </label>
          <Input
            id="new-password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label 
            htmlFor="confirm-password" 
            className="text-sm font-medium flex items-center gap-2"
          >
            <KeyRound className="h-4 w-4" />
            تأكيد كلمة المرور
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              جاري إعادة التعيين...
            </>
          ) : (
            <>
              إعادة تعيين كلمة المرور
              <ArrowRight className="mr-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
