define(function (require) {

    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    var template = require("text!./task-detail.html");
    var api = require("../vuex/api");

    var newVO = function () {
        return {
            //自评任务结果id
            id : null,
            attr1:null,
            attr2:null,
            attr3:null,
            asmtItem:{id:'', name:''},
            asmtTask:{id:null,status:null},
            result:null,
            remark:null,
            isAccept:null,
            isShared:null,
            score:null,
            feedback:null,
            asmtBasisList:null
        }
    };
    var defaultModel = {
        mainModel: {
            title: '自评任务详情',
            tabName: '1'
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picList: null,
        picBasisList:null,
        videoList: null,
        referenceMaterials: null,
        vo: newVO()
    };

    var opts = {
        template: template,
        components: {},
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return defaultModel;
        },
        computed: {
            asmtBasisText: function() {
                var text = _.get(this.vo, 'asmtBasisList[0].name', '');
                return text.replace(/[\r\n]/g, '<br/>');
            }
        },
        methods: {
            _init: function (obj) {
                this.vo = newVO();
                this.videoList = [];
                this.picList = [];
                this.picBasisList = [];
                this.referenceMaterials = [];
                _.deepExtend(this.vo, obj);
            },

            _getFiles: function (id) {
                if (_.isEmpty(id)) {
                    return;
                }
                var _this = this;
                api.listFile({recordId: id}).then(function (res) {
                    _this.picList = [];
                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "V1") {
                            _this.picList.push(LIB.convertFileData(pic));
                        }
                    });
                });
            },
            _getBasisFiles: function (id) {
                if (_.isEmpty(id)) {
                    return;
                }
                var _this = this;
                api.listFile({recordId: id}).then(function (res) {
                    _this.picBasisList = [];
                    _this.videoList = [];
                    _this.referenceMaterials = [];

                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "U1") {
                            _this.picBasisList.push(LIB.convertFileData(pic));
                        }
                        if (pic.dataType === "U2") {
                            _this.videoList.push(LIB.convertFileData(pic));
                        }
                        if (pic.dataType === "U4") {
                            _this.referenceMaterials.push(LIB.convertFileData(pic));
                        }
                    });
                });
            },
            changeTab: function (tabEle) {
                this.mainModel.tabName = tabEle.key;
            },
            convertFilePath: LIB.convertFilePath,
            convertPath: LIB.convertPath,
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            doClose: function () {
                this.visible = false;
            }
        },
        events: {
            "ev_task_detail": function (id, obj) {
                this.mainModel.tabName = "1";
                this._init(obj);
                this._getFiles(id);
                if (_.isArray(this.vo.asmtBasisList) && this.vo.asmtBasisList.length > 0) {
                    this._getBasisFiles(this.vo.asmtBasisList[0].id);
                }
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});