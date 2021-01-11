define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var emerPlanVersionFormModal = require("componentsEx/formModal/emerPlanVersionFormModal");
	var backNode = require("./dialog/backNode");
    var historyList = require("./dialog/historyList");


    LIB.registerDataDic("iem_emer_plan_pass", [
        ["1","未通过"],
        ["2","通过"],
    ]);

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//预案名称
			name : null,
			//评审状态 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施,10:已发布
			status : "1",
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
			type : null,
			//版本号
			verNo : null,
			//是否为初始版本 0:否,1:是
			isInitial : null,
			//修订频率
			reviseFrequence : null,
			//备注
			remark : null,
			//全部版本
			emerPlanVersions : [],
			// 最后的版本号
            lastVersionId:null,
            //修订类型 1:定期修订,2:不定期修订
            reviseType : null,
            result:null, // 结果  1.未通过 2.通过
            participant: null, // 参与人员
            rollbackStep:null,
            operateTime:null,  //操作时间
        	fileList:[],
			step:'',
            reviseReason:null, // //修订理由(枚举值用英文逗号拼接）
            orgId : LIB.user.compId,  // 部门
            compId : LIB.user.compId, // 公司
            attr5:null, // 方案
		}
	};
    var emerPlanHistory = function () {
		return {
            id : null,
            //编码
            code : null,
            //预案名称
            name : null,
            //步骤 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施
            step : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //操作时间
            operateTime : (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            //参与人员
            participant : null,
            //备注描述
            remark : null,
            //处理结果 1:未通过,2:通过,3:回退
            result : 2,
            //修订频率
            reviseFrequence : '3',
            //修订理由(枚举值用英文逗号拼接）
            reviseReason : null,
            //修订类型 1:定期修订,2:不定期修订
            reviseType : null,
            //回退节点 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案
            rollbackStep : null,
            //预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
            type : null,
            //版本号
            verNo : null,
            //预案版本
            emerPlanVersion : null,
            user:{
                name:LIB.user.name,
                id:LIB.user.id
            },
            fileList:[],
            reviseReasonList:[],
            editDate:null
        };
    };

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
            emerPlanHistory:emerPlanHistory(),
			opType : 'view',
			isReadOnly : true,
			title:"预案信息",
            reviseReason:null,
            reviseReasonList:[],
            currentVersionId:null,
            currentVersionList:[],
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("预案名称"),
						  LIB.formRuleMgr.length(50)
				],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("评审状态")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("预案类型")),
				"verNo" : [LIB.formRuleMgr.require("版本号"),
						  LIB.formRuleMgr.length(20)
				],
				"isInitial" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否为初始版本")),
				"reviseFrequence" : [LIB.formRuleMgr.require("修订频率"),
                    {validator:function(rule, value, callback){
                        if( (!_.isNaN(value))  && value.toString().indexOf('.')==-1){
                            if(value >3 || value<=0){
                                return callback(new Error("请输入小于3大于0的整数"));
                            }
                            return callback();
                        }
                        return callback(new Error("请输入整数"));

                    }}
                ],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"remark" : [LIB.formRuleMgr.length(1000)],
				"participant":[LIB.formRuleMgr.length(500)],
				"result":[LIB.formRuleMgr.require("处理结果")],
				"rollbackStep":[],
				"operateTime":[],
				"user":[],
                "reviseReasonList":[ { required: true, type: "array", message: '请选择修订理由',min:1 }],
                "reviseType":[LIB.formRuleMgr.require("修订理由"),
                    LIB.formRuleMgr.length(20)]
	        },
			statusListOne:[
				{name:"方案编制", index:1},
                {name:"内部评审", index:2},
                {name:"外部审核", index:3},
                {name:"法人批准", index:4},
                {name:"政府备案", index:5},
                {name:"发布实施", index:6},
                {name:"结束", index:7},
			]
		},
		tableModel : {
			emerPlanVersionTableModel : LIB.Opts.extendDetailTableOpt({
				url : "emerplan/emerplanversions/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
		},
		formModel : {
			emerPlanVersionFormModel : {
				show : false,
				hiddenFields : ["emerPlanId"],
				queryUrl : "emerplan/{id}/emerplanversion/{emerPlanVersionId}"
			},
		},
		selectModel : {
		},
        // 文件参数
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'EM1',
                fileType: 'EM'
            },
            filters: {
                max_file_size: '20mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
            },
            // url: "/riskjudgmentunit/importExcel",
        },
		dialogModel: {
			backNode:{
				visible:false
			},
            historyList:{
				visible:false,
				list:[]
			}
		}

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
			"emerplanversionFormModal":emerPlanVersionFormModal,
			"backNode":backNode,
			"historyList":historyList
        },
        props:{
            isLeft:{
                type:Boolean,
                default:true
            },
            isCheckKind:{
                type: Boolean,
                default: false
            },
            selectData:{
                type:Array,
                default:null
            }
        },
        watch:{
            "mainModel.emerPlanHistory.reviseFrequence":function (val) {
                this.mainModel.vo.reviseFrequence = val;
            }
        },
		computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.mainModel.vo.type) === 3){
					for(var index=0; index<arr.length; index++){
                        if(index !== 3 && index!==4 && index < parseInt(_this.mainModel.vo.status-1)){
                            list.push(arr[index]);
                        }
					}
                }else{
                    for(var index=0; index<arr.length; index++){
                        if(index < parseInt(_this.mainModel.vo.status-1)){
                            list.push(arr[index]);
                        }
                    }
                }
                return list;
            },
            getItemList:function () {
                if( this.mainModel.vo.type == '3'){
                    return [
                        {name:"方案编制", index:1 , num:1},
                        {name:"内部评审", index:2, num:2},
                        {name:"外部审核", index:3, num:3},
                        // {name:"法人批准", index:4},
                        // {name:"政府备案", index:5},
                        {name:"发布实施", index:6, num:4},
                        {name:"结束", index:7, num:5},
                    ]
                }else{
                    return [
                        {name:"方案编制", index:1, num:1},
                        {name:"内部评审", index:2, num:2},
                        {name:"外部审核", index:3, num:3},
                        {name:"法人批准", index:4, num:4},
                        {name:"政府备案", index:5, num:5},
                        {name:"发布实施", index:6, num:6},
                        {name:"结束", index:7,num:7},
                    ]
                }
            },
            getLabel:function (val) {
                if(this.mainModel.vo.status == 6){
                    return  "签发人"
                }else{
                    return "参与人员"
                }
            }
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            // 取消修订
            cancelRevise:function () {
			    var _this = this;
                LIB.Modal.confirm({
                    title: "是否取消修订？",
                    onOk: function () {
                        var param = {
                            id:_this.mainModel.vo.id,
                            orgId:LIB.user.orgId,
                            compId:LIB.user.compId,
                            // emerPlanVersion : {
                            //     id:_this.mainModel.vo.lastVersionId
                            // }

                        };

                        api.cancelRevise(param).then(function() {
                            _this.changeView("view");
                            _this.$dispatch("ev_dtCreate");
                            _this.storeBeforeEditVo();
                            _this.mainModel.emerPlanHistory = emerPlanHistory();
                            _this.init("update", _this.mainModel.vo.id);

                            _this.mainModel.emerPlanHistory = emerPlanHistory();
                        });
                    }
                });
            },

            doFileTypeChange:function (val) {
                  this.mainModel.vo.type = val;
            },
            getOperateTime:function (val) {
                var str  = (val + "").substr(0, 16);
                return str;
            },
            changeCheckBox:function (val) {
                var index = this.mainModel.reviseReason.indexOf(val);
				if(index>-1){
                    this.mainModel.reviseReason.splice(index,1);
				}else{
                    this.mainModel.reviseReason.push(val);
				}
				this.mainModel.emerPlanHistory.reviseReason = this.mainModel.reviseReason.join(",");
            },
            getStyle:function (item) {
				if(item.index <= parseInt(this.mainModel.vo.status)){
					return 'background:#33a6ff;'
				}
                return "background:#fff;color:#ddd;border: 1px solid #ddd;font-weight:400;"
            },
            /**
             *
             * @param gi groupIndex 6个为一组，组的序号，从0开始
             * @param item 每一个检查点
             * @return {Array}
             */
            calcClass: function (gi, item) {
                var splitLength = 6;

                var res = [];
                var _cls;

                // 1.长度为1时去掉线
                if (item.total === 1) {
                    res.push('line-zero');
                    return res;
                }
                // 2.第一个去掉左半边的线
                if (item.index === 1) {
                    res.push('half-right');
                    return res;
                }
                // 3.最后一项 根据行数判断去掉左半边还是右半边的线
                if (item.index === this.mainModel.statusListOne.length) {
                    // _cls = gi % 2 === 0 ? 'half-left' : 'half-right';
                    _cls = 'half-left'
                    res.push(_cls);
                    return res;
                }
                // 4. 其他不是行首或者行尾的
                if (item.index % splitLength !== 0) {
                    return res;
                }
                // 5. 其他事行首或者行尾的需要加转折线
                var results = {
                    "0": 'odd-end', // 奇数行最后一个
                    "1": "even-end" // 偶数行最后一个
                };
                var key = '' + (gi % 2);
                if (item.index < item.total) {
                    res.push(results[key]);
                }
                return res;
            },
            calcItemClass: function (item) {
                if(item.isBond) {
                    return ['sq'];
                }else{
                    return ['unbound','sq'];
                }
            },

			doShowEmerPlanVersionFormModal4Update : function(param) {
				this.formModel.emerPlanVersionFormModel.show = true;
				this.$refs.emerplanversionFormModal.init("update", {id: this.mainModel.vo.id, emerPlanVersionId: param.entry.data.id});
			},
			doShowEmerPlanVersionFormModal4Create : function(param) {
				this.formModel.emerPlanVersionFormModel.show = true;
				this.$refs.emerplanversionFormModal.init("create");
			},
			doSaveEmerPlanVersion : function(data) {
				if (data) {
					var _this = this;
					api.saveEmerPlanVersion({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emerplanversionTable);
					});
				}
			},
			doUpdateEmerPlanVersion : function(data) {
				if (data) {
					var _this = this;
					api.updateEmerPlanVersion({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.emerplanversionTable);
					});
				}
			},
			doRemoveEmerPlanVersion : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeEmerPlanVersions({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.emerplanversionTable.doRefresh();
						});
					}
				});
			},
            // 切换版本
            doOnSelect:function (val) {
                var _this = this;
                // 更改vo
                if((this.mainModel.currentVersionId && this.mainModel.currentVersionId != this.mainModel.vo.lastVersionId) || (this.mainModel.currentVersionId == this.mainModel.vo.lastVersionId && parseInt(this.mainModel.vo.status) > 6)){
                    var param={
                        'emerPlanVersion.id':_this.mainModel.currentVersionId
                    };
                    api.queryEmerPlanHistories(param).then(function (res) {
                        _.each(res.data, function (item) {
                            item.isShow = true;
                        });
                        _this.dialogModel.historyList.list = res.data;

                    })
                }
            },

            // 设置值
            doFileTypeChangeResult:function (val) {
                if(val == 1){
                    this.mainModel.emerPlanHistory.rollbackStep = this.getList[this.getList.length-1].id;
                }else{
                    this.mainModel.emerPlanHistory.rollbackStep = null;
                }
            },

			afterInitData : function() {
            	var _this = this;
            	if(this.mainModel.vo.lastVersionId){
                    this.mainModel.currentVersionId = this.mainModel.vo.lastVersionId;
                }else{
                    this.mainModel.currentVersionId = null;
                }
                this.mainModel.vo.currentVersionList = [];


            	// 赋值
                if( _this.mainModel.currentVersionId && _this.mainModel.vo.status == '1'){
                    //操作时间
                    this.mainModel.vo.operateTime =(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    this.mainModel.emerPlanHistory.editDate =(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    this.mainModel.vo.reviseReasonList = [];
                    this.mainModel.emerPlanHistory = _.cloneDeep(this.mainModel.vo);
                }
                this.mainModel.emerPlanHistory.result = '2';

                // this.$refs.emerplanversionTable.doQuery({id : this.mainModel.vo.id});
                if(this.mainModel.vo.id){
                    api.queryEmerPlanVersions({id : this.mainModel.vo.id}).then(function (res) {
                        _this.mainModel.currentVersionList = [];
                        _.each(res.data, function (item) {
                            _this.mainModel.currentVersionList.push({id:item.id, value:item.verNo})
                        })
                    });
                }

                if(this.mainModel.opType != "create"){
                    this.uploadModel.params.dataType = "EM" + this.mainModel.vo.status;
                	this.doEdit();
				}else {
                    this.uploadModel.params.dataType = "EM1"
                }

				if(this.mainModel.vo.status >6){
                	var param={
                        'emerPlanVersion.id':_this.mainModel.currentVersionId
					};
                	api.queryEmerPlanHistories(param).then(function (res) {
						_.each(res.data, function (item) {
							item.isShow = true;
                        });
						_this.dialogModel.historyList.list = res.data;
                    })
				}

			},
			beforeInit : function() {
				// this.$refs.emerplanversionTable.doClearData();
                this.mainModel.currentVersionId = null;
                this.mainModel.currentVersionList = [];
                this.mainModel.vo = newVO();
                this.mainModel.emerPlanHistory = emerPlanHistory();
                this.mainModel.opType = arguments[1].opType;
				this.mainModel.vo.operateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                this.mainModel.emerPlanHistory.editDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
			},

			// 修订
            doModify:function () {
                var _this = this;
                var param = {
                    id:this.mainModel.vo.id,
                    orgId:LIB.user.orgId,
                    compId:LIB.user.compId
                };
                LIB.Modal.confirm({
                    title: "确定修订？",
                    onOk: function() {
                        // _this.mainModel.vo.status = '1';
                        // _this.mainModel.vo.isInitial = '0';
                        api.submitRevise(null,param).then(function (res) {
                            // _this.mainModel.emerPlanHistory = emerPlanHistory();
                            // _this.mainModel.vo.status = 1;
                            // _this.mainModel.vo.isInitial = "0";
                            // _this.mainModel.vo.operateTime =(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                            // _this.mainModel.vo.currentVersionList = [];
                            // _this.mainModel.emerPlanHistory =  _.cloneDeep( _this.mainModel.vo);
                            // _this.init("update", _this.mainModel.vo.id);

                            _this.changeView("view");
                            _this.$dispatch("ev_dtCreate");
                            _this.storeBeforeEditVo();
                            _this.mainModel.emerPlanHistory = emerPlanHistory();
                            _this.init("update", _this.mainModel.vo.id);

                            _this.mainModel.emerPlanHistory = emerPlanHistory();
                            _this.doEdit();

                        })
                    }
                });
            },

			// 回退
            saveBackNode:function (obj) {
            	var _this = this;
                _this.mainModel.emerPlanHistory.effectiveDate = obj.effectiveDate;
                _this.mainModel.emerPlanHistory.remark = obj.remark;
                _this.mainModel.emerPlanHistory.rollbackStep = obj.rollbackStep;
                _this.mainModel.emerPlanHistory.result = '3';
                _this.mainModel.emerPlanHistory.orgId = LIB.user.orgId;
                _this.mainModel.emerPlanHistory.compId = LIB.user.compId;
                _this.mainModel.emerPlanHistory.fileList = obj.fileList;

                _this.doSaveEmerInfo();
            },

			// 提交
            doSaveEmerStatus:function () {
            	var _this = this;
            	// emerPlanHistory reviseReasonList
                this.$refs.ruleform.validate(function (valid) {
            		if(valid){
            		    if(!_this.isCheckKind){
                            _this.doSaveEmerInfo();
                        }else{
            		        _this.doSaveEmerInfoAll();
                        }
                    }
                });
                // _this.mainModel.vo.status = parseInt(_this.mainModel.vo.status) + 1;
            },

            // 批量提交
            doSaveEmerInfoAll:function () {
                var _this = this;
                if(_this.mainModel.emerPlanHistory.id == null){
                    _this.mainModel.emerPlanHistory.step = "1";
                    _this.mainModel.emerPlanHistory.operateTime =  (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    _this.mainModel.emerPlanHistory.editDate =  (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    _this.mainModel.emerPlanHistory.user = {
                        id:LIB.user.id,
                        name:LIB.user.name
                    }
                }
                if(_this.mainModel.emerPlanHistory.name){
                    _this.mainModel.vo.name = _this.mainModel.emerPlanHistory.name;
                }
                if(_this.mainModel.vo.name){
                    _this.mainModel.emerPlanHistory.name = _this.mainModel.vo.name;
                }

                if(_this.mainModel.vo.reviseFrequence){
                    _this.mainModel.emerPlanHistory.reviseFrequence = _this.mainModel.vo.reviseFrequence;
                }
                if(_this.mainModel.vo.id){
                    _this.mainModel.emerPlanHistory.emerPlanId = _this.mainModel.vo.id;
                }
                if(_this.mainModel.vo.status){
                    _this.mainModel.emerPlanHistory.step = _this.mainModel.vo.status;
                }
                if(_this.mainModel.vo.lastVersionId){
                    if(_this.mainModel.emerPlanHistory.step != '1'){
                        _this.mainModel.emerPlanHistory.emerPlanVersion = {
                            id:_this.mainModel.vo.lastVersionId,
                        }
                    } else{
                        _this.mainModel.emerPlanHistory.emerPlanVersion=null;
                    }
                };

                if(_this.mainModel.emerPlanHistory.reviseType=='2'){
                    _this.mainModel.emerPlanHistory.reviseReason = _this.mainModel.emerPlanHistory.reviseReasonList.join(",")
                };

                var params = [];
                if(_this.selectData){
                    _.each(_this.selectData, function (item) {
                        // _this.mainModel.emerPlanHistory
                        var men = _.cloneDeep(_this.mainModel.emerPlanHistory);
                        men.emerPlanId = item.id;
                        params.push(men)
                    });
                }

                api.createEmerPlanHistories(params).then(function (res) {

                });
            },

            doSaveEmerInfo:function () {
            	var _this = this;
                if(_this.mainModel.vo.id == null){
                    _this.mainModel.emerPlanHistory.step = "1";
                    _this.mainModel.emerPlanHistory.operateTime =  (new Date()).Format("yyyy-MM-dd hh:mm:ss")
                    _this.mainModel.emerPlanHistory.user = {
                        id:LIB.user.id,
                        name:LIB.user.name
                    }
                }
                // 过滤掉 id
                if( _this.mainModel.vo.attr2 == 0 || _this.mainModel.vo.id == null){
                    _this.mainModel.emerPlanHistory.id = null;
                }
                if(_this.mainModel.emerPlanHistory.name){
                    _this.mainModel.vo.name = _this.mainModel.emerPlanHistory.name;
                }
                if(_this.mainModel.vo.name){
                    _this.mainModel.emerPlanHistory.name = _this.mainModel.vo.name;
                }

                if(_this.mainModel.vo.reviseFrequence){
                    _this.mainModel.emerPlanHistory.reviseFrequence = _this.mainModel.vo.reviseFrequence;
                }

                if(_this.mainModel.vo.id){
                    _this.mainModel.emerPlanHistory.emerPlanId = _this.mainModel.vo.id;
                }
                if(_this.mainModel.vo.status){
                    _this.mainModel.emerPlanHistory.step = _this.mainModel.vo.status;
                    if(_this.mainModel.vo.status == 1){
                        _this.mainModel.vo.attr5 = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    }
                }
                if(_this.mainModel.vo.lastVersionId){
                    if(_this.mainModel.vo.attr2 != 0 && _this.mainModel.vo.id != null){
                        _this.mainModel.emerPlanHistory.emerPlanVersion = {
                            id:_this.mainModel.vo.lastVersionId,
                        }
                    } else{
                        _this.mainModel.emerPlanHistory.emerPlanVersion=null;
                    }
                };

                if(_this.mainModel.emerPlanHistory.reviseType=='2'){
                    _this.mainModel.emerPlanHistory.reviseReason = _this.mainModel.emerPlanHistory.reviseReasonList.join(",")
                };

                api.createEmerPlanHistory(_this.mainModel.emerPlanHistory).then(function (res) {

                    if(_this.mainModel.vo.id == null || _this.mainModel.vo.status == '1'){
                        // res.data.status = '2';
                        // res.data.step = '2';
                        // res.data.lastVersionId = res.data.emerPlanVersion.id;
                        // res.data.isInitial = '1';
                        _this.mainModel.currentVersionId = res.data.lastVersionId;

                        // _this.mainModel.vo = res.data;
                        _this.mainModel.vo.id = res.data.emerPlanId;

                        _this.changeView("view");
                        _this.$dispatch("ev_dtCreate");
                        _this.storeBeforeEditVo();
                        _this.mainModel.emerPlanHistory = emerPlanHistory();
                        _this.init("update", _this.mainModel.vo.id);
                        // _this.doEdit();
                        _this.uploadModel.params.dataType = "EM" + _this.mainModel.vo.status;
                    }else{
                        if(parseInt(_this.mainModel.emerPlanHistory.result) === 2){
                            if(_this.mainModel.vo.type == '3' && _this.mainModel.vo.status == '3'){
                                _this.mainModel.vo.status = 6;
                            }else{
                                _this.mainModel.vo.status = (parseInt(_this.mainModel.vo.status) +1) + '';
                            }
                        }else{
                            _this.mainModel.vo.status =  _this.mainModel.emerPlanHistory.rollbackStep;
                        }

                        if(_this.mainModel.vo.status > 6){
                        	_this.doShowHistortList(1);
						}

                        _this.changeView("view");
                        _this.$dispatch("ev_dtCreate");
                        _this.storeBeforeEditVo();
                        _this.mainModel.emerPlanHistory = emerPlanHistory();
                        _this.init("update", _this.mainModel.vo.id);

                        _this.mainModel.emerPlanHistory = emerPlanHistory();
                        _this.doEdit();
                    }
                })
            },

            doShowBacnNode:function () {
				this.dialogModel.backNode.visible = true;
				this.mainModel.vo.isInitial = '0';
				// this.mainModel.vo.status = 1;
            },

			// 历史详情
            doShowHistortList:function (val) {
				var _this = this;
                var param={
                    'emerPlanVersion.id':_this.mainModel.currentVersionId
                };
                api.queryEmerPlanHistories(param).then(function (res) {
                    _.each(res.data, function (item) {
                        item.isShow = false;
                    });
                    res.data[0].isShow = true;
                    _this.dialogModel.historyList.list = res.data;
                    if(val !=1){
                        _this.dialogModel.historyList.visible = true;
                    }
                })
            },


            // ------------------- 文件 ---------------------
            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id}).then(function (res) {
                    _this.mainModel.emerPlanHistory.fileList = res.data;
                })
            },
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.emerPlanHistory.fileList.push(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.emerPlanHistory.fileList.splice(index, 1);
                        })
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.emerPlanHistory.fileList;
                var file = files[index];
                // var _this = this;

                window.open(LIB.convertFilePath(LIB.convertFileData(file)));

                // 如果是图片
                // if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                //     images = _.filter(files, function (item) {
                //         return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                //     });
                //     this.images = _.map(images, function (content) {
                //         return {
                //             fileId: content.id,
                //             name: content.orginalName,
                //             fileExt: content.ext
                //         }
                //     });
                //     setTimeout(function () {
                //         _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                //         // _this.$refs.imageViewer.view(0)
                //     }, 100);
                // } else {
                //     window.open("/file/down/" + file.id)
                // }
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