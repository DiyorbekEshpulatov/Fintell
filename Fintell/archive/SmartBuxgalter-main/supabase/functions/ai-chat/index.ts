import { corsHeaders } from '../_shared/cors.ts';

const ONSPACE_AI_API_KEY = Deno.env.get('ONSPACE_AI_API_KEY') ?? '';
const ONSPACE_AI_BASE_URL = Deno.env.get('ONSPACE_AI_BASE_URL') ?? '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, businessContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Sen SmartBuxgalter AI Agent — professional buxgalteriya yordamchisisan.
Sening vazifang: moliyaviy hisobotlar tayyorlash, soliq maslahat berish, xarajatlarni tahlil qilish, bashorat qilish.

Foydalanuvchining haqiqiy biznes ma'lumotlari:
${businessContext || 'Ma\'lumot mavjud emas'}

QOIDALAR:
- O'zbek tilida javob ber
- Aniq raqamlar va foizlar bilan javob ber
- Agar moliyaviy hisobot so'rasa — jadval ko'rinishida tayyorla
- Agar tavsiya so'rasa — 3-5 ta aniq taklif ber
- Professional va qisqa javob ber
- Agar ma'lumot yetarli bo'lmasa — nima kerakligini aniq so'ra
- Emoji ishlat: 📊 hisobot, 💰 pul, 📈 o'sish, 📉 tushish, ⚠️ ogohlantirish, ✅ tayyor, 💡 tavsiya`;

    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    console.log(`AI Chat request: ${messages.length} messages`);

    const response = await fetch(`${ONSPACE_AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ONSPACE_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`OnSpace AI error: ${response.status} ${errText}`);
      return new Response(
        JSON.stringify({ error: `AI xizmati xatosi: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back to client
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('AI Chat error:', err);
    return new Response(
      JSON.stringify({ error: `Server xatosi: ${(err as Error).message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
