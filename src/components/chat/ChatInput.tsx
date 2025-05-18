
import React, { useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  isProcessing = false
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const toggleRecording = () => {
    // Voice recording functionality would be implemented here
    setIsRecording(!isRecording);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
      <div className="relative flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about pipelines or data processing..."
          className="resize-none w-full p-3 pr-10 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
          disabled={isProcessing}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          size="icon" 
          variant="outline"
          onClick={toggleRecording}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isProcessing}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
};
