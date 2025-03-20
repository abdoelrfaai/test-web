
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { toast } from 'sonner';
import { sendWelcomeEmail } from './emailService';

export async function fetchUserProfile(userId: string): Promise<User | null> {
  const { data: profileData, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  if (profileData) {
    return {
      id: profileData.id,
      username: profileData.username,
      email: profileData.email,
      isAdmin: profileData.is_admin || false
    };
  }
  
  return null;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
      throw error;
    }
    
    if (data.user) {
      const profileData = await fetchUserProfile(data.user.id);
      
      if (!profileData) {
        throw new Error('لم يتم العثور على الملف الشخصي');
      }
      
      toast.success('تم تسجيل الدخول بنجاح');
      return profileData;
    }
    
    return null;
  } catch (error: any) {
    toast.error(error.message || 'فشل تسجيل الدخول');
    console.error('Login error:', error);
    throw error;
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<User | null> {
  try {
    // Check if email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing user:', checkError);
    }
    
    if (existingUsers) {
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        },
        emailRedirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('البريد الإلكتروني مسجل بالفعل');
      }
      throw error;
    }
    
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            email,
            is_admin: false
          }
        ]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }
      
      // Send welcome email to user
      await sendWelcomeEmail({ email, username });
      
      // Notify admins about new user registration
      await supabase.functions.invoke('admin-notification', {
        body: {
          type: 'new_user',
          data: { username, email }
        }
      }).catch(error => {
        console.error('Error sending admin notification:', error);
      });
      
      toast.success('تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني للتأكيد');
      
      if (data.session) {
        const profileData = await fetchUserProfile(data.user.id);
        return profileData;
      }
    }
    
    return null;
  } catch (error: any) {
    toast.error(error.message || 'فشل في إنشاء الحساب');
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await supabase.auth.signOut();
    toast.success('تم تسجيل الخروج بنجاح');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('فشل تسجيل الخروج');
    throw error;
  }
}

export async function createAdminAccount(): Promise<User | null> {
  try {
    // Check if admin account already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@admin.com')
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    if (existingAdmin) {
      toast.info('حساب الإدارة موجود بالفعل');
      
      // Try to sign in with admin account
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@admin.com',
        password: 'admin'
      });
      
      if (!error && data.user) {
        toast.success('تم تسجيل الدخول كمدير بنجاح');
        return {
          id: existingAdmin.id,
          username: existingAdmin.username,
          email: existingAdmin.email,
          isAdmin: existingAdmin.is_admin || false
        };
      }
      
      return null;
    }
    
    // Create admin user through sign up
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@admin.com',
      password: 'admin',
      options: {
        data: { username: 'admin' }
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username: 'admin',
            email: 'admin@admin.com',
            is_admin: true
          }
        ]);
      
      if (profileError) {
        throw profileError;
      }
      
      toast.success('تم إنشاء حساب الإدارة بنجاح');
      
      // Try to sign in with admin account
      if (data.session) {
        return {
          id: data.user.id,
          username: 'admin',
          email: 'admin@admin.com',
          isAdmin: true
        };
      }
    }
    
    return null;
  } catch (error: any) {
    toast.error(error.message || 'فشل في إنشاء حساب الإدارة');
    console.error('Admin account creation error:', error);
    throw error;
  }
}
