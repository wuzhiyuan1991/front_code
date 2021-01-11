define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        list: {method: 'GET', url: 'documentlibrary/list/1/9999'},
        order: {method: 'PUT', url: 'documentlibrary/order'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        deleteLogic:{method: 'DELETE', url: 'documentlibrary/logic'},
        move:{method:'PUT',url:'documentlibrary/move'},
        getDocCenterUploadExtensions: {method: 'GET', url: 'lookup/syscfg/value?path=sys_global_conf.doc_center_upload_extensions'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("documentlibrary"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '7060001001,7070001001',
        'editFile':   '7060001002,7070001002',
        'deleteFile': '7060001003,7070001003',
        'editDoc':'7070001004',
        'deleteDoc':'7070001005',
        'reupload':'7070001006',
        'down':'7070001007',
        'uploadFile':'7070001008',
        'move':'7070001009',
        'isPublicFile':'7070001010',
        'isAuditFile':'7070001011'
    };
    return resource;
});