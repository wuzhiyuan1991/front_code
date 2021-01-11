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
            pictures:[]
        }
    };
    var defaultModel = {
		mainModel:{
			vo: newVO()
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

            _getFiles: function (id) {
                if (_.isEmpty(id)) {
                    return;
                }
                var _this = this;
                api.listFile({recordId: id,dataType:"N4"}).then(function (res) {
                    
                    var fileData = res.data;
                    //初始化图片数据
                    var pictures = [];
                    _.each(fileData, function (pic) {
                       pictures.push(LIB.convertFileData(pic));
                    });
                    _this.mainModel.vo.pictures = pictures.concat();
                    
                });
            },
            doClose: function () {
                this.visible = false;
            }
        },
        events: {
            "ev_pic_detail": function (id, remarks) {
                this._init({id:id,remarks:remarks});
                this._getFiles(id);
            }
        }
    });

    return detail;
});