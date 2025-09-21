import express from 'express';
import cors from 'cors';
import { TaskAnalysisService } from './task-analysis';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY environment variable is required');
  process.exit(1);
}

const taskAnalysisService = new TaskAnalysisService(apiKey);


app.post('/api/ai/monthly-summary', async (req, res) => {
  try {
    const { userId, month, year } = req.body;
    
    if (!userId || !month || !year) {
      return res.status(400).json({ 
        error: 'userId, month, and year are required',
        success: false
      });
    }

    const result = await taskAnalysisService.generateMonthlySummary({
      userId,
      month: parseInt(month),
      year: parseInt(year)
    });

    res.json({ ...result, success: true });
  } catch (error: any) {
    console.error('Monthly summary error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate monthly summary',
      success: false
    });
  }
});


app.post('/api/ai/chat', async (req, res) => {
  try {
    const { userId, query } = req.body;
    
    if (!userId || !query) {
      return res.status(400).json({ 
        error: 'userId and query are required',
        success: false
      });
    }

    const result = await taskAnalysisService.handleChatQuery({
      userId,
      query
    });

    res.json({ ...result, success: true });
  } catch (error: any) {
    console.error('Chat query error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process chat query',
      success: false
    });
  }
});


app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'smart-task-manager-ai',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});


app.get('/api', (req, res) => {
  res.json({
    name: 'Smart Task Manager AI Server',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/ai/monthly-summary',
        method: 'POST',
        description: 'Generate monthly task summary with AI insights',
        body: {
          userId: 'string (required)',
          month: 'number (required)',
          year: 'number (required)'
        }
      },
      {
        path: '/api/ai/chat',
        method: 'POST',
        description: 'Process natural language queries about tasks',
        body: {
          userId: 'string (required)',
          query: 'string (required)'
        }
      }
    ]
  });
});

app.listen(port, () => {
  console.log(`AI Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`API docs: http://localhost:${port}/api`);
});