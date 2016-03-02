# express-api-session
A Hack which will enable us to use sessinId based session-management for expression-session middleware



## Usage
```
app.use( HandleSessionId({
  name: 'mysite.sid',
  secret: 'my secret',
}) );


// We can get clientSessionId ( Means, sessionId to be sent to client ) in side a controller like this 
function( req, res ){
  res.send( {
    isLoggedIn: true,
    sessionId: req.getClientSessionId(), // Say sessionId = '12345678954156132156';
  });
};

// Instead of keeping session using cookies, now we can keep session by adding a query parameter `sessionId` to any request.
// eg: wget http://myserver.com/my-profile?sessionId=12345678954156132156;

```

