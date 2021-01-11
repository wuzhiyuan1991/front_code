//请参考 1.0 文档 https://github.com/pagekit/vue-resource/blob/master/docs/api.md
define(function(require) {
	 
	var cfg = {
		delCfg : function(){
			return {
				before : function (request) {
			      // abort previous request, if exists
			      if (this.previousRequest) {
			        this.previousRequest.abort();
			      }
			      // set previous request on Vue instance
			      this.previousRequest = request;
			    }
			};
		}
	};
	

    var buildDefaultApi = function(pojo) {
    	var defaultApi = {
	    	list : {method: 'GET', url: pojo + '/list/{curPage}/{pageSize}'},
	        get : {method: 'GET', url: pojo + '/{id}'},
	        create : {method: 'POST', url: pojo},
            create4copy : {method: 'POST', url: pojo + '/{id}/copy'},
	        update : {method: 'PUT', url: pojo},
	        remove : _.extend({method: 'DELETE', url: pojo}, cfg.delCfg),
	        exportExcel : {method: 'GET', url: pojo + '/exportExcel'},
	        importExcel : {method: 'POST', url: pojo + '/importExcel'},
	        //获取业务对象关联的文件信息
	        listFile: {method: 'GET', url: 'file/list'},
	        deleteFile:{method:"DELETE", url:'file', contentType:"application/json;charset=UTF-8"},
			getUUID: {method: 'GET', url: 'helper/getUUID'},
    	}
    	
    	return defaultApi;
    };
    
	return {
		delCfg : cfg.delCfg(),
		buildDefaultApi : buildDefaultApi
	};

})