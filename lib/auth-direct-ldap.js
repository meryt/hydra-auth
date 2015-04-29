var AuthLdap = function (ldapConfig, requestLog) {

    var passport = require('passport');
    var LdapStrategy = require('passport-ldap').Strategy;
    var HydraUser = require('./hydra-user');

    passport.use(new LdapStrategy(ldapConfig.opts, function (req, user, done) {
        // Ensure we don't serialize a user object to a cookie
        if (typeof(user[ldapConfig.loginNameField]) === 'string') {
            req.session.last_logged_in_user = user[ldapConfig.loginNameField];
        }
        return done(null, user);
    }));

    passport.serializeUser(function (user, done) {
        var userId = user[ldapConfig.usernameField];
        var givenName = user[ldapConfig.givenNameField] || userId;
        var email = user[ldapConfig.emailField] || null;

        var groups = user[ldapConfig.groupField] || [];

        var groupNames = [];
        for (var i = 0; i < groups.length; i++) {
            groupNames.push(ldapConfig.groupDNToCommonName(groups[i]));
        }

        var u = new HydraUser(userId, givenName, email, groupNames);

        done(null, u);
    });

    passport.deserializeUser(function (user, done) {
        done(null, new HydraUser(user));
    });

    // Function to perform authentication
    var authenticate = passport.authenticate('ldap', {
        session: true,
        failureFlash: {
            type: 'error',
            message: ldapConfig.errMsg || 'Authentication failed.'
        },
        failureRedirect: ldapConfig.failureRedirect || '/login',
        successRedirect: ldapConfig.successRedirect || '/'
    });

    // Middleware to ensure authentication has been completed, otherwise do something.
    var ensureAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            var usersGroups = req.user.getGroups();
            var usersAllowedGroups = [];
            if (typeof(usersGroups) !== 'undefined') {
                usersAllowedGroups = usersGroups.filter(function (n) {
                    return ldapConfig.allowedGroups.indexOf(n) != -1;
                });
            }
            if (ldapConfig.allowedGroups.length > 0 && usersAllowedGroups.length === 0) {
                if (typeof(requestLog.logRequest) === 'function') {
                    requestLog.logRequest(req, 'User ' + req.user.getUserId() + ' was refused access to the application. '
                        + 'This user belongs to the following LDAP groups: ' + req.user.getGroups().join(', '), 'warn');
                }
                if (typeof(req.flash) === 'function') {
                    req.flash('warn', 'You do not have sufficient LDAP permissions to access this application.');
                }
                req.logout();
                res.redirect(ldapConfig.failureRedirect || '/login');
            } else {
                return next();
            }
        } else {
            if (typeof(req.flash) === 'function') {
                req.flash('warn', 'You are not logged in or your user session has expired.');
            }
            res.redirect(ldapConfig.failureRedirect || '/login');
        }
    };

    return {
        passport: passport,
        authenticate: authenticate,
        ensureAuthenticated: ensureAuthenticated,
        passportUseSession: true,
        allowLogout: function () {
            return true;
        }
    };
};

module.exports = AuthLdap;
