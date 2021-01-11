define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");

    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编号
            code: null,
            //用品名称
            name: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: "0",
            //所属公司
            compId: null,
            //所属部门
            orgId: null,
            //用品型号
            rolename: null,
            //计量单位
            content: null,
            user:null,
            securityAgency:{
                id:null
            }
      
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                // "compId" : [LIB.formRuleMgr.require("公司")],
                "name" : [LIB.formRuleMgr.require("安全机构名字"),
						  LIB.formRuleMgr.length(15)
                ],
                "rolename" : [LIB.formRuleMgr.require("角色名字"),
						  LIB.formRuleMgr.length(10)
				],
                "content" : [LIB.formRuleMgr.length(1000)],
				"user.id" :[LIB.formRuleMgr.require("成员")],
				// "orgId" : [LIB.formRuleMgr.require("部门")],
            }
        },
        tableModel: {
            //
            // attendeesTableModel : LIB.Opts.extendDetailTableOpt({
            //     // url : "testequipment/testusers/list/{curPage}/{pageSize}",
            //     columns : [
            //         {
            //             title : "名称",
            //             fieldName : "name",
            //             keywordFilterName: "criteria.strValue.keyWordValue_name"
            //         },{
            //             title : "部门",
            //             fieldName : "dept",
            //             keywordFilterName: "criteria.strValue.keyWordValue_name"
            //         },{
            //             title : "签到",
            // 		width:100,
            //             fieldName : "isSign",
            //             keywordFilterName: "criteria.strValue.keyWordValue_name"
            //         },{
            //             title : "",
            //             fieldType : "tool",
            //             toolType : "move,del"
            //         }]
            // }),
            //
            // ccUserTableModel : LIB.Opts.extendDetailTableOpt({
            //     // url : "testequipment/testusers/list/{curPage}/{pageSize}",
            //     columns : [
            //         {
            //             title : "名称",
            //             fieldName : "name",
            //             keywordFilterName: "criteria.strValue.keyWordValue_name"
            //         },{
            //             title : "部门",
            //             fieldName : "dept",
            //             keywordFilterName: "criteria.strValue.keyWordValue_name"
            //         },{
            //             title : "",
            //             fieldType : "tool",
            //             toolType : "move,del"
            //         }]
            // })
        },
        selectModel: {
            userSelectModel: {
                visible: false,
                filterData: {
                    compId: null,
                    type: 0
                }
            },

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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "userSelectModal": userSelectModal,

            'companySelectModel': companySelectModel,
            'deptSelectModal': deptSelectModal,
           
        },
        props:{
            securityagency:{
                type:Object,
                default:{}
            }
        },
        data: function () {
            return dataModel;
        },
        watch:{
            'mainModel.vo.compId':function(val){
                if (val) {
                        this.deptSelectModel.filterData.compId=val
                }
            }
        },
        methods: {
            newVO: newVO,
            doSaveCompany: function (val) {
                var _this = this;
                _this.mainModel.vo.compId=val[0].id
            },
            
            afterInit:function(){
                if (this.mainModel.opType=='create') {
                    _.extend(this.mainModel.vo.securityAgency,this.securityagency)
                    if (LIB.user.compId) {
                        this.mainModel.vo.compId=LIB.user.compId
                    }
                }
               
            },
            doSaveUsers: function (selectedDatas) {
                var _this = this
                _this.mainModel.vo.user = selectedDatas[0]
                this.mainModel.vo.compId= _this.mainModel.vo.user.compId
                this.mainModel.vo.orgId= _this.mainModel.vo.user.orgId
            },
            doSaveDepts: function (selectedDatas) {
                var _this = this
                
                _this.mainModel.vo.orgId = selectedDatas[0].id

            },
            doSelectUser: function () {
               
                this.selectModel.userSelectModel.visible = true
            },
            doSelectDept: function () {
                
                this.deptSelectModel.visible = true

            },
            doSelectCompany: function () {
                
                this.companySelectModel.show = true

            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});