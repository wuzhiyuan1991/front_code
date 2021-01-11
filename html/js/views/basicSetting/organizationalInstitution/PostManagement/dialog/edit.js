define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");

    var newVO = function () {
        return {
            id: null,
            name: null,
            orgId:null,
            remarks: null,
            organizationId: null,
            postType: 0,
            code:null,
            posList: [
                {
                    value: "0",
                    label: "普通角色"
                },
                {
                    value: "1",
                    label: "HSE角色"
                }
            ],
            orgList: [],
            //公司id 用来做桥接
//            orgIdData:null,
            //公司id
            compId:null,

        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: ""
        },
        rules: {
            name: [
                {required: true, message: '请输入岗位名称'},
                LIB.formRuleMgr.length(30,1)
                //{ min: 1, max: 30, message: '长度在 1 到 30 个字符'}
            ],
            orgId: [
                { required: true, message: '请选择所属公司'}
            ],
            postType: [
                {required: true, message: '请输入岗位类型'}
            ],
            organizationId: [
                {required: true, message: '请选择所属部门'}
            ],
            remarks: [
                {required: true, message: '请输入岗位职责'},
                LIB.formRuleMgr.length(50,1)
                //{ min: 1, max: 50, message: '长度在 1 到 50 个字    符'}
            ],
//            orgIdData:[{ required: true, message: '请选择公司'}],
            compId:[{ required: true, message: '请选择所属公司'}],
            orgId: [{required: true, message: '请选择所属部门'}],
            //br 4009
            code: LIB.formRuleMgr.code(),
        },
//        selectedDatas:[],
//        selectedOrg:[],
    };

    //声明detail组件
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                //如果有部门就传部门
                if(_this.mainModel.vo.perId){
                    _this.mainModel.vo.orgId = _this.mainModel.vo.perId;
                    //_this.mainModel.vo.organizationId = _this.mainModel.vo.perId;
                }
                var callback = function (res) {
                    //_this.$dispatch("ev_editFinshed", _this.mainModel.vo);
                    _this.$emit("do-emit-finshed", _this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.mainModel.opType == "create") {
                            api.create(_.omit(_this.mainModel.vo,  "id", "posList", "orgList","perId","organizationId")).then(callback);
                        } else {
                            api.update(_.pick(_this.mainModel.vo,  "id","code", "name", "compId", "orgId","postType","remarks")).then(callback);
                        }
                    } else {
                        return false;
                    }
                })
            },
            doCancel: function () {
                this.$dispatch("ev_editCanceled");
            },
            convertPicPath: LIB.convertPicPath
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                //清空数据
                _.extend(_vo, newVO());
//                this.selectedOrg=new Array();
//                this.selectedDatas=new Array();
                //存在nVal则是update
                    api.listDept({type: 2}).then(function (res) {
                        _vo.orgList = res.data;
                        if (nVal != null) {
                            _data.opType = "update";
                            api.get({id: nVal}).then(function (res) {
                                //_.extend(_vo, res.data);
                                //初始化数据
                                _.deepExtend(_vo, res.data);
                                //_vo.perId = res.data.org.id;
                                //获取公司名称根id
//                                var dataDicValuevar =  LIB.getDataDic("org", _vo.perId);
//                                _vo.orgIdData= _vo.perId;
                                 // _vo.compId = _vo.compId || _vo.perId;
//                                dataModel.selectedOrg.push({"id":res.data.org.id});
//                                dataModel.selectedDatas.push({"id":res.data.parentId});
                            });
                        } else {
                            _data.opType = "create";
                        }

                    });
            }
        }
    });

    return detail;
});