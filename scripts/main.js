(function () {
    'use strict';
    window.addEvent('domready', function () {
        /**
         * Namespaces
         */
        this.Metro = {};
        this.Metro.UI = {};
        /**
         * Enumerations
         */
        this.Metro.UI.Transitions = {
            SlideTop: {
                In: 'slide-from-top',
                Out: 'slide-to-top'
            },
            SlideLeft: {
                In: 'slide-from-left',
                Out: 'slide-to-left'
            }
        };
        /**
         * Interfaces
         */
        this.Metro.UI.IHasLinks = new Class({
            initializeLinks: function () {
                this.element.getElements('a').addEvent('click', function (event) {
                    var a = event.target;
                    var pageId = new URI(a.href).get('fragment');
                    var transitionIn = a.get('data-transition-in');
                    var transitionOut = a.get('data-transition-out');
                    (!pageId) ?
                        this.close() :
                        Metro.UI.Pages.get(pageId).setOptions({
                            transitionIn: transitionIn,
                            transitionOut: transitionOut
                        }).open();
                }.bind(this));
            }
        });
        /**
         * Classes
         */
        this.Metro.UI.Element = new Class({
            Implements: [Options, Events],
            element: null,
            options: {},
            initialize: function (element, options) {
                if (!element) throw new ReferenceError('element has to have a value');
                this.element = element;
                this.setOptions(options);
            }
        });
        this.Metro.UI.Desktop = new Class({
            Extends: Metro.UI.Element,
            Implements: Metro.UI.IHasLinks,
            activePageId: null,
            options: {
                pageClassName: 'page'
            },
            initialize: function (element, options) {
                this.parent(element, options);
                this.initializeLinks();
                this.initializePages();
                this.activePageId = new URI(window.location.href).get('fragment');
                this.todo.periodical(100);
            },
            initializePages: function () {
                document.getElements('.' + this.options.pageClassName)
                    .each(function (pageElement) {
                        Metro.UI.Pages.include(
                            pageElement.get('id'),
                            new Metro.UI.Page(pageElement));
                    });
            },
            todo: function () {
                if (new URI(window.location.href).get('fragment') != this.activePageId) {
                    this.activePageId = new URI(window.location.href).get('fragment');
                    Metro.UI.Pages.each(function (page) {
                        if (page.isOpen)
                            page.close();
                    });
                    if (!!this.activePageId && this.activePageId !== 'desktop')
                        Metro.UI.Pages.get(this.activePageId).open();
                }
            }
        });
        this.Metro.UI.Page = new Class({
            Extends: Metro.UI.Element,
            Implements: Metro.UI.IHasLinks,
            isOpen: false,
            options: {
                transitionIn: Metro.UI.Transitions.SlideLeft.In,
                transitionOut: Metro.UI.Transitions.SlideLeft.Out
            },
            initialize: function (element, options) {
                this.parent(element, options);
                this.initializeLinks();
            },
            open: function () {
                this.element
                    .removeClass(this.options.transitionOut)
                    .addClass(this.options.transitionIn);
                this.isOpen = true;
                this.fireEvent('open');
            },
            close: function () {
                this.element
                    .removeClass(this.options.transitionIn)
                    .addClass(this.options.transitionOut);
                this.isOpen = false;
                this.fireEvent('close');
            }
        });
        /**
         * Collections
         */
        this.Metro.UI.Pages = new Hash();

        window.metro = new Metro.UI.Desktop(document.id('desktop'));
    });
})();