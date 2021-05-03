// Replace if using a different env file or config.
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const stripe = require("stripe")('sk_test_51Ijgs0SIUtONOjVtDkCLUCKkKSmNpFssIC0adAfLfGTktRPbM1MUQXrACRhtHdN1Us2BMIqINtnTOvXRQm5zFXOu00XhgHEYu8');
var cors = require('cors')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
// For demo purposes we're hardcoding the amount and currency here.
// Replace this with your own inventory/cart/order logic.
const purchase = {
    amount: 1099,
    currency: "INR"
};

const createPurchase = items => {
    // Extend this function with your logic to validate
    // the purchase details server-side and prevent
    // manipulation of price details on the client.
    return purchase;
};

app.get("/", (req, res) => {
    console.log(req.query)
    res.send("working")
});
app.get("/products", async (req, res) => {
    try {
        let prices = await stripe.prices.list({
            type: 'recurring',
            expand: ['data.product']
        });
        res.send(prices.data)
    } catch (err) {
        res.status(400).send({ err });

    }
})

app.post("/subscription/usage", async (req, res) => {
    const { itemId, quantity } = (req.body);
    try {
        await stripe.subscriptionItems.createUsageRecord(
            itemId,
            {
                quantity,
                timestamp: parseInt(Date.now() / 1000),
                action: 'increment',
            }
        );
        res.send({ message: "Done" });
    } catch (error) {
        console.log(error)
        res.status(400).send({ error });
    }
});


app.get("/subscription/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let subscription = await stripe.subscriptions.retrieve(id)
        res.send(subscription)
    } catch (err) {
        res.status(400).send({ error: err });

    }
})

app.get("/customers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let customer = await stripe.customers.retrieve(id)
        res.send(customer)
    } catch (err) {
        res.status(400).send({ error: err });

    }
})

app.get("/payments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const paymentMethods = await stripe.paymentMethods.list({
            customer: id,
            type: 'card',
        });
        res.send(paymentMethods)
    } catch (err) {
        res.status(400).send({ error: err });

    }
})

app.post("/subscription/create", async (req, res) => {
    const { customerId = '', items = [] } = (req.body);
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items,
        });
        res.send(subscription);
    } catch (error) {
        console.log(error)
        res.status(400).send({ error });
    }
});


app.post("/customer/create", async (req, res) => {
    console.log(req.body)
    const { phone, email, name } = (req.body);
    try {
        // Validate the phone number input
        // Create a new customer object
        const customer = await stripe.customers.create({
            phone,
            email, name, id: (name + phone)
        });
        console.log(customer)
        // Create a CheckoutSession to set up our payment methods recurring usage
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "setup",
            customer: customer.id,
            success_url: `${req.headers.origin}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/`
        });

        res.send({ customer, checkoutSession });
    } catch (error) {
        console.log(error)
        res.status(400).send({ error });
    }
});

app.get("/customer/session/:id", async (req, res) => {
    const { id } = req.params;

    const checkoutSession = await stripe.checkout.sessions.retrieve(id, {
        expand: ["customer", "setup_intent.payment_method"]
    });

    res.send({ checkoutSession });
});


app.listen(5000, () => console.log(`Node server listening on port ${5000}!`));