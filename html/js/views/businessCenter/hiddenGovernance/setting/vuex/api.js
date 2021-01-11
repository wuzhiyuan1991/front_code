define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //create:{method:"POST",url:'process'},
        //update:{method:"PUT",url:'process'},
        delete:{method:"DELETE",url:'process'},
        //list: {method: 'GET', url: 'process/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'process/{id}'},
        _deleteFilterLookup:{method:'DELETE',url:'filterlookup'},
        batchUpdate:{method:'PUT',url:'process/batchUpdate'},
        issue:{method:"POST",url:"process/issue"},


        listLookup:{method: 'GET', url: 'remind/lookup'},
        listLookupItem:{method: 'GET', url: 'remind/lookupItem'},
        listDept: {method: 'GET', url: 'organization/list'},
        listUser: {method: 'GET', url: 'user/list'},
        listRole: {method: 'GET', url: 'role/list?disable=0'},

        saveFilterLookup:{method:'POST',url:'filterlookup'},
        saveFilterConditions:{method:'POST',url:'filtercondition/batch'},
        delFilterConditions:{method:'DELETE',url:'filtercondition'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        filterdelete: {method: 'DELETE', url: 'filterlookup'},
        filterupdate:{method:"PUT",url:'filterlookup'},

    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("process"));
    var resource = Vue.resource(null, {}, customActions);
    return resource;
});