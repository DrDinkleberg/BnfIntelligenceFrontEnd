// API route for dashboard statistics
// Uses mock data for development - will connect to GCP backend in production

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        totalLawFirms: 729,
        totalEntities: 1456,
        totalEvents: 3892,
        totalAlerts: 47,
        totalAdSpend: 36000000,
        riskDistribution: {
          low: 245,
          medium: 412,
          high: 189,
          critical: 45,
        },
      },
    })

    // Original code commented out for reference
    // const supabase = getSupabaseClient()

    // // Get total counts for dashboard
    // const [{ count: totalLawFirms }, { count: totalEntities }, { count: totalEvents }, { count: totalAlerts }] =
    //   await Promise.all([
    //     supabase.from("law_firms").select("*", { count: "exact", head: true }),
    //     supabase.from("monitored_entities").select("*", { count: "exact", head: true }).eq("status", "active"),
    //     supabase.from("regulatory_events").select("*", { count: "exact", head: true }),
    //     supabase.from("alert_history").select("*", { count: "exact", head: true }).is("acknowledged_at", null),
    //   ])

    // // Get activity summary for last 30 days
    // const thirtyDaysAgo = new Date()
    // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // const { data: recentActivity } = await supabase
    //   .from("firm_activity")
    //   .select("ad_spend_estimate")
    //   .gte("activity_date", thirtyDaysAgo.toISOString())
    //   .not("ad_spend_estimate", "is", null)

    // const totalAdSpend = recentActivity?.reduce((sum, activity) => sum + (activity.ad_spend_estimate || 0), 0) || 0

    // // Get risk distribution
    // const { data: riskDistribution } = await supabase
    //   .from("risk_assessments")
    //   .select("risk_category")
    //   .order("assessed_at", { ascending: false })

    // const riskCounts =
    //   riskDistribution?.reduce(
    //     (acc, assessment) => {
    //       acc[assessment.risk_category] = (acc[assessment.risk_category] || 0) + 1
    //       return acc
    //     },
    //     {} as Record<string, number>,
    //   ) || {}

    // return NextResponse.json({
    //   success: true,
    //   data: {
    //     totalLawFirms: totalLawFirms || 0,
    //     totalEntities: totalEntities || 0,
    //     totalEvents: totalEvents || 0,
    //     totalAlerts: totalAlerts || 0,
    //     totalAdSpend,
    //     riskDistribution: riskCounts,
    //   },
    // })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
