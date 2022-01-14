$.noty.themes.tmTheme = {
    name    : 'tmTheme',
    modal   : {
        css: {
            position       : 'fixed',
            width          : '100%',
            height         : '100%',
            backgroundColor: '#000',
            zIndex         : 10000,
            display        : 'none',
            left           : 0,
            top            : 0,
            wordBreak      : 'break-all'
        }
    },
    style   : function () {

        var containerSelector = this.options.layout.container.selector;
        $(containerSelector);

        this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
        this.$closeButton.addClass('close').css({
            position:   'absolute',
            right:      '15px',
            top:        '1.25em',
            marginTop:  '-15px'
        });

        this.$bar.addClass("alert").css('padding', '0px').css({ 'position': 'relative', 'text-weight': 'normal', 'margin-bottom': '3px' });

        this.$progressBar.css({
            position       : 'absolute',
            left           : 0,
            bottom         : 0,
            height         : 4,
            width          : '100%',
            backgroundColor: '#000000',
            opacity        : 0.2,
            '-ms-filter'   : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=20)',
            filter         : 'alpha(opacity=20)'
        });

        switch (this.options.type) {
            case 'alert':
            case 'notification':
                this.$bar.addClass("alert-info");
                break;
            case 'warning':
                this.$bar.addClass("alert-warning");
                break;
            case 'error':
                this.$bar.addClass("alert-danger");
                break;
            case 'information':
                this.$bar.addClass("alert-info");
                break;
            case 'success':
                this.$bar.addClass("alert-success");
                break;
        }

        this.$message.css({
            padding:    '15px 27px 15px 18px',
            width:      'auto',
            position:   'relative',
            lineHeight: '1.4em'
        });
    },
    callback: {
        onShow : function () { },
        onClose: function () { }
    }
};

$.noty.layouts.tmTopRight = {
    name     : 'tmTopRight',
    options  : { // overrides options

    },
    container: {
        object  : '<ul id="noty_topRight_layout_container" />',
        selector: 'ul#noty_topRight_layout_container',
        style   : function() {
            $(this).css({
                top          : '65px',
                right        : 20,
                position     : 'fixed',
                width        : '360px',
                height       : 'auto',
                margin       : 0,
                padding      : 0,
                listStyleType: 'none',
                zIndex       : 10000000
            });

            if(window.innerWidth < 600) {
                $(this).css({
                    right: 5
                });
            }
        }
    },
    parent   : {
        object  : '<li />',
        selector: 'li',
        css     : {}
    },
    css      : {
        display: 'none',
        width  : '360px'
    },
    addClass : ''
};