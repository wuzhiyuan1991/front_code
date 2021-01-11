define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./certRetrialFormModal.html");
	// var certSelectModal = require("componentsEx/selectTableModal/certSelectModal");
	// var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//预定复审时间
			retrialDate : null,
			//复审结果 0:未复审,1:通过,2:未通过
			result : '1',
			//证书记录上传时间
			uploadDate : null,
			//证书
			cert : {id:'', name:''},
			//上传人
			uploader : {id:'', name:''},
			//证书文件
			cloudFiles : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"retrialDate" : [LIB.formRuleMgr.require("预定复审时间")],
				"result" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("复审结果")),
				"uploadDate" : [LIB.formRuleMgr.allowStrEmpty],
				"cert.id" : [LIB.formRuleMgr.require("证书")],
				"uploader.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			certSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			uploaderSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
        resultList: null,
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'O2',
                fileType: 'O'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "png,jpg,jpeg,gif" }]
            }
        },
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			// "certSelectModal":certSelectModal,
			// "userSelectModal":userSelectModal,
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                console.log(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
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
            afterInitData : function() {
                this.uploadModel.params.recordId = this.mainModel.vo.id;
            },
			// doShowCertSelectModal : function() {
			// 	this.selectModel.certSelectModel.visible = true;
			// 	//this.selectModel.certSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			// },
			// doSaveCert : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.cert = selectedDatas[0];
			// 	}
			// },
			// doShowUploaderSelectModal : function() {
			// 	this.selectModel.uploaderSelectModel.visible = true;
			// 	//this.selectModel.uploaderSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			// },
			// doSaveUploader : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.uploader = selectedDatas[0];
			// 	}
			// },
			
		},
		ready: function () {
			this.resultList = _.filter(this.getDataDicList('itm_cert_retrial_result'), function (item) {
				return item.id !== '0';
            });
        }
	});
	
	return detail;
});