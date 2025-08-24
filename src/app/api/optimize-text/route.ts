import { NextRequest, NextResponse } from 'next/server'

interface OptimizeTextRequest {
  text: string
  mode: string
  customInstructions?: string
}

const optimizationPrompts = {
  'human-characteristics': `
Optimize the following text to make it more human-like and natural. Focus on these seven key characteristics:

1. **Perplexity Variation**: Add varied sentence complexity and length
2. **Burstiness**: Mix short punchy sentences with longer, more complex ones
3. **Natural Flow**: Ensure ideas connect smoothly and logically
4. **Conversational Elements**: Include subtle conversational markers and transitions
5. **Emotional Nuance**: Add appropriate emotional undertones where suitable
6. **Stylistic Variety**: Vary sentence structures and paragraph lengths
7. **Authentic Voice**: Make the writing sound like it comes from a real person with expertise

Keep the core meaning and information intact while making these improvements.
`,

  'ai-guidance': `
Analyze the following text and provide a comprehensive rewriting strategy. Include:

1. **Current Issues**: Identify characteristics that make it sound AI-generated
2. **Improvement Areas**: Specific aspects that need enhancement
3. **Rewriting Strategy**: Step-by-step approach for humanizing the content
4. **Optimized Version**: The improved text following your strategy
5. **Key Changes**: Summary of what was modified and why

Focus on making the text more engaging, natural, and human-like while preserving all important information.
`
}

async function callLLM(prompt: string, text: string, apiProvider: string, apiKey: string, model: string) {
  const fullPrompt = `${prompt}\n\nText to optimize:\n\n${text}`
  
  switch (apiProvider) {
    case 'openai':
      return await callOpenAI(fullPrompt, apiKey, model)
    case 'anthropic':
      return await callAnthropic(fullPrompt, apiKey, model)
    case 'google':
      return await callGemini(fullPrompt, apiKey)
    default:
      throw new Error('Unsupported API provider')
  }
}

async function callOpenAI(prompt: string, apiKey: string, model: string) {
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
          role: 'system',
          content: 'You are an expert writing optimization assistant that helps make AI-generated text more natural, engaging, and human-like.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

async function callAnthropic(prompt: string, apiKey: string, model: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0]?.text || ''
}

async function callGemini(prompt: string, apiKey: string) {
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
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4000,
      }
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizeTextRequest = await request.json()
    const { text, mode, customInstructions } = body

    // Get API settings from headers
    const apiProvider = request.headers.get('x-api-provider') || 'openai'
    const apiKey = request.headers.get('x-api-key') || ''
    const model = request.headers.get('x-api-model') || 'gpt-3.5-turbo'

    if (!apiKey && apiProvider !== 'ollama') {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Text to optimize is required' },
        { status: 400 }
      )
    }

    let optimizationPrompt = ''
    
    if (mode === 'custom' && customInstructions) {
      optimizationPrompt = customInstructions
    } else if (mode in optimizationPrompts) {
      optimizationPrompt = optimizationPrompts[mode as keyof typeof optimizationPrompts]
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid optimization mode' },
        { status: 400 }
      )
    }

    const optimizedText = await callLLM(
      optimizationPrompt,
      text,
      apiProvider,
      apiKey,
      model
    )

    if (!optimizedText) {
      throw new Error('No optimized text generated')
    }

    return NextResponse.json({
      success: true,
      optimizedText
    })

  } catch (error) {
    console.error('Text optimization error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}