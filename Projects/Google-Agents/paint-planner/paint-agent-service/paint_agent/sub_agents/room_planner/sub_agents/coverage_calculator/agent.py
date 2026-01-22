import os
from dotenv import load_dotenv
from google.adk.agents import Agent
from .tools import paint_coverage_calculator, get_paint_products, calculate_paint_cost
from .....callback_logging import log_query_to_model, log_model_response

load_dotenv()

coverage_calculator_agent = Agent(
    name="coverage_calculator_agent",
    model=os.getenv("MODEL"),
    instruction="""
    -  Use the 'paint_coverage_calculator' to estimate the amount of coverage they will need for each coat.
       
    - for each paint type:
        - The square feet of paint they need multiplied by the number of coats
        - The coverage rate of the paint they have chosen is COVERAGE_RATE, calculated in square feet.
        - The paint is sold in liters.
        - The price is PRICE per liter, so the total cost is: [provide total cost].
    - provide cost of eact paint type and total cost
    """,
    before_model_callback=log_query_to_model,
    after_model_callback=log_model_response,
    tools=[paint_coverage_calculator, get_paint_products, calculate_paint_cost],
)
