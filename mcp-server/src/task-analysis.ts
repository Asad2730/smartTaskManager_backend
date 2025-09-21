import { GeminiService } from './gemini-service';
import axios from 'axios';
import type { AIResponse, ChatQueryRequest, MonthlySummaryRequest } from './types';

export class TaskAnalysisService {
    private geminiService: GeminiService;
    private mainAppUrl: string;

    constructor(apiKey: string, mainAppUrl: string = 'http://app:4000') {
        this.geminiService = new GeminiService(apiKey);
        this.mainAppUrl = mainAppUrl;
    }

    private async fetchUserTasks(userId: string): Promise<any[]> {
        try {
            const response = await axios.get(`${this.mainAppUrl}/api/tasks`, {
                timeout: 10000,
                headers: {
                    'X-User-ID': userId,
                    'X-Internal-Request': 'true'
                }
            });

            return response.data.tasks;
        } catch (error) {
            console.error('Error fetching user tasks from main app:', error);
            throw new Error('Failed to fetch user tasks from database');
        }
    }

 private async fetchUser(userId: string): Promise<any> {
    try {
        const response = await axios.get(`${this.mainAppUrl}/api/profile`, {
            timeout: 10000,
            headers: {
                'X-User-ID': userId,
                'X-Internal-Request': 'true'
            }
        });
        
        return response.data.user;
    } catch (error) {
        console.error('Error fetching user from main app:', error);
        throw new Error('Failed to fetch user data from database');
    }
}

    async generateMonthlySummary(request: MonthlySummaryRequest): Promise<AIResponse> {
        try {
            const [user, tasks] = await Promise.all([
                this.fetchUser(request.userId),
                this.fetchUserTasks(request.userId)
            ]);

           
            const filteredTasks = tasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                return taskDate.getMonth() === request.month - 1 &&
                    taskDate.getFullYear() === request.year;
            });

            const summary = await this.geminiService.generateMonthlySummary(filteredTasks, user);

          
            const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
            const totalTime = filteredTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

            return {
                summary,
                insights: [
                    `Analyzed ${filteredTasks.length} tasks from ${request.month}/${request.year}`,
                    `Completion rate: ${filteredTasks.length > 0 ? Math.round((completedTasks / filteredTasks.length) * 100) : 0}%`,
                    `Total time invested: ${Math.round(totalTime / 60)} hours`
                ],
                data: {
                    totalTasks: filteredTasks.length,
                    completedTasks,
                    inProgressTasks: filteredTasks.filter(t => t.status === 'in-progress').length,
                    todoTasks: filteredTasks.filter(t => t.status === 'todo').length,
                    totalTimeSpent: totalTime
                }
            };
        } catch (error) {
            console.error('Error generating monthly summary:', error);
            throw new Error('Failed to generate monthly summary');
        }
    }

    async handleChatQuery(request: ChatQueryRequest): Promise<AIResponse> {
        try {
            const [user, tasks] = await Promise.all([
                this.fetchUser(request.userId),
                this.fetchUserTasks(request.userId)
            ]);

            const response = await this.geminiService.answerTaskQuery(request.query, tasks, user);

            return {
                summary: response,
                insights: [
                    `Query: "${request.query}"`,
                    `Based on analysis of ${tasks.length} tasks`,
                    `User: ${user.email} (${user.role} plan)`
                ],
                data: {
                    query: request.query,
                    tasksAnalyzed: tasks.length,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Error handling chat query:', error);
            throw new Error('Failed to process chat query');
        }
    }
}


