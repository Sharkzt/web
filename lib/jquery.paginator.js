(function ( $ ) {

    /**
     *
     * @param object
     * @param options
     * @returns {*}
     * TODO: Reset contfig paginstion
     */
    $.widgetPagination = function(object, optionsInput) {
        var $object = $(object);

        /** Default optonis */
        var optionsDefault = {
            // URL API pagination
            url: "",
            
            // Parameters for pagination
            page: 1,
            perPage: 10,
            query: "",

            scroll:false,
            recount: false,
            lastPage: 1,

            // Custom params request
            requestParams: {},

            refresh: true,
            
            // Callback functions
            callbackReloadBefore: function() {return false;},
            callbackRecount: function() {return '...';},
            callbackReloadSuccess: function(){return false;},
            callbackReloadError: function(){return false;},
            callbackNavigationClick: function(){return false;}
        };
        /** Current options */
        var options;
        /** Interface widget */
        var api;
        var busy;
        var prevCountResult = {data:{total:'...'}};
        // These 'cmd' in request params should not update 'itemsCount' global variable
        var cmdItemsRecountRestricted = [
            'tableSelectContact',
            'tableSelectGroup'
        ];

        /** If not one element, not initialization widget - ONLY ONE DOM ELEMENT */
        if ($object.length !== 1) {
            return false;
        }

        /**
         * init pagination
         */
        function init() {
            /** get settings from the DOM element - quick setup */
            if ($object.data("url")) {
                setOptions({url: $object.data("url")});
            }
            
            $object.data("widgetPagination", api);
            initScroll();
            
//            reload(); // redraw widget
            return;
        }

        /**
         * Get params for request
         * @returns {*}
         */
        function getParamsRequest() {
            var params = $.extend(
                {},
                {
                    page: options.page,
                    perPage: options.perPage,
                    query: options.query,
                    lastId: options.lastId
                },
                options.requestParams
            ); 
            return params; 
        }

        /**
         * Reload pagination
         * 
         * @returns {*}
         */
        function reload(recount) {
            /** Before callback */
            var need_recount = (typeof recount == 'undefined')
                ? options.recount
                : recount;
            options.callbackReloadBefore.call($object.get(0), api, getParamsRequest());
            busy = false;
            app.ajaxRequests.push({
                url: options.url,
                xhr: $.ajax({
                    url: options.url,
                    type: 'POST',
                    data:  getParamsRequest(),
                    dataType: 'html',
                    success: function(data) {
                        $object.html(data);
                        if (need_recount) {
                            var countRequest = $.extend(getParamsRequest(), {'recount': true});
                            app.ajaxRequests.push({
                                url: options.url,
                                xhr: $.ajax({
                                    type: "POST",
                                    url: options.url,
                                    data: countRequest,
                                    success: function(r) {
                                        var itemsRecountAllowed = cmdItemsRecountRestricted.indexOf(countRequest['cmd']) === -1;
                                        if (window.hasOwnProperty('itemsCount') && itemsRecountAllowed) {
                                            itemsCount = r.data.total;
                                        }
                                        prevCountResult = r;
                                        options.callbackRecount(r);
                                    },
                                    dataType: 'json'
                                })
                            });
                        } else {
                            if (options.recount) {
                                options.callbackRecount(prevCountResult);
                                if (window.hasOwnProperty('itemsCount')) {
                                    itemsCount = prevCountResult.data.total;
                                }
                            }
                        }
                        /** Done callback */
                        options.callbackReloadSuccess.call($object.get(0), api);
                    },
                    error: function(data) {
                        /** Error callback */
                        options.callbackReloadError.call($object.get(0), api, data);
                    }
                })
            });
            return api;
        }

        /**
         * Set options pagination
         *
         * @param optionsInput
         * @TODO: refactoring validations parameters
         * 
         * @returns {*}
         */
        function setOptions(optionsInput) {
            /** use custom settings */
            options = $.extend({}, optionsDefault, options, optionsInput);
            if (typeof(optionsInput.refresh) == 'undefined') {
                options.refresh = true;
            }

            /** validation perPage value*/
            if (typeof(options.perPage) != "number" || ~~options.perPage <= 0) {
                options.perPage = optionsDefault.perPage;
            }

            /** validation page value */
            if (typeof(options.page) != "number" || ~~options.page <= 0) {
                options.page = optionsDefault.page;
            }
            recount = options.recount;
            return api;
        }

        function setRequestParams(params) {
            /** use custom settings */

            options.requestParams = $.extend({}, optionsDefault.requestParams, options.requestParams, params);

            if (options.refresh) {
                options.page = 1;
                options.lastId = 0;
                api.stack = [0];
            }

            return api;
        }

        /**
         * Get pagination
         * 
         * @returns {*}
         */
        function getOptions() {
            return options;
        }


        function initScroll(){

            if (! options.scroll) {
                return false;
            }

            $object.scroll(function() {
                if($object.scrollTop() + $object.height() > $object.height() && !busy) {
                    busy = true;
                    setTimeout(function() {
                        scrollTable();
                    }, 500);

                }
            });
        }

        function scrollTable() {
            if (options.lastPage <= options.page) {
                return false;
            }
            options.page++;
            options.callbackReloadBefore.call($object.get(0), api, getParamsRequest());
            $.post(options.url, getParamsRequest(), function(data) {
                $object.find('tbody').append($(data).find('tbody').html());
                options.callbackReloadSuccess.call($object.get(0), api);
                busy = false;
            });
        }

        api = {
            stack: [0],
            getOptions: getOptions,
            setOptions: setOptions,
            reload: reload,
            getRequestParams: getParamsRequest,
            setRequestParams: setRequestParams
        };

        /** INIT PAGINATION */
        setOptions(optionsInput);
        init();

        return api;
    };

    /**
     * Widget pagination
     *
     * @param options Options widget
     * @param callbackInitWidget Callback function init widget
     * @returns {*}
     */
    $.fn.widgetPagination = function(options, callbackInitWidget) {
        if (this.length !== 1) return false;

        if ($(this).data("widgetPagination")) {
            if (options === "api") {
                return $(this).data("widgetPagination");
            } else {
                return $(this).data("widgetPagination").setOptions(options);
            }
        } else {
            if ($(this).prop("tagName") == 'DIV' && options !== "api") {
                var api = $.widgetPagination(this, options);

                if ($.isFunction(callbackInitWidget)) {
                    callbackInitWidget.call(this, api);
                }

                return api;
            } else {
                if ('console' in window) {
                    console.log("Error init widget pagination. Expected DOM element by DIV");
                }
                return false;
            }
        }

        return this;
    };

}( jQuery ));