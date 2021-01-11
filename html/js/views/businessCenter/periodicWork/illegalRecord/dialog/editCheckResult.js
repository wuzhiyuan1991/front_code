define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./editCheckResult.html");

//    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");
    var newVO = function () {
        return {
            id: null,
            problem: null,
            remark: null,
            groupId:null,
            checkItemId: null,
            checkRecordId: null,
            checkResult: null,
            isRectification: 0,
            latentDefect: null,
            rightPictures: [],
            wrongPictures: [],
//            legalRegulationId: null,
//            legalRegulation: {id: '', name: ''}
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
    };
    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            list:[],
            listIndex:0,
            isOptions2:false
        },
        isProblem: false,
        ispic: false,
        isvideo: false,
        //正确图片配置
        rightPicModel: {
            params: {
                recordId: null,
                dataType: 'E1',
                fileType : 'E'
            },
            events: {
                onSuccessUpload: uploadEvents.rightPic
            }
        },
        //视频配置
        wrongPicModel: {
            params: {
                recordId: null,
                dataType: 'E2',
                fileType : 'E'
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
        isShow: true,
        isRemarkShow: true,
        rules: {
            problem: [
                LIB.formRuleMgr.length(500),
                //自定义校验规则
                {
                    validator: function (rule, value, callback) {
                        if (_.trim(value)) {
                            return callback();
                        } else if (dataModel.isProblem === true) {
                            return callback(new Error("请填写描述"));
                        } else {
                            return callback();
                        }
                    }
                }
            ],
            latentDefect: [LIB.formRuleMgr.length(500)],
            remark: [LIB.formRuleMgr.length(500)],
            rightPictures: [
                //自定义校验规则
                {
                    validator: function (rule, value, callback) {
                        if (value.length > 0) {
                            return callback();
                        } else if (dataModel.ispic === true) {
                            return callback(new Error("请上传图片"));
                        } else {
                            return callback();
                        }
                    }
                }
            ],
            wrongPictures: [
                //自定义校验规则
                {
                    validator: function (rule, value, callback) {
                        if (value.length > 0) {
                            return callback();
                        } else if (dataModel.isvideo === true) {
                            return callback(new Error("请上传视频"));
                        } else {
                            return callback();
                        }
                    }
                }
            ]
        },
//        checkBasis: {
//            visible: false,
//            filterData: null
//        }
    };

    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.rightPicModel.params.recordId = recordId;
        dataModel.wrongPicModel.params.recordId = recordId;
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
        components: {
//            checkBasisSelectModal: checkBasisSelectModal
        },
        data: function () {
            return dataModel;
        },
        props:{
          areaId:{
              default:null
          }
        },
        computed: {
            requireProblem: function () {
                return this.isProblem ? 'is-required' : '';
            },
            requirePic: function () {
                return this.ispic ? 'is-required' : '';
            },
            requireVideo: function () {
                return this.isvideo ? 'is-required' : '';
            }
        },
        methods: {
//            doShowLegalRegulationSelectModal: function () {
//                this.checkBasis.visible = true;
//            },
//            doSaveLegalRegulations: function (data) {
//                var o = data[0];
//                if (!_.isPlainObject(o)) {
//                    return;
//                }
//                this.mainModel.vo.legalRegulationId = o.id;
//                this.mainModel.vo.legalRegulation = o;
//            },
            // 点击切换
            changeTab:function (val) {
                var _this = this;
                this.mainModel.listIndex = val;
                this.mainModel.vo = this.mainModel.list[val];
                initUploadorRecordId( this.mainModel.vo.id);

                var _vo =  this.mainModel.vo;

                // api.listFile({recordId: this.mainModel.vo.id}).then(function (res) {
                //     _vo.rightPictures = [];
                //     _vo.wrongPictures = [];
                //
                //     var fileData = res.data;
                //     初始化图片数据
                //     _.each(fileData, function (pic) {
                //         if (pic.dataType === "E1") {//E1隐患图片
                //             _vo.rightPictures.push({fileId: pic.id});
                //         } else if (pic.dataType === "E2") {//E2隐患视频
                //             _vo.wrongPictures.push({fileId: pic.id});
                //         }
                //     });
                // });
            },

            // 校验


            // 删除
            doDelItem:function () {
                this.mainModel.list.splice(this.mainModel.listIndex, 1);
                if(this.mainModel.listIndex == this.mainModel.list.length){
                    this.mainModel.listIndex = this.mainModel.listIndex-1;
                }
                this.changeTab(this.mainModel.listIndex);
            },

            // 点击新增
            doAddItem:function () {
                var _this = this;
                _this.mainModel.list.push(newVO());
                _this.mainModel.listIndex = _this.mainModel.list.length-1;
                _this.mainModel.vo = _this.mainModel.list[_this.mainModel.list.length-1];

                api.getUUID().then(function (res) {
                    _this.mainModel.list[_this.mainModel.list.length-1].id = res.data;
                    _this.mainModel.list[_this.mainModel.list.length-1].checkItemId =  _this.mainModel.list[0].checkItemId;
                    _this.mainModel.list[_this.mainModel.list.length-1].checkRecordId =  _this.mainModel.list[0].checkRecordId;
                    _this.mainModel.list[_this.mainModel.list.length-1].checkResult =  _this.mainModel.list[0].checkResult;
                    _this.mainModel.list[_this.mainModel.list.length-1].dominationAreaId =  _this.mainModel.list[0].dominationAreaId;
                    _this.mainModel.list[_this.mainModel.list.length-1].groupId =  _this.mainModel.list[0].groupId;
                    _this.mainModel.list[_this.mainModel.list.length-1].isRectification =  _this.mainModel.list[0].isRectification;

                    initUploadorRecordId(res.data);
                });
            },

            rightPic: function (data) {
                LIB.Msg.info("上传成功");
                dataModel.mainModel.vo.rightPictures.push({fileId: data.rs.content.id, fileExt: data.rs.content.ext});
            },
            //视频
            wrongPic: function (data) {
                dataModel.mainModel.vo.wrongPictures.push({fileId: data.rs.content.id, fileExt: data.rs.content.ext});
                LIB.Msg.info("上传成功");

            },
            // 检查是否有输入内容或上传文件， 来改变检查结果旁图标的颜色
            hasContent: function () {

                var vo = this.mainModel.list[0];
                // if(this.mainModel.vo.problem
                //     || this.mainModel.vo.latentDefect
                //     || this.mainModel.vo.remark
                //     || this.mainModel.vo.rightPictures.length > 0
                //     || this.mainModel.vo.wrongPictures.length > 0) {
                //     return true;
                // }
                if(vo.problem
                    || vo.latentDefect
                    || vo.remark
                    || vo.rightPictures.length > 0
                    || vo.wrongPictures.length > 0) {
                    return true;
                }
                return false
            },

            // 数组校验
            checkListDetail:function(num, checkRecordDetailProblems){
                var index = num;
                var _this = this;
                _this.changeTab(index);
                this.$nextTick(function () {
                    _this.$refs.ruleform.validate(function (valid) {
                        if (valid) {
                            if(num == _this.mainModel.list.length-1){
                                _this.$dispatch(
                                    "ev_gridRefresh",
                                    // _this.mainModel.vo.id,
                                    // _this.mainModel.vo.checkResult,
                                    // _this.mainModel.vo.problem,
                                    // _this.mainModel.vo.remark,
                                    // _this.mainModel.vo.checkItemId,
                                    // _this.mainModel.vo.latentDefect,
                                    // _this.type,
                                    // _this.hasContent(),
                                    // _this.mainModel.vo.legalRegulationId,
                                    // _this.mainModel.vo.groupId,
                                    _this.mainModel.list[0].id,
                                    _this.mainModel.list[0].checkResult,
                                    _this.mainModel.list[0].problem,
                                    _this.mainModel.list[0].remark,
                                    _this.mainModel.list[0].checkItemId,
                                    _this.mainModel.list[0].latentDefect,
                                    _this.type,
                                    _this.hasContent(),
                                    _this.mainModel.list[0].legalRegulationId,
                                    _this.mainModel.list[0].groupId,
                                    checkRecordDetailProblems
                                );
                                // _.extend(this.mainModel.oldList, _this.mainModel.list);
                                return ;
                            }
                            index++;
                            _this.checkListDetail(index, checkRecordDetailProblems);
                        }
                    });
                })
            },


            gotoSave:function () {
                var checkRecordDetailProblems = [];
                var _this = this;
                _.each(this.mainModel.list, function (item) {
                    checkRecordDetailProblems.push({
                        checkItemId: _this.mainModel.list[0].checkItemId,
                        checkResult: _this.mainModel.list[0].checkResult,
                        checkRecordId: _this.mainModel.list[0].checkRecordId,
                        problem: item.problem,
                        remark: item.remark,
                        latentDefect: item.latentDefect,
                        reformType: '1',
                        dominationAreaId: _this.mainModel.list[0].dominationAreaId,
                        checkObjectId: _this.mainModel.list[0].checkObjectId,
                        legalRegulationId:_this.mainModel.list[0].legalRegulationId,
                        groupId:_this.mainModel.list[0].groupId,
                        id: item.id,
                        detailId: _this.mainModel.list[0].detailId,
                        isNeedGeneratePool: '0',
                        wrongPictures:item.wrongPictures,
                        rightPictures:item.rightPictures
                    })
                });
                _this.checkListDetail(0, checkRecordDetailProblems);

            },

            //保存检查记录详情
            doSave: function () {
                var _this = this;

                // checkRecordDetailProblems 编辑这个值
                if(this.mainModel.list[0].detailId) {
                    this.gotoSave()
                }else{
                    api.getUUID().then(function (res) {
                        // _this.mainModel.vo.id = res.data;
                        _this.mainModel.vo.detailId = res.data;
                        _this.mainModel.list[0].detailId = res.data;
                        _this.gotoSave();
                    });
                }
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
                    videoHelper.create("player", fileId);
                }, 50);
            },
            buildRequiredConfig: function (config, checkItemId) {
                for(var i = 0, item; item = config.children[i++];) {
                    if(item.name === 'description') {
                        if(item.result === '3') {
                            dataModel.isProblem = true;
                        }
                        if(item.result === '2' && _.includes(_.pluck(item.systemBusinessSetDetails, 'result'), checkItemId)) {
                            dataModel.isProblem = true;
                        }
                    } else if (item.name === 'photoForce') {
                        if(item.result === '3') {
                            dataModel.ispic = true;
                        }
                        if(item.result === '2' && _.includes(_.pluck(item.systemBusinessSetDetails, 'result'), checkItemId)) {
                            dataModel.ispic = true;
                        }
                    } else if (item.name === 'videoForce') {
                        if(item.result === '3') {
                            dataModel.isvideo = true;
                        }
                        if(item.result === '2' && _.includes(_.pluck(item.systemBusinessSetDetails, 'result'), checkItemId)) {
                            dataModel.isvideo = true;
                        }
                    }
                }

            },
            updateOption:function (fieldName) {
                this.mainModel.isOptions2 = false;
                if(fieldName =="operation2"){
                    this.mainModel.isOptions2 = true;
                }
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath
        },
        events: {
            /**
             * edit框数据加载
             * @param nVal 点击的表格行数据
             * @param checkRecordId 检查记录id
             * @param config 必填项验证配置
             * @param fieldName 单元格的地段名
             * @param data 数据详情
             */
            "ev_editCheckResult": function (nVal, checkRecordId, config, fieldName, data, dominationAreaId) {
                this.type = nVal.type;
                dataModel.isProblem = false;
                dataModel.ispic = false;
                dataModel.isvideo = false;
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                _vo.rightPictures = [];
                _vo.wrongPictures = [];
                this.$refs.ruleform.resetFields();


                this.mainModel.listIndex = 0;
                this.mainModel.list = [];
                this.mainModel.listIndex = 0;
                this.mainModel.list.push(newVO());

                if(data && data.checkRecordDetailProblems){
                    this.mainModel.list = _.cloneDeep(data.checkRecordDetailProblems);
                    // this.mainModel.oldList = data.checkRecordDetailProblems;
                }
                _vo = this.mainModel.list[0];
                this.mainModel.vo = this.mainModel.list[0];

                this.updateOption(fieldName);

                //清空数据
                // _.extend(_vo, newVO());

                //data是从detail带过来的数据
                if (data && data.id) {
                    if (nVal.type === '0') {
                        _vo.problem = data.talkResult;
                        _vo.latentDefect = data.latentDefect;
                        _vo.remark = data.suggestStep;
                        _vo.id = data.id;
                    } else {
                        // _.deepExtend(_vo, data);

                        _vo = this.mainModel.list[0];
                        this.mainModel.vo = this.mainModel.list[0];
                        // this.mainModel.vo.detailId = data.id;
                    }

                    initUploadorRecordId(data.id);

                    api.listFile({recordId: data.id}).then(function (res) {
                        _vo.rightPictures = [];
                        _vo.wrongPictures = [];
                        var fileData = res.data;
                        //初始化图片数据
                        _.each(fileData, function (pic) {
                            if (pic.dataType === "E1") {//E1隐患图片
                                _vo.rightPictures.push({fileId: pic.id});
                            } else if (pic.dataType === "E2") {//E2隐患视频
                                _vo.wrongPictures.push({fileId: pic.id});
                            }
                        });
                    });

                } else {

                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                        initUploadorRecordId(res.data);
                    });
                }

                _vo.checkRecordId = checkRecordId;
                _vo.checkItemId = nVal.id;
                _vo.groupId = nVal.groupId;

                // 给属地赋值
                if(dominationAreaId){
                    this.mainModel.list[0].dominationAreaId = dominationAreaId;
                }

                // 分析必填项
                if (fieldName === "operation1") {
                    dataModel.isRemarkShow = false;
                    _vo.checkResult = '1';

                    this.buildRequiredConfig(config.legal, nVal.id);

                } else if (fieldName === "operation3"){

                    dataModel.isRemarkShow = false;
                    _vo.checkResult = '2';

                } else if (fieldName === "operation2") {
                    dataModel.isRemarkShow = true;
                    _vo.checkResult = '0';

                    this.buildRequiredConfig(config.illegal, nVal.id);
                }
            }
        }
    });

    return detail;
});