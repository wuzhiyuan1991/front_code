define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'selfevaluationtask/disable'},

        /**
         * 入参:
         * {id:任务id,
         * orgId：任务orgId
         * selfEvaluationDetails:答题详情
         * [{
			//自评答案(选择题为选项id，问答题手填)
			answer : null,
			//自评任务
			selfEvaluationTask : {id:''},
			//自评问卷问题
			selfEvaluationQuestion : {id:''},
		}]
         */
        submitTask: {method: 'POST', url:"selfevaluationtask/submit"},
        saveTask: {method: 'POST', url:"selfevaluationtask/save"},
        getTask: {method: 'GET', url:"selfevaluationtask/{id}"},

		querySelfEvaluationDetails : {method: 'GET', url: 'selfevaluationtask/selfevaluationdetails/list/{pageNo}/{pageSize}'},
		saveSelfEvaluationDetail : {method: 'POST', url: 'selfevaluationtask/{id}/selfevaluationdetail'},
		removeSelfEvaluationDetails : _.extend({method: 'DELETE', url: 'selfevaluationtask/{id}/selfevaluationdetails'}, apiCfg.delCfg),
		updateSelfEvaluationDetail : {method: 'PUT', url: 'selfevaluationtask/{id}/selfevaluationdetail'},

        getUndoCount:{method: 'GET', url: 'selfevaluationtask/todo/num'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("selfevaluationtask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         //'create': '9010003001',
         //'edit':   '9010003002',
         //'delete': '9010003003',
         //'import': '9010003004',
         //'export': '9010003005',
         //'enable': '9010003006',
         'save':   '9010003008',//保存
         'submit':  '9010003009',//提交签名
         'viewScheme':  '9010003007',//查看演练方案
    };
    return resource;
});