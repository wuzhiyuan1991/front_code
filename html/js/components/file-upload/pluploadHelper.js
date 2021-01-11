define(function(require) {
	var ctxpath = "";
	var registerCtxpath = function(path) {
		ctxpath = path;
	}
	var defaultErrorFunc = null;
	var defaultBeforeSuccessUploadFunc = null;
	return {
		registerCtxpath : registerCtxpath,
		ctxpath : function(){ return ctxpath },
		defaultErrorFunc : defaultErrorFunc,
		defaultBeforeSuccessUploadFunc : defaultBeforeSuccessUploadFunc
	}
});