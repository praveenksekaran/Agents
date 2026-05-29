https://docs.langchain.com/oss/python/langchain/agents

# LangChain
There are two different frameworks for creating agents: LangChain agents and deep agents. Both LangChain and deep agents provide you with fine-grained control over tools, memory, and more. The main difference between both is that deep agents come with a range of commonly useful capabilities already built in, such as planning, file system tools, and subagents.
Use deep agents when you want maximum capability with minimal setup; choose LangChain agents when you need fine-grained control.

#### Agent 
Agent takes harness (Model, tools, System_prompt, checkpointer=InMemorySaver, config=threadid, context=userid)

agent can be invoked agent.invoke() or intermediate steps can be streamed agent.stream() or event streams agent.stream_events()

#### Middleware
Middleware is the primitive for customization: each piece handles one concern, hooks into the agent loop at the right moment, and composes freely with any other
As agents take on complex work, they need support across a few key areas. The middleware ecosystem covers each:
Execution environment, Context management, Planning and delegation, Fault tolerance, Guardrails, Steering
```
from langchain.agents import create_agent
from deepagents.backends import StateBackend
from deepagents.middleware import FilesystemMiddleware

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search],
  //Execution environment
    middleware=[FilesystemMiddleware(backend=StateBackend())],
  //Context management
    MemoryMiddleware(backend=backend, sources=["./AGENTS.md"]),
    SkillsMiddleware(backend=backend, sources=["./skills/"]),
  //Planning and delegation  
    TodoListMiddleware(),
    SubAgentMiddleware(backend=StateBackend(), subagents=[researcher])
)
```
#### Memory 
**Short Term Memory**
To add short-term memory (thread-level persistence) to an agent, you need to specify a `checkpointer` when creating an agent. 
In production, use a checkpointer backed by a database (postgreSql). 

By default, agents use `AgentState` to manage short term memory, specifically the conversation history via a messages key
You can extend AgentState to add additional fields. Custom state schemas are passed to create_agent using the `state_schema` parameter.

**Solution to Manage State**
- Trim messages : Remove first or Last N messages before calling messages
- Delete Messages: Delete messages from langraph message state
- Summarize messages: summarize and replace history
- custom strategies: Message filtering, etc

#### Structured Output
provide your structued output class or pydentic or json.

#### Guardrails 
Guardrails help you build safe, compliant AI applications by validating and filtering content at key points in your agent’s execution. 
They can detect sensitive information, enforce content policies, validate outputs, and prevent unsafe behaviors before they cause problems.

Common use cases include:
1. Preventing PII leakage
2. Detecting and blocking prompt injection attacks
3. Blocking inappropriate or harmful content
4. Enforcing business rules and compliance requirements
5. Validating output quality and accuracy

Guardrails can be implemented using two complementary approaches:
1. Deterministic guardrails
Use rule-based logic like regex patterns, keyword matching, or explicit checks. Fast, predictable, and cost-effective, but may miss nuanced violations.
2. Model-based guardrails
Use LLMs or classifiers to evaluate content with semantic understanding. Catch subtle issues that rules miss, but are slower and more expensive.

#### Build in
1. PII Detectors
middleware=PIIMiddleware("email",strategy="redact/mask/block",apply_to_input=True,) or
PIIMiddleware("pi_key",detector=r"sk-[a-zA-Z0-9]{32}",strategy="block",apply_to_input=True,]

2. Human-in-the-loop
```
agent = create_agent(
    model="gpt-5.4",
    tools=[search_tool, send_email_tool, delete_database_tool],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                # Require approval for sensitive operations
                "send_email": True,
                "delete_database": True,
                # Auto-approve safe operations
                "search": False,
            }
        ),
    ],
    # Persist the state across interrupts
    checkpointer=InMemorySaver(),
)
```

3. Custom guardrails
use Before agent and After agent hooks to validate request and response

4. Combine multiple guardrails
```
from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware, HumanInTheLoopMiddleware

agent = create_agent(
    model="gpt-5.4",
    tools=[search_tool, send_email_tool],
    middleware=[
        # Layer 1: Deterministic input filter (before agent)
        ContentFilterMiddleware(banned_keywords=["hack", "exploit"]),

        # Layer 2: PII protection (before and after model)
        PIIMiddleware("email", strategy="redact", apply_to_input=True),
        PIIMiddleware("email", strategy="redact", apply_to_output=True),

        # Layer 3: Human approval for sensitive tools
        HumanInTheLoopMiddleware(interrupt_on={"send_email": True}),

        # Layer 4: Model-based safety check (after agent)
        SafetyGuardrailMiddleware(),
    ],
)
```

# LangGraph
## Framework

#### Human in the loop
https://www.langchain.com/langgraph

#### Persistant Memory


#### Test
https://docs.langchain.com/oss/python/langchain/test

# LangSmith

#### Deployment 


#### Observability
