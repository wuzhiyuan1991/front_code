define(function(require){
      var Vue = require("vue");
      var Vuex = require("vueX");
//      var search = require("vuex/modules/search");
//      var searchGroup = require("vuex/modules/searchGroup");
     	var types = require("../mutation-types");
      Vue.use(Vuex)
      Vue.config.debug = true;
    
      var state = {
    	  vuexDesc: "testsetsetsetes vuexDesc",
          // 查询条件
          searchKey : "",
          // 查询结果
          searchResultList : [],
      };
      
      
      // mutations
      var mutations = {}

      mutations[types.SET_SEARCH_LIST] = function(state,list) {
          // console.log('types.SET_SEARCH_LIST');
      }
      mutations[types.UPDATE_SEARCH_VAL] = function(state , key) {
          // console.log('types.UPDATE_SEARCH_VAL');
      }
      mutations[types.CLEAR_SEARCH_VAL] = function(state ) {
      	  state.vuexDesc += "1";
          // console.log('types.CLEAR_SEARCH_VAL');
      }
      
      var search = {

          state : state,
          //mutation 必须是同步函数 所以异步操作尽量在actions里处理
          mutations : mutations
    	  
      };
      
      
      
      return search;
});