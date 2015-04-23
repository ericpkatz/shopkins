describe("app", function(){
  beforeEach(module("app"));
  describe("NavSvc", function(){
    beforeEach(inject(function($window){
      $window.categories = [
        {},
        {}
      ]; 
    }));
    describe("$window.categories has a length of two", function(){
      var svc;
      beforeEach(inject(function(HeaderSvc){
        svc = HeaderSvc;
      }));
      describe("tabs", function(){
        it("has two tabs", function(){
          expect(svc.categories.length).toEqual(2);
        });
      });
      describe("setTab", function(){
        var tabValue;
        beforeEach(function(){
          svc.setTab("foo");
          tabValue = svc.getTab();
        });
        it("changes the tab value", function(){
          expect(tabValue).toEqual("foo"); 
        });
        
      });
    });
  });
});