(function($){
  $.selectorInitializers = [];

  // $.addInitializer(selector, function_name, function_arguments, ...)
  // $.applyInitializers will use +selector+ and call +function_name+
  // with +function_arguments+ on every element matched by +selector+
  //
  // or
  //
  // $.addInitializer(function)
  // $.applyInitializers will call +function+ passing container (with elements
  // awaiting initialization) as +this+
  $.addInitializer = function() {
    var args = Array.prototype.slice.call(arguments),
        method = args.shift(),
        selector = args.shift();

    $.selectorInitializers.push([method, selector, args]);
  };

  $.fn.applyInitializers = function() {
    // console.log($(this));
    return $(this).each(function() {
      var initializeeContainer = $(this);
      $.each($.selectorInitializers, function(i, initializer) {
        if (typeof initializer[0] == "function") {
          // Generic function initializer
          initializer[0].apply(initializeeContainer);
        } else {
          // Selector + method (optional args) initializer
          var initializee = initializeeContainer.find(initializer[0]);
          if (initializee.length) {
            $.each(initializee, function(j, initializee_elem) {
              console.log(initializee_elem);
              try {
                $(initializee_elem)[initializer[1]].apply(initializee, initializer[2]);
              }
              catch (e) {
                // jQuery doesn't wrap document.ready handlers in try ... catch blocks
                // but in most cases it makes sense to do so, for example so that
                // exception in third-party syntax highlighter
                // library doesn't break any other handler executed next
                if (window.console && console.error) {
                  console.error("Exception while trying to initialize " + initializer[0] + " selector: " + e);
                }
              }
            });
          }
        }
      });
    });
  };
})(jQuery);
