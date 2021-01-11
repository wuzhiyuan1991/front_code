define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
	var certTypeSelectModal = require("../userCert/dialog/certTypeSelectModal");
	var certRetrialFormModal = require("./dialog/certRetrialFormModal");

	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//证书状态 0:无证,1:有效,2:失效
			status : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属公司id
			compId : null,
			recheckData:null,
			//所属部门id
			orgId : null,
			//发证机构
			certifyingAuthority : null,
			//生效日期
			effectiveDate : null,
			//失效日期
			expiryDate : null,
			//证件编号
			idNumber : null,
			//是否需要复审 0:不要,1:需要
			isRecheckRequired : '0',
			//领证日期
			issueDate : null,
			//作业类别
			jobClass : null,
			//操作项目
			jobContent : null,
			//提前提醒复审的月数
			noticeMonthsInAdvance : null,
			//复审周期（月）
			retrialCycle : null,
			//备注
			remark:null,
			possessorType:2,
			//负责人
			principals:[],
			//证书类型
			certType : {id:'', name:''},
            certTypeId: null,
			//证书复审记录
			certRetrials : [],
			//证书文件
			cloudFiles : [],
			//证书复审被提醒人
			users : [],
            address:null
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
				// "status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("证书状态")),
				// "compId" : [LIB.formRuleMgr.require("所属公司")],
				// "orgId" : [LIB.formRuleMgr.length(10)],
				"isRecheckRequired" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"noticeMonthsInAdvance" :[ LIB.formRuleMgr.range(0, 100), {
					validator: function (rule, val, callback) {
						
						var vo = dataModel.mainModel.vo;

						if (parseInt(vo.noticeMonthsInAdvance)> parseInt(vo.retrialCycle)) {
							callback(new Error("复审提前提醒时间应小于复审周期"))
						} else {
							callback()
						}

					}
				}],
				"retrialCycle" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"orgId" : [LIB.formRuleMgr.require("持有机构")],
				"certType.id" : [LIB.formRuleMgr.require("证书类型")],
                "idNumber" : [LIB.formRuleMgr.length(100)],
                "jobClass" : [LIB.formRuleMgr.length(100)],
                "jobContent" : [LIB.formRuleMgr.length(100)],
                "issueDate" : [LIB.formRuleMgr.require("领证日期")],
                "effectiveDate" : [LIB.formRuleMgr.require("生效日期")],
                "expiryDate" : [LIB.formRuleMgr.require("生效日期")],
                "certifyingAuthority" : [LIB.formRuleMgr.length(100)],
				"remark" : [LIB.formRuleMgr.length(200)],
            }
		},
		tableModel : {
			certRetrialTableModel : LIB.Opts.extendDetailTableOpt({
				url : 'cert/certretrials/list/{curPage}/{pageSize}',
				columns : [
					{
						title: "证书复审时间",
						render: function (data) {
							return data.retrialDate ? data.retrialDate.substr(0, 10) : "";
                        }
					},
					{
						title: "上传人",
						fieldName: "uploader.name"
					},
					{
						title: "证书记录上传时间",
						fieldName: "uploadDate"
					},
					{
						title: "复审结果",
						render: function (data) {
                            return LIB.getDataDic("itm_cert_retrial_result", data.result);
                        }
					},
					{
						title: "证件文件",
						render: function (data) {
							if(data.cloudFiles && data.cloudFiles.length > 0) {
								return '<a href="javascript:;" data-action="VIEWFILE">查看</a>'
							}else{
								return "无";
							}
                        }
					},
					{
						title : "",
						fieldType : "tool",
						toolType : "edit,del"
					}
				],
				defaultFilterValue: {"criteria.intsValue": {result: [1, 2]}}
			})
		},
		formModel : {
			certRetrialFormModel : {
				show : false,
				hiddenFields : ["certId"],
				queryUrl : "cert/{id}/certretrial/{certRetrialId}"
			},
		},
		cardModel : {
			certRetrialCardModel : {
				showContent : true
			},
			cloudFileCardModel : {
				showContent : true
			}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
                visible2: false,
				filterData : {orgId : null},
                userSelectType: 1
			},
			principalSelectModel : {
				visible : false,
				filterData : {orgId : null},
			},
			courseSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			certTypeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			}
		},

        uploadModel: {
            params: {
                recordId: null,
                dataType: 'O1',
                fileType: 'O'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "png,jpg,jpeg,gif" }]
            }
        },
        images: null
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
			"userSelectModal":userSelectModal,
			"courseSelectModal":courseSelectModal,
			"certtypeSelectModal":certTypeSelectModal,
			"certretrialFormModal":certRetrialFormModal,

        },
		data:function(){
			return dataModel;
		},
		watch: {
			"mainModel.vo.issueDate": function (nVal) {
				if (!this.mainModel.isReadOnly && nVal && !this.mainModel.vo.effectiveDate) {
                    this.mainModel.vo.effectiveDate = nVal;
				}
            }
		},
		computed: {
            checkRequiredList: function () {
				return this.getDataDicList('itm_cert_is_recheck_required');
            },
			displayIssueDate: function () {
				return this.mainModel.vo.issueDate ? this.mainModel.vo.issueDate.substr(0, 10) : "";
            },
            displayExpiryDate: function () {
                return this.mainModel.vo.expiryDate ? this.mainModel.vo.expiryDate.substr(0, 10) : "";
            },
            displayEffectiveDate: function () {
                return this.mainModel.vo.effectiveDate ? this.mainModel.vo.effectiveDate.substr(0, 10) : "";
            },
            showCertretrialCard: function () {
				return this.mainModel.vo.isRecheckRequired === '1' || this.mainModel.opType === 'create';
            },
			validText: function () {
				return LIB.getDataDic("itm_cert_status", this.mainModel.vo.status);
            },
			validClassNames: function () {
				return [this.mainModel.vo.status === '2' ? 'status-rect-tag-red' : 'status-rect-tag-green'];
            }
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function(type) {
				if (type === 2) {
                    this.selectModel.userSelectModel.visible = true;
                } else {
                    this.selectModel.userSelectModel.visible2 = true;
                }
				this.selectModel.userSelectModel.userSelectType = type;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
            doSaveUsers : function(selectedDatas) {
				var type = this.selectModel.userSelectModel.userSelectType;
				var rows = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name,
						compId: row.compId,
						orgId: row.orgId
                    }
                });
				if (type === 2) {
                    this.mainModel.vo.user = rows[0];
                    this.mainModel.vo.compId = rows[0].compId;
                    this.mainModel.vo.orgId = rows[0].orgId;
                } else if (type === 3) {
                    this.mainModel.vo.users = rows;
                }
            },

			doShowPrincipalSelectModal : function() {
				this.selectModel.principalSelectModel.visible = true;
				//this.selectModel.principalSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePrincipals : function(selectedDatas) {
				var rows = _.map(selectedDatas, function (row) {
					return {
						id: row.id,
						name: row.name,
					}
				});
				this.mainModel.vo.principals = rows;
			},

			doShowCourseSelectModal : function() {
				this.selectModel.courseSelectModel.visible = true;
				this.selectModel.courseSelectModel.filterData = {disable: 0};
			},
			doSaveCourse : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.course = selectedDatas[0];
				}
			},
			doShowCertTypeSelectModal : function() {
				this.selectModel.certTypeSelectModel.visible = true;
				//this.selectModel.certTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCertType : function(selectedDatas) {
				if (!_.isArray(selectedDatas) || _.isEmpty(selectedDatas)) {
					return;
				}
				var row = selectedDatas[0];
				this.mainModel.vo.certType = row;
				this.mainModel.vo.certTypeId = row.id;
			},


			doShowCertRetrialFormModal4Update : function(param) {
				this.formModel.certRetrialFormModel.show = true;
				this.$refs.certretrialFormModal.init("update", {id: this.mainModel.vo.id, certRetrialId: param.entry.data.id});
			},
			doShowCertRetrialFormModal4Create : function(param) {
				var _this = this;
				api.queryNextRecord({id: this.mainModel.vo.id}).then(function (res) {
					if(res.data) {
						_this.formModel.certRetrialFormModel.show = true;
						_this.$refs.certretrialFormModal.init("create");
					}else{
						LIB.Msg.warning("无需更多复审");
					}
				})


			},
			// doSaveCertRetrial : function(data) {
			// 	if (data) {
			// 		var _this = this;
			// 		api.saveCertRetrial({id : this.mainModel.vo.id}, data).then(function() {
			// 			_this.refreshTableData(_this.$refs.certretrialTable);
			// 		});
			// 	}
			// },
			doUpdateCertRetrial : function(data) {
				if (data) {
					if (!_.endsWith(data.retrialDate, "00:00:00")) {
                        data.retrialDate = data.retrialDate + " 00:00:00";
					}
					var _this = this;
					api.updateCertRetrial({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.certretrialTable);

                        // 修改复审记录后，证书有效性可能会改变，需要刷新主列表
                        _this.$dispatch("ev_dtUpdate");
						_this.$refs.certretrialTable.doRefresh();
					});
				}
			},
			doRemoveCertRetrials : function(item) {
				var _this = this;
				var data = item.entry.data;
                LIB.Modal.confirm({
                    title: "确认删除数据",
                    onOk: function() {
                        api.removeCertRetrials({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                            _this.$refs.certretrialTable.doRefresh();
                        });
                    }
                });

			},

            changeCheckedRequired: function () {
				var vo = this.mainModel.vo;
				vo.users = [];
				vo.retrialCycle = '';
				vo.noticeMonthsInAdvance = '';
            },
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.cloudFiles.push(con);
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
							_this.mainModel.vo.cloudFiles.splice(index, 1);
                        })
                    }
                });
            },
            doViewImages: function (index, files) {
				var images = files || this.mainModel.vo.cloudFiles;
				this.images = _.map(images, function (content) {
					return LIB.convertFileData(content);
				});
				var _this = this;
				setTimeout(function () {
					_this.$refs.imageViewer.view(index);
				}, 100);
            },

            clickedTableRow: function (data) {
                var el = data.event.target;
                var _this = this;
                var action = _.get(el, "dataset.action");
				if (action === 'VIEWFILE') {
					api.listFile({recordId: data.entry.data.id}).then(function (res) {
						_this.doViewImages(0, res.data);
                    })
                }
            },

            buildSaveData: function () {
				var param = _.cloneDeep(this.mainModel.vo);
				if (!_.endsWith(param.effectiveDate, "00:00:00")) {
                    param.effectiveDate = param.effectiveDate + " 00:00:00";
				}
                if (!_.endsWith(param.expiryDate, "00:00:00")) {
                    param.expiryDate = param.expiryDate + " 00:00:00";
                }
                if (!_.endsWith(param.issueDate, "00:00:00")) {
                    param.issueDate = param.issueDate + " 00:00:00";
                }
                return param;
            },
            doSave: function() {

                if(this.mainModel.action === "copy") {
                    this.doSave4Copy();
                    return;
                }

                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                var _data = this.mainModel;

                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
                        if (_data.opType === 'create') {
                            _this.$api.create(_vo).then(function(res) {
                                //清空数据
                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;
                                _this.afterDoSave({ type: "C" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtCreate");
                                _this.storeBeforeEditVo();
                            });
                        } else {
                            _vo = _this._checkEmptyValue(_vo);
                            _this.$api.update(_vo).then(function(res) {
                                LIB.Msg.info("保存成功");
                                _this.afterDoSave({ type: "U" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtUpdate");
                                _this.storeBeforeEditVo();
                            });
                        }
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
			afterDoSave: function () {
				this.initData({id: this.mainModel.vo.id});
            },
            setValueAfterGetData: function (data) {
				this.mainModel.vo.status = data.status;
            },
			afterInitData : function() {
				this.$refs.certretrialTable.doQuery({id : this.mainModel.vo.id});
                this.uploadModel.params.recordId = this.mainModel.vo.id;
            },
			beforeInit : function() {
				this.$refs.certretrialTable.doClearData();
			},
			afterInit: function () {
				var _this = this;
				if (this.mainModel.opType === 'create') {
					api.getUUID().then(function (res) {
						_this.mainModel.vo.id = res.data;
                        _this.uploadModel.params.recordId = res.data;
                    })
				}
            }

		},
		events : {
			"ev_retrialRefresh": function () {
				this.$refs.certretrialTable.doRefresh();
			}
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});