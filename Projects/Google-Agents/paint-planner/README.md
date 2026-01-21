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
