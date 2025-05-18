
import { toast } from "@/hooks/use-toast";

// This service would integrate with your chosen AI provider
// For production, you would replace this with actual API calls

export interface AIServiceOptions {
  apiKey?: string;
  modelName?: string;
  endpoint?: string;
}

export class AIService {
  private apiKey?: string;
  private modelName: string;
  private endpoint: string;

  constructor(options: AIServiceOptions = {}) {
    this.apiKey = options.apiKey;
    this.modelName = options.modelName || 'gpt-4o-mini';
    this.endpoint = options.endpoint || 'https://api.openai.com/v1/chat/completions';
  }

  async generateResponse(message: string, history: Array<{role: string, content: string}> = []): Promise<string> {
    // If no API key, return a simulated response (for development only)
    if (!this.apiKey) {
      console.warn('No API key provided. Using simulated response.');
      return this.simulateResponse(message);
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that specializes in data processing, Delta Lake, and data pipelines. Help the user understand concepts and build their pipeline.'
            },
            ...history,
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate AI response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "AI Response Error",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive",
      });
      return "I'm sorry, I encountered an error processing your request. Please try again later.";
    }
  }

  // For development/testing without an API key
  private simulateResponse(message: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          resolve("Hello! How can I help you with your data pipeline today?");
        } else if (lowerMessage.includes('pipeline')) {
          resolve("A data pipeline is a series of data processing steps. In Delta Lake Studio, you can create pipelines by connecting source nodes to transformation nodes and finally to destination nodes.");
        } else if (lowerMessage.includes('transform')) {
          resolve("Transformations allow you to modify, filter, and shape your data. Common transformations include filtering rows, selecting columns, aggregating data, and joining datasets.");
        } else if (lowerMessage.includes('delta lake')) {
          resolve("Delta Lake is an open-source storage layer that brings reliability to data lakes. It provides ACID transactions, scalable metadata handling, and unifies streaming and batch data processing.");
        } else {
          resolve("I'm here to help with your data pipeline. You can ask about specific data processing concepts or how to build your pipeline in Delta Lake Studio.");
        }
      }, 500);
    });
  }
}

export const aiService = new AIService();
