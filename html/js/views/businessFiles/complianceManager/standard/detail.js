define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var standardContentFormModal = require("componentsEx/formModal/standardContentFormModal");
	var typeFormModalDetail = require("./dialog/typeFormModal");
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//角色编码
			code : null,
			//英文标准名称
			enName : null,
			//中文标准名称
			chName : null,
			//标准号
			number : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//废止信息
			annulment : null,
			//废止日期
			annulmentDate : null,
			//标准简介
			content : null,
			//中国标准分类号
			cssCode : null,
			//CCS分类
			cssType : null,
			//国内行业分类
			domesticType : null,
			//实施日期
			effectiveDate : null,
			//效力级别
			effectiveLevel : null,
			//国际标准分类号
			icsCode : null,
			//ICS分类
			icsType : null,
			//国外行业协会分类
			internationalType : null,
			//是否是已修订 0:不是,1:是(页面只显示未修订的)
			isRevise : null,
			//文件时效 1:现行,2:废止,3:即将实施
			limitation : null,
			//管理部门
			managerOrg : null,
			//发布日期
			publishDate : null,
			//发布单位
			publishOrg : null,
			//修订信息
			revise : null,
			//归口部门
			underOrg : null,
			//章节
			standardChapters : [],
			standardType:{name:null,id:null}
		}
	};
	//Vue数据
	var dataModel = {
		revise: null,
		reviseList: [],
		chapterTypes: [],
		typeSelectData: [],
		typeForm: {
			visible: false
		},
		legalRegulationType: { id: '', name: '' },
		legalRegulationTypes: [],
		newFiles:[],
		treeSelectData: [],
		isReviseStatus: false,
		orginalName: null,
		fileList: [],
		oldfileList: [],
		uploadModel: {
			params: {
				recordId: null,
				dataType: 'ICM6',
				fileType: 'ICM'
			},
			filters: {
				max_file_size: '20mb',
				mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx" }]
			},
			// url: "/riskjudgmentunit/importExcel",
		},
		resiveInfo: {
			visible: false,
			vo: { revise: '' }
			,
			rules: {
				'revise': [LIB.formRuleMgr.length(500), LIB.formRuleMgr.require("修订简述")]
			}
		},
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",

			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"enName" : [LIB.formRuleMgr.require("英文标准名称"),
						  LIB.formRuleMgr.length(100)
				],
				"chName" : [LIB.formRuleMgr.require("中文标准名称"),
						  LIB.formRuleMgr.length(100)
				],
				"number" : [LIB.formRuleMgr.require("标准号"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"annulment" : [LIB.formRuleMgr.length(500)],
				"annulmentDate" : [LIB.formRuleMgr.allowStrEmpty],
				"content" : [LIB.formRuleMgr.length(500)],
				"cssCode" : [LIB.formRuleMgr.length(100)],
				"cssType" : [LIB.formRuleMgr.length(100)],
				"domesticType" : [LIB.formRuleMgr.length(100)],
				"effectiveDate" : [LIB.formRuleMgr.allowStrEmpty,LIB.formRuleMgr.require("实施日期")],
				"effectiveLevel" : [LIB.formRuleMgr.range(0, 100),LIB.formRuleMgr.require("效力级别")].concat(LIB.formRuleMgr.allowIntEmpty),
				"icsCode" : [LIB.formRuleMgr.length(100)],
				"icsType" : [LIB.formRuleMgr.length(100)],
				"internationalType" : [LIB.formRuleMgr.length(100)],
				"isRevise" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"limitation" : [LIB.formRuleMgr.allowIntEmpty,LIB.formRuleMgr.require("文件时效")].concat(LIB.formRuleMgr.allowIntEmpty),
				"managerOrg" : [LIB.formRuleMgr.length(100)],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty,LIB.formRuleMgr.require("发布日期")],
				"publishOrg" : [LIB.formRuleMgr.length(100)],
				"revise" : [LIB.formRuleMgr.length(500)],
				"underOrg" : [LIB.formRuleMgr.length(100)],
	        }
		},
		tableModel : {
			standardContentTableModel : LIB.Opts.extendDetailTableOpt({
				url : "standardchapter/standardcontents/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					{
						title: "",
						render: function (data, index) {
							return index + 1
						},
						width: 50
					},
				{
					title : "内容",
					fieldName : "content",
					keywordFilterName: "criteria.strValue.keyWordValue_name",
					'renderClass': 'maxH'
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
		},
		formModel : {
			standardContentFormModel : {
				show : false,
				hiddenFields : ["standardId"],
				queryUrl : "standardchapter/{id}/standardcontent/{standardcontentId}"
			},
		},
		selectModel : {
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		props: {
			typeid: {
				type: String,
				default: ''
			},

		},
		components : {
			"standardContentFormModal":standardContentFormModal,
			'typeFormModalDetail': typeFormModalDetail
		},
		computed: {
			reviseOnly: function () {
				if (this.isReviseStatus) return true


				return this.mainModel.isReadOnly
			}
		},
		watch: {
			'mainModel.vo.id': function (nval) {
				this.revise = null
			},
			isShow: function (nval) {
				if (!nval) {
					this.revise = null
				}
			},
			revise: function (nval, oval) {

				if (oval !== null && nval) {
					this.selectRevise(nval)
				}
			},

		},
		data:function(){
			return dataModel;
		},
		methods:{
			doOk: function () {
				var _this = this
				this.$refs.modalruleform.validate(function (valid) {
					if (valid) {
						_this.resiveInfo.visible = false
						if (_this.mainModel.vo.revise) {
							_this.mainModel.vo.revise += _this.resiveInfo.vo.revise
						} else {
							_this.mainModel.vo.revise = _this.resiveInfo.vo.revise
						}

						_this.resiveInfo.revise = ''
					}

				})


			},
			cancel: function () {
				this.resiveInfo.visible = false
				this.resiveInfo.revise = ''
			},
			afterDoSave: function () {
				var that = this
				// if (type == "C") {
					
					that.init("view", that.mainModel.vo.id)

				// }

			},
			cancel:function(){
				this.fileList = this.oldfileList
				var  fileIds =[]
				if (this.newFiles.length>0) {
					_.each(this.newFiles,function(item){
						
						fileIds.push(item.id)
					})
					
						this.$resource("file").delete("file", fileIds);
					
				}
				this.doCancel()
			},
			edit:function(){
				this.oldfileList = JSON.parse(JSON.stringify(this.fileList))
				this.doEdit()
			},
			doClose:function(){
				this.$dispatch("ev_dtClose");
			},
			doSaveRevise: function () {
				var _this = this
				this.$refs.ruleform.validate(function (valid) {
					if (valid) {
						if (_this.typeSelectData.length > 0) {
							_this.mainModel.vo.standardType = _this.typeSelectData[0]
						}
						api.updateRevision(_this.mainModel.vo).then(function (res) {
							LIB.Msg.success("保存成功");
							api.querystandardrevise({ 'discernId': _this.mainModel.vo.discernId }).then(function (res) {//获取新的修订记录

								var newResive = 0
								for (var index = 0; index < res.data.length; index++) {
									var isNew = true
									for (var j = 0; j < _this.reviseList.length; j++) {
										if (res.data[index].standardId == _this.reviseList[j].standardId) {
											isNew = false
											break
										}
									}
									if (isNew) {
										newResive = index
									}
								}
								_this.revise = res.data[newResive]
								_this.selectRevise(_this.revise.standardId)

								_this.reviseList = res.data
							})
							_this.isReviseStatus = false
						})
					}
				})

			},
			doReviseCancel: function () {
				this.isReviseStatus = false
				var that = this
				this.fileList = this.oldfileList
				this.doCancel()
				var data = _.filter(that.reviseList, function (item) {
					return item.standardId == that.mainModel.vo.id
				})
				if (data.length > 0) {
					that.$nextTick(function () {
						that.revise = data[0].standardId
					})


				}
			},
			doSaveType: function () {
				this._getTreeList();
				this.typeForm.visible = false;
			},
			doUpdateType: function () {

				var typeId = _.get(this.treeSelectData, "[0].id");
				if (!typeId) {
					LIB.Msg.error("请选择分类");
					return;
				}
				var data = _.find(this.chapterTypes, "id", _.get(this.treeSelectData, "[0].id"));
				this.typeForm.visible = true;
				this.$broadcast("ev_le_regulation", "update", data, this.mainModel.vo.id);
			},
			doCreateType: function () {
				var parentId = _.get(this.treeSelectData, "[0].id");
				this.typeForm.visible = true;
				this.$broadcast("ev_le_regulation", "create", { id: parentId }, this.mainModel.vo.id);
			},
			doDeleteType: function () {
				var _this = this;
				var id = _.get(this.treeSelectData, "[0].id");

				if (!id) {
					LIB.Msg.error("请选择分类");
					return;
				}
				LIB.Modal.confirm({
					title: '删除当前数据将会删除所有下级数据，是否确认?',
					onOk: function () {
						api.removestandardChapters({ id: _this.mainModel.vo.id }, [{ id: id }]).then(function () {
							LIB.Msg.success("删除成功");
							_this.$api.querystandardChapters({ 'id': _this.mainModel.vo.id, "criteria.orderValue.fieldName": "orderNo", "criteria.orderValue.orderType": 0 }).then(function (res) {
								_this.chapterTypes = res.data.list
								_this.treeSelectData = res.data.list.slice(0, 1);
								var typeId = _.get(_this.treeSelectData, "[0].id");
								if (typeId) {
									var params = [
										{
											type: "save",
											value: {
												columnFilterName: "id",
												columnFilterValue: typeId
											}
										}
									];
									_this.$refs.standardContentTable.doCleanRefresh(params);
								} else {
									_this.$refs.standardContentTable.doClearData();
								}
							})


						});
					}
				});
			},
			doTreeNodeClick: function () {
				var typeId = _.get(this.treeSelectData, "[0].id");
				if (typeId) {
					var params = [
						{
							type: "save",
							value: {
								columnFilterName: "id",
								columnFilterValue: typeId
							}
						}
					];
					this.$refs.standardContentTable.doCleanRefresh(params);
				} else {
					this.$refs.standardContentTable.doClearData();
				}

			},
			_getTreeList: function () {
				var that = this;
				this.$api.querystandardChapters({ 'id': that.mainModel.vo.id, "criteria.orderValue.fieldName": "orderNo", "criteria.orderValue.orderType": 0 }).then(function (res) {
					that.chapterTypes = res.data.list
					that.treeSelectData = res.data.list.slice(0, 1);
				})
			},
			newVO : newVO,
			doRevise: function () {
				this.mainModel.isReadOnly = false
				this.isReviseStatus = true
				var _this = this
				_.each(Object.keys(this.mainModel.vo), function (key) {
					if (key !== 'effectiveLevel' && key !== 'enName'&& key !== 'chName'&&key !=='number' && key !== 'publishAuthority' && key !== 'revise'  && key !== 'typeId' && key !== 'discernId' && key !== 'id') {
						_this.mainModel.vo[key] = null
					}
				})
				this.oldfileList = JSON.parse(JSON.stringify(this.fileList))
				this.fileList = []
				api.getUUID().then(function (res) {
					_this.mainModel.vo.id = res.data;
					_this.uploadModel.params.recordId = _this.mainModel.vo.id;
				});
			},
			doShowstandardContentFormModal4Update: function (param) {
				this.formModel.standardContentFormModel.show = true;
				this.$refs.standardContentFormModal.init("update", { id: this.mainModel.vo.id, standardcontentId: param.entry.data.id });
			},
			doShowstandardContentFormModal4Create: function (param) {
				var typeId = _.get(this.treeSelectData, "[0].id");
				if (!typeId) {
					LIB.Msg.error("请选择分类");
					return;
				}
				this.formModel.standardContentFormModel.show = true;
				this.$refs.standardContentFormModal.init("create");
			},
			doSavestandardContent: function (data) {
				if (data) {
					var _this = this;
					data.standardId = this.mainModel.vo.id;
					api.saveContent({ id: data.standardChapter.id }, data).then(function () {
						_this.$refs.standardContentTable.doQuery({ id: data.standardChapter.id });
						// _this.refreshTableData(_this.$refs.standardContentTable);
					});
				}
			},
			doUpdatestandardContent: function (data) {
				if (data) {
					var _this = this;
					api.updateContent({ id: data.standardChapter.id }, data).then(function () {
						_this.$refs.standardContentTable.doQuery({ id: data.standardChapterId });
						// _this.refreshTableData(_this.$refs.standardContentTable);
					});
				}
			},
			doRemovestandardContent: function (item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeContent({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
							_this.$refs.standardContentTable.doQuery({ id: data.standardChapterId });
						});
					}
				});
			},
			selectRevise: function (val) {
				$('.detail-container').scrollTop(0)
				this.chapterTypes = []
				this.treeSelectData = []
				this.init("view", val)

				LIB.globalLoader.show()
				this.$nextTick(function () {
					LIB.globalLoader.hide()
					LIB.Msg.success("切换成功");
				})

			},
			// },
			afterInitData: function () {
				var that = this
				this.isReviseStatus = false
				this.orginalName = null
				this.newFiles=[]
				this.getFileList(this.mainModel.vo.id);
				// this.$api.getTreeList().then(function (res) {
				// 	that.legalRegulationTypes = res.data
				// 	that.typeSelectData = _.filter(that.legalRegulationTypes, function (item) {
				// 		return item.id == that.mainModel.vo.typeId
				// 	})
				// })
				this.uploadModel.params.recordId = this.mainModel.vo.id;
				if (this.mainModel.opType !== 'create') {
					LIB.globalLoader.show()
					this.$api.querystandardrevise({ 'discernId': that.mainModel.vo.discernId }).then(function (res) {
						that.reviseList = res.data

						if (that.reviseList.length > 0) {

							var data = _.filter(that.reviseList, function (item) {
								return item.standardId == that.mainModel.vo.id
							})
							if (data.length > 0) {
								that.revise = data[0].standardId
							}
						}

					})
					this.$refs.standardContentTable.doClearData();
					this.$api.querystandardChapters({ 'id': that.mainModel.vo.id, "criteria.orderValue.fieldName": "orderNo", "criteria.orderValue.orderType": 0 }).then(function (res) {
						that.chapterTypes = res.data.list;
						that.$nextTick(function () {
							LIB.globalLoader.hide()

						})
						if (that.chapterTypes.length > 0) {
							that.treeSelectData = that.chapterTypes.slice(0, 1);
							that.$refs.standardContentTable.doQuery({ id: that.treeSelectData[0].id });
						} else {
							that.treeSelectData = []
						}
					})
				}
				if (this.beginRevise) {
					this.$nextTick(function(){
						that.doRevise()
					})
					this.beginRevise=false
				}
				
				
			},
			afterInit: function () {
				var _this = this;
				this.fileList = []
				if (this.mainModel.opType == 'create') {
					api.getUUID().then(function (res) {
						_this.mainModel.vo.id = res.data;
						_this.uploadModel.params.recordId = _this.mainModel.vo.id;
					});
					this.mainModel.vo.typeId=this.typeid
					// this.$api.getTreeList().then(function (res) {
					// 	_this.legalRegulationTypes = res.data
					// 	_this.typeSelectData = _.filter(_this.legalRegulationTypes, function (item) {
					// 		return item.id == _this.typeid
					// 	})
					// 	_this.mainModel.typeName = _this.typeSelectData[0].name
					// })
				}






			},

			// ------------------- 文件 ---------------------
			getFileList: function (id) {
				var _this = this;
				api.getFileList({ recordId: id }).then(function (res) {
					_this.fileList = res.data;
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
				this.fileList.push(con);
				this.newFiles.push(con)
				LIB.globalLoader.hide();
			},
			onUploadComplete: function () {
				LIB.globalLoader.hide();
			},
			removeFile: function (fileId, index) {
				var _this = this;
				LIB.Modal.confirm({
					title: "确定删除文件？",
					onOk: function () {
						api.deleteFile(null, [fileId]).then(function () {
							_this.fileList.splice(index, 1);
						})
					}
				});
			},
			doClickFile: function (index) {
				var files = this.fileList;
				var file = files[index];
				window.open("/file/down/" + file.id)

			},

		},
		events : {
			'revise':function(){
				this.beginRevise=true
				
				
			}
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});