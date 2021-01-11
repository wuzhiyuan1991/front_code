define(function(require){

    var Vue = require("vue");

    var customActions = {
        getDataExcelList: {method: 'GET', url: 'dataexcel/list'},
        getBizExcelList: {method: 'GET', url: 'bizexcelrel/list'},
        save: {method: 'POST', url: 'bizexcelrel/{compId}/batch'}
    };
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});