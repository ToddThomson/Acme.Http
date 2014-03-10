/*
 * Achilles Acme Client Core Services
 * HTTP Request
 * Copyright (c) 2014 Todd Thomson, Achilles Software. All Rights Reserved.
 */
define( ['durandal/system' ],
    function( system ) {
        var uniqueIdSeed = 1;

        var HttpRequest = function( config ) {
           
            //#region Fields

            var self = this;
            // Private Read only - used only by HttpClient only 
            self._jqXHR = null;

            //#endregion

            //#region Public Properties

            self.id = uniqueIdSeed++;
            self.url = config.url;
            self.settings = config.settings;

            //#endregion
        };

        return HttpRequest;
    }
);