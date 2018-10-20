var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var httpServer = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var queryStringObject = parsedUrl.queryStringObject;
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var method = req.method.toLowerCase();
    var headers = req.headers;
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();
        console.log("trimmedPath="+trimmedPath+" typeof(router[trimmedPath]="+typeof(router[trimmedPath]));
        var choosenHandler = typeof(router[trimmedPath])=='function' ? router[trimmedPath] : handler.notFound;

        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
      };
        choosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode)=='number' ? statusCode : 200;
            console.log("typeof(payload)="+typeof(payload));
            payload = typeof(payload)=='object' ? payload : {};
            
            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("Request success");  
      });
    });

});

httpServer.listen(3000, function() {
    console.log("Server is listening on port "+3000);
});

var handler = {};

handler.hello = function(data, callback) {
    console.log("data="+data);
    data = { 'message' : 'Welcome to my page'}; 
    callback(200, data);
};

handler.notFound = function(data, callback) {
    callback(200);
}

var router = {
    'hello' : handler.hello
};