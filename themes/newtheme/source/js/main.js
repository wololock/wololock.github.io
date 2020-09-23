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

    if (typeof udemy !== 'undefined' && (typeof udemy.src !== 'undefined')) {
        var offset = 600;
        var top = document.getElementsByTagName("article").item(0).getBoundingClientRect().height - offset - 1000;

        var container = jQuery("article.post-content > .container");
        var offsetTop = 150;
        var offsetLeft = container.offset().left + container.width();

        window.addEventListener("scroll", function (e){
            var currentScroll = document.scrollingElement.scrollTop;

            if (currentScroll > offset && document.getElementById(udemy.id) === null) {
                var a = document.createElement("a");
                a.href = udemy.url;
                a.target = "_blank";
                a.setAttribute("class", "gatr");
                a.setAttribute("data-name", udemy.name);
                a.setAttribute("data-type", "banner");

                var img = document.createElement("img");
                img.id = udemy.id;
                img.src = udemy.src;
                img.setAttribute("class", "floating-udemy");
                img.setAttribute("style", "display: none; top: " + offsetTop + "px; left: " + offsetLeft + "px;");

                a.append(img);

                jQuery("article.post-content > .container").first().append(a);

            } else if (currentScroll < offset && document.getElementById(udemy.id) !== null) {
                jQuery("#"+udemy.id).fadeOut();
            } else if (currentScroll > offset && currentScroll < top && jQuery("#"+udemy.id).css("display") === "none") {
                jQuery("#"+udemy.id).fadeIn();
            } else if (currentScroll >= top  && jQuery("#"+udemy.id).css("display") !== "none") {
                jQuery("#"+udemy.id).fadeOut();
            }
        });
    }
})(jQuery);