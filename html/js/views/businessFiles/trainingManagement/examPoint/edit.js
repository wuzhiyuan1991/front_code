define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id: null,
            name: null,
            remarks: null,
            parentId: null,
            attr1: null,
            code: null,
            orgId:LIB.user.orgId,
            compId:LIB.user.compId
        }
    };
    var rules = {
        // code: [
        // 	{required: true, message: '请输入编码'},
        // 	LIB.formRuleMgr.length(20, 1)
        // ],
        name: [
            {required: true, message: '请输入名称'},
            LIB.formRuleMgr.length(50, 1)
        ],
        attr1: [
            {required: true, message: '请输入序号'},
            LIB.formRuleMgr.length(20, 1)
        ]
    };
    //vue数据 配置url地址 拉取数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            flag: null,
            type: true,
            addType: false,
            addFlag: null,
            opType: 'view'
        }
    };
    var vm = LIB.VueEx.extend({
        template: require("text!./edit.html"),
        data: function () {
            return dataModel;
        },
        props:{
          topCompId:{
              type:String,
              default:''
          }
        },
        computed: {
            rules: function () {
                if (this.mainModel.isReadOnly) {
                    return {}
                }
                if (this.mainModel.opType === 'create') {
                    return rules;
                }
                else if(this.mainModel.opType === 'update') {
                    return _.assign(_.cloneDeep(rules), {code: LIB.formRuleMgr.codeRule()})
                }
            },
            allowEmpty: function () {
                return this.mainModel.opType !== 'create';
            }
        },
        //引入html页面
        methods: {
            afterInit: function () {
                if(LIB.user.orgId !='9999999999'){
                    // this.mainModel.vo.compId = this.topCompId;
                    this.mainModel.vo.compId = LIB.user.compId;
                    this.mainModel.vo.orgId = LIB.user.orgId;
                }else{
                    this.mainModel.vo.compId = this.topCompId;
                    this.mainModel.vo.orgId = null;
                }
            },
            doSave: function () {
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                var obj = {
                    name: dataModel.mainModel.vo.name,
                    parentId: dataModel.mainModel.vo.parentId,
                    code: dataModel.mainModel.vo.code,
                    attr1: dataModel.mainModel.vo.attr1,
                    orgId: dataModel.mainModel.vo.orgId
                };
                var fsd = this;

                //判断是否为 导航的新增 还是树上面的新增
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (dataModel.mainModel.addType) {
                            api.create(null, obj).then(function (data) {
                                _vo.id = data.body.id;
                                LIB.Msg.info("添加成功");
                                _this.$emit("doeditadd", dataModel.mainModel);
                            })


                        } else {
                            if (dataModel.mainModel.type) {
                                var callback1 = function (res) {
                                    _vo.id = res.body.id;
                                    LIB.Msg.info("添加成功");
                                    _this.$emit("doupdate", dataModel.mainModel, "add");
                                }
                                api.create(null, obj).then(callback1)

                            } else {
                                var updateObj = {
                                    name: dataModel.mainModel.vo.name,
                                    id: dataModel.mainModel.vo.id,
                                    code: dataModel.mainModel.vo.code,
                                    attr1: dataModel.mainModel.vo.attr1,
                                    orgId: dataModel.mainModel.vo.orgId
                                }
                                //var _this=this;
                                var callback2 = function (res1) {
                                    LIB.Msg.info("修改成功");
                                    _this.$emit("doupdate", dataModel.mainModel);
                                }
                                api.update(null, updateObj).then(callback2);
                            }
                        }
                    }
                });

            },
        },
        events: {
            //点击取得id跟name值 双向绑定
            "ev_detailReload": function (data, nVal) {
                var _vo = dataModel.mainModel.vo;
                this.mainModel.flag = nVal
                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.addType = false;
                if (nVal === "add") {
                    this.mainModel.opType = 'create';
                    dataModel.mainModel.vo.parentId = data.data.id;
                    this.mainModel.type = true;
                } else if (nVal === "update") {
                    this.mainModel.opType = 'update';
                    _.deepExtend(_vo, data.data);
                    this.mainModel.type = false;
                }
            },
            "ev_detailAdd": function (val) {
                this.mainModel.opType = 'create';
                var _vo = dataModel.mainModel.vo;

                //清空数据
                _.extend(_vo, newVO());
                this.mainModel.addType = true;
                this.afterInit();
            }

        }
    })
    return vm;
})