"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var passport_strategy_1 = require("passport-strategy");
var lodash_1 = require("lodash");
var crypto = require("crypto");
var deferPromise_1 = require("./deferPromise");
exports.defaultOptions = {
    queryExpiration: 86400,
    passReqToCallback: false
};
/**
 * `TelegramStrategy` constructor.
 *
 * The Telegram authentication strategy authenticates requests by delegating to
 * Telegram using their protocol: https://core.telegram.org/widgets/login
 *
 * Applications must supply a `verify` callback which accepts an `account` object,
 * and then calls `done` callback sypplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occurred, `error` should be set.
 *
 * More info here: https://core.telegram.org/widgets/login
 *
 * @param {Object} options
 * @param {Function} verify
 * @example
 * passport.use(new TelegramStrategy({
 *   botId: 12434151
 * }), (user) => {
 *   User.findOrCreate({telegramId: user.id}, done);
 * });
 */
var TelegramStrategy = /** @class */ (function (_super) {
    __extends(TelegramStrategy, _super);
    function TelegramStrategy(options, verify) {
        var _this = _super.call(this) || this;
        if (!options.botToken) {
            throw new TypeError('options.botToken is required in TelegramStrategy');
        }
        if (!verify) {
            throw new TypeError('LocalStrategy requires a verify callback');
        }
        _this.options = lodash_1.assign({}, exports.defaultOptions, options);
        _this.name = 'telegram';
        _this.verify = verify;
        _this.hashedBotToken = _this.botToken();
        return _this;
    }
    TelegramStrategy.prototype.authenticate = function (req, options) {
        var _this = this;
        var query = req.method === 'GET' ? req.query : req.body;
        try {
            var validationResult = this.validateQuery(req);
            if (validationResult !== true)
                return validationResult;
            var promise = deferPromise_1["default"]();
            if (this.options.passReqToCallback) {
                this.verify(req, query, promise.callback);
            }
            else {
                this.verify(query, promise.callback);
            }
            promise.then(function (_a) {
                var user = _a[0], info = _a[1];
                if (!user)
                    return _this.fail(info);
                _this.success(user, info);
            })["catch"](function (err) {
                return _this.error(err);
            });
        }
        catch (e) {
            return this.error(e);
        }
    };
    /**
     * Function to check if provided date in callback is outdated
     * @returns {number}
     */
    TelegramStrategy.prototype.getTimestamp = function () {
        return parseInt((+new Date / 1000), 10);
    };
    // We have to hash botToken too
    TelegramStrategy.prototype.botToken = function () {
        // Use buffer to better performance
        return crypto.createHash('sha256').update(this.options.botToken).digest();
    };
    /**
     * Used to validate if fields like telegram must send are exists
     * @param {e.Request} req
     * @returns {any}
     */
    TelegramStrategy.prototype.validateQuery = function (req) {
        var query = req.method === 'GET' ? req.query : req.body;
        if (!query.auth_date || !query.hash || !query.id) {
            return this.fail({ message: 'Missing some important data' }, 400);
        }
        var authDate = parseInt(query.auth_date);
        if (this.options.queryExpiration !== -1 &&
            (isNaN(authDate) || this.getTimestamp() - authDate > this.options.queryExpiration)) {
            return this.fail({ message: 'Data is outdated' }, 400);
        }
        var sorted = Object.keys(query).sort();
        var mapped = sorted // Everything except hash must be mapped
            .filter(function (d) { return d !== 'hash'; })
            .map(function (key) { return key + "=" + query[key]; });
        var hashString = mapped.join('\n');
        var hash = crypto
            .createHmac('sha256', this.hashedBotToken)
            .update(hashString)
            .digest('hex');
        if (hash !== query.hash)
            return this.fail({ message: 'Hash validation failed' }, 403);
        return true;
    };
    return TelegramStrategy;
}(passport_strategy_1.Strategy));
exports["default"] = TelegramStrategy;
//# sourceMappingURL=strategy.js.map