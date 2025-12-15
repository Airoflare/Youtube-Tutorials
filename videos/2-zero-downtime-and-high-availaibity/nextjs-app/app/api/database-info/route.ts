import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  let status = "Offline"
  let errorMessage = ""
  let totalRows = 0
  let prismaClientVersion = "N/A"
  let dbLatencyMs = 0

  try {
    // Get Prisma Client Version from package.json
    const packageJsonPath = path.join(process.cwd(), "package.json")
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"))
    prismaClientVersion = (packageJson.dependencies["@prisma/client"] || packageJson.devDependencies["@prisma/client"] || "N/A").replace("^", "")

    // Measure database latency with a simple query
    const dbStartTime = process.hrtime.bigint()
    totalRows = await prisma.person.count()
    const dbEndTime = process.hrtime.bigint()
    dbLatencyMs = Number(dbEndTime - dbStartTime) / 1_000_000

    status = "Operational"

   } catch (error: any) {
     console.error("Database connection or query error:", error)
     errorMessage = error.message
   }

   const dbUrl = process.env.DATABASE_URL
  let dbHost = "Unknown"
  if (dbUrl) {
    try {
      const url = new URL(dbUrl)
      dbHost = url.hostname
    } catch (e) {
      console.error("Error parsing database URL:", e)
    }
  }

  const responseData = {
    databaseType: "PostgreSQL",
    status: status,
    message: errorMessage,
    totalRows: totalRows,
    prismaClientVersion: prismaClientVersion,
    dbLatencyMs: parseFloat(dbLatencyMs.toFixed(2)),
    dbHost: dbHost,
  }

  return NextResponse.json(responseData, {
    headers: {
      'Connection': 'close'
    }
  })
}
