/**
 * User Login Service for Freshdesk
 *
 * @description :: Sails service for when AAF has authenticated a user.
 * @author      :: <a href='https://github.com/shilob/'>Shilo Banihit</a>
 */

module.exports = {
  validUser: function(payload, req, res) {
    sails.log.debug('In userLoginService, redirecting user...');
    // Freshdesk-specific
    var email = payload['https://aaf.edu.au/attributes'].mail;
    var name = payload['https://aaf.edu.au/attributes'].cn;
    var ts = new Date().getTime() / 1000;
    // Taken from: https://support.freshdesk.com/support/solutions/articles/31166-single-sign-on-remote-authentication-in-freshdesk
    var hashSource = name + email + ts;
    var crypto = require('crypto');
    var hmac = crypto.createHmac('md5', sails.config.auth.freshdesk.key);
    var hash = hmac.update(hashSource).digest('hex');
    var url = sails.config.auth.freshdesk.url + '?name='+encodeURIComponent(name)+'&email='+encodeURIComponent(email)+'&timestamp='+ts+'&hash='+hash;
    return res.redirect(url);
  },
  
  invalidUser: function(reason, req, res) {
    sails.log.error("User failed to login: " + reason);
    return res.json({failureReason: reason});
  }
};