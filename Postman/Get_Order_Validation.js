pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Each order total price is more than 660zł", function () {
    const orders = pm.response.json();
    orders.forEach(function(order) {
        const priceStr = order.total_price;
        const priceNum = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
        if (!isNaN(priceNum)) {
            pm.expect(priceNum, "Order #" + order.id + " total_price should be more than 660zł").to.be.above(660);
        }
    });
});

pm.test("Contact Details are properly filled", function () {
    const orders = pm.response.json();
    orders.forEach(function(order) {
        const FirstName = order.first_name;
        const LastName = order.last_name;
        const Address = order.address;

        pm.expect(FirstName, "First Name should not be empty").to.not.be.empty;
        pm.expect(LastName, "Last Name should not be empty").to.not.be.empty;
        pm.expect(Address, "Address should not be empty").to.not.be.empty;
    });
});