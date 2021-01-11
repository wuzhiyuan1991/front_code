define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./checkMethodFormModal.html");
    var api = require("views/businessFiles/hiddenDanger/checkItem/vuex/api");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//方法名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//内容
			content : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
                // "code" : [LIB.formRuleMgr.require(""),
					// 	  LIB.formRuleMgr.length()
                // ],
				"name" : [LIB.formRuleMgr.require("检查方法名称"),
						  LIB.formRuleMgr.length()
				],
                "compId": [{ required: true, message: '请选择所属公司' },
                    LIB.formRuleMgr.length()
                ],
                "content": [LIB.formRuleMgr.require("内容"),
                    LIB.formRuleMgr.length(500, 1)
                ],
				// "disable" : [LIB.formRuleMgr.length()],
				// "modifyDate" : [LIB.formRuleMgr.length()],
				// "createDate" : [LIB.formRuleMgr.length()],
	        },
	        emptyRules:{}
		},
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        rightPictures: [],
        wrongPictures: [],
        referenceMaterials: [],

        rightPicModel: {
            params: {
                recordId: null,
                dataType: 'I1', //检查方法数据来源标识(正确)
                fileType: 'I',
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "png,jpg,jpeg" }]
            }
        },
        //错误图片配置
        wrongPicModel: {
            params: {
                recordId: null,
                dataType: 'I2', //检查方法数据来源标识(错误)
                fileType: 'I',
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "png,jpg,jpeg" }]
            }
        },
        //参考资料配置
        referMaterModel: {
            params: {
                recordId: null,
                dataType: 'I5', //检查方法数据来源标识(参考资料)
                fileType: 'I',
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
            }
        },
	};

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function(recordId) {
        dataModel.rightPicModel.params.recordId = recordId;
        dataModel.wrongPicModel.params.recordId = recordId;
        dataModel.referMaterModel.params.recordId = recordId;
    }

	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            //正确图片
            rightPic: function(data) {
                dataModel.rightPictures.push(LIB.convertFileData(data.rs.content));
            },
            //错误图片
            wrongPic: function(data) {
                dataModel.wrongPictures.push(LIB.convertFileData(data.rs.content));
            },
            //参考资料
            referMater: function(data) {
                dataModel.referenceMaterials.push(LIB.convertFileData(data.rs.content));
            },
            doDeleteFile: function(fileId, index, array) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function(data) {
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
            beforeInit: function() {
                this.rightPictures = [];
                this.wrongPictures = [];
                this.referenceMaterials = [];
            },
            afterInit: function () {
                var _this = this;
                if (this.mainModel.opType === 'create') {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        initUploadorRecordId(res.data);
                    })
                }
            },
            convertFilePath:LIB.convertFilePath,
            afterInitData : function() {
                var _this = this;
                var _vo = _this.mainModel.vo;
                // 初始化图片
                initUploadorRecordId(_vo.id);
                api.listFile({ recordId: _vo.id }).then(function(res) {
                    dataModel.rightPictures = [];
                    dataModel.wrongPictures = [];
                    dataModel.referenceMaterials = [];
                    var fileData = res.data;
                    _.each(fileData, function(pic) {
                        if (pic.dataType === "I1") {
                            dataModel.rightPictures.push(LIB.convertFileData(pic));
                        } else if (pic.dataType === "I2") {
                            dataModel.wrongPictures.push(LIB.convertFileData(pic));
                        } else if (pic.dataType === "I5") {
                            dataModel.referenceMaterials.push(LIB.convertFileData(pic));
                        }
                    });
                });
            },
		},
	});
	
	return detail;
});