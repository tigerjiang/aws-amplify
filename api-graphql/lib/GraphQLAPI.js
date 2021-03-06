"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var GraphQLError_1 = require("graphql/error/GraphQLError");
var printer_1 = require("graphql/language/printer");
var parser_1 = require("graphql/language/parser");
var core_1 = require("@aws-amplify/core");
var pubsub_1 = __importDefault(require("@aws-amplify/pubsub"));
var auth_1 = __importDefault(require("@aws-amplify/auth"));
var cache_1 = __importDefault(require("@aws-amplify/cache"));
var types_1 = require("./types");
var api_rest_1 = require("@aws-amplify/api-rest");
var USER_AGENT_HEADER = 'x-amz-user-agent';
var logger = new core_1.ConsoleLogger('GraphQLAPI');
exports.graphqlOperation = function (query, variables) {
    if (variables === void 0) { variables = {}; }
    return ({
        query: query,
        variables: variables,
    });
};
/**
 * Export Cloud Logic APIs
 */
var GraphQLAPIClass = /** @class */ (function () {
    /**
     * Initialize GraphQL API with AWS configuration
     * @param {Object} options - Configuration object for API
     */
    function GraphQLAPIClass(options) {
        this._api = null;
        this.Auth = auth_1.default;
        this.Cache = cache_1.default;
        this.Credentials = core_1.Credentials;
        this._options = options;
        logger.debug('API Options', this._options);
    }
    GraphQLAPIClass.prototype.getModuleName = function () {
        return 'GraphQLAPI';
    };
    /**
     * Configure API
     * @param {Object} config - Configuration of the API
     * @return {Object} - The current configuration
     */
    GraphQLAPIClass.prototype.configure = function (options) {
        var _a = options || {}, _b = _a.API, API = _b === void 0 ? {} : _b, otherOptions = __rest(_a, ["API"]);
        var opt = __assign(__assign({}, otherOptions), API);
        logger.debug('configure GraphQL API', { opt: opt });
        if (opt['aws_project_region']) {
            opt = Object.assign({}, opt, {
                region: opt['aws_project_region'],
                header: {},
            });
        }
        if (typeof opt.graphql_headers !== 'undefined' &&
            typeof opt.graphql_headers !== 'function') {
            logger.warn('graphql_headers should be a function');
            opt.graphql_headers = undefined;
        }
        this._options = Object.assign({}, this._options, opt);
        this.createInstance();
        return this._options;
    };
    /**
     * Create an instance of API for the library
     * @return - A promise of true if Success
     */
    GraphQLAPIClass.prototype.createInstance = function () {
        logger.debug('create Rest instance');
        if (this._options) {
            this._api = new api_rest_1.RestClient(this._options);
            // Share instance Credentials with client for SSR
            this._api.Credentials = this.Credentials;
            return true;
        }
        else {
            return Promise.reject('API not configured');
        }
    };
    GraphQLAPIClass.prototype._headerBasedAuth = function (defaultAuthenticationType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, aws_appsync_authenticationType, apiKey, authenticationType, headers, _b, credentialsOK, token, federatedInfo, currentUser, e_1, session, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this._options, aws_appsync_authenticationType = _a.aws_appsync_authenticationType, apiKey = _a.aws_appsync_apiKey;
                        authenticationType = defaultAuthenticationType || aws_appsync_authenticationType || 'AWS_IAM';
                        headers = {};
                        _b = authenticationType;
                        switch (_b) {
                            case 'API_KEY': return [3 /*break*/, 1];
                            case 'AWS_IAM': return [3 /*break*/, 2];
                            case 'OPENID_CONNECT': return [3 /*break*/, 4];
                            case 'AMAZON_COGNITO_USER_POOLS': return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 15];
                    case 1:
                        if (!apiKey) {
                            throw new Error(types_1.GraphQLAuthError.NO_API_KEY);
                        }
                        headers = {
                            Authorization: null,
                            'X-Api-Key': apiKey,
                        };
                        return [3 /*break*/, 16];
                    case 2: return [4 /*yield*/, this._ensureCredentials()];
                    case 3:
                        credentialsOK = _c.sent();
                        if (!credentialsOK) {
                            throw new Error(types_1.GraphQLAuthError.NO_CREDENTIALS);
                        }
                        return [3 /*break*/, 16];
                    case 4:
                        _c.trys.push([4, 9, , 10]);
                        token = void 0;
                        return [4 /*yield*/, cache_1.default.getItem('federatedInfo')];
                    case 5:
                        federatedInfo = _c.sent();
                        if (!federatedInfo) return [3 /*break*/, 6];
                        token = federatedInfo.token;
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, auth_1.default.currentAuthenticatedUser()];
                    case 7:
                        currentUser = _c.sent();
                        if (currentUser) {
                            token = currentUser.token;
                        }
                        _c.label = 8;
                    case 8:
                        if (!token) {
                            throw new Error(types_1.GraphQLAuthError.NO_FEDERATED_JWT);
                        }
                        headers = {
                            Authorization: token,
                        };
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _c.sent();
                        throw new Error(types_1.GraphQLAuthError.NO_CURRENT_USER);
                    case 10: return [3 /*break*/, 16];
                    case 11:
                        _c.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, this.Auth.currentSession()];
                    case 12:
                        session = _c.sent();
                        headers = {
                            Authorization: session.getAccessToken().getJwtToken(),
                        };
                        return [3 /*break*/, 14];
                    case 13:
                        e_2 = _c.sent();
                        throw new Error(types_1.GraphQLAuthError.NO_CURRENT_USER);
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        headers = {
                            Authorization: null,
                        };
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/, headers];
                }
            });
        });
    };
    /**
     * to get the operation type
     * @param operation
     */
    GraphQLAPIClass.prototype.getGraphqlOperationType = function (operation) {
        var doc = parser_1.parse(operation);
        var _a = __read(doc.definitions, 1), operationType = _a[0].operation;
        return operationType;
    };
    /**
     * Executes a GraphQL operation
     *
     * @param {GraphQLOptions} GraphQL Options
     * @param {object} additionalHeaders headers to merge in after any `graphql_headers` set in the config
     * @returns {Promise<GraphQLResult> | Observable<object>}
     */
    GraphQLAPIClass.prototype.graphql = function (_a, additionalHeaders) {
        var paramQuery = _a.query, _b = _a.variables, variables = _b === void 0 ? {} : _b, authMode = _a.authMode;
        var query = typeof paramQuery === 'string'
            ? parser_1.parse(paramQuery)
            : parser_1.parse(printer_1.print(paramQuery));
        var _c = __read(query.definitions.filter(function (def) { return def.kind === 'OperationDefinition'; }), 1), _d = _c[0], operationDef = _d === void 0 ? {} : _d;
        var operationType = operationDef.operation;
        switch (operationType) {
            case 'query':
            case 'mutation':
                var cancellableToken = this._api.getCancellableToken();
                var initParams = { cancellableToken: cancellableToken };
                var responsePromise = this._graphql({ query: query, variables: variables, authMode: authMode }, additionalHeaders, initParams);
                this._api.updateRequestToBeCancellable(responsePromise, cancellableToken);
                return responsePromise;
            case 'subscription':
                return this._graphqlSubscribe({ query: query, variables: variables, authMode: authMode }, additionalHeaders);
        }
        throw new Error("invalid operation type: " + operationType);
    };
    GraphQLAPIClass.prototype._graphql = function (_a, additionalHeaders, initParams) {
        var query = _a.query, variables = _a.variables, authMode = _a.authMode;
        if (additionalHeaders === void 0) { additionalHeaders = {}; }
        if (initParams === void 0) { initParams = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _b, region, appSyncGraphqlEndpoint, _c, graphql_headers, customGraphqlEndpoint, customEndpointRegion, headers, _d, _e, _f, _g, _h, _j, body, init, endpoint, error, response, err_1, errors;
            var _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        if (!!this._api) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createInstance()];
                    case 1:
                        _l.sent();
                        _l.label = 2;
                    case 2:
                        _b = this._options, region = _b.aws_appsync_region, appSyncGraphqlEndpoint = _b.aws_appsync_graphqlEndpoint, _c = _b.graphql_headers, graphql_headers = _c === void 0 ? function () { return ({}); } : _c, customGraphqlEndpoint = _b.graphql_endpoint, customEndpointRegion = _b.graphql_endpoint_iam_region;
                        _d = [{}];
                        _e = !customGraphqlEndpoint;
                        if (!_e) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._headerBasedAuth(authMode)];
                    case 3:
                        _e = (_l.sent());
                        _l.label = 4;
                    case 4:
                        _f = [__assign.apply(void 0, _d.concat([(_e)]))];
                        _g = customGraphqlEndpoint;
                        if (!_g) return [3 /*break*/, 8];
                        if (!customEndpointRegion) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._headerBasedAuth(authMode)];
                    case 5:
                        _h = _l.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _h = { Authorization: null };
                        _l.label = 7;
                    case 7:
                        _g = (_h);
                        _l.label = 8;
                    case 8:
                        _j = [__assign.apply(void 0, _f.concat([(_g)]))];
                        return [4 /*yield*/, graphql_headers({ query: query, variables: variables })];
                    case 9:
                        headers = __assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, _j.concat([(_l.sent())])), additionalHeaders]), (!customGraphqlEndpoint && (_k = {},
                                _k[USER_AGENT_HEADER] = core_1.Constants.userAgent,
                                _k))]);
                        body = {
                            query: printer_1.print(query),
                            variables: variables,
                        };
                        init = Object.assign({
                            headers: headers,
                            body: body,
                            signerServiceInfo: {
                                service: !customGraphqlEndpoint ? 'appsync' : 'execute-api',
                                region: !customGraphqlEndpoint ? region : customEndpointRegion,
                            },
                        }, initParams);
                        endpoint = customGraphqlEndpoint || appSyncGraphqlEndpoint;
                        if (!endpoint) {
                            error = new GraphQLError_1.GraphQLError('No graphql endpoint provided.');
                            throw {
                                data: {},
                                errors: [error],
                            };
                        }
                        _l.label = 10;
                    case 10:
                        _l.trys.push([10, 12, , 13]);
                        return [4 /*yield*/, this._api.post(endpoint, init)];
                    case 11:
                        response = _l.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        err_1 = _l.sent();
                        // If the exception is because user intentionally
                        // cancelled the request, do not modify the exception
                        // so that clients can identify the exception correctly.
                        if (this._api.isCancel(err_1)) {
                            throw err_1;
                        }
                        response = {
                            data: {},
                            errors: [new GraphQLError_1.GraphQLError(err_1.message, null, null, null, null, err_1)],
                        };
                        return [3 /*break*/, 13];
                    case 13:
                        errors = response.errors;
                        if (errors && errors.length) {
                            throw response;
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Checks to see if an error thrown is from an api request cancellation
     * @param {any} error - Any error
     * @return {boolean} - A boolean indicating if the error was from an api request cancellation
     */
    GraphQLAPIClass.prototype.isCancel = function (error) {
        return this._api.isCancel(error);
    };
    /**
     * Cancels an inflight request. Only applicable for graphql queries and mutations
     * @param {any} request - request to cancel
     * @return {boolean} - A boolean indicating if the request was cancelled
     */
    GraphQLAPIClass.prototype.cancel = function (request, message) {
        return this._api.cancel(request, message);
    };
    GraphQLAPIClass.prototype._graphqlSubscribe = function (_a, additionalHeaders) {
        var query = _a.query, variables = _a.variables, defaultAuthenticationType = _a.authMode;
        if (additionalHeaders === void 0) { additionalHeaders = {}; }
        var _b = this._options, region = _b.aws_appsync_region, appSyncGraphqlEndpoint = _b.aws_appsync_graphqlEndpoint, aws_appsync_authenticationType = _b.aws_appsync_authenticationType, apiKey = _b.aws_appsync_apiKey, _c = _b.graphql_headers, graphql_headers = _c === void 0 ? function () { return ({}); } : _c;
        var authenticationType = defaultAuthenticationType || aws_appsync_authenticationType || 'AWS_IAM';
        if (pubsub_1.default && typeof pubsub_1.default.subscribe === 'function') {
            return pubsub_1.default.subscribe('', {
                provider: core_1.INTERNAL_AWS_APPSYNC_REALTIME_PUBSUB_PROVIDER,
                appSyncGraphqlEndpoint: appSyncGraphqlEndpoint,
                authenticationType: authenticationType,
                apiKey: apiKey,
                query: printer_1.print(query),
                region: region,
                variables: variables,
                graphql_headers: graphql_headers,
                additionalHeaders: additionalHeaders,
            });
        }
        else {
            logger.debug('No pubsub module applied for subscription');
            throw new Error('No pubsub module applied for subscription');
        }
    };
    /**
     * @private
     */
    GraphQLAPIClass.prototype._ensureCredentials = function () {
        var _this = this;
        return this.Credentials.get()
            .then(function (credentials) {
            if (!credentials)
                return false;
            var cred = _this.Credentials.shear(credentials);
            logger.debug('set credentials for api', cred);
            return true;
        })
            .catch(function (err) {
            logger.warn('ensure credentials error', err);
            return false;
        });
    };
    return GraphQLAPIClass;
}());
exports.GraphQLAPIClass = GraphQLAPIClass;
exports.GraphQLAPI = new GraphQLAPIClass(null);
core_1.Amplify.register(exports.GraphQLAPI);
//# sourceMappingURL=GraphQLAPI.js.map