/*
 * Achilles Acme Client Core Services
 * HTTP Client
 * Copyright (c) 2014 Todd Thomson, Achilles Software. All Rights Reserved.
 */
define( ['durandal/system', 'areas/acme/http/httprequest' ],
    function( system, HttpRequest ) {

        var HttpClient = function() {

            //#region Fields

            var self = this;

            // Associative array. We are using integer keys, so the javascript engine should
            // optimize performance.
            var requests = {};

            //#endregion

            //#region Public Methods

            self.cancelRequest = function( request ) {
                if ( !( request instanceof HttpRequest ) ) {
                    throw Error( 'Invalid argument: request must be an instance of HttpRequest' );
                }

                if ( request && request._jqXHR && request._jqXHR.readyState !== 4 ) {
                    system.log( "HttpClient: cancelRequset() aborting request: ", request.id );
                    request._jqXHR.abort();
                } else {
                    system.log( "HttpClient: cancelRequest() not pending: ", request.id );
                }
            };
            
            self.cancelPendingRequests = function() {
                system.log( "HttpClient: cancelling all pending requests" );
                for ( var id in requests ) {
                    var request = requests[ id ];
                    if ( request._jqXHR && request._jqXHR.readyState !== 4 ) {
                        system.log( "HttpClient: cancelPendingRequests() aborting request: ", request.id );
                        request._jqXHR.abort();
                    } else {
                        system.log( "HttpClient: cancelPendingRequests() not pending: ", request.id );
                    }
                }
            };

            self.sendAsync = function( request ) {
                if ( !( request instanceof HttpRequest ) ) {
                    throw Error( 'Invalid argument: request must be an instance of HttpRequest' );
                }

                if ( request._jqXHR ) {
                    throw Error( 'Request already sent.' );
                }

                system.log( "HttpClient: adding request id: ", request.id );

                return system.defer( function( deferred ) {
                    var jqXHR = $.ajax( request.url, request.settings );

                    jqXHR.done( function( data ) {
                        system.log( "HttpClient: deleting done request: ", request.id );
                        delete requests[request.id];
                        deferred.resolve( data );
                    } );

                    jqXHR.fail( function( data, textStatus, jqXHR ) {
                        system.log( "HttpClient: deleting failed request: ", request.id );
                        delete requests[request.id];
                        deferred.reject( data );
                    } );

                    request._jqXHR = jqXHR;
                    requests[ request.id ] = request;

                } ).promise();
            };

            //#endregion
        };

        return HttpClient;
    }
);