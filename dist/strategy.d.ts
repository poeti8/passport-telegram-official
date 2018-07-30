/// <reference types="node" />
import { Strategy } from 'passport-strategy';
import * as express from 'express';
export declare type TelegramOptions = {
    botToken: string;
    queryExpiration?: number;
    passReqToCallback?: boolean;
};
export declare type TelegramUser = {
    auth_date: number;
    first_name: string;
    hash: string;
    id: number;
    last_name: string;
    username: string;
};
export declare type DoneCallback = (err: any, user: any, info: any) => void;
export declare type CallbackWithRequest = (req: express.Request, user: TelegramUser, done: DoneCallback) => void;
export declare type CallbackWithoutRequest = (user: TelegramUser, done: DoneCallback) => void;
export declare type VerifyCallback = CallbackWithRequest | CallbackWithoutRequest;
export declare const defaultOptions: {
    queryExpiration: number;
    passReqToCallback: boolean;
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
export default class TelegramStrategy extends Strategy {
    name: string;
    options: TelegramOptions;
    verify: any;
    hashedBotToken: Buffer;
    constructor(options: TelegramOptions, verify: VerifyCallback);
    authenticate(req: express.Request, options?: any): false | void;
    /**
     * Function to check if provided date in callback is outdated
     * @returns {number}
     */
    getTimestamp(): number;
    botToken(): Buffer;
    /**
     * Used to validate if fields like telegram must send are exists
     * @param {e.Request} req
     * @returns {any}
     */
    validateQuery(req: express.Request): boolean | void;
}
