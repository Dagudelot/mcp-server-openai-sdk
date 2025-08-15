import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Custom tool schema
const WeatherToolSchema = z.object({
  city: z.string().describe("The city to get weather information for"),
  unit: z.enum(["celsius", "fahrenheit"]).optional().default("celsius").describe("Temperature unit"),
});

// Custom tool implementation
async function getWeatherInfo(city: string, unit: "celsius" | "fahrenheit" = "celsius"): Promise<string> {
  // Simulate weather API call
  const temperature = Math.floor(Math.random() * 30) + 10; // Random temp between 10-40
  const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const tempDisplay = unit === "fahrenheit" ? `${Math.round(temperature * 9/5 + 32)}°F` : `${temperature}°C`;
  
  return `Weather in ${city}: ${tempDisplay}, ${condition}`;
}

// Define the custom tool
const weatherTool: Tool = {
  name: "get_weather",
  description: "Get current weather information for a specific city",
  inputSchema: {
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
  },
};

class CustomMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "custom-mcp-server",
        version: "1.0.0",
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [weatherTool],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "get_weather":
          const { city, unit } = WeatherToolSchema.parse(args);
          const weatherInfo = await getWeatherInfo(city, unit);
          return {
            content: [
              {
                type: "text",
                text: weatherInfo,
              },
            ],
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Custom MCP Server started");
  }
}

// Start the server
const server = new CustomMCPServer();
server.run().catch(console.error);
