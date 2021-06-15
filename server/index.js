const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HzSHtFdvOMEPwYsnZXJISWxcgHhaOeTnWI2HcxAxxwZiJV4QMeJNWCXkEMjKqPypwM2UWaX1Nt04kruEQSedw9k00ctrS4tAA')

app.use(BodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === "OPTIONS") {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next();
})

app.post('/api/payment_handler', async (req, res) => {
    //console.log(req.body.id)
    try {
        const charge = await stripe.charges.create({
            amount: '500',
            description: "5 surveys for $5",
            currency: 'usd',
            source: req.body.id
        })

        return res.status(200).json(charge)
    }
    catch (error) {
        res.status(500).json({
            message: 'Error in creating charge.',
            error
        })
    }

})

const PORT  = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0");