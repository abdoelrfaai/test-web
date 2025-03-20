
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

    let emailData
    
    if (type === 'welcome') {
      // Welcome email for new registration
      emailData = {
        from: 'noreply@digitalmarket.com',
        to: data.email,
        subject: 'مرحبًا بك في ديجيتال ماركت',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>مرحبًا ${data.username}،</h2>
            <p>شكرًا لتسجيلك في ديجيتال ماركت. نحن متحمسون لانضمامك إلينا!</p>
            <p>يمكنك الآن تصفح منتجاتنا والشراء بكل سهولة.</p>
            <p>إذا كان لديك أي أسئلة، فلا تتردد في التواصل معنا.</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
              <p style="margin: 0; color: #666;">مع خالص التحيات،</p>
              <p style="margin: 5px 0 0; font-weight: bold; color: #333;">فريق ديجيتال ماركت</p>
            </div>
          </div>
        `
      }
    } else if (type === 'purchase') {
      // Purchase confirmation email
      emailData = {
        from: 'orders@digitalmarket.com',
        to: data.email,
        subject: 'تأكيد الطلب - ديجيتال ماركت',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>مرحبًا ${data.username}،</h2>
            <p>شكرًا لطلبك! لقد تم تأكيد طلبك بنجاح.</p>
            <p><strong>رقم الطلب:</strong> ${data.orderId}</p>
            <p><strong>إجمالي المبلغ:</strong> $${data.total}</p>
            <h3>تفاصيل الطلب:</h3>
            <ul style="padding-right: 20px;">
              ${data.items.map((item: any) => `
                <li>${item.title} - $${item.price} x ${item.quantity}</li>
              `).join('')}
            </ul>
            <p>سيتم معالجة طلبك وإرساله في أقرب وقت ممكن.</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
              <p style="margin: 0; color: #666;">مع خالص التحيات،</p>
              <p style="margin: 5px 0 0; font-weight: bold; color: #333;">فريق ديجيتال ماركت</p>
            </div>
          </div>
        `
      }
    } else {
      throw new Error('Invalid email type')
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
    console.error('Error sending email:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
