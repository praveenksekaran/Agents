def paint_coverage_calculator(
    ceiling_height_in_m: float,
    room_length_in_m: float,
    room_width_in_m: float,
):
    """Calculates the square-feet of paint required for the walls of a room.

    Args:
        ceiling_height_in_m: float - ceiling height in feet
        room_length_in_m: float - Room length in feet
        room_width_in_m: float - Room width in feet

    Returns a dictionary with:
        {"square_feet": float - Square feet of paint required}
    """

    sq_feet = (
        (((2 * room_length_in_m) + (2 * room_width_in_m)) * ceiling_height_in_m)
    )
    return {"square_feet": sq_feet}

def calculate_paint_cost(sq_feet: float, price_per_liter: float, coverage_rate: float):
    """Calculates the total cost of paint for a given volume and price per liter.

    Args:
        sq_feet: float - Total square feet of paint needed.
        price_per_liter: float - Price per liter of paint.
        coverage_rate: float - Coverage rate of the paint in square feet per liter.

    Returns a dictionary with:
        {"cost": float - Total cost of the paint}
    """
    cost = sq_feet / coverage_rate * price_per_liter
    return {"cost": cost}



def get_paint_products():
    """Reads the paint-products.json file and returns the list of paint products.

    Returns:
        list: A list of paint products.
    """
    import json

    import os
    file_path = os.path.join(os.path.dirname(__file__), "paint-products.json")
    with open(file_path, "r") as f:
        return json.load(f)
