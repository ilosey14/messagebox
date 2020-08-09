# Messagebox

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
    buttons: string[]|string,
    callback: (response: string, content: HTMLElement) => void
) => void
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
