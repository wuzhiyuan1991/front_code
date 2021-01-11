define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./accidentCaseFormModal.html");
    var api = require("views/businessFiles/hiddenDanger/checkItem/vuex/api");
    var videoHelper = require("tools/videoHelper");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//案例名称
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
				"name" : [LIB.formRuleMgr.require("案例名称"),
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
		//正确图片配置
        rightPicModel:{
            params:{
                recordId : null,
                dataType : 'I3',//事故案例数据来源标识（正确）
                fileType : 'I',
            }
        },
        //视频配置
        wrongPicModel:{
            params:{
                recordId : null,
                dataType : 'I4',//事故案例数据来源标识（错误）
                fileType : 'I',
            },
            filters:{
                max_file_size: '10mb',
                mime_types: [{ title: "video", extensions: "mp4" }]
            }
        },
        //参考资料配置
        referMaterModel:{
            params:{
                recordId : null,
                dataType : 'I5',
                fileType : 'I',
            },
            filters:{
                max_file_size: '10mb',
                mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
            }
        },
        playModel:{
            title : "视频播放",
            show : false,
            id: null
        },
        picModel:{
            title : "图片显示",
            show : false,
            id: null
        },
        rightPictures : [],
        wrongPictures : [],
        referenceMaterials : [],
	};

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function(recordId){
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
		methods: {
            newVO: newVO,
            rightPic: function (data) {
                LIB.Msg.info("上传成功");
                dataModel.rightPictures.push(LIB.convertFileData(data.rs.content));
            },
            //视频
            wrongPic: function (data) {
                dataModel.wrongPictures.push(LIB.convertFileData(data.rs.content));
                LIB.Msg.info("上传成功");

            },
            //参考资料
            referMater: function (data) {
                LIB.Msg.info("上传成功");
                dataModel.referenceMaterials.push(LIB.convertFileData(data.rs.content));
            },
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
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
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath,
            convertFilePath:LIB.convertFilePath,
            beforeInit: function () {
                this.rightPictures = [];
                this.wrongPictures = [];
                this.referenceMaterials = [];
            },
            afterInit: function () {
                var _this = this;
                if (this.mainModel.opType === 'create') {
                    api.getUUID().then(function (res) {
                        _this.mainModel.vo.id = res.data;
                        initUploadorRecordId(_this.mainModel.vo.id);
                        console.log()
                    })
                }
            },

            afterInitData: function () {
                var _this = this;
                var _vo = _this.mainModel.vo;
                initUploadorRecordId(_vo.id);
                //初始化图片
                api.listFile({recordId: _vo.id}).then(function (res) {
                    dataModel.rightPictures = [];
                    dataModel.wrongPictures = [];
                    dataModel.referenceMaterials = [];
                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "I3") {
                            dataModel.rightPictures.push(LIB.convertFileData(pic));
                        } else if (pic.dataType === "I4") {
                            dataModel.wrongPictures.push(LIB.convertFileData(pic));
                        } else if (pic.dataType === "I5") {
                            dataModel.referenceMaterials.push(LIB.convertFileData(pic));
                        }
                    });
                });
            },
        }
	});
	
	return detail;
});