import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objeto, tipo, incisoNumero, incisoTitulo, incisoDescricao, incisoTextoLegal } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um especialista em licitações públicas brasileiras, com profundo conhecimento da Lei nº 14.133/2021 (Nova Lei de Licitações e Contratos Administrativos).

Sua tarefa é gerar o conteúdo para um inciso específico do Art. 18 da Lei 14.133/2021, com base no objeto da contratação fornecido.

Regras:
- Gere conteúdo técnico, formal e adequado para documentos oficiais de licitação
- Use linguagem jurídico-administrativa apropriada
- Seja específico e contextualizado ao objeto da contratação
- Inclua referências legais quando pertinente
- O conteúdo deve ser prático e utilizável diretamente no documento
- Gere apenas o conteúdo do inciso, sem títulos ou cabeçalhos
- Adapte o nível de detalhe ao tipo de documento (ETP, TR ou Matriz de Riscos)`;

    const userPrompt = `Objeto da contratação: "${objeto}"
Tipo de documento: ${tipo}

Gere o conteúdo para o seguinte inciso do Art. 18 da Lei 14.133/2021:

Inciso ${incisoNumero} - ${incisoTitulo}
Descrição: ${incisoDescricao}
Texto legal: ${incisoTextoLegal}

Gere um conteúdo completo, técnico e adequado para este inciso, considerando o objeto da contratação informado.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro ao gerar conteúdo com IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("gerar-inciso error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
