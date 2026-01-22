# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from dotenv import load_dotenv
import google.auth
from google.adk.agents import Agent
from google.adk.tools import AgentTool
import google.cloud.logging
import os

from .callback_logging import log_query_to_model, log_model_response

from .sub_agents.room_planner.agent import room_planner_agent

from .tools import set_session_value

# Load env
load_dotenv()

# Configure logging to the Cloud
cloud_logging_client = google.cloud.logging.Client()
cloud_logging_client.setup_logging()

root_agent = Agent(
    name="product_selector",
    model=os.getenv("MODEL"),
    instruction="""
    You represent the paint department of PY Designs.

    - At the start of a conversation, let the user know you're here to help them
      find the estimate and right amount of their DIY project
    - say "Hello! Please start by drawing your room layout on the canvas to the left.
     Once you are done, click 'Complete' to proceed.
    - receive the room layout from the user and store it in the session dictionary 'ROOM_LAYOUT'
    - transfer to the 'room_planner_agent'
    """,
    before_model_callback=log_query_to_model,
    after_model_callback=log_model_response,
    sub_agents=[room_planner_agent],
    tools=[
        set_session_value,
    ],
)
