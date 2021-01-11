define(function(require){

    var Vue = require("vue");
	
	var customActions = {
        getCurUserInfo: {method: 'GET', url: '/user/{id}'},
        updateUserinfo: {method: 'PUT', url: '/user/session'},
        updatePwd: {method: 'PUT', url: '/user/reset/pwd'},
        listDept: {method: 'GET', url: '/organization/list'},
        listTree: {method: 'GET', url: '/user/tree'},
        getPsd:{method: 'GET', url: 'envconfig/{type}'},
        //删除文件
        deleteFile:{method:'DELETE',url:'file'},
        listMenu:{method:"GET", url: 'menu/list'},
        menuCreate : {method: 'PUT', url:'user/homemenu'},

        //新建文件
        createFile : {method: 'POST', url: '/material'},
        //下载
        downFile: {method: 'GET', url: '/file/down/{id}'},
        delFile: {method: 'DELETE', url: 'material'},
        delBatch: {method: 'DELETE', url: 'material/ids'},
        //上下移动
        batchFile: {method: 'PUT', url: '/material/batch'},

        updateFile: {method: 'PUT', url: 'material'},
        updateWorkState: {method: 'PUT', url: '/user/workState'},



    };
    var resource = Vue.resource(null, {}, customActions);
    
    return resource;
});