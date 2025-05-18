
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMessageProps } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message extends ChatMessageProps {
  id: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
  onCreateNode?: (nodeType: string, details: any) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onClose,
  onCreateNode
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      message: "Hello! I'm your AI assistant. How can I help you with your data pipeline today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Here you would call your AI service
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse = processUserMessage(message);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          message: aiResponse,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsProcessing(false);
    }
  };

  // Simple simulation of AI response
  // This would be replaced by your actual AI service
  const processUserMessage = (message: string): string => {
    const msgLower = message.toLowerCase();
    
    // Basic pattern matching for demonstration
    if (msgLower.includes('create') && msgLower.includes('pipeline')) {
      if (onCreateNode) {
        // For demonstration purposes, we simulate creating a data source node
        setTimeout(() => {
          onCreateNode('source', {
            label: 'CSV Data Source',
            details: 'Sample data from user request'
          });
        }, 500);
      }
      return "I'm creating a pipeline for you. I've added a data source node to get started.";
    }
    
    if (msgLower.includes('transform') || msgLower.includes('transformation')) {
      if (onCreateNode) {
        setTimeout(() => {
          onCreateNode('transformation', {
            label: 'Filter Transformation',
            details: 'Filter data based on conditions'
          });
        }, 500);
      }
      return "I've added a transformation node to your pipeline. This will help you filter and process your data.";
    }
    
    if (msgLower.includes('data processing') || msgLower.includes('explain')) {
      return "Data processing involves collecting raw data and transforming it into useful information. In Delta Lake Studio, you can create pipelines with source nodes (where data comes from), transformation nodes (how data is processed), and destination nodes (where processed data goes).";
    }
    
    return "I'm here to help you build data pipelines. You can ask me to create different types of nodes, explain concepts, or guide you through the process.";
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'h-full' : 'h-full'} bg-background border rounded-lg shadow-lg`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">Pipeline Assistant</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id}
              message={msg.message}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <ChatInput 
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};
