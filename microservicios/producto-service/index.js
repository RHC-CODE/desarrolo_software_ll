const express = require('express');
const app = express();
const routes = require('./routes/productRoutes');

app.use(express.json());
app.use('/products', routes);

app.listen(3000, () => console.log('Producto service running on port 3000'));