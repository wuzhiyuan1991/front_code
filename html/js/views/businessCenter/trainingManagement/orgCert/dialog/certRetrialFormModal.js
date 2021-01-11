define(function(require){
	var LIB = require('lib');
	var api = require("../vuex/api");
 	//数据模型
	var tpl = require("text!./certRetrialFormModal.html");

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
        images: null
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {},
		props: {
			certId: {
				type: String,
				default: ''
			}
		},
		computed: {
			resultList: function () {
				return _.filter(this.getDataDicList('itm_cert_retrial_result'), function (item) {
                    return item.id !== '0';
                });
            }
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            changeCheckedRequired: function () {

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
                this.$dispatch("ev_retrialRefresh");
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
                            _this.$dispatch("ev_retrialRefresh");
                        })
                    }
                });
            },
            doViewImages: function (index) {
                this.images = _.map(this.mainModel.vo.cloudFiles, function (content) {
                    return LIB.convertFileData(content);
                });
                var _this = this;
                setTimeout(function () {
                    _this.$refs.imageViewer.view(index);
                }, 100);
            },
			beforeInit: function () {
                this.mainModel.vo.cloudFiles = [];
            },
			afterInit: function () {
                var _this = this;
                if (this.mainModel.opType === 'create') {
					api.queryNextRecord({id: this.certId}).then(function (res) {
                        _.deepExtend(_this.mainModel.vo, res.data);
                        _this.uploadModel.params.recordId = _this.mainModel.vo.id;
                        _this.mainModel.vo.result = '1';
                    })
                }
            },
            afterInitData : function() {
                this.uploadModel.params.recordId = this.mainModel.vo.id;
            }
		}
	});
	
	return detail;
});