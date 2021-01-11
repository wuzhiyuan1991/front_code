define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //会议名称
            name: null,
            //备注
            remark: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属公司
            compId: null,
            //所属部门
            orgId: null,
            //分组状态 1 待发布  2 待提交 3 待审批
            status: null,
            //分组人员
            groupUserRels: [],
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
                "code": [LIB.formRuleMgr.require("编码"),
                LIB.formRuleMgr.length(100)
                ],
                "name": [LIB.formRuleMgr.require("会议名称"),
                LIB.formRuleMgr.length(100)
                ],
                "remark": [
                LIB.formRuleMgr.length(1000)
                ],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
                "status": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
            }
        },
        tableModel : {
			groupUserRelTableModel : LIB.Opts.extendDetailTableOpt({
				url : "peoplegroup/groupuserrels/list/{curPage}/{pageSize}",
				columns : [
					// LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "user.name",
					keywordFilterName: "criteria.strValue.name"
                },
                {
                    title: "所属公司",
                    fieldType: "custom",
                    render: function(data) {
                        if (data.user) {
                            return LIB.tableMgr.rebuildOrgName(data.user.compId, 'comp');
                        }
                    },
                  
                  
                },
                {
                    title: "所属部门",
                    fieldType: "custom",
                    render: function(data) {
                        if (data.user) {
                            return LIB.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
                        }
                    },
                  
                  
                },
            //   _.extend(_.clone(LIB.tableMgr.column.dept),{filterType:null})  ,
                {
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
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
            'companySelectModel': companySelectModel,
            'deptSelectModal': deptSelectModal,
            'userSelectModal': userSelectModal
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
         
            doSelectDept: function () {

                this.deptSelectModel.visible = true

            },
            doSelectCompany: function () {

                this.companySelectModel.show = true

            },
            doSaveGroupUserRel : function(data) {
				if (data) {
                    var _this = this;
                     var newdata =_.map(data,function(item){
                        return {userId:item.id,userName:item.name}
                     })
					api.saveGroupUserRel({id : this.mainModel.vo.id}, newdata).then(function() {
						_this.refreshTableData(_this.$refs.groupuserrelTable);
					});
				}
            },
            doRemoveGroupUserRel : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeGroupUserRels({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.groupuserrelTable.doQuery({id : _this.mainModel.vo.id});
						});
					}
				});
			},
            doSelectUser: function () {

                this.selectModel.userSelectModel.visible = true
            },
            doSaveDepts: function (selectedDatas) {
                var _this = this

                _this.mainModel.vo.orgId = selectedDatas[0].id

            },
            afterInit:function(){
                if (this.mainModel.opType == 'create') {
                 
                    if (LIB.user.compId) {
                        this.mainModel.vo.compId=LIB.user.compId
                    }
                   
                }
                this.$refs.groupuserrelTable.doClearData()
            },
            afterInitData : function() {
				this.$refs.groupuserrelTable.doQuery({id : this.mainModel.vo.id});
			},
            doSaveCompany: function (val) {
                var _this = this;
                _this.mainModel.vo.compId = val[0].id

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