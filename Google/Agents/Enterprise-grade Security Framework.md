# Google Cloud's enterprise-grade security framework for agents

The ability of AI Agents to autonomously execute code and interact with external services poses security challenges related to prompt injection, unauthorized actions, and control over external systems. Thus, deploying AI Agents in a production environment requires a robust security strategy to protect your agent, its data, and the interactions it handles.  

In this lesson, you'll explore the key components of Google’s hybrid, defense-in-depth approach to AI Agent security.  

## Security challenges of how AI Agents work

AI Agents are systems designed to perceive their environment, make decisions, and take autonomous actions to achieve a user-defined goal. Unlike LLMs that only generate content, agents act by leveraging AI reasoning to interact with other systems like APIs, databases, or even web browsers.  

Select **+** to expand each section and learn more about the unique security risks of agents.  

### Input, perception, and personalization

### System instructions

### Reasoning and planning

### Orchestration and action execution (tool use)

### Agent memory

### Response rendering

Zoom image  

### Key risks associated with AI Agents

The inherent design of AI Agents, combined with their powerful capabilities, exposes users to two major risks:  

1. **Rogue actions:** Unintended, harmful, or policy-violating behaviors. This often stems from prompt injection, where malicious data tricks the agent into executing attacker commands using the user's privileges.  

2. **Sensitive data disclosure:** The agent improperly revealing private or confidential information. Attackers exploit actions (data exfiltration) or output generation to trick the agent into leaking secrets via a URL or an insecurely rendered response.  

## Core principles for agent security

Google advocates for three fundamental principles to guide secure agent development.  

**Principle 1: Agents must have well-defined human controllers.** This ensures accountability, user control, and prevents agents from acting autonomously in critical situations without clear human oversight or attribution.  

**Principle 2: Agent powers must have limitations.** Enforcing appropriate, dynamically limited privileges, ensures agents have only the capabilities and permissions necessary for their intended purpose and cannot escalate privileges inappropriately.  

**Principle 3: Agent actions and planning must be observable.** Effective observability requires transparency and auditability through robust logging of inputs, reasoning, actions, and outputs, enabling security decisions and user understanding.  

## Google’s hybrid defense-in-depth approach

Since LLMs are non-deterministic and susceptible to manipulation, neither purely rule-based systems nor purely AI-based judgment are sufficient alone. Google employs a hybrid defense-in-depth strategy which combines traditional, deterministic measures with reasoning-based defense strategies.  

Select each tab to learn more.  

**TRADITIONAL, DETERMINISTIC MEASURES**  
**REASONING-BASED DEFENSE STRATEGIES**  

This layer uses dependable security mechanisms, providing runtime policy enforcement that operates outside the AI model's reasoning.  

- **Function:** Intercepts agent actions (tool use) before execution.  
- **Action:** Evaluates the request against predefined, auditable rules (e.g., "Block any purchase action over $500," or "Require user confirmation for high-risk actions").  
- **Benefit:** Provides reliable, predictable hard limits and confines the potential impact of an agent malfunction.  

This hybrid, layered approach creates robust boundaries, mitigating the risk of harmful outcomes while preserving the agent's utility.  

## Securing AI applications with Model Armor

Model Armor is a Google Cloud service designed to enhance the security and safety of AI applications. It is configured for integration with Google Cloud services like Vertex AI and Gemini Enterprise.  

By proactively screening large language model (LLM) prompts (inputs) and responses (outputs), Model Armor protects the agents built with Vertex AI Agent Builder against critical risks.  

### Prompt injection and jailbreak attacks

Model Armor proactively identifies and blocks malicious inputs designed to manipulate the LLM's system instructions or behavior, ensuring the AI agent operates as intended. Click **+** to expand each section and learn more about the key security functions.  

#### Prompt injection risk mitigation

#### Jailbreak attack risk mitigation

### Sensitive data leakage

Model Armor mitigates the risk of leaking sensitive data like intellectual property (IP) and personally identifiable information (PII) in prompts or responses. Select each tab to learn more about how Model Armor can help mitigate these security risks.  

**SENSITIVE DATA IN PROMPTS**  
**SENSITIVE DATA IN RESPONSES**  

- **Risk:** User input (prompt) containing sensitive data that should not be processed or stored by the LLM.  
- **How you can mitigate this risk:** Implement an input filtering mechanism to scan and remove or obscure sensitive data.  
- **How Model Armor can help you:** Model Armor uses the Cloud Data Loss Prevention service to scan all incoming user prompts for defined sensitive data types (e.g., credit card numbers and email addresses). It can be configured to automatically mask, tokenize, or redact this data in real-time before it's processed by the LLM, protecting the underlying data from exposure during the session.  

### Content safety

**The risk:** LLM outputs can be unpredictable and potentially harmful, so they need to be reviewed.  

**How you can mitigate this risk:** To utilize this technology safely and responsibly, it is also important to consider other risks specific to your use case, users, and business context in addition to built-in technical safeguards.  

We recommend taking the following steps:  

1. Assess your application's security risks.  
2. Perform safety testing appropriate to your use case.  
3. Configure safety filters if required.  
4. Solicit user feedback and monitor content.  

You can use existing tooling for safety filtering. The Gemini API, for example, provides adjustable controls over content generation across harm dimensions like harassment, hate speech, and dangerous content through its [safety settings (opens in a new tab)](https://ai.google.dev/gemini-api/docs/safety-settings).  

**How Model Armor mitigates this risk:** Model Armor serves as another layer of defense to filter content against safety categories, such as dangerous content, ensuring responsible AI outputs.  
Model Armor leverages a pre-trained safety classifier which analyzes the semantic meaning and context of both the prompt and the response against a configurable set of safety categories and thresholds. If a response from the model exceeds the risk threshold for a given category, Model Armor automatically blocks the response or returns a customized safety message.  

## Key takeaway

This lesson explored the critical security challenges of AI Agents, which can be vulnerable to rogue actions and sensitive data disclosure across their operational cycle. To mitigate these risks, Google's strategy is built on three core principles: ensuring agents have human controllers, limiting their limited powers, and making their actions fully observable. This is enforced through a robust hybrid defense-in-depth approach that combines deterministic policy enforcement with dynamic, AI-based defenses.  

[Previous](https://www.skills.google/paths/3273/course_sessions/32805699/documents/599607)  

[Next](https://www.skills.google/paths/3273/course_sessions/32805699/documents/599609)[1]

[1](https://www.skills.google/paths/3273/course_templates/1504/documents/599608)
