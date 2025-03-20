
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
    const { email } = await req.json()
    
    if (!email) {
      throw new Error('Email is required')
    }
    
    // Get email service API key
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    // Generate a random 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the reset code in Supabase with expiration
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    
    const resetResponse = await fetch(`${supabaseUrl}/rest/v1/password_resets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email,
        code: resetCode,
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      })
    })

    if (!resetResponse.ok) {
      const error = await resetResponse.json()
      throw new Error(`Error storing reset code: ${JSON.stringify(error)}`)
    }

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@digitalmarket.com',
        to: email,
        subject: 'إعادة تعيين كلمة المرور - ديجيتال ماركت',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>إعادة تعيين كلمة المرور</h2>
            <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك.</p>
            <p>رمز إعادة التعيين الخاص بك هو:</p>
            <div style="background-color: #f4f4f4; padding: 15px; margin: 15px 0; text-align: center; border-radius: 5px;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${resetCode}</span>
            </div>
            <p>هذا الرمز صالح لمدة ساعة واحدة فقط.</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666;">مع أطيب التحيات،<br>فريق ديجيتال ماركت</p>
            </div>
          </div>
        `
      })
    })

    const result = await emailResponse.json()

    if (!emailResponse.ok) {
      throw new Error(JSON.stringify(result))
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset code sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error sending reset email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
