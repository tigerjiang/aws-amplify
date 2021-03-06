"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright 2017-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
var zen_observable_ts_1 = __importDefault(require("zen-observable-ts"));
var graphql_1 = require("graphql");
var url = __importStar(require("url"));
var uuid_1 = require("uuid");
var buffer_1 = require("buffer");
var core_1 = require("@aws-amplify/core");
var cache_1 = __importDefault(require("@aws-amplify/cache"));
var auth_1 = __importDefault(require("@aws-amplify/auth"));
var PubSubProvider_1 = require("./PubSubProvider");
var index_1 = require("../index");
var logger = new core_1.Logger('AWSAppSyncRealTimeProvider');
var AMPLIFY_SYMBOL = (typeof Symbol !== 'undefined' &&
    typeof Symbol.for === 'function'
    ? Symbol.for('amplify_default')
    : '@@amplify_default');
var dispatchApiEvent = function (event, data, message) {
    core_1.Hub.dispatch('api', { event: event, data: data, message: message }, 'PubSub', AMPLIFY_SYMBOL);
};
var MAX_DELAY_MS = 5000;
var NON_RETRYABLE_CODES = [400, 401, 403];
var MESSAGE_TYPES;
(function (MESSAGE_TYPES) {
    /**
     * Client -> Server message.
     * This message type is the first message after handshake and this will initialize AWS AppSync RealTime communication
     */
    MESSAGE_TYPES["GQL_CONNECTION_INIT"] = "connection_init";
    /**
     * Server -> Client message
     * This message type is in case there is an issue with AWS AppSync RealTime when establishing connection
     */
    MESSAGE_TYPES["GQL_CONNECTION_ERROR"] = "connection_error";
    /**
     * Server -> Client message.
     * This message type is for the ack response from AWS AppSync RealTime for GQL_CONNECTION_INIT message
     */
    MESSAGE_TYPES["GQL_CONNECTION_ACK"] = "connection_ack";
    /**
     * Client -> Server message.
     * This message type is for register subscriptions with AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_START"] = "start";
    /**
     * Server -> Client message.
     * This message type is for the ack response from AWS AppSync RealTime for GQL_START message
     */
    MESSAGE_TYPES["GQL_START_ACK"] = "start_ack";
    /**
     * Server -> Client message.
     * This message type is for subscription message from AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_DATA"] = "data";
    /**
     * Server -> Client message.
     * This message type helps the client to know is still receiving messages from AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_CONNECTION_KEEP_ALIVE"] = "ka";
    /**
     * Client -> Server message.
     * This message type is for unregister subscriptions with AWS AppSync RealTime
     */
    MESSAGE_TYPES["GQL_STOP"] = "stop";
    /**
     * Server -> Client message.
     * This message type is for the ack response from AWS AppSync RealTime for GQL_STOP message
     */
    MESSAGE_TYPES["GQL_COMPLETE"] = "complete";
    /**
     * Server -> Client message.
     * This message type is for sending error messages from AWS AppSync RealTime to the client
     */
    MESSAGE_TYPES["GQL_ERROR"] = "error";
})(MESSAGE_TYPES || (MESSAGE_TYPES = {}));
var SUBSCRIPTION_STATUS;
(function (SUBSCRIPTION_STATUS) {
    SUBSCRIPTION_STATUS[SUBSCRIPTION_STATUS["PENDING"] = 0] = "PENDING";
    SUBSCRIPTION_STATUS[SUBSCRIPTION_STATUS["CONNECTED"] = 1] = "CONNECTED";
    SUBSCRIPTION_STATUS[SUBSCRIPTION_STATUS["FAILED"] = 2] = "FAILED";
})(SUBSCRIPTION_STATUS || (SUBSCRIPTION_STATUS = {}));
var SOCKET_STATUS;
(function (SOCKET_STATUS) {
    SOCKET_STATUS[SOCKET_STATUS["CLOSED"] = 0] = "CLOSED";
    SOCKET_STATUS[SOCKET_STATUS["READY"] = 1] = "READY";
    SOCKET_STATUS[SOCKET_STATUS["CONNECTING"] = 2] = "CONNECTING";
})(SOCKET_STATUS || (SOCKET_STATUS = {}));
var AWS_APPSYNC_REALTIME_HEADERS = {
    accept: 'application/json, text/javascript',
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=UTF-8',
};
/**
 * Time in milleseconds to wait for GQL_CONNECTION_INIT message
 */
