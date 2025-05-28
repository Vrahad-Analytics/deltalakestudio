
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { Home } from "lucide-react";

const AISettings = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('ai_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setApiKey(settings.apiKey || '');
        setModel(settings.model || 'gpt-4o-mini');
        setIsEnabled(settings.isEnabled !== false);
      } catch (error) {
        console.error('Error loading AI settings:', error);
      }
    }
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // In a real application, you might want to validate the API key first
      // For now, we'll just save it to localStorage
      const settings = {
        apiKey,
        model,
        isEnabled,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('ai_settings', JSON.stringify(settings));
      
      toast({
        title: "Settings saved",
        description: "Your AI configuration has been updated successfully.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2"
                >
                  <Home size={18} />
                  <span>Home</span>
                </Button>
              </li>
              <li><Button variant="ghost" onClick={() => navigate('/about')}>About Us</Button></li>
              <li><Button variant="ghost" onClick={() => navigate('/contact')}>Contact Us</Button></li>
              <li><Button variant="ghost" onClick={() => window.open('https://github.com/Vrahad-Analytics/deltalakestudio', '_blank')}>Contribute on GitHub</Button></li>
              <li><Button variant="ghost" onClick={() => window.open('https://chat.whatsapp.com/DXEemF4EvLn7Wt7121yqEt', '_blank')}>Join Us on WhatsApp</Button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">AI Integration Settings</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure your AI assistant for the pipeline designer. The AI assistant helps you create
                and understand data pipelines through natural language conversations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn the AI assistant on or off in the pipeline designer
                  </p>
                </div>
                <Switch 
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select 
                  value={model} 
                  onValueChange={setModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast & Affordable)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (Powerful)</SelectItem>
                    <SelectItem value="gpt-4.5-turbo">GPT-4.5 Turbo (Most Advanced)</SelectItem>
                    <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the AI model that will power your assistant. More powerful models provide better
                  understanding but may be slower or more expensive.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and used to authenticate with the AI provider.
                  Get an API key from <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">OpenAI</a>.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Your API keys are stored locally in your browser and are never sent to our servers.
              They are used exclusively to communicate directly from your browser to the AI provider.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-slate-800 shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; 2023-2025 Delta Lake Studio. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">About Us</a>
              <a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Privacy Policy</a>
              <a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AISettings;
