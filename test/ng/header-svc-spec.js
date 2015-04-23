describe("NavSvc", function(){
  describe("categories", function(){
    var svc;
    describe("when the window exposes two categories", function(){
      beforeEach(function(){
        var _window = injector.get("$window");
        _window.categories = [
          {},
          {}
        ];
        svc = injector.get("HeaderSvc");
      });
      it("has two tabs", function(){
        expect(svc.categories.length).toEqual(2);
      });
    });
    describe("when the window exposes three categories", function(){
      beforeEach(function(){
        var _window = injector.get("$window");
        _window.categories = [
          {},
          {},
          {}
        ];
        svc = injector.get("HeaderSvc");
      });
      it("has three tabs", function(){
        expect(svc.categories.length).toEqual(3);
      });
    });
  });
  describe("setTab", function(){
    var tabValue;
    beforeEach(function(){
      var svc = injector.get("HeaderSvc");
      svc.setTab("foo");
      tabValue = svc.getTab();
    });
    it("changes the tab value", function(){
      expect(tabValue).toEqual("foo"); 
    });
    
  });
});