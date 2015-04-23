var injector;
beforeEach(module("app"));
beforeEach(inject(function($injector){
  injector = $injector;
}));