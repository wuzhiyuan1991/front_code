define(function(require){

    var api = require("./api");
    var types = require("./mutation-types")
    
	var actions = {
	      // clear 查询项
	  clearSearchKey : function(store){
//	      store.dispatch(types.CLEAR_SEARCH_VAL);
	      
	      api.listCheckItem().then(
	  	  			function(response){
	  					console.log(response);
	  					var result = response.data.content[0];
	  					if(result){
	  			              store.dispatch(types.CLEAR_SEARCH_VAL,result.id);

	  			        }
	  				}, 
	  				function(response){
	  					console.log(response);
	  				}
	  			);
	      
	  },
	  // 更新查询项
	  updateSearchKey : function(store , key){
	      store.dispatch(types.UPDATE_SEARCH_VAL,key);
	  },
	  // 查询结果集合
      searchParamList : function(store , group ,key){
          
      }
	
  };
	  
  return actions;
});