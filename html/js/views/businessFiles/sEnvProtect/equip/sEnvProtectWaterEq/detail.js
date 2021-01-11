define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
    
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//设备名称
			name : null,
			//填报人
			reporter : null,
			//操作人
			operator : null,
			//成分15
			cmps15 : null,
			//成分14
			cmps14 : null,
			//成分13
			cmps13 : null,
			//成分12
			cmps12 : null,
			//成分11
			cmps11 : null,
			//成分10
			cmps10 : null,
			//加药量7
			dosage7 : null,
			//成分9
			cmps9 : null,
			//成分8
			cmps8 : null,
			//成分7
			cmps7 : null,
			//成分6
			cmps6 : null,
			//成分5
			cmps5 : null,
			//成分4
			cmps4 : null,
			//成分3
			cmps3 : null,
			//成分2
			cmps2 : null,
			//成分1
			cmps1 : null,
			//加药量6
			env1 : null,
			//预留字段
			env10 : null,
			//预留字段
			env11 : null,
			//预留字段
			env12 : null,
			//预留字段
			env13 : null,
			//预留字段
			env14 : null,
			//预留字段
			env15 : null,
			//cod
			env2 : null,
			//ss
			env3 : null,
			//石油类
			env4 : null,
			//氨氮
			env5 : null,
			//总氮
			env6 : null,
			//总磷
			env7 : null,
			//预留字段
			env8 : null,
			//预留字段
			env9 : null,
			//是否运行 1:是,0:否
			runFlag : null,
			//点位
			position : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//关闭时间
			closeDate : null,
			//备注
			remark : null,
			//取样时间
			sampleDate : null,
			//污泥排放量/kg
			sludgeQuantity : null,
			//开始时间
			startDate : null,
			//处理水量/t
			waterQuantity : null,
			description:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("设备名称"),
						  LIB.formRuleMgr.length(255)
				],
				"reporter" : [LIB.formRuleMgr.require("填报人"),
						  LIB.formRuleMgr.length(100)
				],
				"operator" : [LIB.formRuleMgr.require("操作人"),
						  LIB.formRuleMgr.length(100)
				],
				"cmps15" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps14" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps13" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps12" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps11" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps10" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"dosage7" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps9" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps8" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps7" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps6" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps5" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps4" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps3" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps2" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"cmps1" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入加药量'}],
				"env1" :[ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env10" :[ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env11" :[ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env12" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env13" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env14" :[ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env15" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env2" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env3" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env4" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env5" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env6" : [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env7" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env8" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"env9" :  [ LIB.formRuleMgr.range(0,99999999,5),{required:true,message:'请输入出水监测'}],
				"runFlag" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否运行")),
				"position" : [LIB.formRuleMgr.require("点位"),
						  LIB.formRuleMgr.length(255)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
				'description':[LIB.formRuleMgr.require("设备维修等情况的情况描述"), LIB.formRuleMgr.length(1000)],
				"remark" : [LIB.formRuleMgr.require("备注"),LIB.formRuleMgr.length(1000)],
				
				"sludgeQuantity" : LIB.formRuleMgr.range(0,99999999,5).concat({required:true,message:'请输入处理水量'}),
			
				"waterQuantity" : LIB.formRuleMgr.range(0,99999999,5).concat({required:true,message:'请输入污泥排放量'}),
				"closeDate" : [LIB.formRuleMgr.require("关闭时间")],
				"sampleDate" : [LIB.formRuleMgr.require("取样时间")],
				"startDate" : [  LIB.formRuleMgr.require("开启时间"),   {
					validator: function (rule, value, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.startDate >= vo.closeDate) {
							callback(new Error("开启时间应小于关闭时间"))
						} else {
							callback()
						}
					}
				}],
	        }
		},
       
		companySelectModel: {
            filterData: null,
            list: [],
            num: 0,
            show: false
        },
      
        deptSelectModel: {
            visible: false,
            filterData: {
                compId: null,
                type: 2
            }
        },
        // fileModel:{
        //     file : {
        //         cfg: {
        //             params: {
        //                 recordId: null,
        //                 dataType: 'LTOHPY1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
        //                 fileType: 'LTOHPY'    // 文件类型标识，需要根据数据库的注释进行对应的修改
        //             },
        //             filters: {
        //                 max_file_size: '10mb',
        //             },
        //         },
        //         data : []
        //     }
        // },


	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			 _XXX    			//内部方法
			 doXXX 				//事件响应方法
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			'companySelectModel': companySelectModel,
            'deptSelectModal': deptSelectModal,
        },
		data:function(){
			return dataModel;
		},
		props:{
			cmps:{
				type:Array,
				default:[]
			},
			dosage:{
				type:Array,
				default:[]
			}
		},
		methods:{
			newVO : newVO,
			afterInit:function(){
                if (this.mainModel.opType=='create') {
                   
                    if (LIB.user.compId) {
                        this.mainModel.vo.compId=LIB.user.compId
                    }
                }
               
			},
			renderDosage:function(item,data){
				if (!data[item.fieldName]) {
					return ''
				}
				if (item.title !='PH') {
					return data[item.fieldName] + 'mg/L'
				}
				return data[item.fieldName]
			},
			renderColor:function(obj,data){
				if (obj.toplimit&&obj.botlimit) {
					if (obj.toplimit<data[obj.fieldName]||obj.botlimit>data[obj.fieldName]) {
						return 'color:red'
					}else {
						return ''
					}
				}else if (!obj.toplimit) {
					if (obj.botlimit>data[obj.fieldName]) {
						return 'color:red'
					}else {
						return ''
					}
				}else if (!obj.botlimit) {
					if (obj.toplimit<data[obj.fieldName]) {
						return 'color:red'
					}else {
						return ''
					}
				}
			},
			doSelectDept: function () {
                
                this.deptSelectModel.visible = true

            },
            doSelectCompany: function () {
                
                this.companySelectModel.show = true

			},
			doSaveCompany: function (val) {
                var _this = this;
                _this.mainModel.vo.compId=val[0].id

			},
			doSaveDepts: function (selectedDatas) {
                var _this = this
                
                _this.mainModel.vo.orgId = selectedDatas[0].id

            },
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});