import express from "express";
import { spawn } from "child_process";
import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Weather tool schema
const WeatherToolSchema = z.object({
  city: z.string().describe("The city to get weather information for"),
  unit: z.enum(["celsius", "fahrenheit"]).optional().default("celsius").describe("Temperature unit"),
});

// Weather tool implementation (same as MCP server)
async function getWeatherInfo(city: string, unit: "celsius" | "fahrenheit" = "celsius"): Promise<string> {
  const temperature = Math.floor(Math.random() * 30) + 10;
  const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const tempDisplay = unit === "fahrenheit" ? `${Math.round(temperature * 9/5 + 32)}°F` : `${temperature}°C`;
  
  return `Weather in ${city}: ${tempDisplay}, ${condition}`;
}

// Webhook endpoint for OpenAI function calling
app.post("/webhook/weather", async (req, res) => {
  try {
    console.log("🌐 Webhook called:", req.body);
    
    const { name, arguments: args } = req.body;
    
    if (name === "get_weather") {
      const { city, unit } = WeatherToolSchema.parse(args);
      const weatherInfo = await getWeatherInfo(city, unit);
      
      console.log(`🌤️ Weather for ${city}: ${weatherInfo}`);
      
      res.json({
        content: weatherInfo
      });
    } else {
      res.status(400).json({ error: "Unknown function" });
    }
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "MCP Weather Webhook Server is running" });
});

// Function definition endpoint (for OpenAI to discover available functions)
app.get("/functions", (req, res) => {
  res.json([
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get current weather information for a specific city",
        parameters: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The city to get weather information for"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              default: "celsius",
              description: "Temperature unit"
            }
          },
          required: ["city"]
        }
      }
    }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 MCP Weather Webhook Server running on http://localhost:${PORT}`);
  console.log(`📋 Function definition: http://localhost:${PORT}/functions`);
  console.log(`🌐 Webhook endpoint: http://localhost:${PORT}/webhook/weather`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log("\n📖 Next steps:");
  console.log("1. Use ngrok to expose this server: ngrok http 3000");
  console.log("2. Configure OpenAI to use your webhook URL");
  console.log("3. Test from OpenAI Playground!");
});
