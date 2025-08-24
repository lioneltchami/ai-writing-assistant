import { NextRequest, NextResponse } from 'next/server'

interface GenerateContentRequest {
  topic: string
  keywords: string[]
  wordCount: number
  style: {
    language: string
    structure: string
    narrative: string
    emotion: string
    creativity: string
    formality: string
    technicality: string
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
          content: 'You are a professional writing assistant that creates high-quality, engaging content based on specific requirements and style guidelines.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
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
      temperature: 0.7,
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
        temperature: 0.7,
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
    const body: GenerateContentRequest = await request.json()
    const { topic, keywords, wordCount, style } = body

    // Get API settings from headers (passed from frontend)
    const apiProvider = request.headers.get('x-api-provider') || 'openai'
    const apiKey = request.headers.get('x-api-key') || ''
    const model = request.headers.get('x-api-model') || 'gpt-3.5-turbo'

    if (!apiKey && apiProvider !== 'ollama') {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    // Build the prompt based on the requirements
    const keywordText = keywords.length > 0 ? `Include these keywords naturally: ${keywords.join(', ')}` : ''
    
    const styleDescription = `
Style Requirements:
- Language Style: ${style.language}
- Structure: ${style.structure}
- Narrative Perspective: ${style.narrative}
- Emotional Tone: ${style.emotion}
- Creativity Level: ${style.creativity}
- Formality: ${style.formality}
- Technical Level: ${style.technicality}
`

    const prompt = `Write a comprehensive article about "${topic}" with approximately ${wordCount} words.

${keywordText}

${styleDescription}

Please create engaging, high-quality content that:
1. Has a compelling introduction that hooks the reader
2. Follows a logical structure with clear sections
3. Includes specific examples and actionable insights
4. Maintains the specified style and tone throughout
5. Concludes with a strong summary or call-to-action

The content should be original, informative, and valuable to readers interested in this topic.`

    let generatedContent = ''

    // Call the appropriate API based on provider
    switch (apiProvider) {
      case 'openai':
        generatedContent = await callOpenAI(prompt, apiKey, model)
        break
      case 'anthropic':
        generatedContent = await callAnthropic(prompt, apiKey, model)
        break
      case 'google':
        generatedContent = await callGemini(prompt, apiKey)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported API provider' },
          { status: 400 }
        )
    }

    if (!generatedContent) {
      throw new Error('No content generated')
    }

    return NextResponse.json({
      success: true,
      content: generatedContent
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}