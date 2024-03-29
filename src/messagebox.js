/**
 * Handles user response
 * @typedef {(response: string, content: HTMLElement) => void} MessageboxResponseCallback
 * @callback MessageboxResponseCallback
 * @param {string} response
 * @param {HTMLElement} content
 */

/**
 * Handles user response
 * @typedef {{(content: HTMLElement) => void}} MessageboxButtonCallback
 * @callback MessageboxButtonCallback
 * @param {HTMLElement} content
 */

/**
 * Displays a messagebox with content and buttons
 * @param {string|HTMLElement} content Message content to display or a template name
 * @param {string[]|string|Object<string, MessageboxButtonCallback>} [buttons] Button values or button value-callback pairs
 * @param {MessageboxResponseCallback} [callback] Handles user response
 */
 var messagebox = function (content, buttons, callback) {
	if (messagebox.isOpen) {
		messagebox.clear();

		if (messagebox.isClosing)
			messagebox.keepOpen = true;
	}

	// contents
	if (typeof content === 'string') {
		if (content in messagebox.templates)
			messagebox.content.appendChild(messagebox.templates[content]);
		else
			messagebox.content.appendChild(document.createElement('div')).innerHTML = content;
	}
	else if (content instanceof HTMLElement)
		messagebox.content.appendChild(content);

	// make button value-callback object
	var buttonCallbacks = {};

	if (typeof buttons === 'object') {
		if (buttons instanceof Array) {
			for (let value of buttons)
				buttonCallbacks[value] = null
		}
		else
			buttonCallbacks = buttons;
	}
	else if (typeof buttons === 'string')
		buttonCallbacks[buttons] = null;

	// append buttons
	for (let value in buttonCallbacks) {
		let button = messagebox.buttons.appendChild(document.createElement('input'));

		button.type = 'button';
		button.value = value;

		button.onclick = function () {
			let listener = messagebox.listeners[content],
				contentElement = messagebox.content.firstElementChild,
				buttonCallback = buttonCallbacks[this.value];

			messagebox.isClosing = true;

			// button callback
			if (typeof buttonCallback === 'function')
				buttonCallback(contentElement);

			// response callback
			if (typeof callback === 'function')
				callback(value, contentElement);
			else if (typeof listener === 'function')
				listener(value, contentElement);

			// keep open
			if (messagebox.keepOpen)
				messagebox.keepOpen = false;
			else
				messagebox.close();

			messagebox.isClosing = false;
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
messagebox.container = document.getElementById('messagebox-container');
messagebox.content = document.getElementById('messagebox-content');
messagebox.buttons = document.getElementById('messagebox-buttons');

messagebox.mask.onclick = function (e) {
	e.stopPropagation();
	messagebox.close();
};

messagebox.container.onclick = function (e) {
	e.stopPropagation();
};

messagebox.isOpen = false;
messagebox.keepOpen = false;
messagebox.isClosing = false;

/** @type {Object<string, string&HTMLElement>} */
messagebox.templates = {};
/** @type {Object<string, MessageboxResponseCallback} */
messagebox.listeners = {};

messagebox.onshow = null;
messagebox.onclose = null;

/**
 * Adds a named template to be displayed later.
 *
 * (Optional) Associate a response callback with the template.
 * Can be overruled by the callback in the `messagebox` function.
 * @param {string} name Template name
 * @param {string|HTMLElement} content Template content
 * @param {MessageboxResponseCallback} [listener] Function to invoke when a user response is given
 */
messagebox.addTemplate = function (name, content, listener) {
	if (typeof name !== 'string')
		throw `[messagebox] Template name must be a string, "${typeof name}" given.`;

	this.templates[name] = content;

	if (typeof listener === 'function')
		this.addListener(name, listener);
};

/**
 * Adds a listener to an existing template.
 * @param {string} name Existing template name
 * @param {MessageboxResponseCallback} listener Function to invoke when a user response is given
 */
messagebox.addListener = function (name, listener) {
	if (typeof this.templates[name] === 'undefined')
		throw `[messagebox] Cannot add listener to undefined template "${name}".`;

	this.listeners[name] = listener;
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
	this.keepOpen = false;

	this.clear();

	if (typeof this.onclose === 'function')
		this.onclose();
};

// load in templates
(function () {
	var templateDOM = document.getElementsByClassName('-messagebox-templates');

	// read all templates into list
	while (templateDOM.length) {
		let templates = templateDOM[0];

		for (let template of templates.children)
			messagebox.addTemplate(template.dataset.name, template);

		templates.parentElement.removeChild(templates);
	}
})();