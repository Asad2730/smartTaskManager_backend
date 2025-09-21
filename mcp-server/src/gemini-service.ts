import { GoogleGenAI } from "@google/genai";

export class GeminiService {
    private ai: GoogleGenAI;

    constructor(apiKey: string) {
        this.ai = new GoogleGenAI({ apiKey });
    }

    async generateContent(prompt: string): Promise<string | undefined> {
        try {
            const response = await this.ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            });

            const result = response.text;
            return result;
        } catch (error) {
            console.error('Gemini API error:', error);
            throw new Error('AI service temporarily unavailable. Please try again later.');
        }
    }

    async generateMonthlySummary(tasks: any[], user: any): Promise<string | undefined> {
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTime = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

        const prompt = `
      As a productivity assistant, generate a monthly summary for a task management user.

      USER PROFILE:
      - Email: ${user.email}
      - Plan: ${user.role}
      
      TASK STATISTICS:
      - Total tasks: ${tasks.length}
      - Completed tasks: ${completedTasks}
      - Completion rate: ${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
      - Total time spent: ${totalTime} minutes (${Math.round(totalTime / 60)} hours)
      
      TASK DETAILS:
      ${tasks.map((task, index) => `
        ${index + 1}. "${task.title}"
           Status: ${task.status}
           Time spent: ${task.timeSpent || 0} minutes
           ${task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
           ${task.description ? `Description: ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}` : ''}
      `).join('')}

      Please provide a concise, motivational summary that includes:
      1. Key productivity insights and patterns
      2. Time allocation analysis
      3. Achievements and accomplishments
      4. Gentle, actionable suggestions for improvement
      5. Encouragement for the coming month

      Format: Friendly, professional, and actionable. Use bullet points for clarity.
    `;

        return this.generateContent(prompt);
    }

    async answerTaskQuery(query: string, tasks: any[], user: any): Promise<string | undefined> {
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const todoTasks = tasks.filter(t => t.status === 'todo').length;
        const totalTime = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
        const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

        const prompt = `
      You are a task management assistant. Answer the user's question about their tasks.

      USER QUESTION: "${query}"

      USER CONTEXT:
      - Email: ${user.email}
      - Plan: ${user.role}
      
      TASK STATISTICS:
      - Total tasks: ${tasks.length}
      - Completed: ${completedTasks}
      - In Progress: ${inProgressTasks}
      - Todo: ${todoTasks}
      - Overdue: ${overdueTasks}
      - Total time spent: ${totalTime} minutes

      TASK DATA (JSON format for reference):
      ${JSON.stringify(tasks, null, 2)}

      Please provide a helpful, accurate response based on the actual task data.
      Include specific numbers, percentages, and details when possible.
      If the question requires calculations, show your work briefly.
      Be conversational but professional and supportive.
    `;

        return this.generateContent(prompt);
    }
}