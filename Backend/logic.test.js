// Testing Functions based on company rules

const calculateFuelCost = (distance, traffic) => {
  let cost = distance * 5;
  if (traffic === "High") {
    cost += distance * 2;
  }
  return cost;
};

const calculateLatePenalty = (deliveryTimeMins, baseTimeMins) => {
  const isLate = deliveryTimeMins > baseTimeMins + 10;
  return isLate ? 50 : 0;
};

const calculateHighValueBonus = (orderValue, isLate) => {
  if (!isLate && orderValue > 1000) {
    return orderValue * 0.1;
  }
  return 0;
};

// Used Jest to test functions
describe("GreenCart Business Logic Rules", () => {
  // Fuel Cost
  test("Fuel Cost: should calculate base cost for Low traffic", () => {
    expect(calculateFuelCost(20, "Low")).toBe(100);
  });

  // High Traffic
  test("Fuel Cost: should apply surcharge for High traffic", () => {
    expect(calculateFuelCost(20, "High")).toBe(140);
  });

  // Late Penalty
  test("Late Penalty: should apply a penalty if delivery is >10 mins late", () => {
    expect(calculateLatePenalty(71, 60)).toBe(50);
  });

  // No Late Penalty
  test("Late Penalty: should NOT apply a penalty if delivery is on time", () => {
    expect(calculateLatePenalty(65, 60)).toBe(0);
  });

  // High-Value Bonus
  test("High-Value Bonus: should apply 10% bonus for on-time, high-value orders", () => {
    expect(calculateHighValueBonus(1200, false)).toBe(120);
  });

  // No Bonus if Late
  test("High-Value Bonus: should NOT apply bonus if the order is late", () => {
    expect(calculateHighValueBonus(1200, true)).toBe(0);
  });

  // No Bonus if Low Value
  test("High-Value Bonus: should NOT apply bonus if order value is not high enough", () => {
    expect(calculateHighValueBonus(900, false)).toBe(0);
  });
});