var CONNECTION_INIT_TIMEOUT = 15000;
/**
 * Time in milleseconds to wait for GQL_START_ACK message
 */
var START_ACK_TIMEOUT = 15000;
/**
 * Default Time in milleseconds to wait for GQL_CONNECTION_KEEP_ALIVE message
 */
var DEFAULT_KEEP_ALIVE_TIMEOUT = 5 * 60 * 1000;
var AWSAppSyncRealTimeProvider = /** @class */ (function (_super) {
    __extends(AWSAppSyncRealTimeProvider, _super);
    function AWSAppSyncRealTimeProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.socketStatus = SOCKET_STATUS.CLOSED;
        _this.keepAliveTimeout = DEFAULT_KEEP_ALIVE_TIMEOUT;
        _this.subscriptionObserverMap = new Map();
        _this.promiseArray = [];
        return _this;
    }
    AWSAppSyncRealTimeProvider.prototype.getProviderName = function () {
        return 'AWSAppSyncRealTimeProvider';
    };
    AWSAppSyncRealTimeProvider.prototype.newClient = function () {
        throw new Error('Not used here');
    };
    AWSAppSyncRealTimeProvider.prototype.publish = function (_topics, _msg, _options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('Operation not supported');
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype.subscribe = function (_topics, options) {
        var _this = this;
        var appSyncGraphqlEndpoint = options.appSyncGraphqlEndpoint;
        return new zen_observable_ts_1.default(function (observer) {
            if (!appSyncGraphqlEndpoint) {
                observer.error({
                    errors: [
                        __assign({}, new graphql_1.GraphQLError("Subscribe only available for AWS AppSync endpoint")),
                    ],
                });
                observer.complete();
            }
            else {
                var subscriptionId_1 = uuid_1.v4();
                _this._startSubscriptionWithAWSAppSyncRealTime({
                    options: options,
                    observer: observer,
                    subscriptionId: subscriptionId_1,
                }).catch(function (err) {
                    observer.error({
                        errors: [
                            __assign({}, new graphql_1.GraphQLError(index_1.CONTROL_MSG.REALTIME_SUBSCRIPTION_INIT_ERROR + ": " + err)),
                        ],
                    });
                    observer.complete();
                });
                return function () { return __awaiter(_this, void 0, void 0, function () {
                    var subscriptionState, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, 3, 4]);
                                // Waiting that subscription has been connected before trying to unsubscribe
                                return [4 /*yield*/, this._waitForSubscriptionToBeConnected(subscriptionId_1)];
                            case 1:
                                // Waiting that subscription has been connected before trying to unsubscribe
                                _a.sent();
                                subscriptionState = (this.subscriptionObserverMap.get(subscriptionId_1) || {}).subscriptionState;
                                if (!subscriptionState) {
                                    // subscription already unsubscribed
                                    return [2 /*return*/];
                                }
                                if (subscriptionState === SUBSCRIPTION_STATUS.CONNECTED) {
                                    this._sendUnsubscriptionMessage(subscriptionId_1);
                                }
                                else {
                                    throw new Error('Subscription never connected');
                                }
                                return [3 /*break*/, 4];
                            case 2:
                                err_1 = _a.sent();
                                logger.debug("Error while unsubscribing " + err_1);
                                return [3 /*break*/, 4];
                            case 3:
                                this._removeSubscriptionObserver(subscriptionId_1);
                                return [7 /*endfinally*/];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
            }
        });
    };
    Object.defineProperty(AWSAppSyncRealTimeProvider.prototype, "isSSLEnabled", {
        get: function () {
            return !this.options
                .aws_appsync_dangerously_connect_to_http_endpoint_for_testing;
        },
        enumerable: true,
        configurable: true
    });
    AWSAppSyncRealTimeProvider.prototype._startSubscriptionWithAWSAppSyncRealTime = function (_a) {
        var options = _a.options, observer = _a.observer, subscriptionId = _a.subscriptionId;
        return __awaiter(this, void 0, void 0, function () {
            var appSyncGraphqlEndpoint, authenticationType, query, variables, apiKey, region, _b, graphql_headers, _c, additionalHeaders, subscriptionState, data, dataString, headerObj, _d, _e, subscriptionMessage, stringToAWSRealTime, err_2, _f, message, subscriptionFailedCallback_1, _g, subscriptionFailedCallback, subscriptionReadyCallback;
            var _h;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        appSyncGraphqlEndpoint = options.appSyncGraphqlEndpoint, authenticationType = options.authenticationType, query = options.query, variables = options.variables, apiKey = options.apiKey, region = options.region, _b = options.graphql_headers, graphql_headers = _b === void 0 ? function () { return ({}); } : _b, _c = options.additionalHeaders, additionalHeaders = _c === void 0 ? {} : _c;
                        subscriptionState = SUBSCRIPTION_STATUS.PENDING;
                        data = {
                            query: query,
                            variables: variables,
                        };
                        // Having a subscription id map will make it simple to forward messages received
                        this.subscriptionObserverMap.set(subscriptionId, {
                            observer: observer,
                            query: query,
                            variables: variables,
                            subscriptionState: subscriptionState,
                            startAckTimeoutId: null,
                        });
                        dataString = JSON.stringify(data);
                        _d = [{}];
                        return [4 /*yield*/, this._awsRealTimeHeaderBasedAuth({
                                apiKey: apiKey,
                                appSyncGraphqlEndpoint: appSyncGraphqlEndpoint,
                                authenticationType: authenticationType,
                                payload: dataString,
                                canonicalUri: '',
                                region: region,
                            })];
                    case 1:
                        _e = [__assign.apply(void 0, _d.concat([(_j.sent())]))];
                        return [4 /*yield*/, graphql_headers()];
                    case 2:
                        headerObj = __assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, _e.concat([(_j.sent())])), additionalHeaders]), (_h = {}, _h[core_1.USER_AGENT_HEADER] = core_1.Constants.userAgent, _h)]);
                        subscriptionMessage = {
                            id: subscriptionId,
                            payload: {
                                data: dataString,
                                extensions: {
                                    authorization: __assign({}, headerObj),
                                },
                            },
                            type: MESSAGE_TYPES.GQL_START,
                        };
                        stringToAWSRealTime = JSON.stringify(subscriptionMessage);
                        _j.label = 3;
                    case 3:
                        _j.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this._initializeWebSocketConnection({
                                apiKey: apiKey,
                                appSyncGraphqlEndpoint: appSyncGraphqlEndpoint,
                                authenticationType: authenticationType,
                                region: region,
                            })];
                    case 4:
                        _j.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_2 = _j.sent();
                        logger.debug({ err: err_2 });
                        _f = err_2.message, message = _f === void 0 ? '' : _f;
                        observer.error({
                            errors: [
                                __assign({}, new graphql_1.GraphQLError(index_1.CONTROL_MSG.CONNECTION_FAILED + ": " + message)),
                            ],
                        });
                        observer.complete();
                        subscriptionFailedCallback_1 = (this.subscriptionObserverMap.get(subscriptionId) || {}).subscriptionFailedCallback;
                        // Notify concurrent unsubscription
                        if (typeof subscriptionFailedCallback_1 === 'function') {
                            subscriptionFailedCallback_1();
                        }
                        return [2 /*return*/];
                    case 6:
                        _g = this.subscriptionObserverMap.get(subscriptionId), subscriptionFailedCallback = _g.subscriptionFailedCallback, subscriptionReadyCallback = _g.subscriptionReadyCallback;
                        // This must be done before sending the message in order to be listening immediately
                        this.subscriptionObserverMap.set(subscriptionId, {
                            observer: observer,
                            subscriptionState: subscriptionState,
                            variables: variables,
                            query: query,
                            subscriptionReadyCallback: subscriptionReadyCallback,
                            subscriptionFailedCallback: subscriptionFailedCallback,
                            startAckTimeoutId: setTimeout(function () {
                                _this._timeoutStartSubscriptionAck.call(_this, subscriptionId);
                            }, START_ACK_TIMEOUT),
                        });
                        if (this.awsRealTimeSocket) {
                            this.awsRealTimeSocket.send(stringToAWSRealTime);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Waiting that subscription has been connected before trying to unsubscribe
    AWSAppSyncRealTimeProvider.prototype._waitForSubscriptionToBeConnected = function (subscriptionId) {
        return __awaiter(this, void 0, void 0, function () {
            var subscriptionState;
            var _this = this;
            return __generator(this, function (_a) {
                subscriptionState = this.subscriptionObserverMap.get(subscriptionId).subscriptionState;
                // This in case unsubscribe is invoked before sending start subscription message
                if (subscriptionState === SUBSCRIPTION_STATUS.PENDING) {
                    return [2 /*return*/, new Promise(function (res, rej) {
                            var _a = _this.subscriptionObserverMap.get(subscriptionId), observer = _a.observer, subscriptionState = _a.subscriptionState, variables = _a.variables, query = _a.query;
                            _this.subscriptionObserverMap.set(subscriptionId, {
                                observer: observer,
                                subscriptionState: subscriptionState,
                                variables: variables,
                                query: query,
                                subscriptionReadyCallback: res,
                                subscriptionFailedCallback: rej,
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._sendUnsubscriptionMessage = function (subscriptionId) {
        try {
            if (this.awsRealTimeSocket &&
                this.awsRealTimeSocket.readyState === WebSocket.OPEN &&
                this.socketStatus === SOCKET_STATUS.READY) {
                // Preparing unsubscribe message to stop receiving messages for that subscription
                var unsubscribeMessage = {
                    id: subscriptionId,
                    type: MESSAGE_TYPES.GQL_STOP,
                };
                var stringToAWSRealTime = JSON.stringify(unsubscribeMessage);
                this.awsRealTimeSocket.send(stringToAWSRealTime);
            }
        }
        catch (err) {
            // If GQL_STOP is not sent because of disconnection issue, then there is nothing the client can do
            logger.debug({ err: err });
        }
    };
    AWSAppSyncRealTimeProvider.prototype._removeSubscriptionObserver = function (subscriptionId) {
        this.subscriptionObserverMap.delete(subscriptionId);
        // Verifying 1000ms after removing subscription in case there are new subscription unmount/mount
        setTimeout(this._closeSocketIfRequired.bind(this), 1000);
    };
    AWSAppSyncRealTimeProvider.prototype._closeSocketIfRequired = function () {
        if (this.subscriptionObserverMap.size > 0) {
            // Active subscriptions on the WebSocket
            return;
        }
        if (!this.awsRealTimeSocket) {
            this.socketStatus = SOCKET_STATUS.CLOSED;
            return;
        }
        if (this.awsRealTimeSocket.bufferedAmount > 0) {
            // Still data on the WebSocket
            setTimeout(this._closeSocketIfRequired.bind(this), 1000);
        }
        else {
            logger.debug('closing WebSocket...');
            clearTimeout(this.keepAliveTimeoutId);
            var tempSocket = this.awsRealTimeSocket;
            // Cleaning callbacks to avoid race condition, socket still exists
            tempSocket.onclose = undefined;
            tempSocket.onerror = undefined;
            tempSocket.close(1000);
            this.awsRealTimeSocket = null;
            this.socketStatus = SOCKET_STATUS.CLOSED;
        }
    };
    AWSAppSyncRealTimeProvider.prototype._handleIncomingSubscriptionMessage = function (message) {
        logger.debug("subscription message from AWS AppSync RealTime: " + message.data);
        var _a = JSON.parse(message.data), _b = _a.id, id = _b === void 0 ? '' : _b, payload = _a.payload, type = _a.type;
        var _c = this.subscriptionObserverMap.get(id) || {}, _d = _c.observer, observer = _d === void 0 ? null : _d, _e = _c.query, query = _e === void 0 ? '' : _e, _f = _c.variables, variables = _f === void 0 ? {} : _f, startAckTimeoutId = _c.startAckTimeoutId, subscriptionReadyCallback = _c.subscriptionReadyCallback, subscriptionFailedCallback = _c.subscriptionFailedCallback;
        logger.debug({ id: id, observer: observer, query: query, variables: variables });
        if (type === MESSAGE_TYPES.GQL_DATA && payload && payload.data) {
            if (observer) {
                observer.next(payload);
            }
            else {
                logger.debug("observer not found for id: " + id);
            }
            return;
        }
        if (type === MESSAGE_TYPES.GQL_START_ACK) {
            logger.debug("subscription ready for " + JSON.stringify({ query: query, variables: variables }));
            if (typeof subscriptionReadyCallback === 'function') {
                subscriptionReadyCallback();
            }
            clearTimeout(startAckTimeoutId);
            dispatchApiEvent(index_1.CONTROL_MSG.SUBSCRIPTION_ACK, { query: query, variables: variables }, 'Connection established for subscription');
            var subscriptionState = SUBSCRIPTION_STATUS.CONNECTED;
            this.subscriptionObserverMap.set(id, {
                observer: observer,
                query: query,
                variables: variables,
                startAckTimeoutId: null,
                subscriptionState: subscriptionState,
                subscriptionReadyCallback: subscriptionReadyCallback,
                subscriptionFailedCallback: subscriptionFailedCallback,
            });
            // TODO: emit event on hub but it requires to store the id first
            return;
        }
        if (type === MESSAGE_TYPES.GQL_CONNECTION_KEEP_ALIVE) {
            clearTimeout(this.keepAliveTimeoutId);
            this.keepAliveTimeoutId = setTimeout(this._errorDisconnect.bind(this, index_1.CONTROL_MSG.TIMEOUT_DISCONNECT), this.keepAliveTimeout);
            return;
        }
        if (type === MESSAGE_TYPES.GQL_ERROR) {
            var subscriptionState = SUBSCRIPTION_STATUS.FAILED;
            this.subscriptionObserverMap.set(id, {
                observer: observer,
                query: query,
                variables: variables,
                startAckTimeoutId: startAckTimeoutId,
                subscriptionReadyCallback: subscriptionReadyCallback,
                subscriptionFailedCallback: subscriptionFailedCallback,
                subscriptionState: subscriptionState,
            });
            observer.error({
                errors: [
                    __assign({}, new graphql_1.GraphQLError(index_1.CONTROL_MSG.CONNECTION_FAILED + ": " + JSON.stringify(payload))),
                ],
            });
            clearTimeout(startAckTimeoutId);
            observer.complete();
            if (typeof subscriptionFailedCallback === 'function') {
                subscriptionFailedCallback();
            }
        }
    };
    AWSAppSyncRealTimeProvider.prototype._errorDisconnect = function (msg) {
        logger.debug("Disconnect error: " + msg);
        this.subscriptionObserverMap.forEach(function (_a) {
            var observer = _a.observer;
            if (observer && !observer.closed) {
                observer.error({
                    errors: [__assign({}, new graphql_1.GraphQLError(msg))],
                });
            }
        });
        this.subscriptionObserverMap.clear();
        if (this.awsRealTimeSocket) {
            this.awsRealTimeSocket.close();
        }
        this.socketStatus = SOCKET_STATUS.CLOSED;
    };
    AWSAppSyncRealTimeProvider.prototype._timeoutStartSubscriptionAck = function (subscriptionId) {
        var _a = this.subscriptionObserverMap.get(subscriptionId) || {}, observer = _a.observer, query = _a.query, variables = _a.variables;
        if (!observer) {
            return;
        }
        this.subscriptionObserverMap.set(subscriptionId, {
            observer: observer,
            query: query,
            variables: variables,
            subscriptionState: SUBSCRIPTION_STATUS.FAILED,
        });
        if (observer && !observer.closed) {
            observer.error({
                errors: [
                    __assign({}, new graphql_1.GraphQLError("Subscription timeout " + JSON.stringify({ query: query, variables: variables }))),
                ],
            });
            // Cleanup will be automatically executed
            observer.complete();
        }
        logger.debug('timeoutStartSubscription', JSON.stringify({ query: query, variables: variables }));
    };
    AWSAppSyncRealTimeProvider.prototype._initializeWebSocketConnection = function (_a) {
        var _this = this;
        var appSyncGraphqlEndpoint = _a.appSyncGraphqlEndpoint, authenticationType = _a.authenticationType, apiKey = _a.apiKey, region = _a.region;
        if (this.socketStatus === SOCKET_STATUS.READY) {
            return;
        }
        return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
            var protocol, discoverableEndpoint, payloadString, headerString, _a, _b, headerQs, payloadQs, awsRealTimeUrl, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.promiseArray.push({ res: res, rej: rej });
                        if (!(this.socketStatus === SOCKET_STATUS.CLOSED)) return [3 /*break*/, 5];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        this.socketStatus = SOCKET_STATUS.CONNECTING;
                        protocol = this.isSSLEnabled ? 'wss://' : 'ws://';
                        discoverableEndpoint = appSyncGraphqlEndpoint
                            .replace('https://', protocol)
                            .replace('http://', protocol)
                            .replace('appsync-api', 'appsync-realtime-api')
                            .replace('gogi-beta', 'grt-beta');
                        payloadString = '{}';
                        _b = (_a = JSON).stringify;
                        return [4 /*yield*/, this._awsRealTimeHeaderBasedAuth({
                                authenticationType: authenticationType,
                                payload: payloadString,
                                canonicalUri: '/connect',
                                apiKey: apiKey,
                                appSyncGraphqlEndpoint: appSyncGraphqlEndpoint,
                                region: region,
                            })];
                    case 2:
                        headerString = _b.apply(_a, [_c.sent()]);
                        headerQs = buffer_1.Buffer.from(headerString).toString('base64');
                        payloadQs = buffer_1.Buffer.from(payloadString).toString('base64');
                        awsRealTimeUrl = discoverableEndpoint + "?header=" + headerQs + "&payload=" + payloadQs;
                        return [4 /*yield*/, this._initializeRetryableHandshake({ awsRealTimeUrl: awsRealTimeUrl })];
                    case 3:
                        _c.sent();
                        this.promiseArray.forEach(function (_a) {
                            var res = _a.res;
                            logger.debug('Notifying connection successful');
                            res();
                        });
                        this.socketStatus = SOCKET_STATUS.READY;
                        this.promiseArray = [];
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _c.sent();
                        this.promiseArray.forEach(function (_a) {
                            var rej = _a.rej;
                            return rej(err_3);
                        });
                        this.promiseArray = [];
                        if (this.awsRealTimeSocket &&
                            this.awsRealTimeSocket.readyState === WebSocket.OPEN) {
                            this.awsRealTimeSocket.close(3001);
                        }
                        this.awsRealTimeSocket = null;
                        this.socketStatus = SOCKET_STATUS.CLOSED;
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    AWSAppSyncRealTimeProvider.prototype._initializeRetryableHandshake = function (_a) {
        var awsRealTimeUrl = _a.awsRealTimeUrl;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger.debug("Initializaling retryable Handshake");
                        return [4 /*yield*/, core_1.jitteredExponentialRetry(this._initializeHandshake.bind(this), [{ awsRealTimeUrl: awsRealTimeUrl }], MAX_DELAY_MS)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._initializeHandshake = function (_a) {
        var awsRealTimeUrl = _a.awsRealTimeUrl;
        return __awaiter(this, void 0, void 0, function () {
            var err_4, errorType, errorCode;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger.debug("Initializing handshake " + awsRealTimeUrl);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (function () {
                                return new Promise(function (res, rej) {
                                    var newSocket = new WebSocket(awsRealTimeUrl, 'graphql-ws');
                                    newSocket.onerror = function () {
                                        logger.debug("WebSocket connection error");
                                    };
                                    newSocket.onclose = function () {
                                        rej(new Error('Connection handshake error'));
                                    };
                                    newSocket.onopen = function () {
                                        _this.awsRealTimeSocket = newSocket;
                                        return res();
                                    };
                                });
                            })()];
                    case 2:
                        _b.sent();
                        // Step 2: wait for ack from AWS AppSyncReaTime after sending init
                        return [4 /*yield*/, (function () {
                                return new Promise(function (res, rej) {
                                    var ackOk = false;
                                    _this.awsRealTimeSocket.onerror = function (error) {
                                        logger.debug("WebSocket error " + JSON.stringify(error));
                                    };
                                    _this.awsRealTimeSocket.onclose = function (event) {
                                        logger.debug("WebSocket closed " + event.reason);
                                        rej(new Error(JSON.stringify(event)));
                                    };
                                    _this.awsRealTimeSocket.onmessage = function (message) {
                                        logger.debug("subscription message from AWS AppSyncRealTime: " + message.data + " ");
                                        var data = JSON.parse(message.data);
                                        var type = data.type, _a = data.payload, _b = (_a === void 0 ? {} : _a).connectionTimeoutMs, connectionTimeoutMs = _b === void 0 ? DEFAULT_KEEP_ALIVE_TIMEOUT : _b;
                                        if (type === MESSAGE_TYPES.GQL_CONNECTION_ACK) {
                                            ackOk = true;
                                            _this.keepAliveTimeout = connectionTimeoutMs;
                                            _this.awsRealTimeSocket.onmessage = _this._handleIncomingSubscriptionMessage.bind(_this);
                                            _this.awsRealTimeSocket.onerror = function (err) {
                                                logger.debug(err);
                                                _this._errorDisconnect(index_1.CONTROL_MSG.CONNECTION_CLOSED);
                                            };
                                            _this.awsRealTimeSocket.onclose = function (event) {
                                                logger.debug("WebSocket closed " + event.reason);
                                                _this._errorDisconnect(index_1.CONTROL_MSG.CONNECTION_CLOSED);
                                            };
                                            res('Cool, connected to AWS AppSyncRealTime');
                                            return;
                                        }
                                        if (type === MESSAGE_TYPES.GQL_CONNECTION_ERROR) {
                                            var _c = data.payload, _d = (_c === void 0 ? {} : _c).errors, _e = __read(_d === void 0 ? [] : _d, 1), _f = _e[0], _g = _f === void 0 ? {} : _f, _h = _g.errorType, errorType = _h === void 0 ? '' : _h, _j = _g.errorCode, errorCode = _j === void 0 ? 0 : _j;
                                            rej({ errorType: errorType, errorCode: errorCode });
                                        }
                                    };
                                    var gqlInit = {
                                        type: MESSAGE_TYPES.GQL_CONNECTION_INIT,
                                    };
                                    _this.awsRealTimeSocket.send(JSON.stringify(gqlInit));
                                    function checkAckOk() {
                                        if (!ackOk) {
                                            rej(new Error("Connection timeout: ack from AWSRealTime was not received on " + CONNECTION_INIT_TIMEOUT + " ms"));
                                        }
                                    }
                                    setTimeout(checkAckOk.bind(_this), CONNECTION_INIT_TIMEOUT);
                                });
                            })()];
                    case 3:
                        // Step 2: wait for ack from AWS AppSyncReaTime after sending init
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _b.sent();
                        errorType = err_4.errorType, errorCode = err_4.errorCode;
                        if (NON_RETRYABLE_CODES.includes(errorCode)) {
                            throw new core_1.NonRetryableError(errorType);
                        }
                        else if (errorType) {
                            throw new Error(errorType);
                        }
                        else {
                            throw err_4;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._awsRealTimeHeaderBasedAuth = function (_a) {
        var authenticationType = _a.authenticationType, payload = _a.payload, canonicalUri = _a.canonicalUri, appSyncGraphqlEndpoint = _a.appSyncGraphqlEndpoint, apiKey = _a.apiKey, region = _a.region;
        return __awaiter(this, void 0, void 0, function () {
            var headerHandler, handler, host, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        headerHandler = {
                            API_KEY: this._awsRealTimeApiKeyHeader.bind(this),
                            AWS_IAM: this._awsRealTimeIAMHeader.bind(this),
                            OPENID_CONNECT: this._awsRealTimeOPENIDHeader.bind(this),
                            AMAZON_COGNITO_USER_POOLS: this._awsRealTimeCUPHeader.bind(this),
                        };
                        handler = headerHandler[authenticationType];
                        if (typeof handler !== 'function') {
                            logger.debug("Authentication type " + authenticationType + " not supported");
                            return [2 /*return*/, ''];
                        }
                        host = url.parse(appSyncGraphqlEndpoint).host;
                        return [4 /*yield*/, handler({
                                payload: payload,
                                canonicalUri: canonicalUri,
                                appSyncGraphqlEndpoint: appSyncGraphqlEndpoint,
                                apiKey: apiKey,
                                region: region,
                                host: host,
                            })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._awsRealTimeCUPHeader = function (_a) {
        var host = _a.host;
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, auth_1.default.currentSession()];
                    case 1:
                        session = _b.sent();
                        return [2 /*return*/, {
                                Authorization: session.getAccessToken().getJwtToken(),
                                host: host,
                            }];
                }
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._awsRealTimeOPENIDHeader = function (_a) {
        var host = _a.host;
        return __awaiter(this, void 0, void 0, function () {
            var token, federatedInfo, currentUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cache_1.default.getItem('federatedInfo')];
                    case 1:
                        federatedInfo = _b.sent();
                        if (!federatedInfo) return [3 /*break*/, 2];
                        token = federatedInfo.token;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, auth_1.default.currentAuthenticatedUser()];
                    case 3:
                        currentUser = _b.sent();
                        if (currentUser) {
                            token = currentUser.token;
                        }
                        _b.label = 4;
                    case 4:
                        if (!token) {
                            throw new Error('No federated jwt');
                        }
                        return [2 /*return*/, {
                                Authorization: token,
                                host: host,
                            }];
                }
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._awsRealTimeApiKeyHeader = function (_a) {
        var apiKey = _a.apiKey, host = _a.host;
        return __awaiter(this, void 0, void 0, function () {
            var dt, dtStr;
            return __generator(this, function (_b) {
                dt = new Date();
                dtStr = dt.toISOString().replace(/[:\-]|\.\d{3}/g, '');
                return [2 /*return*/, {
                        host: host,
                        'x-amz-date': dtStr,
                        'x-api-key': apiKey,
                    }];
            });
        });
    };
    AWSAppSyncRealTimeProvider.prototype._awsRealTimeIAMHeader = function (_a) {
        var payload = _a.payload, canonicalUri = _a.canonicalUri, appSyncGraphqlEndpoint = _a.appSyncGraphqlEndpoint, region = _a.region;
        return __awaiter(this, void 0, void 0, function () {
            var endpointInfo, credentialsOK, creds, request, signed_params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        endpointInfo = {
                            region: region,
                            service: 'appsync',
                        };
                        return [4 /*yield*/, this._ensureCredentials()];
                    case 1:
                        credentialsOK = _b.sent();
                        if (!credentialsOK) {
                            throw new Error('No credentials');
                        }
                        return [4 /*yield*/, core_1.Credentials.get().then(function (credentials) { return ({
                                secret_key: credentials.secretAccessKey,
                                access_key: credentials.accessKeyId,
                                session_token: credentials.sessionToken,
                            }); })];
                    case 2:
                        creds = _b.sent();
                        request = {
                            url: "" + appSyncGraphqlEndpoint + canonicalUri,
                            data: payload,
                            method: 'POST',
                            headers: __assign({}, AWS_APPSYNC_REALTIME_HEADERS),
                        };
                        signed_params = core_1.Signer.sign(request, creds, endpointInfo);
                        return [2 /*return*/, signed_params.headers];
                }
            });
        });
    };
    /**
     * @private
     */
    AWSAppSyncRealTimeProvider.prototype._ensureCredentials = function () {
        return core_1.Credentials.get()
            .then(function (credentials) {
            if (!credentials)
                return false;
            var cred = core_1.Credentials.shear(credentials);
            logger.debug('set credentials for AWSAppSyncRealTimeProvider', cred);
            return true;
        })
            .catch(function (err) {
            logger.warn('ensure credentials error', err);
            return false;
        });
    };
    return AWSAppSyncRealTimeProvider;
}(PubSubProvider_1.AbstractPubSubProvider));
exports.AWSAppSyncRealTimeProvider = AWSAppSyncRealTimeProvider;
//# sourceMappingURL=AWSAppSyncRealTimeProvider.js.map