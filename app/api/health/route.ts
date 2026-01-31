import { NextResponse } from 'next/server'

/**
 * Health Check Endpoint for Cloud Run
 * 
 * Cloud Run uses this to determine if the instance is healthy.
 * Returns 200 if healthy, 503 if unhealthy.
 * 
 * GET /api/health
 */

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  version: string
  uptime: number
  checks: {
    name: string
    status: 'pass' | 'fail' | 'warn'
    message?: string
    duration?: number
  }[]
}

// Track server start time
const startTime = Date.now()

// Check if API backend is reachable
async function checkApiBackend(): Promise<{ status: 'pass' | 'fail' | 'warn'; message?: string; duration: number }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    return { status: 'warn', message: 'API URL not configured', duration: 0 }
  }
  
  const start = Date.now()
  
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    const duration = Date.now() - start
    
    if (response.ok) {
      return { status: 'pass', duration }
    } else {
      return { status: 'fail', message: `API returned ${response.status}`, duration }
    }
  } catch (error) {
    const duration = Date.now() - start
    return { 
      status: 'fail', 
      message: error instanceof Error ? error.message : 'Connection failed',
      duration 
    }
  }
}

// Check memory usage
function checkMemory(): { status: 'pass' | 'fail' | 'warn'; message: string; duration: number } {
  const start = Date.now()
  
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()
    const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024)
    const percentUsed = (usage.heapUsed / usage.heapTotal) * 100
    
    const duration = Date.now() - start
    
    if (percentUsed > 90) {
      return { status: 'fail', message: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed.toFixed(1)}%)`, duration }
    } else if (percentUsed > 75) {
      return { status: 'warn', message: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed.toFixed(1)}%)`, duration }
    }
    
    return { status: 'pass', message: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${percentUsed.toFixed(1)}%)`, duration }
  }
  
  return { status: 'pass', message: 'Memory check not available', duration: Date.now() - start }
}

export async function GET() {
  const checks: HealthStatus['checks'] = []
  
  // Memory check
  const memoryCheck = checkMemory()
  checks.push({
    name: 'memory',
    ...memoryCheck,
  })
  
  // API backend check (only in production or if API URL is set)
  if (process.env.NEXT_PUBLIC_API_URL) {
    const apiCheck = await checkApiBackend()
    checks.push({
      name: 'api_backend',
      ...apiCheck,
    })
  }
  
  // Determine overall status
  const hasFailure = checks.some(c => c.status === 'fail')
  const hasWarning = checks.some(c => c.status === 'warn')
  
  let overallStatus: HealthStatus['status'] = 'healthy'
  if (hasFailure) overallStatus = 'unhealthy'
  else if (hasWarning) overallStatus = 'degraded'
  
  const healthStatus: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.round((Date.now() - startTime) / 1000),
    checks,
  }
  
  // Return 503 if unhealthy (Cloud Run will mark instance as unhealthy)
  const httpStatus = overallStatus === 'unhealthy' ? 503 : 200
  
  return NextResponse.json(healthStatus, { 
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

// Also support HEAD requests for simple health checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
