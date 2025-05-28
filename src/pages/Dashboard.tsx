
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { ExternalLink, Code, Database, Zap, FileSpreadsheet, ArrowRightLeft, Home, Menu, Shield } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const navigate = useNavigate();
  const [workspaceUrl, setWorkspaceUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is logged in with credentials
    const url = sessionStorage.getItem('databricks_url');
    const token = sessionStorage.getItem('databricks_token');
    
    if (!url || !token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setWorkspaceUrl(url);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('databricks_url');
    sessionStorage.removeItem('databricks_token');
    sessionStorage.removeItem('guest_mode');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  // Function to open Databricks workspace
  const openDatabricksWorkspace = () => {
    if (workspaceUrl) {
      window.open(workspaceUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="animate-pulse text-slate-700 dark:text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
                <Menu size={20} />
              </Button>
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetContent side="right" className="w-[250px] sm:max-w-none py-8">
                  <div className="flex flex-col space-y-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-start gap-2"
                    >
                      <Home size={18} />
                      <span>Home</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        openDatabricksWorkspace();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-start gap-2"
                    >
                      <span>Databricks Home</span>
                      <ExternalLink size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        window.open('https://github.com/Vrahad-Analytics/deltalakestudio', '_blank');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-start gap-2"
                    >
                      <span>Contribute on GitHub</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        window.open('https://chat.whatsapp.com/DXEemF4EvLn7Wt7121yqEt', '_blank');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-start gap-2"
                    >
                      <span>Join Us on WhatsApp</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <Home size={18} />
                <span>Home</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={openDatabricksWorkspace}
                className="flex items-center gap-2"
              >
                <span>Databricks Home</span>
                <ExternalLink size={16} />
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.open('https://github.com/Vrahad-Analytics/deltalakestudio', '_blank')}
              >
                Contribute on GitHub
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.open('https://chat.whatsapp.com/DXEemF4EvLn7Wt7121yqEt', '_blank')}
              >
                Join Us on WhatsApp
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2 sm:mb-4">Welcome to deltalakestudio.com</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-2 sm:mb-4">
            Design and manage your data pipelines with our intuitive drag-and-drop interface.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            You are connected to: {' '}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium text-left break-all" 
              onClick={openDatabricksWorkspace}
            >
              {workspaceUrl} <ExternalLink className="ml-1 inline" size={14} />
            </Button>
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-4">Data Platform Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Code className="mr-2 text-purple-500" size={24} />
              <h3 className="text-lg font-semibold">Pipeline Designer</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Visual pipeline editor with drag-and-drop components
            </p>
            <Button className="w-full" onClick={() => navigate('/pipeline-designer')}>
              Launch Designer
            </Button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Shield className="mr-2 text-blue-500" size={24} />
              <h3 className="text-lg font-semibold">Master Data Management</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Unified data governance, quality management, and integration platform
            </p>
            <Button className="w-full" onClick={() => navigate('/master-data-management')}>
              Launch MDM
            </Button>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Automation & Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <Zap className="mr-2 text-yellow-500" size={24} />
              <h3 className="text-lg font-semibold">API Connectors</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Connect to external services and APIs without code
            </p>
            <Button className="w-full" variant="outline">
              Coming Soon
            </Button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <FileSpreadsheet className="mr-2 text-red-500" size={24} />
              <h3 className="text-lg font-semibold">Kubernetes Deployment</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Automate your Kubernetes
            </p>
            <Button className="w-full" variant="outline">
              Coming Soon
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-2">
              <ArrowRightLeft className="mr-2 text-blue-500" size={24} />
              <h3 className="text-lg font-semibold">DataFlow</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Migrate your Data from source to Target
            </p>
            <Button className="w-full" onClick={() => navigate('/data-flow')}>
              Launch DataFlow
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
