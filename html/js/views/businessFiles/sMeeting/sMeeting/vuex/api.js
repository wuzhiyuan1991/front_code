define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
      updateDisable : {method: 'PUT', url: 'securemeeting/disable'},
      queryLegalTypes:{method: 'GET', url: 'peoplegroup/list'},
      queryMeetAttacheds : {method: 'GET', url: 'securemeeting/meetattacheds/list/{pageNo}/{pageSize}'},
      saveMeetAttached : {method: 'POST', url: 'securemeeting/{id}/meetattached'},
      removeMeetAttacheds : _.extend({method: 'DELETE', url: 'securemeeting/{id}/meetattacheds'}, apiCfg.delCfg),
      updateMeetAttached : {method: 'PUT', url: 'securemeeting/{id}/meetattached'},
      updateSign : {method: 'GET', url: 'securemeeting/{id}/changeSign'},
    
      saveMeetingChangeStatus : {method: 'GET', url: 'securemeeting/{id}/changStatus'},
      queryMeetingParticipants : {method: 'GET', url: 'securemeeting/meetingparticipants/list/{pageNo}/{pageSize}'},
      saveMeetingParticipant : {method: 'POST', url: 'securemeeting/{id}/meetingparticipants'},
      removeMeetingParticipants : _.extend({method: 'DELETE', url: 'securemeeting/{id}/meetingparticipants'}, apiCfg.delCfg),
      updateMeetingParticipant : {method: 'PUT', url: 'securemeeting/{id}/meetingparticipant'},
  
      queryMeetingRecipients : {method: 'GET', url: 'securemeeting/meetingrecipients/list/{pageNo}/{pageSize}'},
      saveMeetingRecipients : {method: 'POST', url: 'securemeeting/{id}/meetingrecipients'},
      removeMeetingRecipients : _.extend({method: 'DELETE', url: 'securemeeting/{id}/meetingrecipients'}, apiCfg.delCfg),
      updateMeetingRecipients : {method: 'PUT', url: 'securemeeting/{id}/meetingrecipients'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("securemeeting"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2810002001',
        'edit':   '2810002002',
        'delete': '2810002003',
        'import': '2810002004',
        'export': '2810002005',
        'submit':'2810002007' ,
        'approval':'2810002008' ,
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});