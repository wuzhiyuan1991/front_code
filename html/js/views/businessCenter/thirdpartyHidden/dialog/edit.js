define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");
    //弹框
    var checkObjectComponent = require("./checkObject");
    //风险评估模型
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");

    var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");

    tpl = LIB.renderHTML(tpl);

    var customTpl = '';
    var map = {
        "enum" : require('text!componentsEx/template/enum.html')
    };
    var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];
    var columsCfg1 = columsCfg;
    columsCfg = _.groupBy(columsCfg,"formItemGroup");
    customTpl = LIB.formRenderMgr.renderHtml(map, columsCfg);
    tpl = tpl.replace('$hook', customTpl);
    // LIB.Vue.partial('my-partial','');
    var newVO = function () {
        return LIB.dataRenderMgr.renderVO({
            id: null,
            type: null,
            //checkObjectId: null,
            //checkObjectName: null,
            danger: null,
            problem: null,
            riskLevel: null,
            riskModelId: null,
            pictures: [],
            videos: [],
            // disabled: false,
            // infoSource:null,//信息来源
            // profession:null,//专业
            // systemElement:null,//体系要素
            //公司id
            compId: null,
            //部門id
            orgId: null,
            equipment: {id: null, name: null},
            equipmentId: null,
        }, columsCfg1);
    }
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
    //数据模型

    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            //检查项类型
            checkItemTypes: LIB.getDataDicList("pool_type"),
            // infoSourceList:LIB.getDataDicList("info_source"),
            // professionList:LIB.getDataDicList("profession"),
            // systemElementList:LIB.getDataDicList("system_element")
            showEquipmentSelectModal:false,
        },
        //图片
        pictures: {
            params: {
                recordId: null,
                dataType: 'E1'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                //},
                //events: {
                //    onSuccessUpload: uploadEvents.pictures
            }
        },
        //视频
        videos: {
            params: {
                recordId: null,
                dataType: 'E2'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
                //},
                //events: {
                //    onSuccessUpload: uploadEvents.videos
            }
        },
        //视频第一帧
        videoPics: {
            params: {
                recordId: null,
                dataType: 'E3'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
            },
            events: {
                onSuccessUpload: uploadEvents.videos
            }
        },
        //选择受检对象
        checkObjectModel: {
            //显示弹框
            show: false,
            title: "选择受检对象",
            id: null
        },
        riskModel: {
            id: null,
            opts: [],
            result: null
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
        selectModel:{
            disabled:false
        },
        rules:{}
    };
    //初始化上传组件RecordId参数
    var initUploadorRecordId = function (recordId) {
        dataModel.pictures.params.recordId = recordId;
        dataModel.videos.params.recordId = recordId;
        dataModel.videoPics.params.recordId = recordId;
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
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components: {
//            "checkobject-component": checkObjectComponent,
            "equipmentSelectModal":equipmentSelectModal,
            'risk-model': riskModel
        },
        data: function(){
            var renderRules = _.bind(LIB.dataRenderMgr.renderRules, this,columsCfg);

            var rules = renderRules({
                    type: [
                        {required: true, message: '请选择隐患类型'}
                    ],
                    //riskModelId: [
                    //    {required: true, message: '请选择风险等级'}
                    //],
                    problem: [
                        {required: true, message: '请输入问题描述'},
                        LIB.formRuleMgr.length(500,1)
                        //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
                    ],
                    // danger: [
                    //     {required: true, message: '请输入建议措施'},
                    //     LIB.formRuleMgr.length(500,1)
                    //     //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
                    // ],
                    compId: [
                        {required: true, message: '请选择所属公司'},
                    ],
                    orgId: [
                        {required: true, message: '请选择所属部门'},
                    ],
                });

            dataModel.rules = _.extend(rules,dataModel.rules);
            return dataModel
        },
        methods: {
            doSave: function () {
                var _this = this;
                if(!this.riskModel){
                    this.riskModel={
                        id:null
                    }
                }
                this.mainModel.vo.riskLevel = JSON.stringify(this.riskModel);
                this.mainModel.vo.riskModelId = this.riskModel.id;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.mainModel.opType == "create") {
                            api.create(_this.mainModel.vo).then(function (res) {
                                _this.$dispatch("ev_editFinshed");
                                LIB.Msg.info("保存成功");
                            });
                        } else {
                            api.update(_this.mainModel.vo).then(function (res) {
                                _this.$dispatch("ev_editUpdate",_this.mainModel.vo);
                                LIB.Msg.info("修改成功");
                            });
                        }
                    } else {
                        return false;
                    }
                });

            },
            doShowEquipmentSelectModal:function(){
                this.mainModel.showEquipmentSelectModal = true;
            },
            doSaveEquipment:function(selectedDatas){
                if(selectedDatas){
                    var equipment = selectedDatas[0];
                    this.mainModel.vo.equipmentId = equipment.id;
                    this.mainModel.vo.equipment.name = equipment.name;
                    this.mainModel.vo.equipment.id = equipment.id;
                }
            },
            doClearInput:function(){
                this.mainModel.vo.equipmentId = "";
                //this.mainModel.vo.equipment = {id: null, name: null};
            },
            doCancel: function () {
                this.$dispatch("ev_editCanceled");
            },
            selectCheckObject: function () {
                this.checkObjectModel.show = true;
                this.$broadcast('ev_hdCheckObjectReload', this.mainModel.vo.id);
            },
            doVideosSuccessUpload:uploadEvents.videos,
            doPicSuccessUpload:uploadEvents.pictures,
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;

                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api._deleteFile(null, ids).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                arrays.splice(index,1);
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
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
            //edit框数据加载
            "ev_editReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                dataModel.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                //清空数据
                _.extend(_vo, newVO());
                //存在nVal则是update
                if (nVal != null) {
                    _data.opType = "update";
                    initUploadorRecordId(nVal);
                    api.get({id: nVal}).then(function (res) {
                        //初始化数据
                        _.deepExtend(_vo, res.data);
                        // _vo.checkObjectName = res.data.checkObject.name;
                        dataModel.riskModel = JSON.parse(_vo.riskLevel);

                        //如果检查项类型存在,下拉框禁用
                        if(_vo.type){
                            dataModel.selectModel.disabled=true;
                        }

                        //初始化图片
                        api.listFile({recordId: nVal}).then(function (res) {
                            _vo.pictures = [];
                            _vo.videos = [];
                            var fileData = res.data;
                            //初始化图片数据
                            _.each(fileData, function (pic) {
                                if (pic.dataType == "E1") {
                                    _vo.pictures.push({fileId: pic.id});
                                } else if (pic.dataType == "E2") {
                                    _vo.videos.push({fileId: pic.id});
                                }
                            });
                        });
                    });
                } else {
                    _data.opType = "create";
                    //如果检查项类型存在,下拉框禁用
                    dataModel.selectModel.disabled=false;
                    api.getUUID().then(function (res) {
                        _vo.id = res.data;
                        initUploadorRecordId(res.data);
                    });
                }
            },
            //selectCheckTable框点击保存后事件处理
            "ev_editCheckObjectFinshed": function (obj) {
                this.checkObjectModel.show = false;
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;

                ////初始化数据
                //_vo.checkObjectId = obj.checkObjectId;
                //_vo.checkObjectName = obj.checkObjectName;
            },
            "ev_editCheckObjectCancel": function () {
                this.checkObjectModel.show = false;
            }
        }
    });

    return detail;
});