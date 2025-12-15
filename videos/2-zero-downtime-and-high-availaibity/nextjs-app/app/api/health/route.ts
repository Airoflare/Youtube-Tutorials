import { NextResponse } from "next/server"
import { checkHealth } from "@/lib/health"

export async function GET() {
  const health = await checkHealth()

  return NextResponse.json(
    { status: health.message },
    
    { status: health.status, // Sets the HTTP status code based on the health check result
      headers: {
        'Connection': 'close',  // Suggests closing the connection after the response
        'Access-Control-Allow-Origin': '*' // Allows any website to access this API endpoint (CORS)
      }
    }
  )
}