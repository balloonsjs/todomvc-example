(function (window, Q) {
    'use strict';

    var toggle = {
            'active': 'completed',
            'completed': 'active'
        },
        checked = {
            'active': '',
            'completed': 'checked'
        };


    var Todo = Q.define({
        'name': 'todo',

        'init': function () {
            this._id = 0;
            this._collection = [];
        },

        'add': function (text) {
             var task = {
                'id': this._id += 1,
                'date': new Date(),
                'status': 'active', // active or completed
                'text': text,
                'checked': ''
             };

             this._collection.push(task);

             this.emit('add');

             return this;
        },

        'edit': function (id, text) {
            var tasks = this._collection,
                i = 0,
                len = tasks.length;

            for (i; i < len; i += 1) {
                if (tasks[i].id === id) {
                    tasks[i].date = new Date();
                    tasks[i].text = text;
                    break;
                }
            }

            this.emit('edit');

            return this;
        },

        'toggle': function (id) {
            var tasks = this._collection,
                i = 0,
                len = tasks.length;

            for (i; i < len; i += 1) {
                if (tasks[i].id === id) {
                    tasks[i].status = toggle[tasks[i].status];
                    tasks[i].checked = checked[tasks[i].status];
                    break;
                }
            }

            this.emit('toggle');

            return this;
        },

        'toggleAll': function (completed) {
            var tasks = this._collection,
                i = 0,
                len = tasks.length,
                status = (completed) ? 'completed': 'active';

            for (i; i < len; i += 1) {
                tasks[i].status = status;
                tasks[i].checked = checked[status];
            }

            this.emit('toggle');

            return this;
        },

        'remove': function (key, value) {

            var tasks = this._collection,
                i = 0,
                len = tasks.length;

            if (typeof key === 'number') {
                value = key;
                key = 'id';
            }

            for (i; i < len; i += 1) {
                if (tasks[i][key] === value) {
                    tasks.splice(i, 1);
                    len -= 1;
                    i -= 1;
                }
            }

            this.emit('remove');
        },

        'items': function () {
            return this._collection;
        },

        'count': function (status) {
            var tasks = this._collection,
                i = 0,
                len = tasks.length,
                count = 0;

            for (i; i < len; i += 1) {
                if (tasks[i].status === status) {
                    count += 1;
                }
            }

            return count;
        },

        'size': function () {
            return this._collection.length;
        }
    });


    // Expose Todo
    window.Todo = Todo;

}(this, Q));