
import { supabase } from '@/integrations/supabase/client';

/**
 * Send a welcome email to a new user
 */
export const sendWelcomeEmail = async (userData: { email: string; username: string }) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'welcome',
        data: userData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send a purchase confirmation email
 */
export const sendPurchaseEmail = async (purchaseData: {
  email: string;
  username: string;
  orderId: string;
  total: number;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
}) => {
  try {
    // Send email to customer
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'purchase',
        data: purchaseData
      }
    });
    
    if (error) throw error;
    
    // Send notification to admins
    await supabase.functions.invoke('admin-notification', {
      body: {
        type: 'new_order',
        data: {
          orderId: purchaseData.orderId,
          username: purchaseData.username,
          email: purchaseData.email,
          total: purchaseData.total
        }
      }
    }).catch(error => {
      console.error('Error sending admin notification:', error);
    });
    
    return data;
  } catch (error) {
    console.error('Error sending purchase email:', error);
    throw error;
  }
};

/**
 * Send password reset code
 */
export const sendPasswordResetCode = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('reset-password', {
      body: { email }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending password reset code:', error);
    throw error;
  }
};
