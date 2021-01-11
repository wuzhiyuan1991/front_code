define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    require("components/select/Select");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./viewDetail.html");

    var newVO = function () {
        return {
            checkRecordDetailId: null,
            name: null,
            type: null,
            problem: null,
            remark: null,
            talkResult: null,
            suggestStep: null,
            vedioList: [],
            picList: [],
            audioList: [],
            show: false,
            checkResult: null,
            latentDefect: null,
            attr1:null,
//            legalRegulation: {id: '', name: ''}
        }
    };
    var dataModel = {
        mainModel: {
            vo: newVO(),
            tabName: "1",
            list:[],  // 多问题时的导航栏
            listIndex:0
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        picModel: {
            title: "图片显示",
            show: false,
            file: null
        },
        audioModel: {
            visible: false,
            path: null
        },
        itemName:''
    };


    //声明detail组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            convertPicPath: LIB.convertPicPath,
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            convertPath: LIB.convertPath,
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            changeTab: function (tabEle) {
                this.mainModel.tabName = tabEle.key;
            },
            doClose: function () {
                this.$dispatch("ev_viewDetailClose")
            },
            doPlayAudio: function (path) {debugger;
                this.audioModel.path = path;
                this.audioModel.visible = true;
            },

            initFun:function (obj) {

                var _this = this;
                _this.itemName = '';
                api.getDetailproblem({id:obj.checkRecordDetailId}).then(function (res) {
                    _.each(res.data,function (item) {
                        item.picList = [];
                        item.vedioList = [];
                        item.audioList = [];
                    });
                    _this.mainModel.list = [].concat(res.data);
                    if(_this.mainModel.list.length>0){
                        _this.mainModel.vo = _.extend(_this.mainModel.vo,_this.mainModel.list[0]);
                    }else{
                        _this.mainModel.vo = newVO();
                    }
                    if(obj.name){
                        _this.$set("mainModel.vo.name",obj.name);
                        _this.itemName = obj.name;
                    }

                    // if(_this.mainModel.vo.picList.length==0 && _this.mainModel.vo.vedioList.length==0 && _this.mainModel.vo.audioList.length==0){
                    //     _this.getFile(_this.mainModel.vo.id);
                    // }
                    if(_this.mainModel.vo && _this.mainModel.vo.id){
                        _this.getFile(_this.mainModel.vo.id);
                    }

                });
            },

            changeLeftTab:function (index) {
                this.mainModel.listIndex = index;
                this.mainModel.vo = this.mainModel.list[index];
                if(this.mainModel.vo.picList.length==0 && this.mainModel.vo.vedioList.length==0 && this.mainModel.vo.audioList.length==0){
                    this.getFile(this.mainModel.vo.id);
                }
            },

            getFile:function (id) {
                var _this = this;
                var _vo = this.mainModel.vo;
                //初始化图片
                api.listFile({recordId: id}).then(function (res) {
                    _vo.picList = [];
                    _vo.vedioList = [];
                    _vo.audioList = [];

                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "E1") {//E1隐患图片
                            _vo.picList.push(LIB.convertFileData(pic));
                        }
                        else if (pic.dataType === "E2") {//E2隐患视频
                            _vo.vedioList.push(LIB.convertFileData(pic));
                        }
                        else if(pic.dataType === "E5") {
                            _vo.audioList.push(LIB.convertFileData(pic));
                        }
                    });
                });
            }

        },
        events: {
            //数据加载
            "ev_viewDetailReload": function (obj) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                dataModel.mainModel.vo = newVO();
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.list = [];
                this.mainModel.listIndex = 0;

                //初始化数据
                _.deepExtend(_vo, obj);

                //现实tab 并加载
                this.mainModel.vo.show = true;
                this.mainModel.tabName = "1";
                this.initFun(obj);
                return ;  // 后面添加的并且注释后面的

//				this.$nextTick(function(){
//					this.mainModel.tabName = "1";
//				});
                //初始化图片
                api.listFile({recordId: _vo.checkRecordDetailId}).then(function (res) {
                    _vo.picList = [];
                    _vo.vedioList = [];
                    _vo.audioList = [];

                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "E1") {//E1隐患图片
                            _vo.picList.push(LIB.convertFileData(pic));
                        }
                        else if (pic.dataType === "E2") {//E2隐患视频
                            _vo.vedioList.push(LIB.convertFileData(pic));
                        }
                        else if(pic.dataType === "E5") {
                            _vo.audioList.push(LIB.convertFileData(pic));
                        }
                    });
                });

//                var _this = this;
//                api.getViolation({relId: _vo.checkRecordDetailId, relType:1}).then(function (res) {
//                    _this.mainModel.vo.legalRegulation = _.get(res, "data[0].legalRegulation", {});
//                })
            }
        }
//		,
//		ready:function(){
//			var _vo = dataModel.mainModel.vo;
//		}
    });

    return detail;
});