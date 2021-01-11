define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	index:null,
        	mainModel:{
				title:"选择",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "contractoremp/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 // LIB.tableMgr.ksColumn.code,
					{
						//姓名
						title: "姓名",
						fieldName: "name",
						keywordFilterName: "criteria.strValue.keyWordValue_name",
						width:100
					},
					{
						//年龄
						title: "年龄",
						fieldName: "age",
						keywordFilterName: "criteria.strValue.keyWordValue_age",
						width:70
					},
					{
						title: "承包商",
						fieldName: "contractor.deptName",
						keywordFilterName: "criteria.strValue.keyWordValue_contractor_dept_name",
						width:900
					},
//					{
//						//证书
//						title: "证书",
//						fieldName: "certificate",
//						keywordFilterName: "criteria.strValue.keyWordValue_certificate"
//					},
//					{
//						//证书编号
//						title: "证书编号",
//						fieldName: "certificateNo",
//						keywordFilterName: "criteria.strValue.keyWordValue_certificateNo"
//					},
//					{
//						//身份证号
//						title: "身份证号",
//						fieldName: "idNumber",
//						keywordFilterName: "criteria.strValue.keyWordValue_idNumber"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remark",
//						keywordFilterName: "criteria.strValue.keyWordValue_remark"
//					},
//					{
//						//性别
//						title: "性别",
//						fieldName: "sex",
//						keywordFilterName: "criteria.strValue.keyWordValue_sex"
//					},
//					{
//						//联系电话
//						title: "联系电话",
//						fieldName: "telephone",
//						keywordFilterName: "criteria.strValue.keyWordValue_telephone"
//					},
//					{
//						//工种
//						title: "工种",
//						fieldName: "workType",
//						keywordFilterName: "criteria.strValue.keyWordValue_workType"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			return data;
		},
		name:"contractorempSelectTableModal",
        methods: {
            doSave:function(){
                if(this.mainModel.selectedDatas.length ==0){
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible=false;
                // this.resetTriggerFlag=!this.resetTriggerFlag;
                this.$emit('do-save',this.mainModel.selectedDatas, this.index);
            },
            init:function (val) {
                this.index = val;
            }
        },
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});