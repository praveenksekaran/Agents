import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from .sub_agents.coverage_calculator.agent import coverage_calculator_agent

from paint_agent.tools import set_session_value, get_session_value

load_dotenv()

room_planner_agent = Agent(
    name="room_planner_agent",
    model=os.getenv("MODEL"),
    instruction="""
    - Ask the user how many coats they'd like to paint. Store their result as 'COATS' (default to 2 if they respond with something like 'yes').
    - Show all paint name and color in 'PAINTS' and inform the customer that all these paints will be used.
    - To calculate the cost of each paint, transfer to the 'coverage_calculator_agent'
    """,
    sub_agents=[coverage_calculator_agent],
    tools=[set_session_value, get_session_value],
)

# ToDO
# - find out from 'ROOM_LAYOUT' the number of doors and windows in each room
# - subtract the square footage of doors and windows from the total square footage of each room
