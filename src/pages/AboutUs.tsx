
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Home } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();
  
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
              <li><Button variant="ghost" onClick={() => navigate('/privacy')}>Privacy Policy</Button></li>
              <li><Button variant="ghost" onClick={() => navigate('/contact')}>Contact Us</Button></li>
              <li><Button variant="ghost" onClick={() => window.open('https://github.com/Vrahad-Analytics/deltalakestudio', '_blank')}>Contribute on GitHub</Button></li>
              <li><Button variant="ghost" onClick={() => window.open('https://chat.whatsapp.com/DXEemF4EvLn7Wt7121yqEt', '_blank')}>Join Us on WhatsApp</Button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">About Delta Lake Studio</h1>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              At Delta Lake Studio, we're on a mission to simplify data engineering and analytics for organizations of all sizes. 
              We believe that powerful data tools should be accessible, intuitive, and efficient, enabling businesses to extract 
              maximum value from their data assets without excessive complexity.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Delta Lake Studio provides a visual, low-code interface for designing, building, and managing data pipelines on 
              the Databricks platform. Our intuitive drag-and-drop interface makes it easy to create complex data workflows, 
              transformations, and analytics processes without writing extensive code.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">For Data Engineers</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Accelerate your pipeline development with visual tools that generate optimized Spark code. Focus on solving 
                  data problems instead of writing boilerplate.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">For Data Scientists</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Easily prepare and transform data for your ML models without deep engineering expertise. Connect data sources 
                  and build preprocessing pipelines visually.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">For Analysts</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Access the power of Databricks without coding. Create data transformation flows and connect to visualization 
                  tools with minimal technical overhead.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">For IT Leaders</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Maximize your Databricks investment with tools that increase productivity and enable broader adoption across 
                  your organization.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Delta Lake Studio was founded by a team of data engineers and architects who recognized the gap between powerful 
              data processing capabilities and accessibility. After years of building custom solutions for enterprise clients, 
              we created Delta Lake Studio to democratize access to modern data architecture patterns and best practices.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Ready to transform how you work with data? Try Delta Lake Studio today and experience the future of data engineering.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/')} className="mr-4">Login</Button>
              <Button onClick={() => navigate('/contact')} variant="outline">Contact Sales</Button>
            </div>
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

export default AboutUs;
