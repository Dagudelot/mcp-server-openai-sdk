import OpenAI from "openai";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function testMethod2() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  // ⚠️ ACTUALIZA ESTA URL CON LA NUEVA URL DE TU TÚNEL
  const webhookUrl = "https://lightbox-longer-absence-convergence.trycloudflare.com/webhook/weather";
  
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY not found");
    return;
  }

  const openai = new OpenAI({ apiKey });

  console.log("🤖 Método 2: Tu código maneja la conexión automáticamente");
  console.log("========================================================\n");
  console.log(`🌐 Webhook URL: ${webhookUrl}`);
  console.log("📋 Flujo: Usuario → OpenAI → Tu código → Tu webhook → Tu código → OpenAI → Usuario\n");

  const userQuestion = "¿Cuál es el clima en Ciudad de México?";

  try {
    console.log(`👤 Usuario: ${userQuestion}`);
    
    // Paso 1: OpenAI decide llamar la función
    console.log("🔧 Paso 1: OpenAI detecta que necesita información del clima");
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userQuestion }],
      tools: [{
        type: "function",
        function: {
          name: "get_weather",
          description: "Get weather for a city",
          parameters: {
            type: "object",
            properties: {
              city: { type: "string" },
              unit: { type: "string", enum: ["celsius", "fahrenheit"] }
            },
            required: ["city"]
          }
        }
      }],
      tool_choice: "auto",
    });

    const assistantMessage = response.choices[0]?.message;
    
    if (assistantMessage?.tool_calls) {
      console.log("✅ OpenAI quiere llamar la función get_weather");
      
      // Paso 2: Tu código llama automáticamente tu webhook
      console.log("🔄 Paso 2: Tu código llama automáticamente tu webhook");
      
      const toolCall = assistantMessage.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      
      console.log(`   📋 Argumentos: ${JSON.stringify(args, null, 2)}`);
      
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: toolCall.function.name,
          arguments: args
        })
      });
      
      if (webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        console.log(`✅ Paso 3: Tu MCP server responde: ${webhookData.content}`);
        
        // Paso 4: Tu código envía la respuesta de vuelta a OpenAI
        console.log("🔄 Paso 4: Tu código envía la respuesta de vuelta a OpenAI");
        
        const finalResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "user", content: userQuestion },
            assistantMessage,
            {
              role: "tool",
              tool_call_id: toolCall.id,
              content: webhookData.content
            }
          ]
        });
        
        console.log(`🤖 Paso 5: OpenAI presenta la respuesta final:`);
        console.log(`   ${finalResponse.choices[0]?.message?.content}`);
        
        console.log("\n🎉 ¡Método 2 funcionando perfectamente!");
        console.log("✅ Tu código maneja automáticamente toda la comunicación");
        
      } else {
        console.log(`❌ Error en webhook: ${webhookResponse.status}`);
        console.log("💡 Verifica que tu túnel de Cloudflare esté funcionando");
      }
    } else {
      console.log("❌ OpenAI no detectó la necesidad de llamar la función");
    }
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Posibles soluciones:");
    console.log("1. Verifica que tu servidor webhook esté corriendo: npm run webhook");
    console.log("2. Verifica que tu túnel de Cloudflare esté activo");
    console.log("3. Actualiza la URL del webhook en el script");
  }
}

testMethod2().catch(console.error);
