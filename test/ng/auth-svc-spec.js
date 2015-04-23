describe("app", function(){
  
  describe("AuthSvc", function(){
    var svc;
    beforeEach(inject(function(AuthSvc){
      svc = AuthSvc; 
    }));
    
    it("exists", function(){
      expect(svc).toBeTruthy();
    });
  });
});