## jquery-selector_initializers

### Rationale

Traditionally different JavaScript UI components (such as tabs, tooltips, rich
editors) in jQuery applications are initialized inside of the DOM `onload` event
handler with something like this

    $(function() {
      $(".tabs").each(function() {
        $(this).makeTabs();
      });
    });

There are two issues which commonly arise with such approach.

1. One of the `onload` handlers throws exception. The rest of the handlers are
   not executed. Mostly that's undesired since it could mean that single
   exception from some third-party library just disabled half of your JavaScript
   code.

2. There are multiple sources of DOM elements nowadays, most importantly the
   elements loaded with AJAX and generated by templating. These elements need
   to be initialized in the same way elements present when `onload` event fired
   were initialized.


### Usage

See full example in
[example.html](http://github.com/dolzenko/jquery-selector_initializers/blob/master/example/example.html).

Add to `<head>`

    <script src="jquery.selector_initializers.js" type="text/javascript"></script>

Now register initializer with

    $.addInitializer(selector, function_name, function_arguments, ...)

`$.fn.applyInitializers` then will use `selector` and call `function_name`
with `function_arguments` on every element matched by `selector`.

Or more generic form

    $.addInitializer(function)

`$.fn.applyInitializers` will call `function` passing container (with elements
awaiting initialization) as `this`.

For example, to register jQuery Tools Tooltip and Facebook FBML tags initializers 

    // jQuery Tools Tooltip http://flowplayer.org/tools/tooltip/index.html
    $.addInitializer(".trigger", "tooltip", { position: "bottom right", opacity: 0.7});

    // Facebook FBML http://developers.facebook.com/docs/reference/oldjavascript/FB.XFBML.Host.parseDomElement
    $.addInitializer(function() { FB.XFBML.Host.parseDomElement(this[0]); } );

Then whenever DOM tree containing tooltips or Facebook tags comes into existence
call `$.fn.applyInitializers` like

    $(function() {
      // initialize on page load
      $("body").applyInitializers();
    });

    // add dynamic content to #dynamic container
    $("#dynamic").append("<fb:profile-pic uid='1335992023' />");

    // initialize dynamically added content
    $("#dynamic").applyInitializers();


### Similar Projects
  
Dean Edwards proposes the solution based on custom events in
[Callbacks vs Events](http://dean.edwards.name/weblog/2009/03/callbacks-vs-events/)
article. It's cool, but complex. `selector_initializers` just wraps each handler
in `try ... catch` block reporting exceptions where `windows.console` is
available.

Very similar project
[http://github.com/ratnikov/hooker](http://github.com/ratnikov/hooker).

More ambitious. Eliminates manual `applyInitializers` calls by
hooking into jQuery DOM manipulation methods
[http://github.com/ehynds/jquery-create-event](http://github.com/ehynds/jquery-create-event).