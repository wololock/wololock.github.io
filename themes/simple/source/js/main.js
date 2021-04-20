!(function($) {
    "use strict";

    const article = $("article.post").first();
    if (article.length === 1) {
        window.onscroll = function() {
            const topScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            const articleBottom = article.outerHeight() + article.offset().top;

            const scrolled = ((topScroll + clientHeight) / articleBottom) * 100;

            $("#pageprogress > .bar").css("width", Math.min(scrolled, 100) + "%");
        };
    }

    window.addEventListener('DOMContentLoaded', () => {
        const debugtracker = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    ga("send", "event", "debug", "name", entry.target.getAttribute("data-debug"));
                    debugtracker.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll("[data-debug]").forEach((section) => {
           debugtracker.observe(section);

        });

        const lazyimage = new IntersectionObserver(entries => {
            entries.forEach(entry => {
               if (entry.intersectionRatio > 0) {
                   entry.target.setAttribute("src", entry.target.getAttribute("data-lazy"));
                   debugtracker.unobserve(entry.target);
               }
            });
        }, {
            rootMargin: "500px"
        });

        document.querySelectorAll("img[data-lazy]").forEach(section => {
            lazyimage.observe(section);
        })
    });


    var Header = function() {
        this.$header = $('#header');
        this.headerHeight = this.$header.height();
        this.headerUpCSSClass = 'header-up';
        this.delta = 15;
        this.lastScrollTop = 0;
    };

    Header.prototype = {
        run: function() {
            var self = this;
            var didScroll;

            $(window).scroll(function() {
                didScroll = true;
            });

            setInterval(function() {
                if (didScroll) {
                    self.animate();
                    didScroll = false;
                }
            }, 250);
        },

        animate: function() {
            var scrollTop = $(window).scrollTop();

            if (Math.abs(this.lastScrollTop - scrollTop) <= this.delta) {
                return;
            }

            if ((scrollTop > this.lastScrollTop) && (scrollTop > this.headerHeight)) {
                this.$header.addClass(this.headerUpCSSClass);
                this.$header.removeClass("navbar-dark");
            }
            else if (scrollTop + $(window).height() < $(document).height()) {
                this.$header.removeClass(this.headerUpCSSClass);
                this.$header.addClass("navbar-dark");
            }

            if (scrollTop - this.delta <= 0) {
                this.$header.removeClass("navbar-dark");
            }

            this.lastScrollTop = scrollTop;
        }
    };

    $(document).ready(function() {
        new Header().run();
    });
})(jQuery);