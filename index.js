"use strict";

var assert = require('assert');
var signature = require('express-session/node_modules/cookie-signature');


/**
 * Usage
 * ```
 * app.use( HandleSessionId({
 *   name: 'mysite.sid',
 *   secret: 'my secret',
 * }) );
 * 
 * 
 * // We can get clientSessionId ( Means, sessionId to be sent to client ) in side a controller like this 
 * function( req, res ){
 *   res.send( {
 *     isLoggedIn: true,
 *     sessionId: req.getClientSessionId(), // Say sessionId = '12345678954156132156';
 *   });
 * };
 * 
 * // Instead of keeping session using cookies, now we can keep session by adding a query parameter `sessionId` to any request.
 * // eg: wget http://myserver.com/my-profile?sessionId=12345678954156132156;
 * 
 * ```
 * 
 */
function HandleSessionId( opts ){

  var cookieName = opts.name || 'connect.sid';
  var cookieSecret = opts.secret;

  assert( cookieSecret, 'HandleSessionId( opts ) => ');

  return function handleSessionId( req, res, next ){

    var sessionId =  req.query.sessionId, parts;
    var cookieStr = req.headers.cookie;

    if( sessionId ){

      sessionId = new Buffer( sessionId, 'base64').toString();

      var sessionIdPart  =  cookieName + '=' + encodeURIComponent( 's:' + sessionId );

      if( cookieStr ){

        // Overwrite session id
        parts = cookieStr.split('; ');
        var keys = parts.map( function(v){ return v.slice(0,13); });
        var pos = keys.indexOf( cookieName + '=s' );
        if( pos == -1 ){
          parts.push( sessionIdPart );
        } else {
          parts[pos] = sessionIdPart;
        }
      } else {
        parts = [ sessionIdPart ];
      }

      req.headers.cookie = parts.join('; ');

      req.getClientSessionId = function(){
        var signedCookie = signature.sign( this.sessionID,  cookieSecret );
        res.toBeSent.sessionId = new Buffer(signedCookie).toString('base64');
      };
    }
    next();
  };

}

module.exports = HandleSessionId;
