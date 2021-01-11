define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryCourseKpoint : {method: 'GET', url: 'icmcourse/{id}/icmcoursekpoint/{icmcoursekpointId}'},
        checkCourseKpoint : {method: 'GET', url: 'icmcourse/{id}/icmcoursekpoint/{icmcoursekpointId}/checkstatus'},
        queryCourseKpoints : {method:'GET',url:'icmcourse/icmcoursekpoints/list'},
        saveCourseKpoint : {method: 'POST', url: 'icmcourse/{id}/icmcoursekpoint'},
        removeCourseKpoints : _.extend({method: 'DELETE', url: 'icmcourse/{id}/icmcoursekpoints'}, apiCfg.delCfg),
        updateCourseKpoint : {method: 'PUT', url: 'icmcourse/{id}/icmcoursekpoint'},
        listFile: {method: 'GET', url: 'file/list'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        //删除文件
        deleteFile:{method:'DELETE',url:'icmcourse/files'},
        // 检查视频是否通过审核
        checkVideo: {method: 'GET', url: 'icmcourse/{id}/icmcoursekpoint/{icmcoursekpointId}/check'},
        copy:{method:'GET',url:'icmcourse/copy/{icmcourseId}/{destCompId}/{destOrgId}'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("icmcourse"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2040005001',
        'edit':   '2040005002',
        'delete': '2040005003',
        'import': '2040005004',
        'export': '2040005005',
        'enable': '2040005006',
        'charptercreate':'2040005007',
        'charpterupdate':'2040005008',
        'charpterdelete':'2040005009',
    };
    return resource;
});