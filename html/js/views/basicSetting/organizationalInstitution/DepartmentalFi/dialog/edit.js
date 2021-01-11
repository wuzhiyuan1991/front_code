define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");

    var newVO = function () {
        return {
            id: null,
            //和parentId一样，未来可能parentId表示上级部门
            compId: null,
            name: null,
            phone: null,
            parentId: null,
            code:null,
            type: 2,
            deptList: []
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            parentDeptId : null,
            deptDisabled:false,
        },
        rules: {
            name: [
                {required: true, message: '请输入部门名称'},
                LIB.formRuleMgr.length(20,1)
                //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
            ],
            compId: [
                {required: true, message: '请选择所属公司'},
            ],
            phone: [
                {required: true, message: '只允许输入数字'},
                {type: 'phone', required: true, message: '联系电话格式错误'}
            ],
            // code: [
            //     {required: true, message: '请输入部门编码'},
            //     LIB.formRuleMgr.length(10,1)
            //     //{ min: 1, max: 10, message: '长度在 1 到 10 个字符'}
            // ]
        },
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
                //通过id获取公司 用来更新table上面的公司数据
//                if(_this.mainModel.opType !== "create"){
//                    api.listOrganization().then(function(data){
//                        var orgData=data.body;
//                        _.each(orgData,function(item){
//                            if(_this.mainModel.vo.parentId == item.id){
//                                dataModel.orgName = item.name
//                            }
//                        })
//                    });
//                }
                var callback = function (res) {
//                    _this.$dispatch("ev_editFinshed", _this.mainModel.vo, dataModel.orgName);
//                    _this.$dispatch("ev_editFinshed", _this.mainModel.vo);
                    _this.$emit("do-edit-finshed",_this.mainModel.vo);
                    LIB.Msg.info("保存成功");

                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                    	//_this.mainModel.vo.compId = _this.mainModel.vo.parentId;
                        if(_this.mainModel.parentDeptId==""){
                            _this.mainModel.vo.parentId=_this.mainModel.vo.compId;
                        }else{
                            _this.mainModel.vo.parentId=_this.mainModel.parentDeptId;
                        }
                        //_this.mainModel.vo.parentId =  (_this.mainModel.vo.compId == _this.mainModel.vo.parentId) ? _this.mainModel.vo.compId : _this.mainModel.parentDeptId;
                        if (_this.mainModel.opType == "create") {
                            api.create(_.omit(_this.mainModel.vo, "deptList", "userList")).then(callback);
                        } else {
                            api.update(_.omit(_this.mainModel.vo, "org", "deptList", "userList")).then(callback);
                        }
                    } else {
                        return false;
                    }
                })
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editCanceled");
            //},
            reset:function(){
                var _vo = dataModel.mainModel.vo;
                _.extend(_vo, newVO());
            },
            convertPicPath: LIB.convertPicPath
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                var _parentDeptId = dataModel.mainModel.parentDeptId;
                this.$refs.ruleform.resetFields();
                dataModel.mainModel.parentDeptId = "";
                    if (nVal != null) {
                        _data.opType = "update";
                        _data.deptDisabled = true;
                        api.get({id: nVal}).then(function (res) {
                            //初始化数据
                            _.deepExtend(_vo, res.data);
                            if(_vo.parentId == _vo.compId){
                                dataModel.mainModel.parentDeptId = "";
                            }else{
                                dataModel.mainModel.parentDeptId = _vo.parentId;

                            }

                        });
                    } else {
                        this.$refs.dept.init();
                        _data.opType = "create";
                        _data.deptDisabled = false;
                    }
            },
        }
    });

    return detail;
});