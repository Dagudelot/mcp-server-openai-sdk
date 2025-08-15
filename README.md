# MCP Server with OpenAI Integration

Este proyecto demuestra cómo crear un servidor MCP (Model Context Protocol) personalizado con una herramienta de clima e integrarlo con OpenAI usando Cloudflare Tunnel.

<a href="https://glama.ai/mcp/servers/@Dagudelot/mcp-server-openai-sdk">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@Dagudelot/mcp-server-openai-sdk/badge" alt="Server with OpenAI Integration MCP server" />
</a>

## 🚀 Características

- **Servidor MCP personalizado** con herramienta de clima
- **Integración automática** con OpenAI usando tu propio código
- **Túnel de Cloudflare** para exposición pública
- **TypeScript** completamente tipado
- **Function calling automático** sin intervención manual

## 📁 Estructura del Proyecto

```
mcp-server-openai-sdk/
├── src/
│   ├── index.ts              # Servidor MCP principal
│   ├── webhook-server.ts     # Servidor webhook para OpenAI
│   └── test-method2.ts       # Test de integración automática
├── package.json              # Dependencias y scripts
├── tsconfig.json            # Configuración TypeScript
├── .env                     # Variables de entorno (crear)
└── README.md                # Este archivo
```

## 🛠️ Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   # Crear archivo .env
   echo "OPENAI_API_KEY=tu-api-key-aqui" > .env
   ```

3. **Compilar el proyecto**:
   ```bash
   npm run build
   ```

## 🚀 Uso

### Paso 1: Iniciar el servidor webhook
```bash
npm run webhook
```

### Paso 2: Crear túnel de Cloudflare
En otra terminal:
```bash
cloudflared tunnel --url http://localhost:3000
```

### Paso 3: Actualizar la URL del túnel
Edita `src/test-method2.ts` y actualiza la URL:
```typescript
const webhookUrl = "https://tu-nueva-url.trycloudflare.com/webhook/weather";
```

### Paso 4: Probar la integración
```bash
npm run test
```

## 🎯 Cómo Funciona

### Flujo Automático (Método 2)

1. **Usuario pregunta**: "¿Cuál es el clima en Bogotá?"
2. **OpenAI detecta**: Necesita información del clima
3. **Tu código llama automáticamente**: Tu webhook de Cloudflare
4. **Tu MCP server responde**: Con datos del clima
5. **Tu código envía**: La respuesta de vuelta a OpenAI
6. **OpenAI presenta**: La respuesta final naturalmente

### Ejemplo de Salida

```
👤 Usuario: ¿Cuál es el clima en Bogotá?
🔧 Paso 1: OpenAI detecta que necesita información del clima
✅ OpenAI quiere llamar la función get_weather
🔄 Paso 2: Tu código llama automáticamente tu webhook
   📋 Argumentos: { "city": "Bogotá" }
✅ Paso 3: Tu MCP server responde: Weather in Bogotá: 15°C, cloudy
🔄 Paso 4: Tu código envía la respuesta de vuelta a OpenAI
🤖 Paso 5: OpenAI presenta la respuesta final:
   El clima en Bogotá es de 15°C, nublado.
```

## 🔧 Scripts Disponibles

- `npm run build` - Compilar el proyecto
- `npm run webhook` - Iniciar servidor webhook
- `npm run test` - Probar integración automática
- `npm run dev` - Modo desarrollo

## 🎯 Ventajas de esta Integración

✅ **Completamente automático** - No necesitas intervención manual  
✅ **Tu código controla todo** - Manejas la comunicación  
✅ **Escalable** - Puedes agregar más herramientas fácilmente  
✅ **Producción lista** - Listo para usar en aplicaciones reales  

## 🔍 Archivos Esenciales

- **`src/index.ts`** - Servidor MCP con herramienta de clima
- **`src/webhook-server.ts`** - Servidor webhook para OpenAI
- **`src/test-method2.ts`** - Test de integración automática

## 📝 Notas

- El servidor webhook debe estar corriendo en puerto 3000
- El túnel de Cloudflare debe estar activo
- La URL del túnel debe actualizarse en el script de test
- Esta integración funciona completamente automática sin intervención manual

## 🎉 ¡Listo!

Tu servidor MCP personalizado está completamente integrado con OpenAI y funcionando automáticamente. Puedes hacer preguntas sobre el clima y obtener respuestas naturales sin intervención manual.