import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Use your new API key
    const API_KEY = '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';
    
    const openrouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'x-ai/grok-4.1-fast:free',
        messages: [
          {
            role: 'system',
            content: 'You are Cyber AI, created by "The World of Cybersecurity" and developed by Team Cybersecurity. You are helpful, friendly, and knowledgeable.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://cyber-ai.vercel.app',
          'X-Title': 'Cyber AI Assistant'
        },
        timeout: 30000
      }
    );
    
    const aiResponse = openrouterResponse.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }
    
    return res.status(200).json({
      success: true,
      response: aiResponse,
      usage: openrouterResponse.data.usage || {}
    });
    
  } catch (error) {
    console.error('Proxy Error:', error.response?.data || error.message);
    
    return res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message || 'Unknown error'
    });
  }
}
