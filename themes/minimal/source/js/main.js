!(function($) {
    "use strict";

    window.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector("article.post-body") !== null) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute('data-id');
                    const el = document.querySelector(`a[href="#${id}"]`);
                    if (el !== null) {
                        if (entry.intersectionRatio > 0) {
                            el.parentElement.classList.add('active');
                        } else {
                            el.parentElement.classList.remove('active');
                        }
                    }
                });
            });

            document.querySelector("article.post-body").querySelectorAll('h2[id],h3[id]').forEach((section) => {
                const id = section.getAttribute("id");
                section.parentElement.setAttribute("data-id", id);
                observer.observe(section.parentElement);
            });
        }

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
                this.$header.removeClass("bg-white");
            }
            else if (scrollTop + $(window).height() < $(document).height()) {
                this.$header.removeClass(this.headerUpCSSClass);
                this.$header.addClass("bg-white");
            }

            if (scrollTop - this.delta <= 0) {
                this.$header.removeClass("bg-white");
            }

            this.lastScrollTop = scrollTop;
        }
    };

    $(document).ready(function() {
        new Header().run();
    });
})(jQuery);