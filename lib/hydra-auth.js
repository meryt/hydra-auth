var HydraAuth = function (authConfig) {
    switch (authConfig.authMethod) {
        case 'basic':
            var BasicAuth = require('./auth-basic.js');
            var auth = new BasicAuth(authConfig.config);
            break;
        case 'direct-ldap':
            var LdapAuth = require('./auth-direct-ldap.js');
            var auth = new LdapAuth(authConfig.config);
            break;
        default:
            throw "authMethod " + authConfig.authMethod + "not defined or invalid";
    }

    return auth;
};

module.exports = HydraAuth;
