const path = require('path');
const publicPath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

var express = require('express');
var app = express();

app.use(express.static(publicPath));

































app.listen(port, () => {
	console.log(`started up at port ${port}`);
});


