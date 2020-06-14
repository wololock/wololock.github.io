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

    $("#recentArticles").on("slide.bs.carousel", function(e) {
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $(".carousel-item").length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
            var it = itemsPerSlide - (totalItems - idx);
            for (var i = 0; i < it; i++) {
                // append slides to end
                if (e.direction == "left") {
                    $(".carousel-item")
                        .eq(i)
                        .appendTo(".carousel-inner");
                } else {
                    $(".carousel-item")
                        .eq(0)
                        .appendTo($(this).find(".carousel-inner"));
                }
            }
        }
    });

    $("section.tagcloud a").each(function() {
        var size = parseInt($(this).css("fontSize"));
        $(this).css("zIndex", size);
        $(this).css("font-weight", (size * 12));
    })

})(jQuery);