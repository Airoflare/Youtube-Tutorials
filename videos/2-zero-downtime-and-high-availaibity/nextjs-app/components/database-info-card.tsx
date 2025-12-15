"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Database, HeartPulse, XCircle, Server, Clock, Rows, SendHorizontal, Activity } from "lucide-react"

interface CombinedInfo {
  databaseType: string
  status: string
  serverIp: string // This will now be the db host
  message?: string
  totalRows: number
  prismaClientVersion: string
  dbLatencyMs: number
}

export default function DatabaseInfoCard() {
  const [combinedInfo, setCombinedInfo] = useState<CombinedInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const refreshInterval = 5000 // 5 seconds
  const [nextRefreshTime, setNextRefreshTime] = useState(refreshInterval / 1000)

  const fetchInfo = async () => {
    setError(null)
    try {
      const dbRes = await fetch("/api/database-info")

      if (!dbRes.ok) {
        throw new Error(`Database API error! status: ${dbRes.status}`)
      }

      const dbData = await dbRes.json()

      setCombinedInfo({
        databaseType: dbData.databaseType,
        status: dbData.status,
        serverIp: dbData.dbHost, // Use dbHost from the database-info API
        message: dbData.message,
        totalRows: dbData.totalRows,
        prismaClientVersion: dbData.prismaClientVersion,
        dbLatencyMs: dbData.dbLatencyMs,
      })
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setNextRefreshTime((prev) => {
        if (prev > 0) {
          return prev - 1
        } else {
          // Trigger the data fetch when the countdown reaches 0
          fetchInfo()
          return refreshInterval / 1000 // Reset the timer to 5 seconds
        }
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [])

  // Don't render the card if no data is available
  if (!combinedInfo) {
    return null
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-96 bg-background/95 backdrop-blur-sm border border-border shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Database Details</span>
          </div>

          {error && <div className="text-center text-sm text-red-500">Error: {error}</div>}

          <div className="space-y-2 text-xs">
            {/* Server IP */}
            <div className="flex items-center gap-2">
              <Server className="w-3 h-3 text-purple-500" />
              <span className="font-medium text-muted-foreground">Server IP:</span>
              <motion.span
                key={combinedInfo.serverIp}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {combinedInfo.serverIp}
              </motion.span>
            </div>

            {/* Database Type */}
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-blue-500" />
              <span className="font-medium text-muted-foreground">Type:</span>
              <motion.span
                key={combinedInfo.databaseType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {combinedInfo.databaseType}
              </motion.span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              {combinedInfo.status === "Operational" ? (
                <HeartPulse className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              <span className="font-medium text-muted-foreground">Status:</span>
              <motion.span
                key={combinedInfo.status}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`font-mono ${combinedInfo.status === "Operational" ? "text-green-500" : "text-red-500"}`}
              >
                {combinedInfo.status}
              </motion.span>
            </div>

            {/* Error Message (if degraded) */}
            {combinedInfo.status === "Degraded" && combinedInfo.message && (
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="font-medium text-muted-foreground">Error:</span>
                <motion.span
                  key={combinedInfo.message}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-red-500"
                >
                  {combinedInfo.message}
                </motion.span>
              </div>
            )}

            {/* Total Rows */}
            <div className="flex items-center gap-2">
              <Rows className="w-3 h-3 text-gray-500" />
              <span className="font-medium text-muted-foreground">Total Rows:</span>
              <motion.span
                key={combinedInfo.totalRows}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {combinedInfo.totalRows.toLocaleString()}
              </motion.span>
            </div>

            {/* Prisma Client Version */}
            <div className="flex items-center gap-2">
              <SendHorizontal className="w-3 h-3 text-cyan-500" />
              <span className="font-medium text-muted-foreground">Prisma Version:</span>
              <motion.span
                key={combinedInfo.prismaClientVersion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {combinedInfo.prismaClientVersion}
              </motion.span>
            </div>

            {/* Database Latency */}
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-pink-500" />
              <span className="font-medium text-muted-foreground">DB Latency:</span>
              <motion.span
                key={combinedInfo.dbLatencyMs}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {combinedInfo.dbLatencyMs}ms
              </motion.span>
            </div>

            {/* Next Refresh */}
            <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Next Refresh:</span>
              <motion.span
                key={nextRefreshTime}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {nextRefreshTime}s
              </motion.span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
