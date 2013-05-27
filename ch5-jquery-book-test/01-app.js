var http = require('http'),
    url = require('url'),
    fs = require('fs');
http.createServer(function (req, res) {
  var reqData = {
		url: url.parse(req.url, true),
		method: req.method,
		headers: req.headers },
  	  path = reqData.url.pathname;

  if(path.match(/^\/[0-9a-z\-]+\.(html)|(json)|(xml)$/))
    fs.readFile('.' + path, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('not found');
      }
	  else {
	   if(path.split('.')[1] == 'html')
  	     res.writeHead(200, {'Content-Type': 'text/html'});
	   else if(path.split('.')[1] == 'xml')
  	     res.writeHead(200, {'Content-Type': 'application/xml'});
	   else 
         res.writeHead(200, {'Content-Type': 'application/json'});
       res.end(data);
      }   
    });
  else if(path == '/return-http-headers') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(reqData));
  }
  else if(path == '/sleep') {
	var endTime = new Date().getTime() + 2000;
	while (new Date().getTime() < endTime);
	res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('slow response');
  }
  else if(path == '/validate') {
	var keys = [];
	for(var key in reqData.url.query) {
		if(reqData.url.query[key] == '')
			keys.push(key);
	}
	res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(keys));
  }
  else if(path == '/redirect') {
	res.writeHead(302, {
	  'Location': '/test-values.json' });
    res.end();	
  }
  else if(path == '/fail\-on\-purpose') {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('unexpected" error');
  }
  else {
   res.writeHead(404, {'Content-Type': 'text/plain'});
   res.end('not found');
  }
}).listen(1337, "localhost");
console.log('Server running at http://localhost:1337/');