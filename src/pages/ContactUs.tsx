
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Home } from "lucide-react";

const ContactUs = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Calendly link after a short delay
    const timer = setTimeout(() => {
      window.location.href = "https://calendly.com/aviralbhardwaj";
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
              <li><Button variant="ghost" onClick={() => navigate('/privacy')}>Privacy Policy</Button></li>
              <li><Button variant="ghost" onClick={() => window.open('https://github.com/Vrahad-Analytics/deltalakestudio', '_blank')}>Contribute on GitHub</Button></li>
              <li><Button variant="ghost" onClick={() => window.open('https://chat.whatsapp.com/DXEemF4EvLn7Wt7121yqEt', '_blank')}>Join Us on WhatsApp</Button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
          <div className="animate-pulse mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-500 mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Redirecting to Calendly</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            You're being redirected to our calendar booking system to schedule a meeting with Aviral Bhardwaj. 
            If you're not redirected automatically, please click the button below.
          </p>
          
          <Button 
            onClick={() => window.location.href = "https://calendly.com/aviralbhardwaj"}
            className="w-full"
          >
            Go to Calendly
          </Button>
          
          <div className="mt-8">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You can also contact us at:
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Setup Meeting: <a href="https://calendly.com/aviralbhardwaj" className="text-purple-600 hover:underline">https://calendly.com/aviralbhardwaj</a><br />
              Phone: +91-9752227743
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

export default ContactUs;
