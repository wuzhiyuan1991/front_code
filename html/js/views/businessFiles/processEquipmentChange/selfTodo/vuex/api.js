define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'processequipmentchange/disable'},

        /**
         * 入参 为PecApplication对象
        
         */
        saveOperation :{method: 'POST', url: "pecapplication/operate"},
        getFileList: {method: 'GET', url: "file/list"},
        queryPecAssessment : {method: 'GET', url: "pecapplication/{id}/pecassessment"},//查询变更评估 入参 变更申请id
        queryPecAuditRecords : {method: 'GET', url: 'pecapplication/pecauditrecords/list'},//查询审批记录 入参 变更申请id
        queryPecImplementation : {method: 'GET', url: "pecapplication/{id}/pecimplementation"},//查询变更实施 入参 变更申请id
        queryPecAcceptance : {method: 'GET', url: "pecapplication/{id}/pecacceptance"},//查询变更验收 入参 变更申请id
        queryPecUseRangeEvaluation : {method: 'GET', url: "pecapplication/{id}/pecuserangeevaluation"},//查询应用范围评估 入参 变更申请id
        queryCandidates: {method: 'GET', url: "pecapplication/candidates"},//id=xx
        queryTodoNum: {method: 'GET', url: "pecapplication/todoNum"},
        queryAuditRoles: {method: 'GET', url: 'pecapplication/companyprofessionals/list/1/9999'},
        queryPreview: {method: 'GET', url: 'pecapplication/view/{id}'},
       
    };

    //PecApplication对象属性：{
    //    id : null,
    //       //所属专业
    //        // profession : null,
    //    //变更事由
    //    changeReason : null,
    //    //变更模式 1:临时变更,2:永久变更
    //    changeMode : null,
    //    //变更结束时间
    //    endTime : null,
    //    //变更开始时间
    //    startTime : null,
    //    //业务类型 1:管理处,2:公司业务处
    //    bizType : null,
    //    //申请日期
    //    applyDate : null,
    //    //变更所在功能区
    //    functionalZone : null,
    //    //变更项目
    //    projectName : null,
    //    //公司id
    //    compId : null,
    //    //部门id
    //    orgId : null,
    //    //变更期限
    //    changeDeadline : null,
    //    变更等级 0:未评估,1:一般变更,2:重大变更
    //    level : null,
    //    //状态 0:待申请提交,1:待评估,2:待审批,3:待填写变更实施,4:待验收,5:待评估范围,6:已评估范围,7:线下执行
    //    status : null,
    //    //申请人
    //    user : {id:'', name:''},
    //    //审批状态 0:未审核,1:科室长审批,2:管理处机关主管领导审批,3:公司业务处室业务人员审批,4:公司业务处室主管领导审批
    //    auditStatus: null
    //    //检查项
    //    pecCheckItems : [],
    //        //委托记录
    //        pecDelegateRecords : [],
    //    //审批记录
    //    pecAuditRecords : [],
    //    //变更评估
    //    assessment: {},
    //    //变更实施
    //    implementation: {},
    //    //变更验收
    //    acceptance: {},
    //    //应用范围评估
    //    useRangeEvaluation: {},
    //    /**
    //     * 操作类型
    //     * 101：变更申请-保存，102：变更申请-提交
    //     * 201：变更评估-保存，202：变更申请-提交，203：变更评估-委托
    //     * 301：变更审批-保存，302：变更审批-提交，303：变更审批-委托
    //     * 401：变更实施-保存，402：变更实施-提交，403：变更实施-委托
    //     * 501：变更验收-保存，502：变更验收-提交，503：变更验收-委托
    //     * 601：应用范围评估-保存，602：应用范围评估-提交，603：应用范围评估-委托
    //     */
    //    operationType: null
    //}

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("pecapplication"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'handle': '2510001008',
         //'edit':   '2510001002',
         'delete': '2510001003',
         //'import': '2510001004',
         'export': '2510001005',
         //'enable': '2510001006',
    };
    return resource;
});