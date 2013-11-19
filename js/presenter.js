(function (window) {
    'use strict';

    var app = {},
        footer = document.querySelector('#footer'),
        count = document.querySelector('#todo-count'),
        toggleAll = document.querySelector('#toggle-all'),
        clearCompleted = document.querySelector('#clear-completed'),
        completedCount = document.querySelector('#completed-count'),
        todo = new Todo(),
        template = new Templit('#view', '#todo-list');

    // Defines user interaction
    document.querySelector('#todoapp').addEventListener('click', function (eve) {
        var el = eve.target,
            status,
            taskID;

        if (el.className === 'destroy') {
            taskID = parseInt(el.parentNode.parentNode.dataset.task, 10);
            todo.remove(taskID);
        }

        if (el.id === 'clear-completed') {
            todo.remove('status', 'completed');
        }

        if (el.className === 'toggle') {
            taskID = parseInt(el.parentNode.parentNode.dataset.task, 10);
            todo.toggle(taskID);
        }

        if (el.id === 'toggle-all') {
            todo.toggleAll(el.checked);
        }
    });

    document.querySelector('#new-todo').addEventListener('keyup', function (eve) {
        if (this.value === '') {
            return;
        }

        // ENTER key
        if (eve.keyCode === 13) {
            todo.add(this.value);
            this.value = '';
            this.blur();
        }

        // ESC key
        if (eve.keyCode === 27) {
            this.value = '';
            this.blur();
        }
    });

    // Defines model events
    todo.on('add', function() {
        template.render(todo.items());

        toggleAll.removeAttribute('hidden');
        toggleAll.checked = false;

        footer.removeAttribute('hidden');

        count.innerHTML = todo.count('active');
    });

    todo.on('edit', function() {
        template.render(todo.items());
    });

    todo.on('remove', function() {
        template.render(todo.items());

        count.innerHTML = todo.count('active');

        completedCount.innerHTML = todo.count('completed');

        if (todo.count('completed') === 0) {
            clearCompleted.setAttribute('hidden');
        }

        if (todo.size() === 0) {
            toggleAll.checked = false;
            toggleAll.setAttribute('hidden');
            footer.setAttribute('hidden');
        }

    });

    todo.on('toggle', function () {

        template.render(todo.items());

        count.innerHTML = todo.count('active');

        completedCount.innerHTML = todo.count('completed');

        if (todo.count('completed') === 0) {
            clearCompleted.setAttribute('hidden', 'hidden');

        } else {
            clearCompleted.removeAttribute('hidden');
            toggleAll.checked = (todo.count('active') === 0);
        }
    });

    // Expose app presenter
    window.app = {
        'model': todo,
        'template': template
    };

}(this));