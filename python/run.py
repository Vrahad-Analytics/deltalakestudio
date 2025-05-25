#!/usr/bin/env python3
import os
import sys
import subprocess

def setup_environment():
    """Set up virtual environment and install dependencies"""
    print("Setting up virtual environment...")
    
    # Create virtual environment if it doesn't exist
    if not os.path.exists("venv"):
        subprocess.run([sys.executable, "-m", "venv", "venv"])
    
    # Determine the pip path based on OS
    pip_path = os.path.join("venv", "Scripts", "pip") if sys.platform == "win32" else os.path.join("venv", "bin", "pip")
    
    # Install requirements
    print("Installing dependencies...")
    subprocess.run([pip_path, "install", "-r", "requirements.txt"])
    
    print("Environment setup complete!")

def run_app():
    """Run the Flask application"""
    # Determine the python path based on OS
    python_path = os.path.join("venv", "Scripts", "python") if sys.platform == "win32" else os.path.join("venv", "bin", "python")
    
    print("Starting Flask application...")
    subprocess.run([python_path, "app.py"])

if __name__ == "__main__":
    # Create templates and static directories if they don't exist
    os.makedirs("templates", exist_ok=True)
    os.makedirs(os.path.join("static", "css"), exist_ok=True)
    os.makedirs(os.path.join("static", "js"), exist_ok=True)
    os.makedirs(os.path.join("static", "temp"), exist_ok=True)
    
    # Create __init__.py files for Python packages
    open(os.path.join("services", "__init__.py"), "a").close()
    
    # Setup environment and run app
    setup_environment()
    run_app()