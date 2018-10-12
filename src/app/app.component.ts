import {AfterViewInit, Component, Injector, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {AppConsts} from '@shared/AppConsts';
import {SubscriptionStartType} from '@shared/AppEnums';
import {AppSessionService} from '@shared/common/session/app-session.service';
import {UrlHelper} from '@shared/helpers/UrlHelper';
import * as moment from 'moment';
import {AppComponentBase} from 'shared/common/app-component-base';

declare var $: any;
declare var App: any;

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent extends AppComponentBase implements OnInit, AfterViewInit {

    private viewContainerRef: ViewContainerRef;
    private router: Router;

    subscriptionStartType = SubscriptionStartType;
    installationMode = true;


    public constructor(
        injector: Injector,
        viewContainerRef: ViewContainerRef,
        private _router: Router,
        private _appSessionService: AppSessionService) {
        super(injector);
        this.viewContainerRef = viewContainerRef; // You need this small hack in order to catch application root view container ref (required by ng2 bootstrap modal)
        this.router = _router;
    }

    ngOnInit(): void {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
    }

    ngAfterViewInit(): void {
        this.LayoutBrand();
        this.LayoutHeaderCart();
        this.LayoutMegaMenu();
        this.LayoutSidebarMenu();
        this.LayoutQuickSearch();
        this.LayoutCartMenu();
        this.LayoutQuickSidebar();
        this.LayoutGo2Top();
        this.LayoutOnepageNav();
        this.LayoutSmoothScroll();
        this.LayoutHeader();
    }

    LayoutBrand() {
        $('body').on('click', '.c-hor-nav-toggler', function () {
            let target = $(this).data('target');
            $(target).toggleClass('c-shown');
        });
    };

    LayoutHeaderCart() {
        let cart = $('.c-cart-menu');

        if (cart.width() === 0) {
            return;
        }

        if (App.getViewPort().width < App.getBreakpoint('md')) { // mpbile mode
            $('body').on('click', '.c-cart-toggler', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('body').toggleClass('c-header-cart-shown');
            });

            $('body').on('click', function (e) {
                if (!cart.is(e.target) && cart.has(e.target).length === 0) {
                    $('body').removeClass('c-header-cart-shown');
                }
            });
        } else { // desktop
            $('body').on('click', '.c-cart-toggler', function (e) {
                $('body').addClass('c-header-cart-shown');
            });

            $('body').on('hover', '.c-mega-menu > .navbar-nav > li:not(.c-cart-toggler-wrapper)', function (e) {
                $('body').removeClass('c-header-cart-shown');
            });

            $('body').on('mouseleave', '.c-cart-menu', function (e) {
                $('body').removeClass('c-header-cart-shown');
            });
        }
    }

    LayoutHeader() {
        let offset = $('.c-layout-header').attr('data-minimize-offset') > 0 ? parseInt($('.c-layout-header').attr('data-minimize-offset')) : 0;
        let _handleHeaderOnScroll = function () {
            if ($(window).scrollTop() > offset) {
                $('body').addClass('c-page-on-scroll');
            } else {
                $('body').removeClass('c-page-on-scroll');
            }
        };

        let _handleTopbarCollapse = function () {
            $('.c-layout-header .c-topbar-toggler').on('click', function (e) {
                $('.c-layout-header-topbar-collapse').toggleClass('c-topbar-expanded');
            });
        };

        if ($('body').hasClass('c-layout-header-fixed-non-minimized')) {
            return;
        }

        _handleHeaderOnScroll();
        _handleTopbarCollapse();

        $(window).scroll(function () {
            _handleHeaderOnScroll();
        });
    }

    LayoutMegaMenu() {
        $('.c-mega-menu').on('click', '.c-toggler', function (e) {
            if (App.getViewPort().width < App.getBreakpoint('md')) {
                e.preventDefault();
                if ($(this).closest('li').hasClass('c-open')) {
                    $(this).closest('li').removeClass('c-open');
                } else {
                    $(this).closest('li').addClass('c-open');
                }
            }
        });

        $('.c-layout-header .c-hor-nav-toggler:not(.c-quick-sidebar-toggler)').on('click', function () {
            $('.c-layout-header').toggleClass('c-mega-menu-shown');

            if ($('body').hasClass('c-layout-header-mobile-fixed')) {
                let height = App.getViewPort().height - $('.c-layout-header').outerHeight(true) - 60;
                $('.c-mega-menu').css('max-height', height);
            }
        });
    }

    LayoutSidebarMenu() {
        $('.c-layout-sidebar-menu > .c-sidebar-menu .c-toggler').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.c-dropdown').toggleClass('c-open').siblings().removeClass('c-open');
        });
    }

    LayoutQuickSearch() {
        // desktop mode
        $('.c-layout-header').on('click', '.c-mega-menu .c-search-toggler', function (e) {
            e.preventDefault();

            $('body').addClass('c-layout-quick-search-shown');

            if (App.isIE() === false) {
                $('.c-quick-search > .form-control').focus();
            }
        });

        // mobile mode
        $('.c-layout-header').on('click', '.c-brand .c-search-toggler', function (e) {
            e.preventDefault();

            $('body').addClass('c-layout-quick-search-shown');

            if (App.isIE() === false) {
                $('.c-quick-search > .form-control').focus();
            }
        });

        // handle close icon for mobile and desktop
        $('.c-quick-search').on('click', '> span', function (e) {
            e.preventDefault();
            $('body').removeClass('c-layout-quick-search-shown');
        });
    }

    LayoutCartMenu() {
        // desktop mode
        $('.c-layout-header').on('mouseenter', '.c-mega-menu .c-cart-toggler-wrapper', function (e) {
            e.preventDefault();

            $('.c-cart-menu').addClass('c-layout-cart-menu-shown');

        });

        $('.c-cart-menu, .c-layout-header').on('mouseleave', function (e) {
            e.preventDefault();

            $('.c-cart-menu').removeClass('c-layout-cart-menu-shown');

        });

        // mobile mode
        $('.c-layout-header').on('click', '.c-brand .c-cart-toggler', function (e) {
            e.preventDefault();

            $('.c-cart-menu').toggleClass('c-layout-cart-menu-shown');

        });
    }

    LayoutQuickSidebar() {
        // desktop mode
        $('.c-layout-header').on('click', '.c-quick-sidebar-toggler', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if ($('body').hasClass('c-layout-quick-sidebar-shown')) {
                $('body').removeClass('c-layout-quick-sidebar-shown');
            } else {
                $('body').addClass('c-layout-quick-sidebar-shown');
            }
        });

        $('.c-layout-quick-sidebar').on('click', '.c-close', function (e) {
            e.preventDefault();

            $('body').removeClass('c-layout-quick-sidebar-shown');
        });

        $('.c-layout-quick-sidebar').on('click', function (e) {
            e.stopPropagation();
        });

        $(document).on('click', '.c-layout-quick-sidebar-shown', function (e) {
            $(this).removeClass('c-layout-quick-sidebar-shown');
        });
    }

    LayoutGo2Top() {

        let handle = function () {
            let currentWindowPosition = $(window).scrollTop(); // current vertical position
            if (currentWindowPosition > 300) {
                $('.c-layout-go2top').show();
            } else {
                $('.c-layout-go2top').hide();
            }
        };

        handle(); // call headerFix() when the page was loaded

        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            $(window).bind('touchend touchcancel touchleave', function (e) {
                handle();
            });
        } else {
            $(window).scroll(function () {
                handle();
            });
        }

        $('.c-layout-go2top').on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 600);
        });
    }

    LayoutOnepageNav() {

        let handle = function () {
            let offset;
            let scrollspy;
            let speed;
            let nav;

            $('body').addClass('c-page-on-scroll');
            offset = $('.c-layout-header-onepage').outerHeight(true) || 0;
            $('body').removeClass('c-page-on-scroll');

            if ($('.c-mega-menu-onepage-dots').width() > 0) {
                if ($('.c-onepage-dots-nav').width() > 0) {
                    $('.c-onepage-dots-nav').css('margin-top', -($('.c-onepage-dots-nav').outerHeight(true) / 2));
                }
                scrollspy = $('body').scrollspy({
                    target: '.c-mega-menu-onepage-dots',
                    offset: offset
                });
                speed = parseInt($('.c-mega-menu-onepage-dots').attr('data-onepage-animation-speed'));
            } else {
                scrollspy = $('body').scrollspy({
                    target: '.c-mega-menu-onepage',
                    offset: offset
                });
                speed = parseInt($('.c-mega-menu-onepage').attr('data-onepage-animation-speed'));
            }

            scrollspy.on('activate.bs.scrollspy', function () {
                $(this).find('.c-onepage-link.c-active').removeClass('c-active');
                $(this).find('.c-onepage-link.active').addClass('c-active');
            });

            $('.c-onepage-link > a').on('click', function (e) {
                let section = $(this).attr('href');
                let top = 0;

                if (section !== '#home') {
                    top = $(section).offset().top - offset + 1;
                }

                $('html, body').stop().animate({
                    scrollTop: top,
                }, speed, 'easeInExpo');

                e.preventDefault();

                if (App.getViewPort().width < App.getBreakpoint('md')) {
                    $('.c-hor-nav-toggler').click();
                }
            });
        };


        handle(); // call headerFix() when the page was loaded
    }

    ContentOwlcarousel() {

        let _initInstances = function () {
            $('[data-slider=\'owl\'] .owl-carousel').each(function () {

                var parent = $(this);

                var items;
                var itemsDesktop;
                var itemsDesktopSmall;
                var itemsTablet;
                var itemsTabletSmall;
                var itemsMobile;

                var rtl_mode = (parent.data('rtl')) ? parent.data('rtl') : false;
                var items_loop = (parent.data('loop')) ? parent.data('loop') : true;
                var items_nav_dots = (parent.attr('data-navigation-dots')) ? parent.data('navigation-dots') : true;
                var items_nav_label = (parent.attr('data-navigation-label')) ? parent.data('navigation-label') : false;

                if (parent.data('single-item') == true) {
                    items = 1;
                    itemsDesktop = 1;
                    itemsDesktopSmall = 1;
                    itemsTablet = 1;
                    itemsTabletSmall = 1;
                    itemsMobile = 1;
                } else {
                    items = parent.data('items');
                    itemsDesktop = parent.data('desktop-items') ? parent.data('desktop-items') : items;
                    itemsDesktopSmall = parent.data('desktop-small-items') ? parent.data('desktop-small-items') : 3;
                    itemsTablet = parent.data('tablet-items') ? parent.data('tablet-items') : 2;
                    itemsMobile = parent.data('mobile-items') ? parent.data('mobile-items') : 1;
                }

                parent.owlCarousel({

                    rtl: rtl_mode,
                    loop: items_loop,
                    items: items,
                    responsive: {
                        0: {
                            items: itemsMobile
                        },
                        480: {
                            items: itemsMobile
                        },
                        768: {
                            items: itemsTablet
                        },
                        980: {
                            items: itemsDesktopSmall
                        },
                        1200: {
                            items: itemsDesktop
                        }
                    },

                    dots: items_nav_dots,
                    nav: items_nav_label,
                    navText: false,
                    autoplay: (parent.data('auto-play')) ? parent.data('auto-play') : true,
                    autoplayTimeout: (parent.data('slide-speed')) ? parent.data('slide-speed') : 5000,
                    autoplayHoverPause: (parent.data('auto-play-hover-pause')) ? parent.data('auto-play-hover-pause') : false,
                });
            });
        };


        _initInstances();
    }

    LayoutSmoothScroll() {

        var _initInstances = function () {

            $('.js-smoothscroll').on('click', function () {
                var scroll_target = $(this).data('target');
                var scroll_offset = ($(this).data('scroll-offset')) ? $(this).data('scroll-offset') : 0;
                $.smoothScroll({
                    scrollTarget: '#' + scroll_target,
                    offset: scroll_offset,
                });
                return false;
            });
        };

        _initInstances();
    }
}
