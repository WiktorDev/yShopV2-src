! function($) {
    "use strict";

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

    Greeva.prototype.initTestimonial = function() {
        $("#owl-demo").owlCarousel({
            autoPlay: 3000,
            items : 3,
            itemsDesktop : [1199,3],
            itemsDesktopSmall : [979,3]
       
        });
    },

    Greeva.prototype.initContact = function() {
        
        $('#contact-form').submit(function() {

            var action = $(this).attr('action');
        
            $("#message").slideUp(750, function() {
                $('#message').hide();
        
                $('#submit')
                    .before('')
                    .attr('disabled', 'disabled');
        
                $.post(action, {
                        name: $('#name').val(),
                        email: $('#email').val(),
                        comments: $('#comments').val(),
                    },
                    function(data) {
                        document.getElementById('message').innerHTML = data;
                        $('#message').slideDown('slow');
                        $('#cform img.contact-loader').fadeOut('slow', function() {
                            $(this).remove()
                        });
                        $('#submit').removeAttr('disabled');
                        if (data.match('success') != null) $('#cform').slideUp('slow');
                    }
                );
        
            });
        
            return false;
        
        });

    },

    

    Greeva.prototype.init = function() {
        this.initStickyMenu();
        this.initSmoothLink();
        this.initScrollspy();
        this.initTestimonial();
        this.initContact();
    },
    $.Greeva = new Greeva, $.Greeva.Constructor = Greeva
}(window.jQuery),
function($) {
    "use strict";
    $.Greeva.init();
}(window.jQuery);