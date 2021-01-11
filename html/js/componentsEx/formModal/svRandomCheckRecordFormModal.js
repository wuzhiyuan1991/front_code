define(function(require){
	var LIB = require('lib');
    var api = require("views/businessCenter/hiddenDanger/svRandomCheckTable/vuex/api");
    var videoHelper = require("tools/videoHelper");
 	//数据模型
	var tpl = require("text!./svRandomCheckRecordFormModal.html");
	// var legalRegulationSelectModal = require("componentsEx/selectTableModal/legalRegulationSelectModal")
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//内容
			content : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//组织id
			orgId : null,
			//检查时间
			checkDate : null,
			//检查依据
			legalRegulation : {id:'', name:''},
			//执行人
			checker : {id:'', name:''},
            videos:[],
            pictures:[]
		}
	};

    //图片上传后回调方法声明
    var uploadEvents = {
        //图片
        pictures: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.pictures.push({fileId: rs.content.id});
        },
        //视频
        videos: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.videos.push({fileId: rs.content.id});
        },
        //视频第一帧
        videoPics: function (param) {
            var rs = param.rs;
            dataModel.mainModel.vo.videoPics.push({fileId: rs.content.id});
        }
    }


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
				"content" : [
					LIB.formRuleMgr.length(4000)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"checker.id" : [LIB.formRuleMgr.require("检查人")],
				"checkDate":  [LIB.formRuleMgr.require("检查时间")]
	        },
	        emptyRules:{}
		},
        //图片
        pictures: {
            params: {
                recordId: null,
                fileType: "B",
                dataType: 'B1'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
            }
        },
        //视频
        videos: {
            params: {
                recordId: null,
                fileType: "B",
                dataType: 'B2'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
            }
        },
        //视频第一帧
        videoPics: {
            params: {
                recordId: null,
                fileType: "B",
                dataType: 'B3'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
            },
            events: {
                onSuccessUpload: uploadEvents.videos
            }
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
		selectModel : {
			legalRegulationSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			svRandomCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			checkerSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
        checkBasis: {
            visible: false,
            filterData: null
        }
	};

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.pictures.params.recordId = recordId;
        dataModel.videos.params.recordId = recordId;
        dataModel.videoPics.params.recordId = recordId;
    }
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
            checkBasisSelectModal: checkBasisSelectModal,
            "userSelectModal":userSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            doDeleteVideo: function (fileId, index) {
			    var _this = this;
                api.deleteFile(null, [fileId]).then(function (data) {
                    if (data.data && data.error != '0') {
                        return;
                    } else {
                        _this.mainModel.vo.videos.splice(index, 1);
                    }
                })
            },
            doDeleteFile: function(fileId, index, array) {
                api.deleteFile(null, [fileId]).then(function (data) {
                    if (data.data && data.error != '0') {
                        return;
                    } else {
                        array.splice(index, 1);
                    }
                })
            },
            doShowLegalRegulationSelectModal: function () {
                this.checkBasis.visible = true;
            },
            doVideosSuccessUpload: uploadEvents.videos,
            doPicSuccessUpload: uploadEvents.pictures,
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", fileId);
                }, 50);
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath,
            doSaveLegalRegulations: function (data) {
                var o = data[0];
                if (!_.isPlainObject(o)) {
                    return;
                }
                this.mainModel.vo.legalRegulationId = o.id;
                this.mainModel.vo.legalRegulation = o;
            },
			doShowCheckerSelectModal : function() {
				this.selectModel.checkerSelectModel.visible = true;
				//this.selectModel.checkerSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveChecker : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checker = selectedDatas[0];
				}
			},
            afterInit: function (_vo) {
			    var vo = this.mainModel.vo;
				if (this.mainModel.opType === 'create') {
                    vo.pictures = [];
                    vo.videos = [];
					this.mainModel.vo.compId = _vo.compId;
                    this.mainModel.vo.checker = {
                    	id: LIB.user.id,
						name: LIB.user.name
					};
					this.mainModel.vo.checkDate = new Date().Format("yyyy-MM-dd");
                    api.getUUID().then(function (res) {
                        vo.id = res.data;
                        initUploadorRecordId(res.data);
                    });
				}
                if (this.mainModel.opType === 'update') {
                    // 初始化图片
                    initUploadorRecordId(_vo.svRandomCheckRecordId);
                    api.listFile({recordId: _vo.svRandomCheckRecordId}).then(function (res) {
                        vo.pictures = [];
                        vo.videos = [];
                        var fileData = res.data;
                        //初始化图片数据
                        _.each(fileData, function (pic) {
                            if (pic.dataType === "B1") {
                                vo.pictures.push({fileId: pic.id});
                            } else if (pic.dataType === "B2") {
                                vo.videos.push({fileId: pic.id});
                            }
                        });
                    });
                }
            },
            beforeDoSave: function () {
                if (!this.mainModel.vo.orgId) {
                    this.mainModel.vo.orgId = this.mainModel.vo.compId;
                }
            }
		}
	});
	
	return detail;
});