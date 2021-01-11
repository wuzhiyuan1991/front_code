define(function(require){

    var Vue = require("vue");
	
	var defaultOpts = {
		 // use before callback， 这里可以防止请求在短时间内多次调用，把上一次为完成的请求cancel掉
		    before: function(request) {
		      console.log("use before callback : " + this.previousRequest);
		      // abort previous request, if exists
		      if (this.previousRequest) {
		        this.previousRequest.abort();
		      }
	
		      // set previous request on Vue instance
		      this.previousRequest = request;
		    }
		};
	
	var listCheckItem = function() {
		return Vue.http.get('checkitem/list', defaultOpts);
	};
	

//	var listCheckItem = function() {
//		Vue.http.get('checkitem/list', defaultOpts).then(
//			function(response){
//				console.log(response);
//			}, 
//			function(response){
//				console.log(response);
//			}
//		);
//	};
      
      
      
      return {listCheckItem:listCheckItem};
});