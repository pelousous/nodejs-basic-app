const path = require('path');
const express = require('express');
const app = express();
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
