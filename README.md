<div align="center">
  <img src="https://deltalakestudio.com/logo.png" alt="Delta Lake Studio Logo" width="200"/>
  <h1>🚀 Delta Lake Studio</h1>
  <p><strong>Visual Pipeline Designer for Databricks and Delta Lake</strong></p>
  <a href="https://deltalakestudio.com"><img src="https://img.shields.io/badge/Website-deltalakestudio.com-blue" alt="Website"/></a>
  <a href="https://github.com/Vrahad-Analytics-India/deltalakestudio/stargazers"><img src="https://img.shields.io/github/stars/Vrahad-Analytics-India/deltalakestudio" alt="Stars"/></a>
  <a href="https://github.com/Vrahad-Analytics-India/deltalakestudio/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"/></a>
</div>

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Technologies Used](#-technologies-used)
- [Architecture](#-architecture)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 🔍 Project Overview

**Delta Lake Studio** is a modern, web-based visual pipeline builder specifically designed for data engineers, data scientists, and analytics teams working with Databricks and Delta Lake. It bridges the gap between code-first and visual development approaches, enabling teams to:

- **Design data pipelines** with an intuitive drag-and-drop interface
- **Configure complex transformations** without writing extensive code
- **Connect to cloud storage** including AWS S3, Azure Blob Storage, and more
- **Deploy and monitor** pipelines directly to Databricks environments
- **Collaborate** with team members through shareable pipeline designs

Whether you're a seasoned data engineer or a business analyst with limited coding experience, Delta Lake Studio provides the tools to build robust, scalable data pipelines with Delta Lake's reliability and performance benefits.

---

## ✨ Key Features

### Visual Pipeline Builder
- **Drag-and-drop interface** for intuitive pipeline design
- **Smart node connections** with automatic data type compatibility checking
- **Canvas navigation** with zoom, pan, and auto-layout capabilities
- **Pipeline versioning** to track changes and rollback when needed

### S3 Mount Integration
- **Secure credential management** for AWS S3 access
- **Visual configuration** of mount points with validation
- **Code preview** with syntax highlighting
- **One-click deployment** to Databricks clusters

### Data Transformation Tools
- **Pre-built transformation components** (filter, join, aggregate, etc.)
- **Custom code blocks** supporting Python, SQL, and Scala
- **Schema validation** to prevent data type mismatches
- **Data preview** functionality to sample outputs

### Databricks Integration
- **Seamless authentication** with Databricks workspaces
- **Cluster management** interface
- **Notebook generation** from visual pipelines
- **Job scheduling** and monitoring capabilities

### Delta Lake Optimizations
- **Table optimization** tools (OPTIMIZE, VACUUM, Z-ORDER)
- **Time travel** interface for data versioning
- **Schema evolution** management
- **Transaction log** visualization

---

## 📸 Screenshots

<div align="center">
  <img src="https://deltalakestudio.com/screenshots/pipeline-canvas.png" alt="Pipeline Canvas" width="80%"/>
  <p><em>Visual Pipeline Canvas with Connected Components</em></p>
  
  <img src="https://deltalakestudio.com/screenshots/s3-mount-dialog.png" alt="S3 Mount Configuration" width="80%"/>
  <p><em>S3 Mount Configuration Dialog with Code Preview</em></p>
  
  <img src="https://deltalakestudio.com/screenshots/databricks-integration.png" alt="Databricks Integration" width="80%"/>
  <p><em>Databricks Workspace Integration Panel</em></p>
</div>

---

## 🛠️ Technologies Used

### Frontend
- **React** - UI library for component-based development
- **TypeScript** - Type-safe JavaScript for robust applications
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible and customizable component library
- **React Flow** - Library for interactive node-based interfaces

### Backend & Infrastructure
- **Node.js** - JavaScript runtime for the backend
- **Express** - Web framework for API endpoints
- **Databricks REST API** - For cluster and job management
- **Delta Lake** - Storage layer for reliable data lakes
- **AWS S3** - Cloud storage integration
- **Docker** - Containerization for consistent deployments

### Development Tools
- **ESLint** - Code quality and style checking
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **GitHub Actions** - CI/CD pipeline automation

---

## 🏗️ Architecture

Delta Lake Studio follows a modern web application architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Node.js API   │────▶│   Databricks    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        ▼                                               ▼
┌─────────────────┐                           ┌─────────────────┐
│                 │                           │                 │
│  Browser Storage│                           │   Cloud Storage │
│                 │                           │   (S3, Azure)   │
└─────────────────┘                           └─────────────────┘
```

The application uses:
- **Component-based architecture** for UI elements
- **State management** with React Context API
- **RESTful API** for backend communication
- **OAuth 2.0** for secure authentication
- **Local storage** for pipeline drafts and user preferences

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- Git
- A Databricks workspace (for full functionality)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vrahad-Analytics-India/deltalakestudio.git
   cd deltalakestudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_DATABRICKS_API_URL=your_databricks_workspace_url
   VITE_S3_REGION=your_aws_region
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running

### Production Build

```bash
# Create optimized production build
npm run build
# or
yarn build

# Preview production build locally
npm run preview
# or
yarn preview
```

---

## 📘 Usage Guide

### Getting Started

1. **Access the application**
   - Open [https://deltalakestudio.com](https://deltalakestudio.com) or your local instance
   - Sign in with your credentials or Databricks account

2. **Create a new pipeline**
   - Click the "New Pipeline" button
   - Give your pipeline a descriptive name
   - The canvas will appear with a grid layout

### Using the S3 Mount Component

1. **Add an S3 Mount node**
   - Drag the "S3 Mount" component from the left sidebar onto the canvas
   - Click on the node to select it

2. **Configure the S3 Mount**
   - Click the "Edit Mount" button in the node
   - Enter your AWS Access Key and Secret Key
   - Specify the S3 bucket name
   - Optionally, customize the mount name (defaults to bucket name)
   - Preview the generated code in the "Code Preview" tab

3. **Save and deploy**
   - Click "Create Mount" to save the configuration
   - The node will display a preview of the mount code
   - Use the "Execute" button to deploy the mount to your Databricks cluster

### Building a Complete Pipeline

1. **Add source nodes**
   - Drag data source components (S3, ADLS, etc.) onto the canvas
   - Configure connection details for each source

2. **Add transformation nodes**
   - Connect transformation components to your data sources
   - Configure each transformation with the desired operations

3. **Add destination nodes**
   - Add output destinations for your processed data
   - Connect the final transformation nodes to these destinations

4. **Deploy the pipeline**
   - Click "Deploy" to generate the complete pipeline code
   - Choose a Databricks cluster to run the pipeline
   - Monitor execution in the "Runs" tab

---

## 🤝 Contributing

We welcome contributions from the community! Delta Lake Studio is an open-source project that thrives on collaboration and diverse perspectives.

### Contribution Guidelines

1. **Fork the repository**
   - Create your own fork of the project
   - Set up the development environment as described above

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards and patterns used in the project
   - Write clear, commented code
   - Include tests for new functionality

4. **Commit your changes**
   ```bash
   git commit -m "Add feature: your feature description"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Open a PR against the main branch
   - Provide a clear description of the changes
   - Reference any related issues

### Development Standards

- Use TypeScript for type safety
- Follow the project's ESLint and Prettier configurations
- Write unit tests for new functionality
- Update documentation for any new features or changes

### Feature Requests and Bug Reports

If you have ideas for new features or have found a bug, please open an issue on GitHub with the appropriate label:
- Use the `enhancement` label for feature requests
- Use the `bug` label for bug reports

---

## 📄 License

Delta Lake Studio is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📫 Contact & Support

### Official Channels

- **Website**: [https://deltalakestudio.com](https://deltalakestudio.com)
- **GitHub Issues**: [Report bugs or request features](https://github.com/Vrahad-Analytics-India/deltalakestudio/issues)
- **Email Support**: support@deltalakestudio.com
- **Schedule a Demo**: [Calendly](https://calendly.com/aviralbhardwaj)

### Community

- **Discord**: [Join our community](https://discord.gg/3h6zT4bY)
- **Twitter**: [@DeltaLakeStudio](https://twitter.com/DeltaLakeStudio)
- **LinkedIn**: [Delta Lake Studio](https://www.linkedin.com/company/delta-lake-studio)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Vrahad-Analytics-India">Vrahad Analytics India</a> and the open-source community.</p>
  <p><em>Last updated: May 18, 2025</em></p>
</div>



