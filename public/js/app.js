! function($) {

    var Greeva = function() {};

    Greeva.prototype.initStickyMenu = function() {
        $(window).scroll(function() {
            var scroll = $(window).scrollTop();
        
            if (scroll >= 50) {
                $(".sticky").addClass("nav-sticky");
            } else {
                $(".sticky").removeClass("nav-sticky");
            }
        });
    },

    Greeva.prototype.initSmoothLink = function() {
        $('.navbar-nav a').on('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 0
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    },

    Greeva.prototype.initScrollspy = function() {
        $("#navbarCollapse").scrollspy({
            offset:20
        });
    },
    Greeva.prototype.init = function() {
        this.initStickyMenu();
        this.initSmoothLink();
        this.initScrollspy();
    },
    $.Greeva = new Greeva, $.Greeva.Constructor = Greeva
}(window.jQuery),

function($) {
    "use strict";
    $.Greeva.init();
}(window.jQuery);