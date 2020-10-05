const cors = require('cors');
const express = require('express');
const stripe = require('stripe')("sk_test_51HRwaOD2RnrZ3ZPxFREt77oT5WKP7tj0VXaNTJ5cIgqsa30qbKLF957y87qNVEjLSDNmY607k13hVo2MmrUin6IE00cgDPLpmK");
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Everthing is working fine.');
});

app.post('/payment', (req, res) => {
    console.log('payment working');
    const { product, token } = req.body;
    const idempotencyKey = uuidv4();
    console.log(product.price);
    return stripe.customers
        .create({
            email: token.email,
        })
        .then(customer => {
            return stripe.invoiceItems.create({
                customer: customer.id,
                amount: product.price,
                currency: 'usd',
                description: `Purchased  ${product.name}`,
            })
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(8080, () => console.log('Listning at port 8080'));