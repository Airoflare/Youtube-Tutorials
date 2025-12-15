'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [url, setUrl] = useState('https://i8wccs00g0kws88ko0s0888w.shadowarcanist.internal/api/health')
  const [logs, setLogs] = useState<string[]>([])
  const [isPinging, setIsPinging] = useState(false)
  const [successRate, setSuccessRate] = useState(100)
  const [intervalMs, setIntervalMs] = useState(1000)
  const [retryCount, setRetryCount] = useState(1)
  const [timeoutMs, setTimeoutMs] = useState(1000)

  useEffect(() => {
    if (!isPinging) return

    const interval = setInterval(async () => {
      let status = 0
      let responseTime = 0
      let errorMsg = ''

      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

          const start = Date.now()
          const response = await fetch(url, { signal: controller.signal })
          clearTimeout(timeoutId)
          const end = Date.now()
          status = response.status
          responseTime = end - start
          break
        } catch (error) {
          if (attempt === retryCount) {
            status = 0 // Error after all retries
            responseTime = 0
            errorMsg = error instanceof Error ? error.message : String(error)
          }
        }
      }

      const log = status === 0
        ? `${new Date().toLocaleTimeString()}: Error - ${errorMsg}`
        : `${new Date().toLocaleTimeString()}: ${status} (${responseTime}ms)`

      setLogs(prev => {
        const newLogs = [...prev.slice(-24), log]
        const total = newLogs.length
        const successes = newLogs.filter(l => l.includes('200')).length
        setSuccessRate(total > 0 ? Math.round((successes / total) * 100) : 100)
        return newLogs
      })
    }, intervalMs)

    return () => clearInterval(interval)
  }, [isPinging, url, intervalMs, retryCount, timeoutMs])

  const togglePinging = () => {
    setIsPinging(!isPinging)
    if (!isPinging) {
      setLogs([])
      setSuccessRate(100)
    }
  }

  const clearLogs = () => {
    setLogs([])
    setSuccessRate(100)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Health Tester</CardTitle>
            <CardDescription>
              Ping a URL every second and monitor responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to ping"
                className="flex-1"
              />
              <Button onClick={togglePinging}>
                {isPinging ? 'Stop' : 'Start'}
              </Button>
              <Button onClick={clearLogs} variant="outline">
                Clear Logs
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Interval (ms)</label>
                <Input
                  type="number"
                  value={intervalMs}
                  onChange={(e) => setIntervalMs(Number(e.target.value))}
                  disabled={isPinging}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Retries</label>
                <Input
                  type="number"
                  value={retryCount}
                  onChange={(e) => setRetryCount(Number(e.target.value))}
                  disabled={isPinging}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timeout (ms)</label>
                <Input
                  type="number"
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(Number(e.target.value))}
                  disabled={isPinging}
                />
              </div>
            </div>
            <div className="text-lg font-semibold">
              Success Rate: {successRate}%
            </div>
            <div className="text-sm text-muted-foreground">
              Note: If pinging external URLs, ensure CORS is enabled or use a server-side proxy.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs (Last 25)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-96 overflow-y-auto bg-black p-4 rounded font-mono text-sm">
               {logs.length === 0 ? (
                 <div className="text-muted-foreground">No logs yet</div>
               ) : (
                 logs.map((log, i) => {
                   const [timestamp, ...messageParts] = log.split(': ')
                   const message = messageParts.join(': ')
                   return (
                     <div key={i} className="mb-1">
                       <span className="text-muted-foreground">{timestamp}</span>: {message}
                     </div>
                   )
                 })
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}