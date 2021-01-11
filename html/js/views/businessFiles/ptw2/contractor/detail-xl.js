define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var contractorEmpFormModal = require("componentsEx/formModal/contractorEmpFormModal");
	var certRelFormModal = require("./dialog/edit");
	//初始化数据模型
	var newVO = function() {
		return {
			attr1: null,//所属部门，代替orgId，不做部门数据权限
            id : null,
			//编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//健康安全环保协议有效期
			agreementDeadline : null,
			//经营范围
			businessScope : null,
			//资质证书
			certificate : null,
			//证书期限
			cetDeadline : null,
			//企业类别
			compType : null,
			//法人代表
			corporation : null,
			//单位地址
			deptAddr : null,
			//单位名称
			deptName : null,
			//雇员人数
			empNum : null,
			//营业执照编号
			licenceNo : null,
			//联系人
			linkman : null,
			//手机
			mobilePhone : null,
			//服务资质
			qualification : null,
			qualifications : [],
			qualificationRel : [],
			//资质等级
			qualificationLevel : null,
			//注册资金
			registerCapital : null,
			//备注
			remark : null,
			//健康安全环保协议
			securityAgreement : null,
			//服务类别
			serviceType : null,
			//座机
			telephone : null,
			//承包商员工
			contractorEmps : [],
		}
	};
	//Vue数据
	var dataModel = {
        seleceDatas:[],
		mainModel : {
        	lastId:null,
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            fileList:[], //资质证书
			fileList1:[], // 协议文件
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				// "orgId" : [LIB.formRuleMgr.require("部门")],
				"agreementDeadline" : [LIB.formRuleMgr.allowStrEmpty],
				"businessScope" : [LIB.formRuleMgr.length(100)],
				"certificate" : [LIB.formRuleMgr.length(100)],
				"cetDeadline" : [LIB.formRuleMgr.allowStrEmpty],
				"compType" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"corporation" : [LIB.formRuleMgr.length(100)],
				"deptAddr" : [LIB.formRuleMgr.length(200)],
				"deptName" : [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("单位名称")],
				"empNum" : LIB.formRuleMgr.range(0, 1000000000).concat(LIB.formRuleMgr.allowIntEmpty),
				"licenceNo" : [LIB.formRuleMgr.length(100)],
				"linkman" : [LIB.formRuleMgr.length(100)],
				"mobilePhone" : [LIB.formRuleMgr.length(100)],
				"qualifications" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.str),
				"qualificationLevel" : [LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty)],
				"registerCapital" : [LIB.formRuleMgr.length(15)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"securityAgreement" : [LIB.formRuleMgr.length(100)],
				"serviceType" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"telephone" : [LIB.formRuleMgr.length(100)],
	        }
		},
		tableModel : {
			contractorEmpTableModel : LIB.Opts.extendDetailTableOpt({
				cureObj:null,
				lists:[],
				url : "contractor/contractoremps/list/{curPage}/{pageSize}",
				columns : [
					// LIB.tableMgr.ksColumn.code,
					// (function () {
					// 	var code = _.cloneDeep(LIB.tableMgr.ksColumn.code);
					// 	code.width = 130;
					// 	return code;
                    // }()),
					{
						title:'',
                        fieldType:'radio',
                        // fieldType:'cb',
                        width:60,
                    },
					{
                        fieldType:'sequence',
						title:'序号',
						width:60,
                        keywordFilterName: "criteria.strValue.keyWordValue_value"
					},
					{
						title : "姓名",
						fieldName : "name",
						width:80,
					},
                    {
                        title: "工种",
                        fieldName: "workType",
                        width:130,
						render:function (data) {
							var result = '';
							if(data.workTypeRel){
								data.workTypeRel.forEach(function(item){
									result+=(LIB.getDataDic('iptw_work_type', item.lookUpValue))+' '
								})
							}
							return  result;
							// return '<span style="display: block;overflow: visible;white-space: pre-line;">'+data.remark+'</span>'
						},
                    },
                    {
                        title: "任职/资质证书",
                        fieldName: "certificate",
                        width:170,
						render:function (data) {
							var result = '';
							if(data.certRel){
								data.certRel.forEach(function(item){
									result+=(LIB.getDataDic('iptw_cert', item.lookUpValue))+" ";
								})
							}
							return  result;
							// return '<span style="display: block;overflow: visible;white-space: pre-line;">'+data.remark+'</span>'
						},
                    },
				]
			}),
            ptwJsaReferenceDetailTableModel : LIB.Opts.extendDetailTableOpt({
                url : "ptwjsareference/ptwjsareferencedetails/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
                columns : [
                    {
                        title: "任职/资质证书",
                        fieldName: "lookUpValue",
                        width: "100px",
						render:function (data) {
                            return LIB.getDataDic('iptw_cert',data.lookUpValue)
                        }
                    },
                    {
                        title: "证书编号",
                        width: "120px",
                        fieldName: "certificateNo"
                    },
                    {
                        title: "证书有效期",
                        width: "100px",
                        fieldName: "expirationDate",
						render:function (data) {
                        	if(data.expirationDate){
                                var a = data.expirationDate.split(' ');
                                return a[0];
							}
							return '';
                        }
                    },
                    {
                        title: "证书附件",
                        width: "140px",
                        fieldName: "riskScore",
                        render: function (data) {
                            var lists = data.fileList;
                            var str = '';
                            if (lists && lists.length>0) {
                               for(var i=0; i<lists.length; i++){
                               		str+= "<a style='color: #00f;' href='/file/down/"+lists[i].id+"'>"+lists[i].orginalName+"</a><br>"
							   }
                            }
                           return str;
                        }
                    },
                ]
            }),
        },
		formModel : {
			contractorEmpFormModel : {
				show : false,
				hiddenFields : ["contractorId"],
				queryUrl : "contractor/{id}/contractoremp/{contractorEmpId}"
			},
		},
        editModel:{
			show:false,
			title:'新增'
		},
		cardModel : {
			contractorEmpCardModel : {
				showContent : true
			},
		},
		selectModel : {
		},

        // 文件参数
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'CBS2',
                fileType: ''
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
            },
            url: "",
        },
		uploadType:0,
		importProgress: {
			show: false
		},
		templete: {
			url: "/contractoremp/file/down"
		},
		exportModel : {
			url: "/contractoremp/exportExcel",
		},


