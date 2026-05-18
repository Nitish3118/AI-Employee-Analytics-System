// controllers/aiController.js - AI interaction controller
const Employee = require('../models/Employee');

// @desc    Get AI recommendation for an employee
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      res.status(400);
      throw new Error('employeeId is required');
    }

    const employee = await Employee.findById(employeeId);
    
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const promptText = `Analyze this employee and return JSON with these exact keys:
  {
    "promotionRecommendation": "string",
    "performanceFeedback": "string",
    "skillGaps": ["string"],
    "trainingRecommendations": ["string"],
    "overallSummary": "string"
  }
  Employee: Name=${employee.name}, Dept=${employee.department}, Score=${employee.performanceScore}/100, Experience=${employee.experience || 0}yrs, Skills=${employee.skills.join(',')}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let aiResponse;
    try {
      const fetchResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'HR Analytics App'
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [
            {
              role: 'system',
              content: 'You are an expert HR analytics AI. Respond ONLY with valid JSON. No markdown, no text outside JSON.'
            },
            {
              role: 'user',
              content: promptText
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        console.error('OpenRouter API Error:', fetchResponse.status, errorText);
        throw new Error('AI service unavailable');
      }

      aiResponse = await fetchResponse.json();
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError);
      res.status(502);
      throw new Error('AI service unavailable');
    }

    try {
      const content = aiResponse.choices[0].message.content.trim();
      
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found');
      }
      
      const jsonString = content.substring(jsonStart, jsonEnd + 1);
      const parsedData = JSON.parse(jsonString);
      
      res.json(parsedData);
    } catch (parseError) {
      res.status(500);
      throw new Error('Invalid AI response format');
    }
    
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation };
