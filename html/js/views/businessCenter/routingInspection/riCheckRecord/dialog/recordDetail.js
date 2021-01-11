define(function (require) {

    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    var template = require("text!./recordDetail.html");
    var api = require("../vuex/api");


    var emptyResult = function () {
        return {
            id: '',
            code: '',
            result: ''
        }
    };
    var newVO = function () {
        return {
            name: '',
            checkBasis: '',
            checkResult: '',
            lastCheckResult: '',
            problem: ''
        }
    };
    var defaultModel = {
        mainModel: {
            title: '巡检结果',
            tabName: '1'
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picList: null,
        videoList: null,
        vo: newVO(),
        resultParams: null,
        isParam: false,
        dangerObj: emptyResult(),
        lastDangerObj: emptyResult()
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
            showThisTime: function () {
                return this.dangerObj.result === '0' && !!this.dangerObj.id
            },
            showLastTime: function () {
                return this.lastDangerObj.result === '0' && !!this.lastDangerObj.id
            },
            specialtyText: function () {
                return LIB.getDataDic('specialty', this.vo.specialty);
            }
        },
        methods: {
            _init: function (obj) {
                this.resultParams = _.get(obj, "riCheckItem.riCheckItemParam", {});
                this.vo = newVO();
                this.videoList = [];
                this.picList = [];
                this.vo.name = _.get(obj, "riCheckItem.name");
                this.vo.checkBasis = _.get(obj, "riCheckItem.checkBasis");
                this.vo.checkResult = this._getResult(obj);
                this.vo.problem = _.get(obj, "problem");
                this.vo.specialty = _.get(obj, "specialty");
                this.vo.problemFinder = _.get(obj, "problemFinder");
            },
            _getResult: function (item) {
                var results = _.get(item, "riCheckItem.riCheckResults");
                if(results && results.length > 0) {
                    this.isParam = false;
                    var result = results[0];
                    if(!_.isEmpty(result)) {
                        if(item.checkResult === '1') {
                            return '<span style="color: blue;">' + result.name + '</span>'
                        } else {
                            return '<span style="color: red;">' + result.name + '</span>'
                        }
                    }
                    return '';
                } else {
                    var params = _.get(item, "riCheckItem.riCheckItemParam");
                    var param = _.get(item, "checkParamResult");
                    if(!params || !param) {
                        return ''
                    }
                    this.isParam = true;
                    if(item.checkResult === '1') {
                        return '<span style="color: blue;">' + param + params.unit + '</span>'
                    } else {
                        return '<span style="color: red;">' + param + params.unit + '</span>'
                    }
                }
            },
            _setLastResult: function (obj) {
                if(!obj) {
                    return '';
                }

                this.lastDangerObj.result = obj.checkResult;
                this._getCode(obj.id, 1);

                var result = obj.riCheckResult;
                if(result) {
                    if(obj.checkResult === '1') {
                        return '<span style="color: blue;">' + result.name + '</span>'
                    } else {
                        return '<span style="color: red;">' + result.name + '</span>'
                    }
                }
                result = obj.checkParamResult;
                var params = this.resultParams;
                if(result) {
                    if(obj.checkResult === '1') {
                        return '<span style="color: blue;">' + result + params.unit + '</span>'
                    } else {
                        return '<span style="color: red;">' + result + params.unit + '</span>'
                    }
                }
                return '';
            },
            _getFiles: function (id) {
                var _this = this;
                api.listFile({recordId: id}).then(function (res) {
                    _this.picList = [];
                    _this.videoList = [];
                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "Y1") { //Y1隐患图片
                            _this.picList.push(LIB.convertFileData(pic));
                        } else if (pic.dataType === "Y2") { //Y2隐患视频
                            _this.videoList.push(LIB.convertFileData(pic));
                        }
                    });
                });
            },
            _getLastResult: function (obj) {
                var _this = this;
                var params = {
                    checkItemId: obj.riCheckItem.id,
                    createDate: obj.createDate
                };
                api.getLastResult(params).then(function (res) {
                    _this.vo.lastCheckResult = _this._setLastResult(res.data);
                })
            },
            changeTab: function (tabEle) {
                this.mainModel.tabName = tabEle.key;
            },
            convertPath: LIB.convertPath,
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            doClose: function () {
                this.visible = false;
            },
            /**
             * 获取隐患记录的code
             * @param id
             * @param time  1:上次巡检, 2:本次巡检
             * @private
             */
            _getCode: function (id, time) {
                var _this = this;
                api.getDangerCode({id: id}).then(function (res) {
                    if(time === 2) {
                        _this.dangerObj.id = _.get(res.data, "id");
                        _this.dangerObj.code = _.get(res.data, "code");
                    } else if(time === 1) {
                        _this.lastDangerObj.id = _.get(res.data, "id");
                        _this.lastDangerObj.code = _.get(res.data, "code");
                    }
                })
            },
            openNewTab: function (time) {
                var obj = time === 1 ? this.lastDangerObj : this.dangerObj;
                if(!_.get(obj, "id")) {
                    return LIB.Msg.error("还未生成隐患记录");
                }
                window.open("/html/main.html#!/hiddenGovernance/businessCenter/total?method=detail&id=" + obj.id + "&code="  + obj.code)
            }
        },
        events: {
            "ev_record_detail": function (id, obj) {
                this.dangerObj = emptyResult();
                this.lastDangerObj = emptyResult();
                this.mainModel.tabName = "1";
                this._init(obj);
                this._getFiles(id);
                this._getLastResult(obj);
                // 不合格需要获取隐患记录的code，用于跳转
                if(obj.checkResult === '0') {
                    this.dangerObj.result = '0';
                    this._getCode(id, 2)
                }
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});