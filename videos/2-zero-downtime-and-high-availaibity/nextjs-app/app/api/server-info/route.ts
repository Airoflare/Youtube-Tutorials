import { NextResponse } from "next/server"
import os from "os"
import dns from "dns"

export async function GET(req: Request) {
  const startTime = process.hrtime.bigint()

  const hostIp = await new Promise<string | undefined>((resolve) => {
    dns.lookup("host.docker.internal", (err, address) => {
      if (err) {
        resolve(undefined)
      } else {
        resolve(address)
      }
    })
  })

  const serverIp = hostIp || os.hostname()

  const headers: { [key: string]: string } = {}
  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  const endTime = process.hrtime.bigint()
  const responseTimeMs = Number(endTime - startTime) / 1_000_000

  const responseData = {
    serverIp: serverIp,
    request: {
      method: "GET",
      path: "/api/server-info",
      timestamp: new Date().toISOString(),
      headers: headers,
    },
    response: {
      status: 200,
      message: "OK",
      timestamp: new Date().toISOString(),
      responseTimeMs: parseFloat(responseTimeMs.toFixed(2)),
    },
  }

  return NextResponse.json(responseData, {
    headers: {
      'Connection': 'close'
    }
  })
}
