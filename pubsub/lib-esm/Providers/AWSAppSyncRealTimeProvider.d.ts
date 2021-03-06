import Observable from 'zen-observable-ts';
import { ProvidertOptions } from '../types';
import { AbstractPubSubProvider } from './PubSubProvider';
export declare class AWSAppSyncRealTimeProvider extends AbstractPubSubProvider {
    private awsRealTimeSocket;
    private socketStatus;
    private keepAliveTimeoutId;
    private keepAliveTimeout;
    private subscriptionObserverMap;
    private promiseArray;
    getProviderName(): string;
    newClient(): Promise<any>;
    publish(_topics: string[] | string, _msg: any, _options?: any): Promise<void>;
    subscribe(_topics: string[] | string, options?: ProvidertOptions): Observable<any>;
    protected readonly isSSLEnabled: boolean;
    private _startSubscriptionWithAWSAppSyncRealTime;
    private _waitForSubscriptionToBeConnected;
    private _sendUnsubscriptionMessage;
    private _removeSubscriptionObserver;
    private _closeSocketIfRequired;
    private _handleIncomingSubscriptionMessage;
    private _errorDisconnect;
    private _timeoutStartSubscriptionAck;
    private _initializeWebSocketConnection;
    private _initializeRetryableHandshake;
    private _initializeHandshake;
    private _awsRealTimeHeaderBasedAuth;
    private _awsRealTimeCUPHeader;
    private _awsRealTimeOPENIDHeader;
    private _awsRealTimeApiKeyHeader;
    private _awsRealTimeIAMHeader;
    /**
     * @private
     */
    _ensureCredentials(): any;
}
