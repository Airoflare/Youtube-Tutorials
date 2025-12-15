import { prisma } from "./prisma"

let isShuttingDown = false

// Handle SIGTERM signal for graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM - Changing health status to Service Unavailable')
  isShuttingDown = true
})

export async function checkHealth() {
  if (isShuttingDown) {
    return { status: 503, message: 'Service Unavailable - Shutting down' }
  }

  try {
    // Check database connectivity with a simple query
    await prisma.$queryRaw`SELECT 1`
    return { status: 200, message: 'OK' }
  } catch (error) {
    console.error('Health check failed:', error)
    return { status: 503, message: 'Service Unavailable - Database connection failed' }
  }
}