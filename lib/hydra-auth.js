var HydraAuth = function (authConfig, requestLog) {
    switch (authConfig.authMethod) {
        case 'basic':
            var BasicAuth = require('./auth-basic.js');
            var auth = new BasicAuth(authConfig.config, requestLog);
            break;
        case 'direct-ldap':
            var LdapAuth = require('./auth-direct-ldap.js');
            var auth = new LdapAuth(authConfig.config, requestLog);
            break;
        default:
            throw "authMethod " + authConfig.authMethod + "not defined or invalid";
    }

    return auth;
};

module.exports = HydraAuth;
