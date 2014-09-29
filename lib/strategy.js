'use strict';

var passport = require('passport-strategy');

function lookup (obj, field){
  if (!obj) { return null; }
  var chain = field.split(']').join('').split('[');
  for (var i = 0, len = chain.length; i < len; i++) {
    var prop = obj[chain[i]];
    if (typeof(prop) === 'undefined') { return null; }
    if (typeof(prop) !== 'object') { return prop; }
    obj = prop;
  }
  return null;
}

function Strategy(options, verify){
  if(typeof options === 'function'){
    verify = options;
    options = {};
  }

  if(!verify) { throw new TypeError('EmployerDCS Strategy requires a verify callback');

  this._businessIdField = options.businessIdField || 'businessId';
  this._emailField = options.emailField || 'email';
  this._passwordField = options.passwordField || 'password';

  passport.Strategy.call(this);
  this.name = 'employerDcs';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var businessId = lookup(req.body, this._businessIdField || lookup(req.query, this._businessIdField);
  var email = lookup(req.body, this.emailField || lookup(req.query, this._emailField);
  var password = lookup(req.body, this.passwordField || lookup(req.query, this._passwordField);

  if(!businessId || !email || !password){
    return this.fail({message : options.badRequestMessage || 'Missing Credentials'}, 400);
  }

  function verified(err, user, info){
    if(err){ return self.error(err)}
    if(!user){ return self.fail(info);}
    self.success(user, info);
  }
  
  try{
    if(self._passReqToCallback){
      this._verify(req, businessId, email, password, verified);
    } else {
      this._verify(businessId, email, password);
    }
  } catch (ex){
    return self.error(ex);
  }
};
