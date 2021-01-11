define(function(require){
      var Vue = require("vue");
      var Vuex = require("vueX");
//      var search = require("vuex/modules/search");
//      var searchGroup = require("vuex/modules/searchGroup");
      Vue.use(Vuex)
      Vue.config.debug = true;
    
      
	  	var todoData = {
		    message: 'data.message, Hello Vue.js!',
		    todos: [
		            { text: 'Learn JavaScript' },
		            { text: 'Learn Vue.js' },
		            { text: 'Build Something Awesome' }
		          ]
	    };
	  	
	  	var scopeData = {data:todoData, isActive:true, newTodo: ''};


      var state = {
    	  vuexDesc: "testsetsetsetes vuexDesc",
          // 查询条件
          searchKey : "",
          // 查询结果
          searchResultList : [],
          
          data:todoData, isActive:true, newTodo: ''
      };
      
      
      
      
//      var types = {
//		    	    SET_SEARCH_LIST : "SET_SEARCH_LIST",
//		    	    UPDATE_SEARCH_VAL : "UPDATE_SEARCH_VAL",
//		    	    CLEAR_SEARCH_VAL : "CLEAR_SEARCH_VAL",
//		    	   };

   	var types = require("./mutation-types");
    var api = require("./api");
      
      // mutations
      var mutations = {};

      mutations[types.SET_SEARCH_LIST] = function(state,list) {
          console.log('types.SET_SEARCH_LIST');
      }
      mutations[types.UPDATE_SEARCH_VAL] = function(state , key) {
          console.log('types.UPDATE_SEARCH_VAL');
      }
      mutations[types.CLEAR_SEARCH_VAL] = function(state, id ) {

	      state.vuexDesc += id;
    	  
    	  
          console.log('types.CLEAR_SEARCH_VAL');
      }
      
      var search = {

          state : state,
          //mutation 必须是同步函数 所以异步操作尽量在actions里处理
          mutations : mutations
    	  
      };
      
      
	  var aside = {

          state : {showRight:false},
          //mutation 必须是同步函数 所以异步操作尽量在actions里处理
          mutations : {"startShowRight":function(state, isShow){state.showRight = isShow}}
    	  
      };
      
      
      
      return new Vuex.Store({

        //modules里定义`store`和`mutations`。`store`是我们正常要维护的状态数据,`mutatinons`是操作和维护store的处理
        modules: {
          search : search,
          aside : aside
//          searchGroup :searchGroup
        },
        strict: true,
        middlewares: [Vuex.createLogger]
      })
});