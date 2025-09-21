import axios from 'axios';

const AI_SERVER_URL = process.env.AI_SERVER_URL ?? 'http://mcp-server:8080';

export const getMonthlySummaryService = async (userId: string, month: number, year: number) => {
  const response = await axios.post(`${AI_SERVER_URL}/api/ai/monthly-summary`, {
    userId,
    month,
    year
  }, {
    timeout: 30000
  });
  return response.data;
};

export const chatQueryService = async (userId: string, query: string) => {
  const response = await axios.post(`${AI_SERVER_URL}/api/ai/chat`, {
    userId,
    query
  }, {
    timeout: 30000
  });
  return response.data;
};