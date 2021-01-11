define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var companySelectModel = require("componentsEx/selectTableModal/companySelectModel");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    var selectGroup = require('./dialog/selectGroup')
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //名称
            name: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属公司
            compId: null,
            //所属部门
            orgId: null,
            //支持人的姓名
            approverName: null,
            //支持人的姓名
            compereName: null,
            //会议内容
            content: null,
            //结束时间
            endDate: null,
            //会议名称
            meetingName: null,
            //支持人的姓名
            registrarName: null,
            //会议地点
            site: null,
            //开始时间
            startDate: null,
            //会议状态 1 待发布  2 待提交 3 待审批
            status: null,
            //会议类型 1 安全例会  2 安委会会议 3 其他安全会议
            type: null,
            //会议附件
            meetAttacheds: [],
            //参会人员
            meetingParticipants: [],
            //抄送人员
            meetingRecipients: [],
            compere: { id: null, name: null },
            registrar: { id: null, name: null },
            approver: { id: null, name: null },
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
                "name": [LIB.formRuleMgr.length(100)],
                'approver.id': [LIB.formRuleMgr.require("审批人")],
                'registrar.id': [LIB.formRuleMgr.require("记录人")],
                'compere.id': [LIB.formRuleMgr.require("主持人")],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.length(10)],
                "approverName": [LIB.formRuleMgr.length(100)],
                "compereName": [LIB.formRuleMgr.length(100)],
                "content": [LIB.formRuleMgr.length(65535)],
                "endDate": [LIB.formRuleMgr.allowStrEmpty],
                "meetingName": [LIB.formRuleMgr.length(100)],
                "registrarName": [LIB.formRuleMgr.length(100)],
                "site": [LIB.formRuleMgr.length(100)],
                "startDate": [LIB.formRuleMgr.allowStrEmpty],
                "status": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                "type": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
            }
        },
        tableModel: {
            
            meetingParticipantTableModel: LIB.Opts.extendDetailTableOpt({
                url: "securemeeting/meetingparticipants/list",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title : "名称",
                        fieldName : "user.name",
                        keywordFilterName: "criteria.strValue.name"
                    },
                    // {
                    //     title: "所属公司",
                    //     fieldType: "custom",
                    //     render: function(data) {
                    //         if (data.user) {
                    //             return LIB.tableMgr.rebuildOrgName(data.user.compId, 'comp');
                    //         }
                    //     },
                    // },
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.user) {
                                return LIB.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
                            }
                        },
                      
                      
                    },
                    {
                        title: "签到",
                        // fieldType: "custom",
                        render: function (data) {
                            if (data.sign) {
                                var className = data.sign == '2' ? 'status-rect-tag-yellow' : 'status-rect-tag-green';
                              var text= data.sign == '2'?'否':'是'
                              return    '<div class="status-rect-tag ' + className + '" style="color: #fff;">' +text + '</div>'+ '<img  style="width: 25px;float: right;margin-right: 35px;margin-top: 5px;" src="" alt="">';
                               
                            }
                         },


                    },
                    //  {
                    //     title: "",
                    //     fieldType: "tool",
                    //     toolType: "del"
                    // }
                ]
            }),
            meetingRecipientsTableModel: LIB.Opts.extendDetailTableOpt({
                url: "securemeeting/meetingrecipients/list",
                columns: [
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
                    
                    // {
                    //     title: "",
                    //     fieldType: "tool",
                    //     toolType: "del"
                    // }
                ]
            }),
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
        selectModel: {
            userSelectModel: {
                visible: false,
                filterData: {
                    compId: null,
                    type: 0
                }
            },

        },
        selectGroup: {
            show: false
        },
        fileModel: {
            file: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'AQHY1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'AQHY'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                    },
                },
                data: []
            }
        },
        images:'',
        userState: null,
        single: true
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
            'userSelectModal': userSelectModal,
            'selectGroup': selectGroup
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
            doPreview: function () {
				this.$emit("do-preview", {vo:this.mainModel.vo,tableData:this.$refs.meetingparticipantTable.values});
			},
            doViewImages:function(){
                console.log("接口待改!!!");
                _this=this
               this.images=[{attr5:'5', fullSrc: ''}]
               setTimeout(function () {
                _this.$refs.imageViewer.view();}, 100);
              },  
            doViewImages1:function(e){
                console.log("接口待改!!!");
                _this=this
                if(e.target.localName=="img"){
                    this.images=[{attr5:'5', fullSrc: ''}]
                    setTimeout(function () {
                     _this.$refs.imageViewer.view();}, 100);
                }
              },  
            afterInit: function () {
                var _this = this
                if (this.mainModel.opType == 'create') {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data
                        _this.fileModel.file.cfg.params.recordId = res.data
                    })
                }
            },
      
            afterInitData: function () {
                this.fileModel.file.cfg.params.recordId = this.mainModel.vo.id
                this.$refs.meetingparticipantTable.doQuery({ id: this.mainModel.vo.id });
                this.$refs.meetingrecipientsTable.doQuery({ id: this.mainModel.vo.id });
            },
            doPublic:function(){
                var _this = this
                api.saveMeetingChangeStatus({id:this.mainModel.vo.id,status:2}).then(function(res){
                   
                        LIB.Msg.success('发布成功')
                        _this.$dispatch("ev_dtUpdate");
                        _this.doClose()
                    
                   
                })
            },
            doSubmit:function(){
                var _this = this
                api.saveMeetingChangeStatus({id:this.mainModel.vo.id,status:3}).then(function(res){
                  
                        LIB.Msg.success('提交成功')
                        _this.$dispatch("ev_dtUpdate");
                        _this.doClose()
                    
                   
                })
            },
            doApproval:function(){
                var _this = this
                api.saveMeetingChangeStatus({id:this.mainModel.vo.id,status:4}).then(function(res){
                  
                        LIB.Msg.success('审批成功')
                        _this.$dispatch("ev_dtUpdate");
                        _this.doClose()
                  
                   
                })
            },
            doSaveMeetingParticipant: function (data) {
                if (data) {
                    var _this = this;
                    var newdata = _.map(data, function (item) { return { userId: item.user.id ,userName: item.user.name} })
                    api.saveMeetingParticipant({ id: this.mainModel.vo.id }, newdata).then(function () {
                        _this.refreshTableData(_this.$refs.meetingparticipantTable);
                    });
                }
            },
            doRemoveMeetingParticipant: function (item) {
                if (this.hasAuth('edit')) {
                    LIB.Msg.error('暂无权限')
                    return
                }
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeMeetingParticipants({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
                            _this.$refs.meetingparticipantTable.doRefresh();
                        });
                    }
                });
            },
            doRemoveMeetingRecipients: function (item) {
                if (this.hasAuth('edit')) {
                    LIB.Msg.error('暂无权限')
                    return
                }
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeMeetingRecipients({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
                            _this.$refs.meetingrecipientsTable.doRefresh();
                        });
                    }
                });
            },
            doSaveMeetingRecipients: function (data) {
                if (data) {
                    var _this = this;
                    var newdata = _.map(data, function (item) { return { userId: item.id ,userName: item.name} })
                    api.saveMeetingRecipients({ id: this.mainModel.vo.id }, newdata).then(function () {
                        _this.refreshTableData(_this.$refs.meetingrecipientsTable);
                    });
                }
            },
            doSelectGroup: function () {
                this.selectGroup.show = true
            },

            doSaveUsers: function (selectedDatas) {
                var _this = this
                if (this.userState == 1) {
                    this.mainModel.vo.compere = selectedDatas[0]
                } else if (this.userState == 2) {
                    this.mainModel.vo.registrar = selectedDatas[0]
                } else if (this.userState == 3) {
                    this.mainModel.vo.approver = selectedDatas[0]
                } else if (this.userState == 4) {
                    this.doSaveMeetingRecipients(selectedDatas)
                }


            },
            doSelectUser: function (val) {
                this.userState = val
                if (val < 4) {
                    this.single = true
                } else {
                    this.single = false
                }
                this.selectModel.userSelectModel.visible = true
            },
            doSelectDept: function () {

                this.deptSelectModel.visible = true

            },
            doSelectCompany: function () {

                this.companySelectModel.show = true

            },
            doSaveDepts: function (selectedDatas) {
                var _this = this

                _this.mainModel.vo.orgId = selectedDatas[0].id

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