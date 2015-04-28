var HydraUser = function (userId, userName, email) {
    if (typeof(userId) === 'object') {
        this._userId = userId._userId;
        this._userName = userId._userName;
        this._email = userId._email;
    } else {
        this._userId = userId;
        this._userName = userName;
        this._email = email;
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

module.exports = HydraUser;
