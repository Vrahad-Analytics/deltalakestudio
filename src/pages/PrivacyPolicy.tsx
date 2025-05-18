
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Home, LayoutDashboard } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
                  <Home size={18} />
                  <span>Home</span>
                </Button>
              </li>
              <li>
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Button>
              </li>
              <li><Button variant="ghost" onClick={() => navigate('/about')}>About Us</Button></li>
              <li><Button variant="ghost" onClick={() => navigate('/contact')}>Contact Us</Button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Last Updated: May 16, 2025
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Delta Lake Studio ("we", "our", or "us") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">2.1 Personal Information</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When you create an account or use our services, we may collect personal information such as:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>Name</li>
                <li>Email address</li>
                <li>Company information</li>
                <li>Job title</li>
                <li>Databricks workspace URL (stored only in your browser's session storage)</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-2">2.2 Usage Information</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We may also collect information about how you access and use our services, including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Pages visited</li>
                <li>Time and date of your visit</li>
                <li>Time spent on pages</li>
                <li>Click-stream data</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>Providing and maintaining our services</li>
                <li>Improving our services</li>
                <li>Personalizing your experience</li>
                <li>Communicating with you about updates or changes</li>
                <li>Customer support</li>
                <li>Security and fraud prevention</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We implement appropriate security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We may use third-party services that collect or use your information. These third-party services have their own privacy policies, and we encourage you to read them.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions about this Privacy Policy, please visit our <a href="/contact" className="text-purple-600 hover:underline">Contact Us</a> page.
              </p>
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

export default PrivacyPolicy;
