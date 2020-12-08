# Messagebox

[documentation]: https://ilosey14.github.io/

A messagebox library for sites and web apps.

---

This library adds a message or dialog box to any site
with a simple set of commands and reuseable templating for
common and complex markups.

Display a simple message

```javascript
messsagebox('Hello world!');
```

Prompt a user

```javascript
messsagebox('Are you sure about that?', ['Yes', 'No'], function (response) {
	if (response !== 'Yes') return;

	doTheThing();
});
```

Display a template

```html
<form data-name="login">
	<table>
		<tr>
			<td>Username</td>
			<td><input type="text" name="username"></td>
		</tr>
		<tr>
			<td>Password</td>
			<td><input type="password" name="password"></td>
		</tr>
	<table>
	<input type="submit" value="Login">
</form>
```

```javascript
messagebox('login', 'Close')
```

---

## Usage

The `messagebox` function will display the given contents and buttons when called
and run the optional callback function only when one of the defined buttons is chosen.

```typescript
messagebox(
	content: string|HTMLElement,
	buttons?: string[]|string,
	callback?: (response: string, content: HTMLElement) => void
) => void
```
or
```typescript
message(
	content: string|HTMLElement,
	buttons: {[value: string]: (content: HTMLElement) => void, ...},
	callback?: ...
)
```

See the `example.html` for a more detailed implementation and a live demo.

For commonly used content, templates can be defined before the `messagebox.js` script
using the following container and the `data-name` attribute for each child.

```html
<div class="-messagebox-templates">
	<div data-name="hello">Hello world!</div>
	<div data-name="goodbye">Goodbye everybody!</div>
	...
</div>
```

---

## Implementation

Given the following backend
([or similar MVC](https://symfony.com/doc/current/page_creation.html#checking-out-the-project-structure))

* ...
* src/
* libs/
  * messagebox.html
* templates/
  * messagebox-templates.html
* public/
  * src/
	* messagebox.js
  * style/
	* messagebox.css
* ...

as an example, the messagebox library can be included via the following page structure ...

```html
<!-- content -->
...

<!-- page specific templates -->
<div class="-messagebox-templates">
	<form data-name="login"></form>
	...
</div>

<!-- site-wide templates -->
<?php include_once '/templates/messagebox-templates.html' ?>

<!-- libraries -->
<?php require_once '/libs/messagebox.html' ?>
```

---

## Extending the Messagebox

### Adding a Draggable Title Bar

Add a title bar to the markup.

`messagebox.html`
```html
<div id="messagebox-mask">
	<div id="messagebox-container">
		<div id="messagebox-titlebar"></div> <!-- Add title bar here -->
		<div id="messagebox-content"></div>
		<div id="messagebox-buttons"></div>
	</div>
</div>
```

Enable free movement on the container and style the title bar.

`style/messagebox.css`
```css
#messagebox-container.absolute {
	position: absolute !important;
}
#messagebox-titlebar {
	height: 10px;
	width: 100%;
	background-color: #cccccc;
	border-radius: 2px;
	cursor: grab;
}
#messagebox-titlebar:active {
	cursor: grabbing;
}
```

Extend the messagebox object by implementing dragging on the title bar in your page/site source.

`main.js`
```javascript
// get additional elements
messagebox.container = document.getElementById('messagebox-container');
messagebox.titleBar = document.getElementById('messagebox-titlebar');

// handle dragging
messagebox.titleBar.onmousedown = function (e) {
	var top = messagebox.container.offsetTop,
		left = messagebox.container.offsetLeft;

	messagebox.mask.onmousemove = mousemove;
	this.onmouseup = removeTitleBarListeners;

	function mousemove(e) {
		top += e.movementY;
		left += e.movementX;

		messagebox.moveTo({ top: top, left: left });
	}

	function removeTitleBarListeners() {
		messagebox.mask.onmousemove = null;
		this.onmouseup = null;
	}
};

// clear positioning if desired
messagebox.onclose = function () {
	this.container.classList.remove('absolute');
	this.container.style = null;
};

/**
 * Moves the messagebox container to an absolute position.
 * @param {{top:number, left:number, bottom:number, right:number}} position
 */
messagebox.moveTo = function (position) {
	window.requestAnimationFrame(() => {
		this.container.classList.add('absolute');

		for (let p in position)
			this.container.style[p] = `${position[p] || 0}px`;
	});
};
```

---

## Documentation and More

Check the [docs][documentation] for everything you can do with this library.

### Clone the repo

```bash
git clone https://github.com/ilosey14/messagebox.git
```