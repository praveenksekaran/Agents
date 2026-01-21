# Objectives
- Build an agent with Agent Development Kit (ADK) made up of a root agent and sub-agents

# Project introdcution
Shop for paint for DIY home renovation projects.

Paint-shop-UI:
- Visually create a floor plan of the house
- add floor, rooms, doors and windows
- select color for each wall

Paint Service Agent 
- Start on UI start, to welcome the user 
- on 'Submit', take the dimensions and plan
- sub agents for calculations 

# Multiagent build and Deploy
```
cloudshell workspace ~

cd ~/paint-planner/paint-agent-service
export PATH=$PATH:"/home/${USER}/.local/bin"
python3 -m pip install "google-adk==1.16.0"
python3 pip install -r requirements.txt

```

```
cd ~/paint-planner/paint-agent-service
cat << EOF > .env
GOOGLE_GENAI_USE_VERTEXAI=TRUE
GOOGLE_CLOUD_PROJECT=[Your Project ID]
GOOGLE_CLOUD_LOCATION=us-central1
RESOURCES_BUCKET=paint-planner-bucket
MODEL=gemini-2.5-flash
SEARCH_ENGINE_ID=YOUR_ID
EOF

```

```
cp .env paint_agent/.env

adk web --reload

```
## Deploy on Vertext engine

#### Run the below command
```
# Create requirements into paint_agent
# add below line 
# google-cloud-aiplatform[adk,agent_engines]==1.110.0

# Change to folder
cd ~/paint-planner/paint-agent-service

adk deploy agent_engine paint_agent \
--display_name "paint agent servicer" \
--staging_bucket gs://paint-planner-bucket
```

#### Oputput 
```
>>Using bucket paint-planner-bucket
>>Wrote to gs://paint-planner-bucket/agent_engine/agent_engine.pkl
>>Writing to gs://paint-planner-bucket/agent_engine/requirements.txt
>>Creating in-memory tarfile of extra_packages
>>Writing to gs://paint-planner-bucket/agent_engine/dependencies.tar.gz

# Vertex URL is returned 
vertexai.agent_engines.get('[Vertex Engine Resource name]')
```

## To query the agent, you must first grant it the authorization to call models via Vertex AI
1. navigate to IAM in the console
2. Click the checkbox to Include Google-provided role grants
3. Find the AI Platform Reasoning Engine Service Agent (service-PROJECT_NUMBER@gcp-sa-aiplatform-re.iam.gserviceaccount.com), and click the edit pencil icon in this service agent's row.
4. Click + Add another role
5. In the `Select a role` field, enter `Vertex AI User`. If you deploy an agent that uses tools to access other data, you would grant access to those systems to this service agent as well.
6. Save

## Test vertext deployment 
```
python3 test_vertex_deployment.py
```

# UI build

1. Update primary configuration next.config.ts file and app/services/vertex.ts:17 - Fallback default URL with Vertext AI URL

```
cd paint-planner/paint-shop-UI

npm run build
npm run dev

```

## Deploy on Google Cloud Run 

Deploying a Node.js application to **Google Cloud Run** is one of the most efficient ways to run serverless containers. Cloud Run handles the scaling, routing, and infrastructure, allowing you to focus on your code.

This guide uses the **Source-to-Service** method, which is the modern standard (as of 2026). It automatically containerizes your code using Google Cloud Buildpacks, meaning you don't even need a Dockerfile.

---

### 1. Prerequisites & IAM Setup

To deploy, your identity (User or Service Account) needs specific permissions.

#### Required IAM Roles

* **Cloud Run Admin** (`roles/run.admin`): Full control over Cloud Run resources.
* **Artifact Registry Administrator** (`roles/artifactregistry.admin`): To create and manage the container repository.
* **Cloud Build Editor** (`roles/cloudbuild.builds.editor`): To package your Node.js code into a container.
* **Service Account User** (`roles/iam.serviceAccountUser`): Required to deploy the service as the runtime service account.

#### CLI Initialization

```bash
# Login to your Google account
gcloud auth login

# Set your active project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
    run.googleapis.com \
    config.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com

```

---

### 2. Prepare Your Node.js App

Cloud Run expects your app to follow two simple rules:

1. **Listen on the `PORT` environment variable:** Cloud Run injects this (usually `8080`).
2. **A `start` script in `package.json`:** Buildpacks use this to run your app.

**Example `index.js`:**

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Node.js on Cloud Run!');
});

// IMPORTANT: Use process.env.PORT
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

```

---

### 3. Deploying to Cloud Run

The `gcloud run deploy` command will now zip your source, send it to Cloud Build, create a container image in Artifact Registry, and deploy it to a service.

#### The Deployment Command

```bash
gcloud run deploy my-nodejs-app \
    --source . \
    --region us-central1 \
    --allow-unauthenticated

```

**Key Flags Explained:**

* `--source .`: Tells GCP to build the container from the current directory.
* `--region`: The physical location of your server (choose one close to your users).
* `--allow-unauthenticated`: Makes your website public. If omitted, your app will be private by default.

---

### 4. Post-Deployment Configuration

Once deployed, you may need to manage secrets or environment variables.

#### Adding Environment Variables

```bash
gcloud run services update my-nodejs-app \
    --update-env-vars NODE_ENV=production,API_KEY=12345

```

#### Granting "Invoker" Rights (If Private)

If you didn't use `--allow-unauthenticated`, you must manually grant access to specific users:

```bash
gcloud run services add-iam-policy-binding my-nodejs-app \
    --member="user:collaborator@gmail.com" \
    --role="roles/run.invoker" \
    --region us-central1

```

---

### 5. Verification

After the command completes, you will receive a **Service URL** (e.g., `https://my-nodejs-app-xyz.a.run.app`).

To check the status of your service at any time:

```bash
gcloud run services describe my-nodejs-app --region us-central1

```

Would you like me to show you how to set up a **Cloud Build Trigger** so that your app redeploys automatically every time you push code to GitHub?
