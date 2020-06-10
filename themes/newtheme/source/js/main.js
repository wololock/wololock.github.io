!(function($) {
    "use strict";

    // Toggle .header-scrolled class to #header when page is scrolled
    if (!$('#header').hasClass("bg-white navbar-light shadow-sm scrolled")) {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('#header').addClass('bg-white navbar-light shadow-sm scrolled');
            } else {
                $('#header').removeClass('bg-white navbar-light shadow-sm scrolled');
            }
        });

        if ($(window).scrollTop() > 100) {
            $('#header').addClass('bg-white navbar-light shadow-sm scrolled');
        }
    }

    // Back to top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

})(jQuery);