define(function(require){
	
    var v = require("vue");
    var BASE = require("base");

	var defaultOpts = {
		 	// use before callback， 这里可以防止请求在短时间内多次调用，把上一次为完成的请求cancel掉
		    before: function(req) {
		    	//非http请求，则为本地请求，本地请求需删除访问的根路径
		    	var rootPath = req.url.toLowerCase();
		    	var disks = ["c:","d:","e:","f:","g:","h:","file:"] ;
		    	var isLocalReq = _.some(disks, function(item){
//		    		return rootPath.startsWith(item);
		    		return rootPath.indexOf(item) == 0;
		    	});
		    	
		    	if(isLocalReq) {
			    	delete req.root;
		    	}
		    }
		};
	
	var listMenu = function() {
        return v.http.get(BASE.ctxpath + '/menu/list', defaultOpts);
	};
	var delDownLoad = function(val) {
		console.log(val);
        return v.http.delete(BASE.ctxpath + '/userexporttask',{emulateJSON: true, body: val});
	};

	var logout = function(){
		return v.http.get(BASE.ctxpath + '/user/logout', defaultOpts);
	}
	//获取国际化信息列表
	var listI18nList=function(){
		return v.http.get(BASE.ctxpath + '/i18n/list');
	}
	var getAuditTask = function () {
        return v.http.get(BASE.ctxpath + '/auditfile/loginuser/todo');
    }

	return {
		listMenu:listMenu,
		logout:logout,
		listI18nList:listI18nList,
        getAuditTask: getAuditTask,
        delDownLoad: delDownLoad,
	};
      
});