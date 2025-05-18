
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { 
  Database, 
  Home, 
  Lock, 
  Server, 
  Shield, 
  Package, 
  Activity, 
  Layers, 
  BarChart, 
  Code, 
  Workflow, 
  FileText 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple validation
    if (!url || !token) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Remove any guest mode flag first
    sessionStorage.removeItem('guest_mode');
    
    // Store credentials in session storage
    sessionStorage.setItem('databricks_url', url);
    sessionStorage.setItem('databricks_token', token);
    
    toast({
      title: "Success",
      description: "Logged in successfully",
    });
    
    navigate('/dashboard');
  };
  
  const populateExampleCredentials = () => {
    setUrl('https://example-workspace.cloud.databricks.com');
    setToken('dapi1234567890abcdef');
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
        <Helmet>
          <title>Delta Lake Studio | Visual Data Pipeline Designer for Databricks</title>
          <meta name="description" content="Build, optimize, and manage Delta Lake data pipelines with our intuitive visual designer. Connect to Databricks, design ETL workflows, and monitor performance in real-time." />
          <meta name="keywords" content="Delta Lake, Databricks, data pipeline, ETL, data engineering, data warehouse, data lakehouse, visual pipeline designer, big data, data transformation, data analytics" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://deltalakestudio.com/" />
          <meta property="og:title" content="Delta Lake Studio | Visual Data Pipeline Designer for Databricks" />
          <meta property="og:description" content="Build, optimize, and manage Delta Lake data pipelines with our intuitive visual designer. Connect to Databricks, design ETL workflows, and monitor performance in real-time." />
          <meta property="og:image" content="https://deltalakestudio.com/og-image.png" />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://deltalakestudio.com/" />
          <meta property="twitter:title" content="Delta Lake Studio | Visual Data Pipeline Designer for Databricks" />
          <meta property="twitter:description" content="Build, optimize, and manage Delta Lake data pipelines with our intuitive visual designer. Connect to Databricks, design ETL workflows, and monitor performance in real-time." />
          <meta property="twitter:image" content="https://deltalakestudio.com/og-image.png" />
          
          {/* Canonical URL */}
          <link rel="canonical" href="https://deltalakestudio.com/" />
          
          {/* Structured Data / JSON-LD */}
          <script type="application/ld+json">{`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Delta Lake Studio",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Visual data pipeline designer for Databricks and Delta Lake",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "125"
              }
            }
          `}</script>
        </Helmet>
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav>
            <ul className="flex space-x-6">
              <li><Button variant="ghost" onClick={() => navigate('/about')}>About Us</Button></li>
              <li><Button variant="ghost" onClick={() => navigate('/privacy')}>Privacy Policy</Button></li>
              <li><Button variant="ghost" onClick={() => navigate('/contact')}>Contact Us</Button></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
        <div className="w-full max-w-lg animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-700 dark:text-purple-400">
            Delta Lake Studio
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
            Visual Data Pipeline Designer for Databricks
          </h2>
          <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">
            Build, optimize, and manage Delta Lake data pipelines with our intuitive visual designer. 
            Connect to Databricks, design ETL workflows, and monitor performance in real-time.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">#DeltaLake</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">#Databricks</span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">#DataPipelines</span>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium">#ETL</span>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">#DataEngineering</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Database className="text-purple-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Delta Lake Integration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Native support for Delta Lake tables and ACID transactions</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Layers className="text-indigo-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Visual ETL Designer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Intuitive drag-and-drop pipeline builder for ETL workflows</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Activity className="text-blue-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Real-time Analytics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Monitor pipeline performance and data quality metrics</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Shield className="text-green-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Enterprise Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Role-based access control and data encryption</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Code className="text-red-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Auto-generated Code</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Automatically generate optimized Spark and SQL code</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <BarChart className="text-amber-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Data Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Built-in data validation and quality monitoring tools</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <Workflow className="text-teal-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Workflow Orchestration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Schedule and orchestrate complex data pipelines</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg shadow backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <FileText className="text-cyan-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Data Catalog</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Discover and manage your data assets with metadata</p>
              </div>
            </div>
          </div>
        </div>
        
        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg rounded-xl animate-scale-in">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Connect to Databricks</CardTitle>
            <CardDescription className="text-center">
              Enter your Databricks credentials to access your data lakehouse
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  <Server className="h-4 w-4" /> Databricks Workspace URL
                </Label>
                <Input
                  id="url"
                  className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors focus:bg-white dark:focus:bg-slate-900"
                  placeholder="https://your-workspace.cloud.databricks.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  aria-label="Databricks Workspace URL"
                  aria-required="true"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your Databricks workspace URL (e.g., dbc-abc123-def4.cloud.databricks.com)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Access Token
                </Label>
                <Input
                  id="token"
                  type="password"
                  className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors focus:bg-white dark:focus:bg-slate-900"
                  placeholder="Enter your Databricks access token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  aria-label="Databricks Access Token"
                  aria-required="true"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your personal access token from Databricks User Settings
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">Need help?</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={populateExampleCredentials}
            >
              Try with Example Credentials
            </Button>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              For demo purposes, you can use example credentials to explore our Delta Lake pipeline designer.
            </p>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h4 className="font-medium text-blue-700 dark:text-blue-300 text-sm">Why Choose Delta Lake Studio?</h4>
              <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1 list-disc list-inside">
                <li>Build ETL pipelines with our visual designer - no coding required</li>
                <li>Seamless integration with Databricks and Delta Lake</li>
                <li>Optimize data transformations with intelligent suggestions</li>
                <li>Monitor data quality and pipeline performance</li>
                <li>Enterprise-grade security and access controls</li>
              </ul>
            </div>

            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
              <p>Don't have a Databricks account? <a href="https://databricks.com/try-databricks" className="text-purple-600 hover:underline hover:text-purple-700 transition-colors" target="_blank" rel="noopener noreferrer">Get started with Databricks</a></p>
            </div>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              <p>New to Delta Lake? <a href="https://delta.io/" className="text-indigo-600 hover:underline hover:text-indigo-700 transition-colors" target="_blank" rel="noopener noreferrer">Learn about Delta Lake architecture</a></p>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white dark:bg-slate-800 shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              &copy; 2023-{currentYear} Delta Lake Studio. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
              <a href="https://delta.io/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Delta Lake</a>
              <a href="https://databricks.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Databricks</a>
              <a href="https://spark.apache.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Apache Spark</a>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About Us</a>
              <a href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="py-3 bg-slate-100 dark:bg-slate-900 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Delta Lake Studio - The #1 Visual ETL Designer for Databricks and Delta Lake</p>
        </div>
      </footer>
    </div>
    </HelmetProvider>
  );
};

export default Index;
