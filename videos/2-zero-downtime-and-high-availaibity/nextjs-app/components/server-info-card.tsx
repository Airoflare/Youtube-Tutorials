"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Server, Clock, GitPullRequest, CornerDownRight, Hexagon } from "lucide-react"

interface ServerInfo {
  serverIp: string
  request: {
    method: string
    path: string
    timestamp: string
    headers: Record<string, string>
  }
  response: {
    status: number
    message: string
    timestamp: string
    responseTimeMs: number
  }
}

export default function ServerInfoCard() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const refreshInterval = 5000 // 5 seconds
  const [nextRefreshTime, setNextRefreshTime] = useState(refreshInterval / 1000)

  const fetchServerInfo = async () => {
    setError(null)
    try {
      const res = await fetch("/api/server-info")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: ServerInfo = await res.json()
      setServerInfo(data)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchServerInfo()

    // Countdown and refresh synchronization
    const interval = setInterval(() => {
      setNextRefreshTime((prev) => {
        if (prev > 0) {
          return prev - 1 // Decrease timer
        } else {
          fetchServerInfo() // Trigger data refresh when timer hits 0
          return refreshInterval / 1000 // Reset timer
        }
      })
    }, 1000) // 1-second interval for countdown

    return () => clearInterval(interval)
  }, [])

  // Don't render the card if no data is available
  if (!serverInfo) {
    return null
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-96 bg-background/95 backdrop-blur-sm border border-border shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Server Details</span>
          </div>

          {error && <div className="text-center text-sm text-red-500">Error: {error}</div>}

          <div className="space-y-2 text-xs">
            {/* Server IP */}
            <div className="flex items-center gap-2">
              <Server className="w-3 h-3 text-blue-500" />
              <span className="font-medium text-muted-foreground">Hostname:</span>
              <motion.span
                key={serverInfo.serverIp} // Stable key for Server IP
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {serverInfo.serverIp}
              </motion.span>
            </div>

            {/* Request Method */}
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-3 h-3 text-green-500" />
              <span className="font-medium text-muted-foreground">Request:</span>
              <motion.span
                key={`${serverInfo.request.method}-${serverInfo.request.path}`} // Stable key for request
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {serverInfo.request.method} {serverInfo.request.path}
              </motion.span>
            </div>

            {/* Request Timestamp */}
            <div className="flex items-center gap-2 pl-5">
              <CornerDownRight className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Time:</span>
              <motion.span
                key={serverInfo.request.timestamp} // Stable key for request timestamp
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {new Date(serverInfo.request.timestamp).toLocaleTimeString()}
              </motion.span>
            </div>

            {/* Response Status */}
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-purple-500" />
              <span className="font-medium text-muted-foreground">Response:</span>
              <motion.span
                key={`${serverInfo.response.status}-${serverInfo.response.message}`} // Stable key for response status
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                Status {serverInfo.response.status} ({serverInfo.response.message})
              </motion.span>
            </div>

            {/* Latency */}
            <div className="flex items-center gap-2 pl-5">
              <CornerDownRight className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Latency:</span>
              <motion.span
                key={serverInfo.response.responseTimeMs} // Stable key for response latency
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="font-mono text-foreground"
              >
                {serverInfo.response.responseTimeMs}ms
              </motion.span>
             </div>

             {/* App Version */}
             <div className="flex items-center gap-2">
               <Hexagon className="w-3 h-3 text-yellow-500" />
               <span className="font-medium text-muted-foreground">App Version:</span>
               <span className="font-mono text-foreground">v1</span>
             </div>

             {/* Next Refresh Timer */}
             <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Next Refresh:</span>
              <motion.span
                key={nextRefreshTime} // Stable key for the timer
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
