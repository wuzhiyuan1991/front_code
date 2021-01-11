define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./regulationContentFormModal.html");
	var api = require("views/businessFiles/complianceManager/regulation/vuex/api")
	//初始化数据模型
	var newVO = function() {
		return {
            id: null,
			//角色编码
			code : null,
			//内容
			content : null,
			//禁用标识 0未禁用，1已禁用
            disable : "0",
            regulationChapter: { id: '', name: '' },
            parentId: null,
            insertPointObjId: null,
            orderNo: null,
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"content" : [LIB.formRuleMgr.require("内容"),
						  LIB.formRuleMgr.length(2000)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
	        },
	        emptyRules:{}
		},
		fileList:[],
        uploadModel: {
			params: {
				recordId: null,
				dataType: 'ICM4',
				fileType: 'ICM'
			},
			filters: {
				max_file_size: '20mb',
				mime_types: [{ title: "files", extensions: "jpg,jpeg,png,gif" }]
			},
			// url: "/riskjudgmentunit/importExcel",
		},
		legalTypes: null,
        orderList: null, // 排序位置列表
        positionList: [{ key: "first", name: "当前层级最前" }, { key: "last", name: "当前层级最后" }, { key: "middle", name: "某个节点之后" }],//位置方式列表
        positionKey: 'first',
        selectedDatas: [],
        selectList: []
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			// "standardSelectModal":standardSelectModal,
			
		},
		watch: {
            visible: function (val) {

                if (!val) {
                    this._reset();
                }
                if (val&&this.chapter.length==0) {
                    LIB.Msg.error("请先选择章节");
                    this.visible=false
                }

            }
        },
		data:function(){
			return dataModel;
		},
		props: ['chapterId','chapter'],
		methods:{
			newVO : newVO,
			detailImg: function (file) {

                return LIB.convertFilePath(LIB.convertFileData(file))
            },
            _reset: function () {
                this.fileList=[]
                this.selectedDatas = []
                this.mainModel.vo = newVO();
                this.parentList = null;
            },
            doShowLegalRegulationTypeSelectModal: function () {
                this.selectModel.legalRegulationTypeSelectModel.visible = true;
                //this.selectModel.legalRegulationTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveLegalRegulationType: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.legalRegulationType = selectedDatas[0];
                }
            },

            afterDoSave: function () {

            },

            afterInit: function () {
                var _this=this
                this.positionKey = "last";
                this.mainModel.vo.regulationChapter.id = this.chapter[0].id
                this.mainModel.vo.regulationChapter.name = this.chapter[0].name
                this._setSelectList(this.chapter[0].id);
                if (this.mainModel.opType=='create') {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        _this.uploadModel.params.recordId=  _this.mainModel.vo.id
                    });
                }
                return;
            },
            afterInitData:function(){
                var _this=this
                    this.uploadModel.params.recordId=  this.mainModel.vo.id
                this.getFileList(this.mainModel.vo.id)
            },
            beforeDoSave: function () {
                var _this = this;
                // this.mainModel.vo.insertPointObjId = this.mainModel.vo.lawsChapter.id
                switch (this.positionKey) {
                    case "first":
                        this.mainModel.vo.orderPosition = 2
                        break;
                    case "middle":
                        this.mainModel.vo.orderPosition = 3
                        _this.mainModel.vo["criteria"] = {
                            strValue: {insertPointObjId: _this.mainModel.vo.insertPointObjId}
                        };
                        break;
                    case "last":
                        this.mainModel.vo.orderPosition = 1;
                        if (_this.selectList.length == 0) {
                            _this.mainModel.vo.insertPointObjId = null;
                        } else {
                            _this.mainModel.vo.insertPointObjId = _this.selectList.slice(-1)[0].id;
                        }
                        _this.mainModel.vo["criteria"] = {
                            strValue: {insertPointObjId: _this.mainModel.vo.insertPointObjId}
                        };
                        break;
                    default:
                        this.mainModel.vo.orderPosition = 1
                        break;
                }

            },
            _setSelectList: function (pid) {
                var _this = this;
                var selectList = [];
                var parentId = pid
                
                
                if (parentId) {
                    var param = {id: parentId};
                    api.queryContentList(param).then(function (res) {
                        if (res.data) {
                            selectList = _.sortBy(res.data, function (item) {
                                return item.orderNo ? parseInt(item.orderNo) : 0;
                            });
                          
                            if (!_.isArray(selectList) || selectList.length === 0) {
                                _this.mainModel.vo.insertPointObjId = null;
                            }
                            _this.selectList  =_.filter(selectList,function(item){
                                return item.id !== _this.mainModel.vo.id
                            })
                        }
                    })
                }
            },
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
						// api.deleteFile(null, [_this.fileList[0].id]).then(function () {
						// 	_this.fileList = _this.fileList.splice(index,1);
							
						// })
					}
				});
			},
			doClickFile: function (index) {
				var files = this.fileList;
                var file = files[index];
				window.open("/file/down/" + file.id)

			},
			
		},
		init: function () {
            this.$api = api;
        }
	});
	
	return detail;
});