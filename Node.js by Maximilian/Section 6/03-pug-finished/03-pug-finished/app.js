const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//we are telling express that we have a templet engine has been installed and the name
app.set('view engine', 'pug');
// Is it Mandatory?
// Not Always Mandatory: If you place your view files in a directory named views in the root of your project, Express will look there by default, and you don't need to explicitly set it.
// Mandatory in Custom Locations: If your view files are in a different directory, you must use app.set('views', 'your_views_directory'); to tell Express where to find them.
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found'});
});

app.listen(3000);
