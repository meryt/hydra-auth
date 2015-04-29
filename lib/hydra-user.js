var HydraUser = function (userId, userName, email, groups) {
    if (typeof(userId) === 'object') {
        this._userId = userId._userId;
        this._userName = userId._userName;
        this._email = userId._email;
        this._groups = userId._groups;
    } else {
        this._userId = userId;
        this._userName = userName;
        this._email = email;
        this._groups = groups;
    }
};


HydraUser.prototype.getUserId = function () {
    return this._userId;
};
HydraUser.prototype.getUserName = function () {
    return this._userName;
};
HydraUser.prototype.getEmail = function () {
    return this._email;
};

HydraUser.prototype.getGroups = function () {
    return this._groups || [];
};

module.exports = HydraUser;
