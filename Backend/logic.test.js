// This file tests your business logic functions in isolation.

// Let's define the functions we want to test based on the company rules.
const calculateFuelCost = (distance, traffic) => {
    let cost = distance * 5; // Base cost
    if (traffic === 'High') {
        cost += distance * 2; // Surcharge
    }
    return cost;
};

const calculateLatePenalty = (deliveryTimeMins, baseTimeMins) => {
    const isLate = deliveryTimeMins > (baseTimeMins + 10);
    return isLate ? 50 : 0; // Return 50 if late, 0 otherwise
};

const calculateHighValueBonus = (orderValue, isLate) => {
    if (!isLate && orderValue > 1000) {
        return orderValue * 0.10; // 10% bonus
    }
    return 0; // No bonus
};


// Now, we use Jest to test these functions
describe('GreenCart Business Logic Rules', () => {

    // Test Case 1: Fuel Cost
    test('Fuel Cost: should calculate base cost for Low traffic', () => {
        // distance: 20km, traffic: Low
        expect(calculateFuelCost(20, 'Low')).toBe(100);
    });

    // Test Case 2: Fuel Cost with Surcharge
    test('Fuel Cost: should apply surcharge for High traffic', () => {
        // distance: 20km, traffic: High
        expect(calculateFuelCost(20, 'High')).toBe(140); // 20*5 + 20*2 = 100 + 40
    });

    // Test Case 3: Late Penalty
    test('Late Penalty: should apply a penalty if delivery is >10 mins late', () => {
        // base time: 60 mins, delivery time: 71 mins
        expect(calculateLatePenalty(71, 60)).toBe(50);
    });

    // Test Case 4: No Late Penalty
    test('Late Penalty: should NOT apply a penalty if delivery is on time', () => {
        // base time: 60 mins, delivery time: 65 mins
        expect(calculateLatePenalty(65, 60)).toBe(0);
    });

    // Test Case 5: High-Value Bonus
    test('High-Value Bonus: should apply 10% bonus for on-time, high-value orders', () => {
        // order value: 1200, isLate: false
        expect(calculateHighValueBonus(1200, false)).toBe(120);
    });

    // Test Case 6 (Bonus Test): No Bonus if Late
    test('High-Value Bonus: should NOT apply bonus if the order is late', () => {
        // order value: 1200, isLate: true
        expect(calculateHighValueBonus(1200, true)).toBe(0);
    });

    // Test Case 7 (Bonus Test): No Bonus if Low Value
    test('High-Value Bonus: should NOT apply bonus if order value is not high enough', () => {
        // order value: 900, isLate: false
        expect(calculateHighValueBonus(900, false)).toBe(0);
    });
});