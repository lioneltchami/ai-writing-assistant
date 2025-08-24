import { NextRequest, NextResponse } from 'next/server'

interface TestConnectionRequest {
  provider: string
  apiKey: string
  model: string
  endpoint?: string
}

async function testOpenAI(apiKey: string, model: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: 'Say "Hello" if you can see this message.'
        }
      ],
      max_tokens: 10,
    }),
  })

  return response.ok
}

async function testAnthropic(apiKey: string, model: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 10,
      messages: [
        {
          role: 'user',
          content: 'Say "Hello" if you can see this message.'
        }
      ],
    }),
  })

  return response.ok
}

async function testGemini(apiKey: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: 'Say "Hello" if you can see this message.'
            }
          ]
        }
      ],
      generationConfig: {
        maxOutputTokens: 10,
      }
    }),
  })

  return response.ok
}

async function testOllama(endpoint: string = 'http://localhost:11434') {
  try {
    const response = await fetch(`${endpoint}/api/tags`, {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    return false
  }
}

async function testCustomAPI(endpoint: string, apiKey: string, model: string) {
  try {
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: 'Say "Hello" if you can see this message.'
          }
        ],
        max_tokens: 10,
      }),
    })
    return response.ok
  } catch (error) {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TestConnectionRequest = await request.json()
    const { provider, apiKey, model, endpoint } = body

    let isConnected = false

    switch (provider) {
      case 'openai':
        isConnected = await testOpenAI(apiKey, model)
        break
      
      case 'anthropic':
        isConnected = await testAnthropic(apiKey, model)
        break
      
      case 'google':
        isConnected = await testGemini(apiKey)
        break
      
      case 'ollama':
        isConnected = await testOllama(endpoint)
        break
      
      case 'custom':
        isConnected = await testCustomAPI(endpoint || '', apiKey, model)
        break
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported provider' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: isConnected,
      message: isConnected ? 'Connection successful' : 'Connection failed'
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Connection test failed'
      },
      { status: 500 }
    )
  }
}