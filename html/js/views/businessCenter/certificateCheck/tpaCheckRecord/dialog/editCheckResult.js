define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./editCheckResult.html");

    var newVO = function () {
        return {
            id: null,
            problem: null,
            remark: null,
            checkItemId: null,
            checkRecordId:null,
            checkResult : null,
            isRectification :0,
            rightPictures: [],
            wrongPictures: [],
        }
    };
    //图片上传后回调方法声明
    var uploadEvents = {
        //正确图片
        rightPic: function (file, rs) {
            dataModel.mainModel.vo.rightPictures.push({fileId: rs.content.id, fileExt: rs.content.ext});
        },
        //视频
        wrongPic: function (file, rs) {
            dataModel.mainModel.vo.wrongPictures.push({fileId: rs.content.id, fileExt: rs.content.ext});
        }
    }
    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            resultList:[],
            illegal :{},
            legal : {}
        },
        isProblem:true,
        ispic:true,
        isvideo:true,
        orgList: [],
        selectedOrg: [],
        //正确图片配置
        rightPicModel: {
            params: {
                recordId: null,
                dataType: 'E1'
            },
            events: {
                onSuccessUpload: uploadEvents.rightPic
            }
        },
        //视频配置
        wrongPicModel: {
            params: {
                recordId: null,
                dataType: 'E2'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "video", extensions: "mp4"}]
            },
            events: {
                onSuccessUpload: uploadEvents.wrongPic
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
        isShow:true,
        isRemarkShow:true,
        rules:{
            problem:[//自定义校验规则
                {validator:function(rule, value, callback){
                    if(value){
                        return callback();
                    }else if(dataModel.isProblem == false){
                        return callback(new Error("请填写问题描述"));
                    }else{
                        return callback();
                    }
                }}
            ],
            rightPictures:[//自定义校验规则
                {validator:function(rule, value, callback){
                    if(value.length > 0){
                        return callback();
                    }else if(dataModel.ispic == false){
                        return callback(new Error("请上传图片"));
                    }else{
                        return callback();
                    }
                }}
            ],
            wrongPictures:[//自定义校验规则
                {validator:function(rule, value, callback){
                    if(value.length > 0){
                        return callback();
                    }else if(dataModel.isvideo == false){
                        return callback(new Error("请上传视频"));
                    }else{
                        return callback();
                    }
                }}
            ]
        },
    };

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.rightPicModel.params.recordId = recordId;
        dataModel.wrongPicModel.params.recordId = recordId;
    }
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
        //监听下拉框值变化
        // watch:{
        //     "mainModel.vo.checkResult":function(){
        //       if(this.mainModel.vo.checkResult == "2"){
        //           this.isShow = false;
        //       }else{
        //           this.isShow = true;
        //       }
        //     }
        // },
        methods: {
            rightPic:function(data){
                LIB.Msg.info("上传成功");
                dataModel.mainModel.vo.rightPictures.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
            },
            //视频
            wrongPic:function(data){
                dataModel.mainModel.vo.wrongPictures.push({fileId:data.rs.content.id,fileExt:data.rs.content.ext});
                LIB.Msg.info("上传成功");

            },
            //保存检查记录详情
            doSave: function () {
                var _this=this;
                _this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.$dispatch("ev_gridRefresh", _this.mainModel.vo.id, _this.mainModel.vo.checkResult, _this.mainModel.vo.problem, _this.mainModel.vo.remark, _this.mainModel.vo.checkItemId);
                    }
                });
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
            doCancel: function () {
                this.$dispatch("ev_editCanceled");
            },
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player",fileId);
                }, 50);
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath
        },
        events: {
            //edit框数据加载
            "ev_editCheckResult": function (nVal,checkRecordId,config,fieldName,data) {
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                _vo.rightPictures = [];
                _vo.wrongPictures=[];
                //清空数据
                _.extend(_vo, newVO());
                //data是从detail带过来的数据
                if(data && data.id){
                    if(nVal.type==0){
                        _vo.problem = data.talkResult ;
                        _vo.remark =data.suggestStep;
                        _vo.id = data.id;
                    }else{
                        _.deepExtend(_vo, data);
                    }
                    initUploadorRecordId(data.id);
                    api.listFile({recordId : data.id}).then(function(res){
                        _vo.rightPictures = [];
                        _vo.wrongPictures=[];
                        var fileData = res.data;
                        //初始化图片数据
                        _.each(fileData,function(pic){
                            if(pic.dataType == "E1"){//E1隐患图片
                                _vo.rightPictures.push({fileId:pic.id});
                            }else if(pic.dataType == "E2"){//E2隐患视频
                                _vo.wrongPictures.push({fileId:pic.id});
                            }
                        });
                    });
                }else{
                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                        initUploadorRecordId(res.data);
                    });
                }
                _vo.checkRecordId=checkRecordId;
                _vo.checkItemId = nVal.id;
                _data.resultList = new Array();
                _data.illegal = config.checkResult.illegal;
                _data.legal = config.checkResult.legal;
                if (fieldName == "operation1"){
                   dataModel.isRemarkShow = false;
                    _vo.checkResult = 1;
                }else if (fieldName == "operation2"){
                    dataModel.isRemarkShow = true;
                    _vo.checkResult = 0;
                }
                if (this.mainModel.illegal.description == 1){
                    dataModel.isProblem = false;
                }
                if (this.mainModel.illegal.photoForce == 1){
                    dataModel.ispic = false;
                }
                if (this.mainModel.illegal.videoForce == 1){
                    dataModel.isvideo = false;
                }
            },
        }
    });

    return detail;
});