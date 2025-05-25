# Delta Lake Studio - Python Flask Backend

This is the Python Flask backend for Delta Lake Studio, a data pipeline design tool for Databricks.

## Setup and Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

### Quick Start

1. Navigate to the project directory:
   ```bash
   cd python
   ```

2. Run the setup script:
   ```bash
   python run.py
   ```

   This script will:
   - Create a virtual environment
   - Install required dependencies
   - Start the Flask application

3. Access the application at http://localhost:8080

### Manual Setup

If you prefer to set up manually:

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the application:
   ```bash
   python app.py
   ```

## API Endpoints

- **POST /api/pipeline/generate-code** - Generate PySpark pipeline code
- **POST /api/databricks/deploy-notebook** - Deploy notebook to Databricks
- **POST /api/s3/deploy-mount** - Deploy S3 mount notebook
- **POST /api/download-code** - Download generated code

## Project Structure

```
python/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── run.py                  # Setup and run script
├── services/               # Service modules
│   ├── __init__.py
│   ├── data_validation_service.py
│   ├── ml_service.py
│   ├── notebook_service.py
│   ├── s3_mount_service.py
│   └── spark_code_generator.py
├── static/                 # Static assets
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── temp/               # Temporary files for downloads
└── templates/              # HTML templates
    └── index.html
```

## Development

To add new features or modify existing ones:

1. Ensure you have activated the virtual environment
2. Make your changes
3. Test locally by running `python app.py`
4. Restart the application to see your changes

## License

Copyright © 2023 Delta Lake Studio