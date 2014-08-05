window.addEvent('domready', function () {
    this.Metro = new Hash();
    this.Metro.UI = new Hash();
    this.Metro.UI.Element = new Class({
        Implements: Options,
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
        pages: [],
        options: {
            startPage: 'page-one',
            pageClassName: 'page'
        },
        initialize: function (element, options) {
            this.parent(element, options);
            this.element.getElements('.' + this.options.pageClassName).each(function (page) {
                this.pages.push(new Metro.UI.Desktop.Page(page));
            }.bind(this));
            /*this.hidePages();
            this.showPage(new URI(location.href).get('fragment') || this.options.startPage);*/
            this.element.getElements('a').addEvent('click', function (event) {
                //event.stop();
                var destinationPage = new URI(event.target.href).get('fragment');
                if (!destinationPage)
                    return;
                /*this.hidePages();
                this.showPage(destinationPage);*/
            }.bind(this));
        },
        hidePages: function () {
            this.pages.each(function (page) {
                console.log(page.element.get('id'));
                if (page.element.get('id') != this.options.startPage) {
                    page.hide();
                };
            }.bind(this));
        },
        showPage: function (pageId) {
            this.pages.each(function (page) {
                if (page.element.get('id') == pageId) {
                    page.slideIn();
                };
            });
        }
    });
    this.Metro.UI.Desktop.Page = new Class({
        Extends: Metro.UI.Element,
        fxSlide: null,
        options: {
            mode: 'horizontal'
        },
        initialize: function (element, options) {
            this.parent(element, options);
            this.fxSlide = new Fx.Slide(this.element, {
                mode: this.options.mode,
                hideOverflow: false
            });
        },
        show: function () {
            /*this.fxSlide.show();*/
            /*this.element.show();*/
        },
        hide: function () {
            this.fxSlide.hide();
            /*this.element.hide();*/
        },
        slideIn: function () {
            this.fxSlide.slideIn();
            /*this.element.show();*/
        },
        slideOut: function () {
            this.fxSlide.slideOut().chain(function () {
                /*this.element.hide();*/
            });
        }
    });
    window.metro = new Metro.UI.Desktop(document.getElement('.desktop'));
});