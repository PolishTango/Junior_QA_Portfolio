pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Sum of item prices matches total_price", function () {
    const requestBody = JSON.parse(pm.request.body.raw);
    
    const items = requestBody.items || [];
    const expectedTotal = parseFloat(String(requestBody.total_price || requestBody.totalPrice).replace(/[^0-9.]/g, ""));
    
    const calculatedTotal = items.reduce((sum, item) => {
        const itemPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
        const itemQuantity = Number(item.quantity) || 1;
        return sum + (itemPrice * itemQuantity);
    }, 0);
    
    console.log(`Calculated total: ${calculatedTotal}, Expected (total_price): ${expectedTotal}`);
    
    pm.expect(calculatedTotal, "The sum of item prices must equal total_price").to.eql(expectedTotal);
});