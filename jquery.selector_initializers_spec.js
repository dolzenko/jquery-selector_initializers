describe("selector_initializers", function() {
  beforeEach(function () {
    jQuery.selectorInitializers = [];
  });

  describe("jQuery.addInitializer", function() {

    it("exposes registered intializers", function() {
      expect(jQuery.selectorInitializers).toBeDefined();
      expect(jQuery.selectorInitializers.length).toBe(0);
    });

    it("registers initializer", function() {
      jQuery.addInitializer(".tooltip", "each", function() { });
      expect(jQuery.selectorInitializers[0][0]).toBe(".tooltip");
      expect(jQuery.selectorInitializers[0][1]).toBe("each");
    });
  });

  describe("jQuery.fn.applyInitializers", function() {
    var cnt = function() { return $("#test_div") };
    var cleanCnt = function() { cnt().html(""); };

    beforeEach(cleanCnt);
    afterEach(cleanCnt);

    var setupConsoleSpy = function() {
      if (!window.console) {
        alert("installed stub");
        window.console = { error: function() { } };
      }

      spyOn(window.console, "error");
    };

    beforeEach(setupConsoleSpy);

    it("applies registered initializer", function() {
      jQuery.addInitializer(".tooltip", "each", function() {
        $(this).text("42");
      });

      cnt().html("<div class='tooltip'></div>");

      cnt().applyInitializers();

      expect(cnt().find(".tooltip:first").text()).toBe("42");
    });

    it("keeps applying initializers even when some of them throw exceptions", function() {
      jQuery.addInitializer(".tooltip", "each", function() {
        throw "FAIL";
      });

      jQuery.addInitializer(".tooltip", "each", function() {
        $(this).text("42");
      });

      cnt().html("<div class='tooltip'></div>");

      cnt().applyInitializers();

      expect(cnt().find(".tooltip:first").text()).toBe("42");      
    });

    it("reports failed initializations", function() {
      jQuery.addInitializer(".tooltip", "each", function() {
        throw "FAIL";
      });

      cnt().html("<div class='tooltip'></div>");

      cnt().applyInitializers();

      expect(window.console.error.mostRecentCall.args[0]).toContain(".tooltip");
      expect(window.console.error.mostRecentCall.args[0]).toContain("FAIL");
    });

    it("works with collections", function() {
      jQuery.addInitializer(".tooltip", "each", function() {
        $(this).text("42");
      });

      cnt().html("<div><div class='cnt'><div class='tooltip'></div></div><div class='cnt'><div class='tooltip'></div></div>");

      cnt().find(".cnt").applyInitializers();

      expect(cnt().find(".tooltip").length).toBe(2);
      expect(cnt().find(".tooltip").eq(0).text()).toBe("42");
      expect(cnt().find(".tooltip").eq(1).text()).toBe("42");
    });

    it("initializes collections", function() {
      jQuery.addInitializer(".tooltip", "each", function() {
        $(this).text("42");
      });

      cnt().html("<div class='tooltip'></div><div class='tooltip'></div>");

      cnt().applyInitializers();

      expect(cnt().find(".tooltip").length).toBe(2);
      expect(cnt().find(".tooltip").eq(0).text()).toBe("42");
      expect(cnt().find(".tooltip").eq(1).text()).toBe("42");      
    });

    it("calls generic initializer function", function() {
      jQuery.addInitializer(function() { $(this).text("42"); });

      cnt().applyInitializers();

      expect(cnt().text()).toBe("42");
    });
  });
});