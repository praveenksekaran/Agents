import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from .sub_agents.coverage_calculator.agent import coverage_calculator_agent

load_dotenv()

room_planner_agent = Agent(
    name="room_planner_agent",
    model=os.getenv("MODEL"),
    instruction=f"""
    - find out from 'ROOM_LAYOUT' the number of rooms and the dimensions of each room
    - Room dimension will be of the form:
        - Length in feet
        - width in feet
        - height in feet
        - doors and windows count and their dimentions, which can be ignored for now
    - Ask the user how many coats they'd like to paint. Store their result as 'coats' (default to 2 if they respond with something like 'yes'). 
    - For each unique paint type in 'ROOM_LAYOUT', calculate the total square footage of all rooms that use that paint type    
    - To calculate the paint needed of each paint type, transfer to the 'coverage_calculator_agent'
    """,
    sub_agents=[coverage_calculator_agent],
)

# ToDO
# - find out from 'ROOM_LAYOUT' the number of doors and windows in each room
# - subtract the square footage of doors and windows from the total square footage of each room
