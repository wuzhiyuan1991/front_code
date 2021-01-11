define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var videoHelper = require("tools/videoHelper");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var addGroup = require("./dialog/addGroup")
    LIB.registerDataDic("bgfw", [
        ["1", "永久变更"],
        ["2", "紧急变更"],
        ["3", "临时变更"]
    ]);

    LIB.registerDataDic("smoc_pass_opinion_result", [
        ["0", "-"],
        ["1", "通过"],
        ["2", "不通过"]
    ]);

    LIB.registerDataDic("smoc_pass_opinion_type", [
        ["1", "审批"],
        ["2", "评估"],
        ["3", "验收"]
    ]);
    //初始化数据模型
    var newVO = function () {
        return {
            attr5: null,
            id: null,
            //编码
            code: null,
            //变更性质 0:增加,1:删减,2:更改
            nature: null,
            //地点
            position: null,
            //项目名称
            name: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: "0",
            //公司id
            compId: null,
            //部门id
            orgId: null,
            //变更类型 0:设备设施,1:原料,2:作业方式,3:技术工艺,4:其他
            changeMode: null,
            //变更期限
            deadLine: null,
            //变更结束时间
            endTime: null,
            //变更说明
            illustrate: null,
            //备注
            remark: null,
            //变更范围 0:永久变更,1:紧急变更,2:临时变更
            scope: null,
            //变更开始时间
            startTime: null,
            //状态 0:申请待提交,1:待评估,2待审批,3:待实施,4:培训,5:待验收,6:已完成
            status: '0',
            //流程意见记录
            cultivateRecords: [],
            //流程意见记录
            passOpinions: [],
            //风险辨识组
            riskItemGroups: [],
            applicant: {},
            //实施人
            handlers: [],
            //审批人
            approvers: [],
            //评估人
            assessors: [],
            //培训人
            trainers: [],
            //验收人
            acceptors: [],
            smocTemplate:null
        }
    };
    //Vue数据
    var uploadEvents = {
        //正确图片
        rightPic: function (file, rs) {
            dataModel.opinionModel.rightPictures.push(LIB.convertFileData(rs.content));
        },
        //视频
        wrongPic: function (file, rs) {
            dataModel.opinionModel.wrongPictures.push(LIB.convertFileData(rs.content));
        }
    };
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length(100)],
                "nature": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("变更性质")),
                "position": [LIB.formRuleMgr.require("地点"),
                LIB.formRuleMgr.length(255)
                ],
                "name": [LIB.formRuleMgr.require("项目名称"),
                LIB.formRuleMgr.length(255)
                ],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("公司")],
                "orgId": [LIB.formRuleMgr.length(10)],
                "changeMode": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),

                "endTime": [LIB.formRuleMgr.allowStrEmpty],
                "illustrate": [LIB.formRuleMgr.length(1000)],
                "remark": [LIB.formRuleMgr.length(1000)],
                "scope": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "startTime": [LIB.formRuleMgr.allowStrEmpty],
                "status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "deadLine": [{
                    validator: function (rule, val, callback) {
                        var vo = dataModel.mainModel.vo;
                        if (_.isEmpty(vo.scope)) {
                            callback(new Error("请填写变更期限"))
                        } else if (vo.scope != '0') {
                            if (_.isEmpty(vo.deadLine)) {
                                callback(new Error("请填写期限时间"))
                            } else {
                                callback()
                            }
                        } else {
                            vo.deadLine = null;
                            _.set(vo, 'criteria.strValue.deadLine', 0);
                            // vo['criteria.strValue.changeDeadline_empty']= 1
                            callback()
                        }
                    }
                }],
                'applicant.id': LIB.formRuleMgr.require("申请人"),
                'approvers': [{
                    validator: function (rule, val, callback) {
                        var vo = dataModel.mainModel.vo;

                        if (vo.approvers.length == 0) {
                            callback(new Error("请选择审批人"))
                        } else {
                            callback()
                        }

                    }
                }],
            },
            activeTabName: '1',
            pgyjValues: [],
            groups2: []
        },
        tableModel: {
            checkModel: LIB.Opts.extendDetailTableOpt({

                columns: [{
                    title: "风险项",
                    fieldName: "name",
                    width: 400
                },
                {
                    title: "控制措施",
                    fieldName: "measure",
                },
                {
                    title: "落实情况",
                    fieldName: "detail",
                },
                    {
                        title: "是否落实",
                        fieldType: "custom",

                        width: "120px",
                        render: function (data) {
                            var textColor = '#cecece',
                                iconColor = '#cecece';

                            if (data.status == '1') {
                                textColor = 'blue';
                                return "<a href='javascript:void(0);' class='record-cell-text' style='color:" + textColor + ";'>已落实</a>"
                            }
                            return "<a href='javascript:void(0);' class='record-cell-text' style='color:" + textColor + ";'>点击落实</a>"
                        },
                        showTip:false,
                        tipRender: function (data) {
                            return "点击落实";
                        }
                    },
                {
                    title: "",
                    fieldType: "tool",
                    toolType: "edit,del"
                }
                ],
            }),
            checkBasisTableModel: LIB.Opts.extendDetailTableOpt({

                columns: [
                    {
                        title: "风险项",
                        fieldName: "name",
                        width: 400
                    },
                    {
                        title: "辨识结果",
                        fieldName: "result",
                        fieldType: "custom",
                        renderClass: 'text-center',
                        showTip: false,
                        render: function (data) {
                            if (data.result == 1) {
                                return '<label  class="ivu-checkbox-wrapper result1"><span class="ivu-checkbox ivu-checkbox-checked result1" ><span class="ivu-checkbox-inner result1"></span></span><span></span>是</label><label class="ivu-checkbox-wrapper result2"><span class="ivu-checkbox result2"><span class="ivu-checkbox-inner result2"></span></span><span></span>否</label>'
                            } else if (data.result == 0) {
                                return '<label class="ivu-checkbox-wrapper result1"><span class="ivu-checkbox result1"><span class="ivu-checkbox-inner result1"></span></span><span></span>是</label><label class="ivu-checkbox-wrapper result2"><span class="ivu-checkbox result2"><span class="ivu-checkbox-inner result2"></span></span><span></span>否</label>';
                            } else if (data.result == 2) {
                                return '<label class="ivu-checkbox-wrapper result1"><span class="ivu-checkbox result1"><span class="ivu-checkbox-inner result1"></span></span><span></span>是</label><label class="ivu-checkbox-wrapper result2"><span class="ivu-checkbox ivu-checkbox-checked result2" ><span class="ivu-checkbox-inner result2" style="background:red;border-color:red"></span></span><span></span>否</label>'
                            }
                        },
                        width: 120
                    },
                    {
                        title: "控制措施",
                        fieldName: "measure",
                    },
                    {
                        title: "落实人",
                        fieldName: "handler.name",
                        width: 100
                    },
                ]
            }),
            //评估
            pgyjModel: LIB.Opts.extendDetailTableOpt({
                url: "changemanagement/passopinions/list/1/2000",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "评估部门",
                        render: function (data) {
                            if (data.handler) {
                                return LIB.tableMgr.rebuildOrgName(data.handler.orgId, 'dept');
                            }

                        },
                    },
                    {
                        title: "评估人",
                        fieldName: "handler.name",
                        width: 100
                    },
                    {
                        //结果 0:未辨识,1:通过,2:不通过
                        title: "审批结果",
                        fieldName: "result",

                        render: function (data) {
                            if (data.attr5) {
                                return LIB.getDataDic("smoc_pass_opinion_result", data.attr5);
                            }else{
                                return LIB.getDataDic("smoc_pass_opinion_result", data.result);
                            }
                        }
                    },
                    {
                        title: "评估意见内容",
                        fieldName: "opinion",
                    }],
                defaultFilterValue: { 'criteria.intsValue': { type: [2] } }
            }),
            //验收
            ssjlModel: LIB.Opts.extendDetailTableOpt({
                // url : "testequipment/checkbases/list/{curPage}/{pageSize}",
                columns: [
                    // LIB.tableMgr.ksColumn.code,

                    {
                        title: "风险项",
                        fieldName: "mocRiskItem",
                        width: 400
                    },

                    {
                        title: "控制措施",
                        fieldName: "mocRiskHandle",
                    },

                    {
                        title: "落实情况",
                        fieldName: "pgyj",
                    },
                    {
                        title: "落实人",
                        fieldName: "pgyj",
                        width: 100
                    },

                ]
            }),

            //培训
            pxjlModel: LIB.Opts.extendDetailTableOpt({
                // url : "testequipment/checkbases/list/{curPage}/{pageSize}",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "姓名",
                        fieldName: "pgbm",
                    },
                    {
                        title: "所属部门",
                        fieldName: "pgyj",
                    },
                    {
                        title: "培训日期",
                        fieldName: "pgyj",
                    },
                    {
                        title: "培训结果",
                        fieldName: "pgyj",
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }]
            }),
            //审批
            spyjModel: LIB.Opts.extendDetailTableOpt({
                url: "changemanagement/passopinions/list/1/2000",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "审批人",
                        fieldName: "handler.name",
                        width: 100
                    },
                    _.extend(_.clone(LIB.tableMgr.column.modifyDate), { title: '审批时间', filterType: null }),
                    {
                        //结果 0:未辨识,1:通过,2:不通过
                        title: "审批结果",
                        fieldName: "result",

                        render: function (data) {
                            if (data.attr5) {
                                return LIB.getDataDic("smoc_pass_opinion_result", data.attr5);
                            }else{
                                return LIB.getDataDic("smoc_pass_opinion_result", data.result);
                            }
                        }
                    },
                    {
                        //意见
                        title: "审批意见",
                        fieldName: "opinion",

                    }

                ],
                defaultFilterValue: { 'criteria.intsValue': { type: [1] } }
            }),
            //验收
            ysyjModel: LIB.Opts.extendDetailTableOpt({
                // url : "testequipment/checkbases/list/{curPage}/{pageSize}",
                columns: [
                    // LIB.tableMgr.ksColumn.code,
                    {
                        title: "验收人",
                        fieldName: "spr",
                        width: 100
                    },
                    {
                        title: "验收时间",
                        fieldName: "spsj",
                        width: 100
                    },
                    {
                        title: "验收结果",
                        fieldName: "pgyj",
                        width: 100
                    },
                    {
                        title: "验收意见",
                        fieldName: "pgyj",
                    }
                ]
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
        //无需附件上传请删除此段代码
        fileModel: {
            file: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'SMOC1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'SMOC'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                    },
                },
                data: []
            },
            pic: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'SMOC2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'SMOC'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{ title: "files", extensions: "png,jpg,jpeg" }]
                    }
                },
                data: []
            },
            video: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'SMOC3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                        fileType: 'SMOC'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                    },
                    filters: {
                        max_file_size: '50mb',
                        mime_types: [{ title: "files", extensions: "mp4,avi,flv,3gp" }]
                    }
                },
                data: []
            }
        },
        userType: 1,
        user: [],
        add: {
            visible: false,
            name: null,
            id: null,
            opType: 'create',
            rules: {
                "name": LIB.formRuleMgr.require("分组名"),
            }
        },
        groupUser: {
            visible: false,
            name: null,
            id: null,
            user: {},
            rules: {
                "user.id": LIB.formRuleMgr.require("落实人"),
            }
        },
        opinionModel: {
            name: null,
            measure:null,
            visible: false,
            detail: null,
            id: null,
            wrongPictures: [],
            rightPictures: [],
            rules: {
                'detail': [LIB.formRuleMgr.length(1000), LIB.formRuleMgr.require("实施情况")]
            }
        },
        addGroup: {
            visible: false,
        },
        cardModel: {

            showContent: true

        },
        isPG: false,
        rightPicModel: {
            params: {
                recordId: null,
                dataType: 'MOC1',
                fileType: 'MOC'
            },
            events: {
                onSuccessUpload: uploadEvents.rightPic
            }
        },
        //视频配置
        wrongPicModel: {
            params: {
                recordId: null,
                dataType: 'MOC2',
                fileType: 'MOC'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "video", extensions: "mp4" }]
            },
            events: {
                onSuccessUpload: uploadEvents.wrongPic
            }
        },
        groups1: [],
        groups2: [],
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picModel: {
            title: "图片显示",
            show: false,
            file: null
        },
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
            'userSelectModal': userSelectModal,
            'multiInputSelect': multiInputSelect,
            'addGroup': addGroup
        },
        data: function () {
            return dataModel;
        },
        computed: {
            isShowsubmit: function () {
                var _this = this;
                var isShow = false;
                if(_this.groups2.length>0){
                    _.each(_this.groups2, function (items) {
                        if(items.riskItems && items.riskItems.length){
                            isShow = true;
                        }
                    })
                }
                return isShow
            },
            users: function () {
                var str = ''
                _.each(this.user, function (item) {
                    str += item.name + ','
                })
                return str.substring(0, str.length - 1)
            },
        },
        methods: {
            doSubmit: function () {
                var _this = this;
                var err =false
                _.each(_this.groups2, function (items) {
                _.each(items.riskItems,function(data){
                    if (data.status!='1') {
                        err=true
                    }
                }) 
                       
                    
                })
                    if (err) {
                        LIB.Msg.info("请完成落实");
                        return
                    }
                api.doSubmit({id: this.mainModel.vo.id}).then(function (res) {
                    LIB.Msg.info("提交成功");
                    _this.$dispatch("ev_dtcreate");
                            _this.doClose()
                    // _this.afterInitData();
                });
                // this.doSave();
            },
            convertPath:LIB.convertPath,
            rightPic: function (data) {
                LIB.Msg.info("上传成功");
                dataModel.opinionModel.rightPictures.push(LIB.convertFileData(data.rs.content));
            },
            //视频
            wrongPic: function (data) {
                dataModel.opinionModel.wrongPictures.push(LIB.convertFileData(data.rs.content));
                LIB.Msg.info("上传成功");

            },
            doCancelOpinionModele:function(){
                this.opinionModel.visible=false
                
                var data =  _.map(this.opinionModel.wrongPictures,function(item){
                return item.fileId
              })  
              var data1 =  _.map(this.opinionModel.rightPictures,function(item){
                return item.fileId
              }) 
              api.deleteFile(null, data1.concat(data))
            },
            doDeleteFile: function (fileId, index, array) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        api.deleteFile(null, [fileId]).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            } else {
                                array.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        })
                    }
                });
            },
            doPic: function (file) {
                this.picModel.show = true;
                this.picModel.file = file;
            },
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            // dopass: function () {
            //     var _this = this
            //     api.update(null, { id: this.mainModel.vo.id, status: 4 }).then(function () {
            //         LIB.Msg.success('提交培训成功')
            //         _this.$dispatch("ev_dtcreate");
            //         _this.doClose()
            //     })
            // },
            convertPicPath: LIB.convertImagePath,
            doOpinion: function (data) {
                this.opinionModel.name = data.name;
                this.opinionModel.measure = data.measure;

                this.opinionModel.visible = true;
                this.opinionModel.detail = null;
                this.opinionModel.id = data.id;
                this.opinionModel.wrongPictures = [];
                this.opinionModel.rightPictures = [];
                this.rightPicModel.params.recordId = data.id;
                this.wrongPicModel.params.recordId = data.id;
                if (data.status == 1) {
                    this.opinionModel.detail = data.detail
                    var _vo = this.opinionModel
                    api.listFile({ recordId: data.id }).then(function (res) {
                        _vo.rightPictures = [];
                        _vo.wrongPictures = [];
                        var fileData = res.data;
                        //初始化图片数据
                        _.each(fileData, function (pic) {
                            if (pic.dataType === "MOC1") {//MOC1隐患图片
                                _vo.rightPictures.push(LIB.convertFileData(pic));
                            } else if (pic.dataType === "MOC2") {//MOC2隐患视频
                                _vo.wrongPictures.push(LIB.convertFileData(pic));
                            }
                        });
                    });
                }

                this.$refs.opinionform.resetFields()
            },
            newVO: newVO,
            doRemoveGroup: function (group, index) {
                var _this = this;

                LIB.Modal.confirm({
                    title: '删除当前分组?',
                    onOk: function () {
                        api.removeRiskItemGroups({ id: _this.mainModel.vo.id }, [{ id: group.id }]).then(function () {
                            LIB.Msg.info('删除成功')
                            api.queryRiskItemGroups({ id: _this.mainModel.vo.id }).then(function (res) {
                                _this.groups1 = res.data
                            })
                        });
                    }
                });

            },
            doTableCellClick: function (data) {
                var target = data.event.target
                var _this = this
                if (target && target.classList.contains("record-cell-text")) {
                    _this.doOpinion(data.entry.data)
                }
                if (target && target.classList.contains("record-cell-text")) {
                    _this.doOpinion(data.entry.data)
                }
            },
            doRemoveCheckBasis: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        if (data.attr1 != 1) {
                            return LIB.Msg.info('初始申请数据无法编辑')
                        }
                        api.removeRiskItems(null, { id: data.id }).then(function () {
                            LIB.Msg.info('删除成功')
                            api.queryRiskItemGroups({'criteria.strValue':JSON.stringify({handlerId:LIB.user.id}) , id: _this.mainModel.vo.id, 'criteria.strValue.handlerId': LIB.user.id, 'criteria.strsValue': JSON.stringify({ 'result': ['1'] }) }).then(function (res) {
                                _this.groups2 = res.data
                            })
                        });
                    }
                });
            },
            doMove: function (offset, group, index) {

            },
            doRemovepgyj: function (item) {
                if (this.mainModel.vo.status == 1) {
                    return LIB.Msg.info('评估阶段无法删除评估人员')
                }
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removePassOpinions({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
                            LIB.Msg.info('删除成功')
                            _this.$refs.pgyj.doQuery({ id: _this.mainModel.vo.id })
                        });
                    }
                });
            },
            doRemovespyj: function (item) {

                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removePassOpinions({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
                            LIB.Msg.info('删除成功')
                            _this.$refs.spyj.doQuery({ id: _this.mainModel.vo.id })
                        });
                    }
                });
            },
            doShowGroupFormModal4Update: function (group, index) {
                this.add.visible = true
                this.add.name = group.name
                this.add.id = group.id
                this.add.opType = 'update'
                this.$refs.addform.resetFields()

            },
            doSelectGroupUser: function (group, index) {
                this.groupUser.visible = true
                this.groupUser.name = group.name
                this.groupUser.id = group.id
                this.groupUser.list = group.riskItems || []
                this.$refs.userform.resetFields()
                this.groupUser.user = { id: null, name: null }
            },
            doShowItemFormModal4Create: function (group, index) {
                this.$broadcast("doCeateGroup", group)

            },
            doEidtGroup: function (group) {
                this.$broadcast("doUpdateGroup", group.entry.data)
            },
            doShowCheckBasisSelectModal: function () {
                this.add.visible = true
                this.add.name = null
                this.add.id = null
                this.add.opType = 'create'
                this.$refs.addform.resetFields()
            },
            doSaveItem: function (data, title) {
                var _this = this
                if (title == '新增') {
                    api.saveRiskItem({ id: data.groupId }, data).then(function (res) {
                        LIB.Msg.info('新增成功')
                        api.queryRiskItemGroups({'criteria.strValue':JSON.stringify({handlerId:LIB.user.id}) , id: _this.mainModel.vo.id, 'criteria.strValue.handlerId': LIB.user.id, 'criteria.strsValue': JSON.stringify({ 'result': ['1'] }) }).then(function (res) {
                            _this.groups2 = res.data
                        })
                    })
                } else {
                    if (data.attr1 != 1) {
                        return LIB.Msg.info('初始申请数据无法编辑')
                    }
                    api.updateRiskItem(null, data).then(function (res) {
                        LIB.Msg.success('修改成功')
                        api.queryRiskItemGroups({'criteria.strValue':JSON.stringify({handlerId:LIB.user.id}) , id: _this.mainModel.vo.id, 'criteria.strValue.handlerId': LIB.user.id, 'criteria.strsValue': JSON.stringify({ 'result': ['1'] }) }).then(function (res) {
                            _this.groups2 = res.data
                        })
                    })
                }
            },
            doSaveGroupUser: function () {

                var _this = this
                this.$refs.userform.validate(function (val) {
                    if (val) {
                        _.each(_this.groupUser.list, function (item) {
                            if (item.result != 2) {
                                item.handler = { id: _this.groupUser.user.id, name: _this.groupUser.user.name }
                            } else {
                                item.handler = { id: '' }
                            }

                        })
                        api.updateGroup({}, { id: _this.groupUser.id, riskItems: _this.groupUser.list }).then(function () {
                            LIB.Msg.success('配置成功')
                            _this.groupUser.visible = false
                            api.queryRiskItemGroups({ id: _this.mainModel.vo.id }).then(function (res) {
                                _this.groups1 = res.data
                            })
                        })
                    }
                })
            },
            doAddGroupName: function () {
                var _this = this
                this.$refs.addform.validate(function (val) {
                    if (val) {
                        if (_this.add.opType == 'create') {
                            api.saveRiskItemGroup({ id: _this.mainModel.vo.id }, { name: _this.add.name }).then(function (res) {
                                _this.add.visible = false
                                LIB.Msg.info('新增成功')
                                api.queryRiskItemGroups({ id: _this.mainModel.vo.id }).then(function (res) {
                                    _this.groups1 = res.data
                                })
                            })
                        } else {
                            api.updateRiskItemGroup({ id: _this.mainModel.vo.id }, { id: _this.add.id, name: _this.add.name }).then(function (res) {
                                _this.add.visible = false
                                LIB.Msg.success('修改成功')
                                api.queryRiskItemGroups({ id: _this.mainModel.vo.id }).then(function (res) {
                                    _this.groups1 = res.data
                                })
                            })
                        }

                    }
                })
            },
            changeTab: function (tabEle) {
                this.mainModel.activeTabName = tabEle.key;
            },
            doSaveUsers: function (data) {
                var _this = this
                if (this.userType == 1) {
                    this.mainModel.vo.applicant = data[0]
                } else if (this.userType == 2) {
                    this.mainModel.vo.approvers = data
                } else if (this.userType == 3) {
                    _.extend(this.groupUser.user, data[0])
                } else if (this.userType == 4) {
                    this.mainModel.vo.assessors = data
                    // var arr = []
                    // _.each(data, function (item) {

                    //     arr.push({ handler: item, result: 0, type: 2 })
                    // })

                    // api.saveOpinions({}, { id: this.mainModel.vo.id, passOpinions: arr }).then(function (res) {
                    //     LIB.Msg.info('新增成功')
                    //     _this.$refs.pgyj.doQuery({ id: _this.mainModel.vo.id })
                    // })

                } else if (this.userType == 5) {
                    this.mainModel.vo.acceptors = data
                    // var arr = []
                    // _.each(data, function (item) {

                    //     arr.push({ handler: item, result: 0, type: 1 })
                    // })
                    // api.saveOpinions({}, { id: this.mainModel.vo.id, passOpinions: arr }).then(function (res) {
                    //     LIB.Msg.info('新增成功')
                    //     _this.$refs.spyj.doQuery({ id: _this.mainModel.vo.id })
                    // })

                }
            },
            doSaveOpinionModel: function () {
                var _this = this
                this.$refs.opinionform.validate(function (val) {
                    if (val) {
                        api.updateRiskItem(null, { id: _this.opinionModel.id, detail: _this.opinionModel.detail, status: 1 }).then(function (res) {
                            _this.opinionModel.visible = false
                            if (res.data == 'pass') {
                                LIB.Msg.success('全部落实成功,数据流转至变更培训')
                                _this.$dispatch("ev_dtCreate");
                                _this.doClose()
                            } else {
                                LIB.Msg.success('落实成功')
                                api.queryRiskItemGroups({'criteria.strValue':JSON.stringify({handlerId:LIB.user.id}) , id: _this.mainModel.vo.id, 'criteria.strValue.handlerId': LIB.user.id, 'criteria.strsValue': JSON.stringify({ 'result': ['1'] }) }).then(function (res) {
                                    _this.groups2 = res.data
                                })
                            }
                        })
                    }
                })
            },
            doSelectUser: function (val) {
                this.userType = val

                this.selectModel.userSelectModel.visible = true
            },
            afterInit: function () {
                if (this.mainModel.opType == 'create') {
                    this.mainModel.vo.applicant = LIB.user
                }
            },
            doLoadTableData: function (data) {
                var arr = _.filter(data, function (item) {
                    return item.handler.id == LIB.user.id
                })
                if (arr.length > 0) {
                    if (arr[0].result != 0) {
                        this.isPG = false
                    } else {
                        this.isPG = true
                    }

                } else {
                    this.isPG = false
                }
            },
            afterDoSave: function () {
                var _this = this
                if (this.mainModel.opType == 'create') {
                    api.queryRiskItemGroups({ id: this.mainModel.vo.id }).then(function (res) {

                        _this.groups1 = res.data
                        // _.each(  _this.groups1,function(item){
                        //     _this.mainModel.vo.smocTemplates.push({ id:item.id,name:item.name})
                        // })
                    })
                    _this.$refs.pgyj.doQuery({ id: this.mainModel.vo.id })
                    _this.$refs.spyj.doQuery({ id: this.mainModel.vo.id })
                }

            },
            afterInitData: function () {
                var _this = this

                api.queryRiskItemGroups({ id: this.mainModel.vo.id }).then(function (res) {
                    _this.groups1 = res.data
                })
                api.queryRiskItemGroups({ id: this.mainModel.vo.id, 'criteria.strValue':JSON.stringify({handlerId:LIB.user.id}) , 'criteria.strsValue': JSON.stringify({ 'result': ['1'] }) }).then(function (res) {
                    _this.groups2 = res.data;
                })
                _this.$refs.pgyj.doQuery({ id: this.mainModel.vo.id })
                _this.$refs.spyj.doQuery({ id: this.mainModel.vo.id })
            }
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});