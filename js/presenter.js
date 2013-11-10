(function (window) {
    'use strict';

    // Template engine
    var render = new Templit();

    function Presenter() {

        // Defines a new Todo model
        this.todo = new Todo();

        // Defines user interaction
        this.userEvents();

        // Defines model events
        this.modelEvents();

    };

    Presenter.prototype.userEvents = function () {

        var that = this;

        document.querySelector('#todoapp').addEventListener('click', function (eve) {
            var el = eve.target,
                status,
                taskID;

            if (el.className === 'destroy') {
                taskID = parseInt(el.parentNode.parentNode.dataset.task, 10);
                that.todo.remove(taskID);
            }

            if (el.id === 'clear-completed') {
                that.todo.remove('status', 'completed');
            }

            if (el.className === 'toggle') {
                taskID = parseInt(el.parentNode.parentNode.dataset.task, 10);
                that.todo.toggle(taskID);
            }
        });

        document.querySelector('#new-todo').addEventListener('keyup', function (eve) {
            if (this.value === '') {
                return;
            }

            // ENTER key
            if (eve.keyCode === 13) {
                that.todo.add(this.value);
                this.value = '';
                this.blur();
            }

            // ESC key
            if (eve.keyCode === 27) {
                this.value = '';
                this.blur();
            }
        });
    };

    Presenter.prototype.modelEvents = function () {

        var that = this,
            footer = document.querySelector('#footer'),
            count = document.querySelector('#todo-count'),
            clearCompleted = document.querySelector('#clear-completed'),
            completedCount = document.querySelector('#completed-count');

        this.todo.on('add', function() {
            render.use('#view').into('#todo-list').fill(that.todo.items());

            footer.removeAttribute('hidden');

            count.innerHTML = that.todo.count('active');
        });

        this.todo.on('edit', function() {
            render.use('#view').into('#todo-list').fill(that.todo.items());
        });

        this.todo.on('remove', function() {
            render.use('#view').into('#todo-list').fill(that.todo.items());

            count.innerHTML = that.todo.count('active');

            completedCount.innerHTML = that.todo.count('completed');

            if (that.todo.count('completed') === 0) {
                clearCompleted.setAttribute('hidden');
            }

            if (that.todo.size() === 0) {
                footer.setAttribute('hidden');
            }

        });

        this.todo.on('toggle', function () {

            render.use('#view').into('#todo-list').fill(that.todo.items());

            count.innerHTML = that.todo.count('active');

            completedCount.innerHTML = that.todo.count('completed');

            if (that.todo.count('completed') === 0) {
                clearCompleted.setAttribute('hidden', 'hidden');
            } else {
                clearCompleted.removeAttribute('hidden');
            }
        });

        return this;
    }

    // Expose app presenter
    window.app = new Presenter();

}(this));