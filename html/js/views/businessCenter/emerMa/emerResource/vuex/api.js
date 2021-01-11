define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emerresource/disable'},
        deleteBatch: {method: 'DELETE', url: 'emerresource/ids'},//批量删除
        /**
         * 危险化学品企业级别评定，
         * 入参：{
         *  isHazardousChemicalEnterprise：是否为危化品企业 0:否,1:是
         *  enterpriseScale：企业规模 1:300人以下或营收2000万以下,2:300人以上或营收2000万以上,3:1000人以上或营收40000万以上
         *  hazardLevel：危险源级别 1:一级危化品重大危险源,2:二级危化品重大危险源,3:三级危化品重大危险源,4:四级危化品重大危险源
         *  compId: 公司id
         * }
         */
        createEnterpriseGrade: {method: 'POST', url: 'enterprisegrade'},
        //获取公司危险化学品企业级别，属性为grade 1:第一类危险化学品单位,2:第二类危险化学品单位,3:第三类危险化学品单位
        getEnterpriseGradeByCompId: {method: 'GET', url: 'enterprisegrade/getByCompId/{compId}'},

		queryEmerInspectRecords : {method: 'GET', url: 'emerresource/emerinspectrecords/list/{pageNo}/{pageSize}'},
		saveEmerInspectRecord : {method: 'POST', url: 'emerresource/{id}/emerinspectrecord'},
		removeEmerInspectRecords : _.extend({method: 'DELETE', url: 'emerresource/{id}/emerinspectrecords'}, apiCfg.delCfg),
		updateEmerInspectRecord : {method: 'PUT', url: 'emerresource/{id}/emerinspectrecord'},

		queryEmerMaintRecords : {method: 'GET', url: 'emerresource/emermaintrecords/list/{pageNo}/{pageSize}'},
		saveEmerMaintRecord : {method: 'POST', url: 'emerresource/{id}/emermaintrecord'},
		removeEmerMaintRecords : _.extend({method: 'DELETE', url: 'emerresource/{id}/emermaintrecords'}, apiCfg.delCfg),
		updateEmerMaintRecord : {method: 'PUT', url: 'emerresource/{id}/emermaintrecord'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emerresource"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9020004001',
         'edit':   '9020004002',
         'delete': '9020004003',
         'import': '9020004004',
         'export': '9020004005',
         'copy': '9020004007',
        'grade': '9020004008',
    };
    return resource;
});