var AuthBasic = function (authConfig) {

    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var HydraUser = require('./hydra-user');

    passport.use(new BasicStrategy({realm: authConfig.realm},
        function (username, password, done) {
            if (authConfig.authenticate(username, password)) {
                return done(null, new HydraUser(username, username, null, []));
            } else {
                return done(null, false);
            }
        }
    ));

    // Function to perform authentication
    var authenticate = passport.authenticate('basic', {session: false});

    // With HTTP Basic Auth, auth headers are passed with every request, so checking for
    // auth is the same thing as performing it.
    var ensureAuthenticated = authenticate;

    return {
        buildUser: function (object) {
            return new HydraUser(object);
        },
        passport: passport,
        authenticate: authenticate,
        ensureAuthenticated: ensureAuthenticated,
        passportUseSession: false,
        allowLogout: function () {
            return false;
        }
    };
};

module.exports = AuthBasic;