//无需附件上传请删除此段代码
/*
		fileModel:{
			file : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data : []
			},
			pic : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
					}
				},
				data : []
			},
			video : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'XXX3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
					}
				},
				data : []
			}
		}
*/


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
			"contractorempFormModal":contractorEmpFormModal,
			"certRelFormModal":certRelFormModal
        },
		data:function(){
			return dataModel;
		},
        computed:{
            tableTools: function () {
                if (this.mainModel.vo.id && this.mainModel.isReadOnly && this.tableModel.contractorEmpTableModel.cureObj && !this.tableModel.contractorEmpTableModel.cureObj.certRel[0].isFalse) {
                    return ['del', 'update'];
                }
                return []
            },
			getWorkTypeRel: function () {
                var result = [];
                var data = this.tableModel.contractorEmpTableModel.cureObj;
                if(data.workTypeRel){
                    data.workTypeRel.forEach(function(item){
                        result.push(LIB.getDataDic('iptw_work_type', item.lookUpValue))
                    })
                }
                return  result;
            }
		},
        watch:{
			'mainModel.vo.qualifications':function (val) {
				if(val.length == 0){
					this.mainModel.vo.qualificationLevel = '';
				}
            },
			'mainModel.vo.compId':function (val) {
                if(val == '' || val == null){
                    this.mainModel.vo.orgId = '';
                }
            },
			"tableModel.contractorEmpTableModel.cureObj":function (val) {
				if(val){
                    if(this.tableModel.contractorEmpTableModel.cureObj.certRel && this.tableModel.contractorEmpTableModel.cureObj.certRel.length==0){
                        this.tableModel.contractorEmpTableModel.cureObj.certRel = [{isFalse:true}];
					}
				}

            }
		},
		methods:{
			newVO : newVO,
			checkList:function (vo) {
				var obj = _.find(this.tableModel.contractorEmpTableModel.cureObj.certRel,function (item) {
					if(item.lookUpValue == vo.lookUpValue){
						return true;
					}
                });
				if(obj && obj.id !=vo.id){
					LIB.Msg.error("任职,资质证书名称重复",3);
					return false;
				}
            },
            doAddrel:function () {
				this.editModel.show = true;
                this.editModel.title = "新增";
                this.$refs.editModel.initFun();
            },
            doEditrel:function (obj) {
                this.editModel.show = true;
                this.editModel.title = "编辑";
                this.$refs.editModel.initFun(obj);
            },
            updateRel:function (vo) {
				var _this = this;
				vo.contractorId = this.mainModel.vo.id;
				vo.contractorEmpId = this.tableModel.contractorEmpTableModel.cureObj.id;
				api.updateInforel(vo).then(function (res) {
					for(var i=0; i<_this.tableModel.contractorEmpTableModel.cureObj.certRel.length;i++){
						if(_this.tableModel.contractorEmpTableModel.cureObj.certRel[i].id == vo.id){
							_.extend(_this.tableModel.contractorEmpTableModel.cureObj.certRel[i], vo);
						}
					}
					_this.changeIndex(_this.getIndex());
                    LIB.Msg.info("保存成功")
                })
            },
			addRel:function (vo) {
				var _this = this;
                vo.contractorId = this.mainModel.vo.id;
                vo.contractorEmpId = this.tableModel.contractorEmpTableModel.cureObj.id;
                api.saveInforel(vo).then(function (res) {
                	if(_this.tableModel.contractorEmpTableModel.cureObj.certRel[0] && _this.tableModel.contractorEmpTableModel.cureObj.certRel[0].isFalse){
                        _this.tableModel.contractorEmpTableModel.cureObj.certRel.splice(0, 1);
					}
                    _this.tableModel.contractorEmpTableModel.cureObj.certRel.push(vo);
                    _this.changeIndex(_this.getIndex());
                    LIB.Msg.info("保存成功")
                })
            },
			removeRel:function (vo) {
				var _this = this;
				LIB.Modal.confirm({
					title:"是否删除",
					onOk:function () {
                        api.removeInforel(null,vo).then(function (res) {
                            for(var i=0; i<_this.tableModel.contractorEmpTableModel.cureObj.certRel.length;i++){
                                if(_this.tableModel.contractorEmpTableModel.cureObj.certRel[i].id == vo.id){
                                    _this.tableModel.contractorEmpTableModel.cureObj.certRel.splice(i,1);
                                    break;
                                }
                            }
                        })
                    }
				})
                return ;
            },

			getIndex:function () {
                var index = 0;
                for(var i=0; i<this.tableModel.contractorEmpTableModel.lists.length; i++){
                    if(this.mainModel.lastId == this.tableModel.contractorEmpTableModel.lists[i].id){
                        index = i;
                        this.seleceDatas[0] = this.tableModel.contractorEmpTableModel.lists[i];
                    }
                }
                if(index == 0 && this.tableModel.contractorEmpTableModel.lists[0]){
                    this.seleceDatas[0] = this.tableModel.contractorEmpTableModel.lists[0];
                    this.lastId = this.tableModel.contractorEmpTableModel.lists[0].id;
				}
                return index;
            },

			changeDisable:function (val) {
				var _this = this;
				var title = val==0?'确认驻场？':'确认离场？'
				LIB.Modal.confirm({
					title:title,
					onOk:function (data) {
                        api.contractorempDisable({id:_this.tableModel.contractorEmpTableModel.cureObj.id,disable:val}).then(function (res) {
                            _this.tableModel.contractorEmpTableModel.cureObj.disable = val;
                            LIB.Msg.success("保存成功");
                            _this.changeIndex(_this.getIndex());
                        });
                    }
				})

            },

			changeIndex:function(val){
                var _this = this;
                this.tableModel.contractorEmpTableModel.cureObj = this.tableModel.contractorEmpTableModel.lists[val];
                _.each(_this.$refs.contractorempTable.filteredValues,function (item) {
					item.rowCheck = false;
                });
				this.seleceDatas[0] = this.tableModel.contractorEmpTableModel.lists[val];
                this.$nextTick(function () {
                    if(_this.$refs.contractorempTable.filteredValues[parseInt(val)])
                    _this.$refs.contractorempTable.filteredValues[parseInt(val)].rowCheck = true;
                })
			},

            onClickRow:function (val) {
				var _this = this;
                this.tableModel.contractorEmpTableModel.cureObj = val.entry.data;
                this.mainModel.lastId = val.entry.data.id;
                this.changeIndex(val.cell.rowId);
			},
            changeSelect:function (val) {
				var _this = this;

                this.tableModel.contractorEmpTableModel.cureObj = null;
				var index = _this.getIndex()
				this.$nextTick(function () {
					if(_this.$refs.contractorempTable.filteredValues[index]){
                        _this.changeIndex(index);
					}
                });

                if(val[index]){
                    this.seleceDatas = [];
                    // this.seleceDatas.push(val[index]);
					this.$set("seleceDatas", val[index])
                    this.tableModel.contractorEmpTableModel.cureObj = val[index];
				}
            },
			doShowContractorEmpFormModal4Update : function(param) {
				if(this.tableModel.contractorEmpTableModel.cureObj && this.tableModel.contractorEmpTableModel.cureObj.id){
                    this.formModel.contractorEmpFormModel.show = true;
                    this.$refs.contractorempFormModal.init("update", {id: this.mainModel.vo.id, contractorEmpId: this.tableModel.contractorEmpTableModel.cureObj.id});
                }
			},
			doShowContractorEmpFormModal4Create : function(param) {
				this.formModel.contractorEmpFormModel.show = true;
				this.$refs.contractorempFormModal.init("create");
			},
			doSaveContractorEmp : function(data) {
				if (data) {
					var _this = this;
					api.saveContractorEmp({id : this.mainModel.vo.id}, data).then(function() {
						LIB.Msg.success("保存成功");
						_this.refreshTableData(_this.$refs.contractorempTable);
					});
				}
			},
			doUpdateContractorEmp : function(data) {
				if (data) {
					var _this = this;
					api.updateContractorEmp({id : this.mainModel.vo.id}, data).then(function() {
                        LIB.Msg.success("保存成功");
						_this.refreshTableData(_this.$refs.contractorempTable);
					});
				}
			},
			doRemoveContractorEmp : function() {
				var _this = this;
				var data = this.tableModel.contractorEmpTableModel.cureObj;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeContractorEmps({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							// _this.$refs.contractorempTable.doRefresh();
							var lists = _this.tableModel.contractorEmpTableModel.lists;
							var cure = _this.tableModel.contractorEmpTableModel.cureObj;
                            if(lists && lists.length>0){
                                for(var i=0; i<lists.length; i++){
                                    if(lists[i].id == cure.id){
                                        lists.splice(i,1);
                                        _this.tableModel.contractorEmpTableModel.cureObj = null;
                                        break;
                                    }
                                }
                                _this.changeIndex(0);
                            }

                            LIB.Msg.info("删除成功")
						});
					}
				});
			},

			afterInitData : function() {
                if(this.mainModel.vo.id){
                    this.$refs.contractorempTable.doQuery({id : this.mainModel.vo.id});
                    this.getFileList(this.mainModel.vo.id)  ;
                }
				if(this.mainModel.opType === 'view' || this.mainModel.opType === 'update'){
					if(this.mainModel.vo.qualification){
						this.mainModel.vo.qualifications = this.mainModel.vo.qualification.split(",");
					}
				}
			},
            afterInit: function () {
                var _this = this;
                if (this.mainModel.opType === 'create') {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        _this.uploadModel.params.recordId = res.data;
                    })
                }
            },

			beforeInit : function() {
                this.seleceDatas = [];
                this.tableModel.contractorEmpTableModel.cureObj = null;
                this.$refs.contractorempTable.doClearData();
                this.mainModel.fileList = [];
                this.mainModel.fileList1 = [];
				this.mainModel.vo = newVO();
			},

            beforeDoSave:function () {
				this.mainModel.vo.orgId = this.mainModel.vo.compId;
				this.mainModel.vo.qualification = this.mainModel.vo.qualifications.join(",")
            },
            beforedoAdd4Copy:function () {

				this.doAdd4Copy();
            },

            afterDoCance:function () {

            },

            afterDoCopy:function () {
				this.mainModel.fileList = [];
                this.mainModel.fileList1 = [];
            },

			buildQualificationRel:function(data){
				if(data.qualifications.length > 0){
					data.qualificationRel = [];
					data.qualifications.forEach(function(item){
						data.qualificationRel.push(
							{
								lookUpValue : item,
								type: 0
							})
					})
				}
			},
            doSave: function() {
				var _this = this;
                if(this.mainModel.action === "copy") {
					if(this.mainModel.vo.qualifications.length > 0){
						this.mainModel.vo.qualificationRel = [];
						this.mainModel.vo.qualifications.forEach(function(item){
							_this.mainModel.vo.qualificationRel.push(
								{
									lookUpValue : item,
									type: 0
								})
						})
					}
                    this.doSave4Copy();
                    return;
                }
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _data = this.mainModel;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
						_this.buildQualificationRel(_vo);
                        if (_data.vo.id == null || _this.mainModel.opType==='create') {
                            _this.$api.create(_vo).then(function(res) {
                                //清空数据
                                //_.deepExtend(_vo, _this.newVO());
                                //_this.opType = "view";
                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;
                                _this._getResultCodeByRequest(res.data.id);
                                _this.afterDoSave({ type: "C" }, res.body);
                                if(_this.fileModel) {
                                    _.each(_this.fileModel,function (item) {
                                        item.cfg && item.cfg.params && (item.cfg.params.recordId = _data.vo.id);
                                    });
                                }
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
                    }
                });
            },

            getUUId:function () {
            	var _this = this;
                api.getUUID().then(function(res){
                    var group={};

                });
            },

            // ------------------- 文件 ---------------------
            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id}).then(function (res) {
                    // _this.mainModel.fileList = res.data;
                    _this.mainModel.fileList = _.filter(res.data, function (item) {
						return  item.dataType == 'CBS1'
                    });
                    _this.mainModel.fileList1 = _.filter(res.data, function (item) {
                        return  item.dataType == 'CBS2'
                    });
                })
            },
            uploadClicked: function (val) {
				this.uploadType = val;
                this.uploadModel.params.recordId = this.mainModel.vo.id;
				if(this.uploadType == 0){
					this.uploadModel.params.dataType = 'CBS1';
				}else{
                    this.uploadModel.params.dataType = 'CBS2';
				}
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                // LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                if(this.uploadType == 0)
                	this.mainModel.fileList.push(con);
                else
                	this.mainModel.fileList1.push(con);
                // LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index, val) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                        	if(val == 0){
                                _this.mainModel.fileList.splice(index, 1);
                            }else{
                                _this.mainModel.fileList1.splice(index, 1);
							}
                        })
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.fileList;
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
			doImport: function () {
				this.importProgress.show = true;
				this.uploadModel.url = "/contractoremp/importExcel/" + this.mainModel.vo.id;
			},
			doExport:function(){
				var _this = this;
				var obj = {"keyWordValue_value":this.$refs.simpcard.filterKey, "keyWordValue_join_":"or"};
				var param = JSON.stringify(obj)
				// window.open(_this.exportModel.url+"?contractorId=" + _this.mainModel.vo.id + "&criteria.strValue=" + param);
				window.open(_this.exportModel.url+"?contractorId=" + _this.mainModel.vo.id);
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