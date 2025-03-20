
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const ResetSuccessMessage = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-xl font-medium mb-4">تم إعادة تعيين كلمة المرور بنجاح</h3>
      <p className="text-muted-foreground mb-6">
        يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
      </p>
      <Button asChild className="w-full">
        <Link to="/login">
          العودة إلى تسجيل الدخول
          <ArrowRight className="mr-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};
