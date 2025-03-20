
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    
    // Get email service API key
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    // Get admin emails from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    
    const adminResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?is_admin=eq.true&select=email`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (!adminResponse.ok) {
      throw new Error('Failed to fetch admin emails')
    }
    
    const admins = await adminResponse.json()
    
    if (!admins || admins.length === 0) {
      throw new Error('No admin users found')
    }
    
    const adminEmails = admins.map((admin: any) => admin.email)
    
    let emailData
    
    if (type === 'new_user') {
      // New user registration notification for admins
      emailData = {
        from: 'system@digitalmarket.com',
        to: adminEmails,
        subject: 'مستخدم جديد - ديجيتال ماركت',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>مستخدم جديد</h2>
            <p>تم تسجيل مستخدم جديد في ديجيتال ماركت:</p>
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>اسم المستخدم:</strong> ${data.username}</p>
              <p><strong>البريد الإلكتروني:</strong> ${data.email}</p>
              <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleString('ar-EG')}</p>
            </div>
            <p>يمكنك التحقق من المستخدمين في لوحة التحكم لمزيد من التفاصيل.</p>
          </div>
        `
      }
    } else if (type === 'new_order') {
      // New order notification for admins
      emailData = {
        from: 'orders@digitalmarket.com',
        to: adminEmails,
        subject: 'طلب جديد - ديجيتال ماركت',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>طلب جديد</h2>
            <p>تم تقديم طلب جديد في ديجيتال ماركت:</p>
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>رقم الطلب:</strong> ${data.orderId}</p>
              <p><strong>المستخدم:</strong> ${data.username} (${data.email})</p>
              <p><strong>إجمالي المبلغ:</strong> $${data.total}</p>
              <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-EG')}</p>
            </div>
            <p>يمكنك التحقق من الطلبات في لوحة التحكم لمزيد من التفاصيل.</p>
          </div>
        `
      }
    } else {
      throw new Error('Invalid notification type')
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(JSON.stringify(result))
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error sending admin notification:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
