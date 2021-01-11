define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./edit.html");
    var cascader = require('components/cascader/iviewCascader');

    var newVO = function () {
        return {
            id:null,
            name: null,
            phone: null,
            parentId: null,
            address: null,
            remarks: null,
            attr5: null,
            type: 1,
            code: null,
            regionId: null,
            deptList: [],
            countryList: [],
            provinceList: [],
            cityList: [],
            organizationExt :{
                    //企业类型
                   // compGenre:null,
                    genre:null,
                    //企业法人
                    legalPerson:null,
                    //组织机构代码
                   // organizationCode:null,
                     orgCode:null,
                    //注册号
                    regno: null,
                    //行业
                    industry:null,
                    //企业人数
                    population:null,
                    //企业产值
                    production:null,
                    //电子邮箱
                    email: null,
                    phone : null,
            },
            //businessModel: null,
            //registeredCapital: null,
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            updateType:false,
            countryId: "",
            provinceId: "",
            compDate:[{value:"1",name:"国有或国有控股"},{value:"2",name:"股份有限"},{value:"3",name:"有限责任"},{value:"4",name:"中外合资"},{value:"5",name:"外商独资"},
                {value:"6",name:"股份合作"},{value:"7",name:"集体"},{value:"8",name:"合伙"},{value:"9",name:"其他"}],
            //enterpriseScaleList:[{value:"1",name:"按人数"},{value:"2",name:"按产值"}],
            industryVal : [],
        },
        rules: {
            code: [
                {required: true, message: '请输入编码'},
                LIB.formRuleMgr.length(20, 1)
                //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'} 企业人数population、企业产值production、联系电话phone 不可以 录入 数字之外的字符
            ],
            "organizationExt.population": [{type: 'number', message: '企业人数必须为数字值'}],
            "organizationExt.production": [{type:"number", message: '企业产值必须为数字值'}],
            "organizationExt.phone": [{type:"tel", message: '请输入正确联系电话格式'}],
            "organizationExt.email": [{type:"email", message: '请输入正确联系邮箱格式'}],
            name: [
                {required: true, message: '请输入公司名称'},
                LIB.formRuleMgr.length(20, 1)
                //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
            ],
            attr5: [
                {required: true, message: '请输入公司简称'},
                LIB.formRuleMgr.length(10, 1)
                //{ min: 1, max: 10, message: '长度在 1 到 10 个字符'}
            ],
           parentId: [
               {required: true, message: '请选择所属公司'},
               LIB.formRuleMgr.length(10, 1)
                // { min: 1, max: 10, message: '长度在 1 到 10 个字符'}
           ],
            "organizationExt.genre": [
                {required: true, message: '请选择企业类型'},
            ],
        },
        queyCountry:null,
        queyProvince:null,
        queyCity:null,
        orgName:null,
        //显示更多
        compShowMore:false,
        //行业数据
        industryList:[],
        //判断是否添加的为顶级公司
        comShowProp:false,
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
        components: {
            cascader: cascader
        },
        methods: {
            doSave: function () {
                var _this = this;
                //if(isNaN(_this.mainModel.vo.organizationExt.scaleType)==true){
                //    _this.mainModel.vo.organizationExt.scaleType= null;
                //    LIB.Msg.warning("请输入数字");
                //}
                _this.mainModel.vo.organizationExt.industry = this.mainModel.industryVal+"";
                var callback = function (res) {
                   // _this.$dispatch("ev_editFinshed", _this.mainModel.vo);
                    if(_this.mainModel.opType=="create"){
                        _this.mainModel.vo.id = res.body.id;
                        _this.afterDoSave({type:"C"});
                    }else{
                        _this.afterDoSave({type:"U"});
                    }
                    _this.$emit("do-edit-finshed", _this.mainModel.vo);
                    LIB.Msg.info("保存成功");
                };
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.mainModel.opType == "create") {
                            _this.mainModel.countryId = "";

                            api.create(_.omit(_this.mainModel.vo, "countryList", "provinceList", "cityList", "deptList")).then(callback);
                        } else {
                            api.update(_.omit(_this.mainModel.vo, "countryList", "provinceList", "cityList", "deptList")).then(callback);

                        }
                    } else {
                        return false;
                    }
                })
            },
            //添加公司成功 修改登录的缓存信息
            afterDoSave:function(type){
                var _this = this
                var comp={
                	id: _this.mainModel.vo.id,
                	name: _this.mainModel.vo.name,
                	parentId: _this.mainModel.vo.parentId,
                }
                if(type.type=="C"){
                	LIB.setting.orgList.push(comp);
                }else{
                	_.each(LIB.setting.orgList,function(item,index){
                		if(item.id == _this.mainModel.vo.id){
                			LIB.setting.orgList[index] = comp;
                		}
                	});

                }
                LIB.setting.orgMap = _.indexBy(LIB.setting.orgList, "id");
                LIB.setting.dataDic.org[_this.mainModel.vo.id] ={
                	compName: _this.mainModel.vo.name,
                	id: _this.mainModel.vo.id,
                };
            },
            doChangeProvince: function (data) {
                if (data) {
                    api.listRegion({parentId: data}).then(function (res) {
                        dataModel.mainModel.vo.provinceList = res.data;
                        dataModel.mainModel.vo.cityList = [];
                    });
                }
            },
            doChangeCity: function (data) {
                if (data) {
                    api.listRegion({parentId: data}).then(function (res) {
                        dataModel.mainModel.vo.cityList = res.data;
                    });
                }
            },
            doShowMore:function(){
                this.compShowMore = true;
            },
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                this.$refs.ruleform.resetFields();
                //this.$refs.company.init();
                //清空数据
                _.extend(_vo, newVO());
                _data.countryId = "";
                _data.provinceId = "";
                _vo.countryList = [];
                _vo.provinceList = [];
                _vo.cityList = [];
                this.compShowMore = false;
                this.comShowProp = false;
                //存在nVal则是update
                api.listDept({type: 1}).then(function (res) {
                    _vo.deptList = res.data;
                });
                api.listRegion({regionLevel: 1}).then(function (res) {
                    _vo.countryList = res.data;
                });
                api.getIndustry().then(function (data) {
                    dataModel.industryList = data.body;
                    //console.log(dataModel.industryList);
                })

                if (nVal != null) {
                    _data.opType = "update";
                    _data.updateType = true;
                    api.get({id: nVal}).then(function (res) {
                        //初始化数据
                        if(res.data.regionId){
                            api.getRegion({id: res.data.regionId}).then(function (res1) {
                                //console.log(res.data);
                                    _data.countryId = res1.data.country;
                                    _data.provinceId = res1.data.province;
                            });
                        }
                        _.deepExtend(_vo, res.data);
                        if(_vo.organizationExt.industry){
                            _data.industryVal = _vo.organizationExt.industry.split(",");
                        }


                    });
                } else {
                    _data.opType = "create";
                    _data.updateType = false;
                    var _this = this;
                    api.countOrganization().then(function(res){
                        if(res.data > 0){
                            _this.comShowProp = true;
                        }
                    });
                    //新增时清空所属行业
                    this.mainModel.industryVal = [];
                }
            },
            //点击弹层关闭的时候 清空搜索的数据
            ev_detailClose:function(){
                dataModel.queyCountry = null;
                dataModel.queyProvince = null;
                dataModel.queyCity = null;
            }
        },
        ready:function() {
        }
    });

    return detail;
});