const express = require('express');
const app = express();
app.use('/_include', express.static(__dirname +'/_include'));
app.use('/samples', express.static(__dirname +'/samples'));

app.get('/', (request, response) => {
	response.sendFile(__dirname + '/index.html');
});

app.listen(80, () => {
    console.log('Server running at http://127.0.0.1:80');
});