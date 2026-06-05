Implementation Plan: Client-Side Telemetry Integration via Azure Static Web Apps
This document outlines the technical specifications and deployment steps to enable client-side application monitoring for a standalone React application hosted on Azure Static Web Apps (SWA). The strategy utilizes a minimal, low-overhead JavaScript API placeholder to bypass Azure Portal infrastructure constraints and unlock native portal telemetry mapping without incurring runtime infrastructure fees.

Architecture Overview
By default, the Azure Portal limits native Application Insights linking within the SWA blade to instances that contain at least one integrated backend route. To satisfy this validation without migrating the existing custom Web API backend into Azure Functions, a lightweight JavaScript HTTP trigger is introduced into the repository.

[ Browser / React App ] ───(Direct Telemetry HTTPS)───> [ Application Insights ]
         │
         ├───(Static Content Requests)───────────────> [ Azure Static Web App ]
         │                                                      │
         └───(Portal Validation Bypass)─────────────────────────└──> [ /api Placeholder ]
The React architecture initializes the Application Insights JavaScript SDK client-side during the application boot phase. Performance metrics, exceptions, and user interactions are securely streamed from the user's browser straight to the provisioned Azure Log Analytics workspace.

## Phase 1: Repository Infrastructure Additions
1. API Endpoint Definition
A new directory named api/telemetry-ping/ must be generated at the repository root. This directory contains the necessary configuration and script execution contexts required by the Kudu/Oryx build engines during deployment.

File: /api/telemetry-ping/function.json

JSON
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
File: /api/telemetry-ping/index.js

JavaScript
module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: "SWA Telemetry placeholder active."
  };
};


2. CI/CD Workflow Modification
The automation pipeline configuration file (e.g., GitHub Actions workflow file located at .github/workflows/azure-static-web-apps-*.yml) must be updated to include the targeted API directory location. This instructs the builder to compile and deploy the function runtime alongside the static assets.

YAML
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: "upload"
  app_location: "/"          # Target directory for the React source code
  api_location: "api"        # Target directory for the placeholder function
  output_location: "dist"    # Production build output directory (Vite standard)



## Phase 2: Azure Resource Provisioning & Linking
Once the updated code repository has been merged and the CI/CD pipeline executes successfully, the portal constraints resolve.

Navigate to the Azure Portal and select the target Static Web App instance.

Under the Monitoring menu category, select Application Insights.

Toggle the selection to Yes to enable integration.

Select or provision a target log analytics workspace and click Save.

Open the newly linked Application Insights resource instance and retrieve the Connection String from the global Overview metadata panel.

## Phase 3: Frontend SDK Integration
1. Dependency Installation
The Microsoft Application Insights web tracking module must be added to the frontend dependency array.

Bash
npm install @microsoft/applicationinsights-web
2. Environment Configuration
The connection string must be decoupled from application code through environment variable files to enforce clean configuration decoupling across dev, staging, and production boundaries.

File: .env.production

Code snippet
VITE_APPINSIGHTS_CONNECTION_STRING=your_production_connection_string_here
3. Telemetry Subsystem Initialization
A core management file initializes the tracking instance and sets up auto-route tracking properties designed for single-page applications (SPAs).

File: src/telemetry.js

JavaScript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const connectionString = import.meta.env?.VITE_APPINSIGHTS_CONNECTION_STRING || process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING;

const appInsights = new ApplicationInsights({
  config: {
    connectionString: connectionString,
    enableAutoRouteTracking: true,
    maxAjaxCallsPerView: 50
  }
});

if (connectionString) {
  appInsights.loadAppInsights();
  appInsights.trackPageView();
}

export { appInsights };
4. Entry Point Execution Execution
To capture initial DOM load contexts and structural client performance timings accurately, the tracking instance is imported directly into the application initialization flow.

File: src/main.jsx (or src/index.js)

JavaScript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './telemetry'; // Invokes instantaneous module execution

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
Phase 4: Telemetry Instrumentation Standards
Developers can leverage the exported tracking reference to report custom transactional boundaries or process failures.

Pattern A: Custom Interaction Logs
JavaScript
import { appInsights } from '../telemetry';

const logUserInteraction = (eventName, analyticalProperties = {}) => {
  appInsights.trackEvent({
    name: eventName,
    properties: analyticalProperties
  });
};
Pattern B: Exception Ingestion
JavaScript
import { appInsights } from '../telemetry';

try {
  // Runtime or External Network API logic execution
} catch (error) {
  appInsights.trackException({ exception: error });
}