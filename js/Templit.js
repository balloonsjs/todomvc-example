(function (window) {
    'use strict';

    var doc = window.document,
        Arr = window.Array,
        isArray = (function () {
            if (typeof Arr.isArray === 'function') {
                return Arr.isArray;
            }

            return function (obj) {
                return (window.Object.prototype.toString.call(obj) === '[object Array]');
            };
        }()),
        regexp = new RegExp(':{([a-zA-Z0-9.]+)}', 'gm');

    function render(tpl, data) {

        return tpl.innerHTML.replace(regexp, function () {
            var key = arguments[1],
                keys = key.split('.'),
                value;


            function defineValue(k) {
                value = value[k];
            }

            if (keys.length > 1) {
                value = data;
                keys.forEach(defineValue);
            }

            value = (data[key] !== undefined) ? data[key] : value;

            return value;
        });
    }

    function Templit(template, container, data) {

        if (template) {
            this.use(template);
        }

        if (container) {
            this.into(container);
        }

        if (data) {
            this.render(data);
        }

        return this;
    }

    Templit.prototype.use = function (template) {
        this.template = doc.querySelector(template);

        return this;
    };

    Templit.prototype.into = function (container) {
        this.container = doc.querySelector(container);

        return this;
    };

    Templit.prototype.render = function (data) {
        var that = this,
            html = [];

        data = isArray(data) ? data : [data];

        data.forEach(function (data) {
            html.push(render(that.template.cloneNode(true), data));
        });

        this.container.innerHTML = html.join('');

        return this;

    };

    window.Templit = Templit;

}(this));