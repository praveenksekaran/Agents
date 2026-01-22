def calculate_paint_cost(pricePerLiter: float, coveragePerLiter: float, paintableArea_sum: float, coats: int):
    """Calculates the total cost of paint for a given volume and price per liter.

    Args:
        pricePerLiter: float - Price per liter of paint.
        coveragePerLiter: float - Coverage rate of the paint in square feet per liter.
        paintableArea_sum: float - Total square feet of paint needed.
        coats: int - Number of coats 

    Returns a dictionary with:
        {"cost_of_paint": float - Total cost of the paint}
    """
    total_area = paintableArea_sum * coats
    cost_of_paint = (total_area / coveragePerLiter) * pricePerLiter
    return {"cost_of_paint": cost_of_paint}

