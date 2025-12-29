# Cymbal Finacial Fruad Analyst use case 

## Course downloads

[Git Complete project](https://github.com/GoogleCloudPlatform/training-data-analyst/tree/master/courses/ai-agents-with-databases)

You are highly encouraged to follow along with the demos in this course by downloading the following notebooks and files:

#### Module 1: Setup_and_explore_databases.ipynb
This notebook is designed to finalize the setup of the database environment and to familiarize you with the database schemas and data. Click [Setup / Explore](https://github.com/GoogleCloudPlatform/training-data-analyst/blob/master/courses/ai-agents-with-databases/notebooks/1_setup_and_explore_databases.ipynb) to download the notebook.

#### Module 1: Deploy_mcp_toolbox.ipynb

This notebook walks you through creating two simple MCP Toolbox tools and deploying them onto a Toolbox service in Cloud Run. Click [Deploy MCP](https://github.com/GoogleCloudPlatform/training-data-analyst/blob/master/courses/ai-agents-with-databases/notebooks/2_deploy_mcp_toolbox.ipynb) to download the notebook.

#### Module 2: Build_adk_agent.ipynb
This notebook walks you through building your first ADK Agent and connecting it to the tools you deployed to MCP Toolbox. You will also integrate the ADK Session service with Cloud SQL for PostgreSQL to persist this critical context. Click [Build Agent](https://github.com/GoogleCloudPlatform/training-data-analyst/blob/master/courses/ai-agents-with-databases/notebooks/3_build_adk_agent.ipynb) to download the notebook.

#### Terraform: main.tf

This location can be a [URL](https://github.com/GoogleCloudPlatform/training-data-analyst/blob/master/courses/ai-agents-with-databases/terraform/main.tf), another lesson, or an email address. You can type a description here.

## Infrastructure as Code (IaC)
Before an AI agent, powered by MCP Toolbox for Databases, can perform its first query, it needs a secure identity. In an enterprise environment, managing these identities manually is not scalable or secure. This is where the concept of Infrastructure as Code (IaC) becomes essential. This course uses Terraform to programmatically create and manage these foundational components.

Here, the primary role of Terraform is to create a dedicated, least-privileged service account. This service account acts as the identity for our MCP Toolbox service. By defining this identity in code, you ensure the application runs with only the permissions it strictly needs to connect to your databases.

In addition, using Terraform introduces a structured, automated workflow that separates infrastructure management from application deployment. This ensures that the secure environment is ready before the application is even deployed.

## The setup for this course
The main Terraform template(opens in a new tab) discussed in the demos, is designed to provision all the necessary core infrastructure for this course.  The template creates the following resources in your Google Cloud project:

#### Networking
- A custom Virtual Private Cloud (VPC) will be created to provide a secure and isolated network environment. This includes:

  - A Cloud Router and Cloud NAT Gateway to allow resources within the VPC to securely access the internet.  
  - Firewall rules to control traffic flow and enhance security.  
  - A private IP range for service networking, enabling private communication with Google Cloud services.

#### Databases
- An AlloyDB cluster and instance, a fully-managed, PostgreSQL-compatible database service for demanding transactional and analytical workloads.

- A Spanner instance and database, a globally-distributed, strongly consistent database service. The schema and initial data for the Spanner database will also be created.

#### AI and Compute
A Vertex AI Workbench instance, a managed Jupyter notebook environment where you will run the provided notebooks to complete the lab.

#### APIs
All necessary APIs will be enabled, including those for Spanner, AlloyDB, and other related services.

# Build a secure foundation

#### Learning objectives
- Explain the architectural role of MCP Toolbox for Databases as a secure, manageable intermediary connecting AI agents to enterprise databases.
- Provision and configure a database (AlloyDB, Cloud SQL) suitable for AI agent integration, including secure networking and least-privilege access.
- Deploy the MCP Toolbox for Databases to a secure, serverless environment on Google Cloud and define parameterized database tools using a declarative tools.yaml configuration.

#### Ground AI in reality

> Grounding an AI agent means connecting it to a definitive source of truth, in this case, the enterprise database(s).

When an agent is grounded, it can answer specific, high-value questions like, "Retrieve the policy coverage limits for claim #12345 and summarize the claimant's last three claims." This transforms the agent from a generic chatbot into a powerful business tool that can automate complex workflows, like the initial information gathering phase of an insurance claim investigation.

Google Cloud provides a powerful ecosystem for building grounded agents. Vertex AI offers the Gemini family of models for advanced reasoning and planning. AlloyDB for PostgreSQL and Cloud SQL provide fully managed, scalable, and secure database services. The critical missing piece, which this course focuses on, is the secure and manageable bridge between them. The MCP Toolbox for Databases provides this bridge, acting as a control plane that enables agents to interact with databases through a well-defined, secure set of "tools."

## Build on Google Cloud
Google Cloud provides a powerful ecosystem for building grounded agents.

- Vertex AI offers the Gemini family of models for advanced reasoning and planning.
- AlloyDB, Cloud SQL, and Spanner provide fully managed, scalable, and secure database services.

The critical missing piece, which this course focuses on, is the secure and manageable bridge between them. The MCP Toolbox for Databases provides this bridge, acting as a control plane that enables agents to interact with databases through a well-defined, secure set of "tools."

> **MCP Toolbox for databases**
> An open-source middleware service that exposes database operations as discrete, pre-approved, and parameterized tools.

a direct database connection could allow an attacker to use a maliciously crafted prompt (prompt injection) to trick the agent into querying and returning personal information
To solve this security risk, MCP Toolbox for Databases enables the agent to call a tool named get_policy_details with claim_id as a parameter. The Toolbox executes a safe, pre-written SQL query, ensuring the agent gets only the data it needs for that specific claim.

## Secure connectivity

#### Foundational network security

Deploying an AI agent that interacts with sensitive customer and claims data at Cymbal Insurance requires earning the trust of the security and operations teams. 
The security team's primary concerns are unauthorized data access and data exfiltration.

> Data exfiltration is the unauthorized transfer of data from a computer or other device.

#### Network perimeter security
An enterprise-grade solution requires a secure-by-default architecture, which begins with network isolation to create a private, trusted environment for all application components.

- Ensure that the databases are completely inaccessible from the public internet.
- Require that communication between services is controlled and authenticated.
- Adhere to the principle of least privilege, creating dedicated service accounts with the absolute minimum permissions required for their roles.

The first layer of defense is isolating your resources from the public internet and controlling what traffic can get in or out.

**Custom VPC**: Instead of using the default network, provision a custom Virtual Private Cloud (VPC). This creates a private, isolated network space for all the database and agent resources, which is a foundational security best practice.

**Cloud NAT Gateway**: The VPC should be configured with a Cloud NAT (Network Address Translation) gateway. This allows resources inside your private VPC (like the notebooks in the demos) that do not have public IP addresses, to securely access the internet for things like software updates. Crucially, it only allows egress (outbound) traffic and blocks any unsolicited ingress (inbound) traffic, acting as a secure one-way street to the internet.

The following video walks through the foundational steps of creating a secure network environment in Google Cloud, starting with a custom VPC and Cloud NAT and firewall rules. It demonstrates how to establish secure, private connections to database services such as AlloyDB and Cloud SQL, ensuring they are never exposed to the public internet.

#### Firewall rules protect the network
Firewalls act as the gatekeepers for your VPC, controlling traffic flow. This configuration sets up a critical rule to allow secure access to your tools.

> **Key Rule: allow-iap-internal**
> This firewall rule explicitly allows ingress traffic from a specific Google-owned IP range: 35.235.240.0/20. This range belongs to the Identity-Aware Proxy (IAP) service, and allows you to manage access to applications running on Google Cloud based on a user's identity rather than their network location.
> This firewall rule ensures that only legitimate, authenticated traffic coming through the IAP proxy can reach your backend services.

#### Secure database connections
A major security goal is to ensure that the connections to your databases are never exposed to the public internet.  You architect this using two distinct, private connectivity methods.
- VPC network peering privately connects your Virtual Private Cloud (VPC) to another VPC network, such as one managed by Google for services like AlloyDB, using Google's internal network. This allows resources in both networks to communicate directly and securely as if they were part of the same network, ensuring that traffic never travels over the public internet.
- PSC creates a private and secure endpoint that exists inside your VPC and connects directly to the database service. Just like with VPC peering, this ensures the connection is private and that the traffic never crosses the public internet.

#### Identity and compute security
In addition to the foundational network security, there are two more critical layers of defense:

1. Identity and Access Management (IAM) following the principle of least privilege.
2. A hardened compute environment for development.

A core tenet of cloud security is the principle of least privilege:

> An identity should only have the exact permissions required to perform its job.

Instead of using a single, overly powerful default service account for all tasks, you create distinct, dedicated service accounts for the main components of your solution.  This separates who can access what, and significantly reduces risk.

- **Notebook service accounts**
  This service account is attached to the Vertex AI Workbench instance. Any code you run within the notebooks will inherit the permissions of this account.  In a real-world scenario, this account would have minimal permissions, such as the ability to interact with Vertex AI services and read from specific storage buckets.

- **Toolbox service account**
  This account will be used by the MCP Toolbox for Databases service when it runs. Its primary job is to connect to your databases. Therefore, it will be granted IAM roles like roles/cloudsql.client and roles/alloydb.client, but it won't have permissions to, for example, modify the Vertex AI notebook instance.

- **ADK agent service account**
  This account will be used by the MCP Toolbox for Databases service when it runs. Its primary job is to connect to your databases. Therefore, it will be granted IAM roles like roles/cloudsql.client and roles/alloydb.client, but it won't have permissions to, for example, modify the Vertex AI notebook instance.

> **Notebook vs. production permissions:**
> You will notice that the notebook service account is granted very powerful roles like iam.securityAdmin.
> This is done specifically for the demonstration environment to allow the notebook to provision other resources as you work through the exercises.
> In a real-world production environment, this is far too permissive and would violate the principle of least privilege.  Always start with minimal permissions and add only what is necessary.

#### Hardening the development environment
An agent's security posture begins with its development environment. The Vertex AI Workbench instance provisioned in this example, is intentionally hardened with several key security features.

- **No public IP address**
The configuration explicitly sets no_public_ip = true for the workbench instance.
This means it is not directly exposed to the public internet, protecting it from unsolicited external traffic and automated attacks. It can still access the internet for essential tasks like downloading software updates through the secure, egress-only Cloud NAT gateway.

- **Identity-aware proxy (IAP) access**
If the notebook has no public IP, how do you access it? The Terraform output provides a proxy_uri.
This is a special URL that routes your request through Google's Identity-Aware Proxy (IAP). IAP acts as a secure gateway, checking your Google Cloud identity and permissions before forwarding your request to the notebook.
This enforces zero-trust access for developers.

- **Shielded instance configuration**
  The configuration enables shielded_instance_config.  This is an extra layer of defense that leverages features like Secure Boot, virtual trusted platform modules (vTPM), and integrity monitoring.
It helps ensure the instance has not been compromised by boot-level or kernel-level malware or rootkits, verifying the integrity of your compute environment from the ground up.

## Prepare the data foundation
Preparing the database is a methodical process. It involves :

- Establishing a secure, private IP connection to the instance.
- Creating the database schema.
- Loading it with production-like data.
- Creating a dedicated, least-privilege database user.

This user, will be used exclusively by MCP Toolbox for Databases, and its permissions will be strictly limited to read-only access on the specific tables required for claims investigation. This is a fundamental defense-in-depth practice.

#### Programmatic database creation
shows video of 1_setup_and_explore_databases.ipynb

#### Key features of the created AlloyDB cluster
- **Secure Connectivity**
Use an official database connector, such as the AlloyDB Python connector, to create a secure connection pool.
The key configuration parameter ensures the connection is made over private IP, meaning all communication between the agent (or development) environment and the database remains within Google Cloud's private network backbone, completely isolated from the public internet

- **Database-Level Least Privilege**
  IAM controls who can connect to the database instance, but database-level permissions control what they can do once connected. This is a critical security layer.
This ensures the MCP Toolbox for Databases service connects with a user that has the absolute minimum required permissions, preventing any possibility of data modification or deletion at the source.

## MCP Toolbox for Databases

#### The declarative AI-database bridge

To avoid the severe security and operational risks of direct database access, Cymbal Insurance needs a robust, manageable, and secure layer to sit between the AI agent and its data.

This layer must prevent SQL injection, enforce access control, and abstract away the complexities of database connection management. A hard-coded approach is not scalable or secure.

#### A secure middleware layer
[MCP Toolbox for Databases](https://googleapis.github.io/genai-toolbox/getting-started/introduction/) is an open-source control plane that serves as this secure layer. Its core principle is declarative configuration. Instead of writing imperative code to handle database logic, you define the agent's capabilities in a simple YAML file, tools.yaml.

This file defines what data sources are available, what specific actions (tools) can be taken against them, and which groups of tools an agent can use. This approach separates the agent's reasoning from the data access logic, making the entire system more secure, manageable, and easier to update.

The tools.yaml file has three main sections:

- **Sources**
"sources" defines the connection details for each database. Each source has a unique name and specifies its kind (e.g., alloydb-postgres or cloud-sql-postgres).
You provide the project, instance, and database name.
For credentials, you should always reference a secret from a service like Secret Manager (e.g., password: ${SECRET_ALLOYDB_PASSWORD}), never hardcode them in the file.
This practice is critical for auditability and simplifies credential lifecycle management, such as key rotation, which are essential security requirements for enterprises like Cymbal Insurance.

- **Tools**
"tools" define each function available to the agent.  These are the individual, parameterized SQL queries that the agent can invoke by name.
A tool has:
  - A name (e.g., get_claim_history).
  - A description, which provides the context the LLM uses to decide which tool to select for a given task.  
  - The data source it targets.
  - The SQL statement. This statement MUST use placeholders for any dynamic values to be secure.

- **Toolsets**
A toolset is simply a named list of tool names. For example, you can create a claims_investigation_toolset for the agent.
Toolsets named collections of tools that can be granted to specific agents, providing role-based access control.
In a more complex scenario, you might have a claims_admin_toolset with additional tools for updating records. The agent requests a specific toolset, and the Toolbox ensures it can only see and execute the tools within that set, providing any enterprise with effective, role-based access control for its agents.

## Deploy and configure MCP Toolbox for Databases

#### Make the plan actionable
A tools.yaml file on its own is just a plan. To make these tools operational for the Cymbal Insurance agent, you must deploy the MCP Toolbox for Databases as a scalable, secure, and reliable service. This deployment must be consistent with the secure-by-design architecture, running privately and enforcing strict authentication for every request.

To do this, you can package the MCP Toolbox for Databases server into a container and deploy it to Cloud Run(opens in a new tab), a fully managed serverless platform. This is an ideal target because it handles scaling automatically and abstracts away the underlying infrastructure.

> A key aspect of this process is that you do not build secrets into the container image. Instead, you store sensitive configurations, like the tools.yaml file and database passwords, in Google Secret Manager and securely mount them into the Cloud Run instance at runtime.

#### The declarative approach
The following demo uses the gcloud run deploy command with a series of flags to ensure a secure deployment. This declarative approach is a core tenet of Infrastructure as Code (IaC), as it makes deployments repeatable and predictable; each time the command runs, it brings the service to the desired state defined by the flags.

This results in a secure, private, and authenticated API endpoint for the tools.

- --vpc-connector and --vpc-egress, to place the service within the private VPC.
- --service-account, to assign the dedicated, least-privilege toolbox service account.
- --no-allow-unauthenticated, to block all unauthenticated traffic.
- --set-secrets, to instruct Cloud Run to fetch the tools.yaml config and database passwords from Secret Manager and make them available to the container, either as a file volume or an environment variable.

## Test and monitor the tools

#### Test and iterate

Testing your tools directly, and bypassing the AI agent layer, allows you to see exactly what the agent will see and is a great pattern for creating integration tests as part of a CI/CD deployment.

Testing in this way helps you:
- Validate a successful deployment and pinpoint the exact source of an error much faster.
- Verify that your queries are returning the correct format, columns, and data types that the agent expects to receive.
- Create integration tests for CI/CD pipelines. These automated tests can be run every time you update your tools.yaml file to ensure you haven't accidentally broken anything.

The testing process involves a few simple steps.

- **URL of Cloud Run Service**
The endpoint you created with MCP Toolbox for Databases is the most critical piece of this entire architecture. It's not just a technical step; it's the solution to a major security and control problem. It:
- Creates a secure "gatekeeper."
- Provides a strict list of allowed actions.
- Simplifies the agent's job to just figuring out which pre-approved tool to call, and what parameters to pass.

- **IAM Auth Token**
Because you secured the service during deployment by requiring IAM authentication, you must first generate an identity token.
This token proves that you are an authenticated principal with permission to invoke the service.

- **Toolbox Client Library**
To simplify this process, you can use the provided Toolbox client library, which handles obtaining the token and attaching it to your API requests.

Once you establish an authenticated connection, you can load the specific toolset you want to test and then execute the tools programmatically.  Watch the video below for a demonstration of these steps.














