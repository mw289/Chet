import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY

    return NextResponse.json({
      status: "API is working",
      timestamp: new Date().toISOString(),
      environment: {
        hasOpenAIKey,
        nodeEnv: process.env.NODE_ENV,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "API test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    return NextResponse.json({
      status: "POST request received",
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "POST test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
