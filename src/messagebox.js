/**
 * Displays a messagebox with content and buttons
 * @param {string|HTMLElement} content Message of content to display
 * @param {string[]|string} buttons Button values
 * @param {{(response: string, content: HTMLElement) => void}} callback Handles user's response
 */
var messagebox = function (content, buttons = [], callback = null) {
    if (messagebox.isOpen) {
        messagebox.clear();
        messagebox.keepOpen = true;
    }

    // contents
    if (typeof content === 'string') {
        if (messagebox.templates[content])
            messagebox.content.appendChild(messagebox.templates[content]);
        else
            messagebox.content.appendChild(document.createElement('div')).innerHTML = content;
    }
    else if (content instanceof HTMLElement)
        messagebox.content.appendChild(content);

    //buttons
    if (!(buttons instanceof Array))
        buttons = [ buttons ];

    for (let value of buttons) {
        let button = messagebox.buttons.appendChild(document.createElement('input'));

        button.type = 'button';
        button.value = value;

        button.onclick = function () {
            if (typeof callback === 'function')
                callback(this.value, messagebox.content.firstElementChild);
            else if (typeof messagebox.listeners[content] === 'function')
                messagebox.listeners[content](this.value, messagebox.content.firstElementChild);

            if (messagebox.keepOpen)
                messagebox.keepOpen = false;
            else
                messagebox.close();
        };
    }

    // show
    messagebox.mask.classList.add('show');
    messagebox.isOpen = true;

    if (typeof messagebox.onshow === 'function')
        messagebox.onshow();

    // autofocus
    var autofocus = messagebox.content.querySelector('[data-autofocus]');

    if (autofocus)
        autofocus.focus();
    else if (messagebox.buttons.firstElementChild)
        messagebox.buttons.firstElementChild.focus();
};

messagebox.mask = document.getElementById('messagebox-mask');
messagebox.content = document.getElementById('messagebox-content');
messagebox.buttons = document.getElementById('messagebox-buttons');

messagebox.mask.onclick = function (e) {
    e.stopPropagation();
    messagebox.close();
    messagebox.keepOpen = false;
};

document.getElementById('messagebox-container').onclick = function (e) {
    e.stopPropagation();
};

messagebox.keepOpen = false;
messagebox.isOpen = false;
messagebox.templates = {};
messagebox.listeners = {};

messagebox.onshow = undefined;
messagebox.onclose = undefined;

/**
 * Adds a named template and optionally an associated
 * callback to be displayed later
 * @param {string} name Template name
 * @param {HTMLElement|string} template Template content
 * @param {{(response: string, content: HTMLElement) => void}} callback Function to invoke when a user response is given
 */
messagebox.add = function (name, template = null, callback = null) {
    this.templates[name] = template;
    this.listeners[name] = callback;
};

/**
 * Clears the contents and buttons
 */
messagebox.clear = function () {
    // clear contents
    while (this.content.children.length)
        this.content.removeChild(this.content.firstElementChild);

    // clear buttons
    while (this.buttons.children.length)
        this.buttons.removeChild(this.buttons.firstElementChild);
};

/**
 * Closes the messagebox and clears its contents
 */
messagebox.close = function () {
    this.mask.classList.remove('show');
    this.isOpen = false;

    this.clear();

    if (typeof this.onclose === 'function')
        this.onclose();
};

// load in templates
(function () {
    var templateDOM = document.getElementsByClassName('-messagebox-templates'),
        templateList = {};

    // read all templates and callbacks into list
    while (templateDOM.length) {
        let templates = templateDOM[0];

        for (let template of templates.children) {
            let name = template.dataset.name,
                type = template.dataset.type || 'template';

            if (!templateList[name])
                templateList[name] = {};

            if (type === 'template')
                templateList[name][type] = template;
            else if (type === 'callback') {
                try {
                    templateList[name][type] = new Function('response', 'content', '"use strict";' + template.innerHTML.trim());
                }
                catch (err) {
                    console.error('Messagebox Template Error: syntax error in "' + name + ':callback"');
                    continue;
                }
            }
        }

        templates.parentElement.removeChild(templates);
    }

    // add templates to messagebox
    for (let name in templateList)
        messagebox.add(name, templateList[name]['template'], templateList[name]['callback']);
})();