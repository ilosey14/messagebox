<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Messagebox Example</title>
</head>
<body>
    <!-- page content -->
    <div>
        <h1>PHP Messagebox Example</h1>
    </div>
    <div>
        <p>
            Given the following backend
            (<a href="https://symfony.com/doc/current/page_creation.html#checking-out-the-project-structure">or similar MVC</a>)
        </p>
        <ul>
            <li>...</li>
            <li>src/</li>
            <li>libs/</li>
            <ul>
                <li>messagebox.html</li>
            </ul>
            <li>templates/</li>
            <ul>
                <li>messagebox-templates.html</li>
            </ul>
            <li>public/</li>
            <ul>
                <li>src/</li>
                <ul>
                    <li>messagebox.js</li>
                </ul>
                <li>style/</li>
                <ul>
                    <li>messagebox.css</li>
                </ul>
            </ul>
            <li>...</li>
        </ul>
        <p>the messagebox library can be included via the following page structure... (see source)</p>
    </div>

    <!-- page specific templates -->
    <div class="-messagebox-templates">
        <form data-name="login"></form>
        <!-- ... -->
    </div>

    <!-- site-wide templates -->
    <?php include_once '/templates/messagebox-templates.html'; ?>

    <!-- libraries -->
    <?php
    require_once '/libs/messagebox.html';
    require_once '/libs/some-other-api.html';
    ?>
</body>
</html>