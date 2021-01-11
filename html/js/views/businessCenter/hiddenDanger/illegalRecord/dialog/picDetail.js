define(function (require) {

    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    var template = require("text!./picDetail.html");
    var api = require("../vuex/api");

    var newVO = function () {
        return {
            //自评任务结果id
            id : null,
            remarks:null,
            pictures:[],
            signatureImgs:[]
        }
    };
    var defaultModel = {
		mainModel:{
			vo: newVO(),
            tabName: "1"
		}
    };

    var detail = LIB.Vue.extend({
        template: template,
        data: function () {
            return defaultModel;
        },
        methods: {
            _init: function (obj) {
                this.mainModel.vo = newVO();
                _.deepExtend(this.mainModel.vo, obj);
            },
            changeTab: function (tabEle) {
                this.mainModel.tabName = tabEle.key;
            },
            _getFiles: function (id) {
                if (_.isEmpty(id)) {
                    return;
                }
                var _this = this;
                api.listFile({recordId: id}).then(function (res) {
                    
                    var fileData = res.data;
                    //初始化图片数据
                    var pictures = [];
                    var signatureImgs = [];
                    _.each(fileData, function (pic) {
                        if(pic.dataType == 'E4') {
                            pictures.push({fileId: pic.id});
                        }else if(pic.dataType == 'E6') {
                            signatureImgs.push({fileId: pic.id});
                        }
                    });
                    _this.mainModel.vo.pictures = pictures.concat();
                    _this.mainModel.vo.signatureImgs = signatureImgs.concat();
                    
                });
            },
            convertPath: LIB.convertPath,
            doClose: function () {
                this.visible = false;
            }
        },
        events: {
            "ev_pic_detail": function (id, remarks) {
                this.mainModel.tabName = "1";
                this._init({id:id,remarks:remarks});
                this._getFiles(id);
            }
        }
    });

    return detail;
});