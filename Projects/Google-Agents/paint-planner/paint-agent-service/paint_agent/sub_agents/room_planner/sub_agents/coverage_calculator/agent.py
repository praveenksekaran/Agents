import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from .tools import calculate_paint_cost
from .....callback_logging import log_query_to_model, log_model_response
from paint_agent.tools import get_session_value

load_dotenv()

coverage_calculator_agent = Agent(
    name="coverage_calculator_agent",
    model=os.getenv("MODEL"),
    instruction="""
    - calculate the cost of each paint in 'PAINTS' by using calculate_paint_cost tool
    - for each paint in 'PAINTS', provide the volume in liters, the cost in dollars in a nice table format 
    - provide the total cost of paint in 'TOTAL_COST'
    """,
    before_model_callback=log_query_to_model,
    after_model_callback=log_model_response,
    tools=[calculate_paint_cost, get_session_value],
)
