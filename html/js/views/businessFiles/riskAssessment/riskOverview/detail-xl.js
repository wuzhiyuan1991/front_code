define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
    // var editComponent = require("./edit");
	var tpl = require("text!./detail-xl.html");
    var detailOpt = require("./detail-xl-opt");
	var risktypeSelectModal = require("componentsEx/selectTableModal/risktypeSelectModal");
	var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
	var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
	// var checkBasisSelectModal = require("componentsEx/selectTableModal/checkBasisSelectModal");
    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");
	// var riskModel = require("views/businessFiles/riskAssessment/evaluationModel/dialog/riskModel");
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查频次
			checkFrequency : null,
			//管控层级
			// controlHierarchy : null,
			//控制措施
			controlMeasures : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//'危害辨识来源标识 0 隐患回转 1 自建记录
			markup : null,
			//风险等级
			riskLevel : null,
			//风险等级模型
            riskTypeId:null,
            riskModelId:null,
            residualRiskModelId:null,
            residualRiskEvaluationRank:null,//残余风险评估-风险等级
			//场景
			scene : null,
			//状态（0已评估，1未评估,2未通过）
			state : null,
			//风险点类型
			checkObjType:null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//危害分类
			riskType : {id:'', name:''},
			//危害因素分类
			hazardFactor : {id:'', name:''},
			//检查项
			checkItem : {id:'', name:'',type:''},
            introducer:null,//引导词
            subIntroducer:null,//分类引导词
            areas:null,//部门区域
            areaType:null,//地域类型
            hazardousElementsSenior:null,//大分类
            hazardousElementsJunior:null,//小分类
            hazard:null,//危险源
            hazardousElementsContent:null,//危害因素-内容
            deviceName:null,//设备设施-名称
            devicePart:null,//部件
            activityType:null,//分类
            activityName:null,//活动（操作/作业/任务）-名称
            activityContent:null,//活动（操作/作业/任务）-内容
            riskAnalysis:null,//风险分析
            preventionDepartment:null,//责任部门
            preventionPerson:null,//责任人
            emergencyPlan:null,
            emergencyPlanYes:true,
            emergencyPlanNo:null,
			typeOfCtrlMeas:null,//控制措施-类型
			hierOfCtrlMeas:null,//控制措施-层级
			scoreOfCtrlMeas:null,//控制措施-分值
			levelOfControl:null,//管控等级
            hiddenDangerType:null,
            hiddenDangerLevel:null,

		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"checkFrequency" : [LIB.formRuleMgr.length()],
				// "controlHierarchy" : [LIB.formRuleMgr.length()],
				"controlMeasures" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"markup" : [LIB.formRuleMgr.length()],
				"riskLevel" : [LIB.formRuleMgr.length()],
				"riskModel" : [LIB.formRuleMgr.length()],
				"scene" : [LIB.formRuleMgr.length()],
				"state" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
			checkMethodTableModel : {
				url : "checkitem/checkmethods/list/{curPage}/{pageSize}",
				columns : [
					{
						title : "名称",
						fieldName : "name",
						width: 400
					},
                    {
                        title : "内容",
                        fieldName : "content"
                    },
					{
						title : "",
						fieldType : "tool",
						toolType : "del",
						width: 60
					}
				]
			},

            checkBasisTableModel: LIB.Opts.extendDetailTableOpt({
                url: "checkitem/legalregulations/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "所属规范",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.topType) {
                                return data.topType.name;
                            }

                        }

                    },
                    {
                        title: "依据内容",
                        fieldName: "name"

                    },
                    // {
                    //     title: "内容说明",
                    //     fieldName: "content"
                    // },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }),

			// checkBasisTableModel:{
			// 	url : "checkitem/checkbases/list/{curPage}/{pageSize}",
			// 	columns :[
			// 		{
			// 			title:"法律法规",
			// 			fieldName:"name"
			// 		},
			// 		{
			// 			title:"章节条款",
			// 			fieldType:"custom",
			// 			render: function(data){
			// 				if(data.checkBasisType){
			// 					return data.checkBasisType.name;
			// 				}
            //
			// 			}
			// 		},
			// 		{
			// 			title:"内容",
			// 			fieldName:"content",
			// 		},
			// 		{
			// 			title:"",
			// 			fieldType:"tool",
			// 			toolType:"del"
			// 		}
			// 	],
			// },
			checkAccidentcaseTableModel:{
				url : "checkitem/accidentcases/list/{curPage}/{pageSize}",
			}
		},
		cardModel : {
			checkMethodCardModel : {
				showContent : true
			},
		},
		cardMode2 : {
			checkMethodCardModel : {
				showContent : true
			},
		},
		cardMode3 : {
			checkMethodCardModel : {
				showContent : true
			},
		},
		formModel : {
		},
		riskTypeList:null,
		selectedDatas:[],
		selectModel:{
			risktypeSelectModel:{
				visible:false
			},
			checkMethodSelectModel:{
				visible:false
			},
			accidentCaseSelectModel:{
				visible:false
			},
			checkBasisSelectModel:{
				visible:false
			}
		},
        checkBasis: {
            visible: false,
            filterData: null
        }

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailTabXlPanel,detailOpt],
		template: tpl,
		components : {
			"risktypeSelectModal":risktypeSelectModal,
			"checkmethodSelectModal":checkMethodSelectModal,
			"accidentCaseSelectModal":accidentCaseSelectModal,
			"checkBasisSelectModal":checkBasisSelectModal
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRisktypeSelectModal : function(param) {
				this.selectModel.risktypeSelectModel.visible = true;
			},
			doShowCheckMethodSelectModal : function(param) {
				this.selectModel.checkMethodSelectModel.visible = true;
			},
			doShowAccidentCaseSelectModal : function(param) {
				this.selectModel.accidentCaseSelectModel.visible = true;
			},
			doShowCheckBasisSelectModal : function(param) {
				this.selectModel.checkBasisSelectModel.visible = true;
			},
		},
		events : {

		},
        init: function () {
            this.$api = api;
        }
	});

	return detail;
});