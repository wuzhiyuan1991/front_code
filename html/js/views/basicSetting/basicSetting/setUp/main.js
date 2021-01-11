define(function (require) {
    var LIB = require('lib');
    var API = require("./vue/api");
    var cascader = require('components/cascader/iviewCascader');

    //初始化页面控件
    var dataModel = {
        moduleCode: LIB.ModuleCode.BS_BaC_ComI,
        mainModel: {
            id: null,
            createDate: null,
            createBy: null,
            modifyDate: null,
            attr1: null,
            name: null,
            legalPerson: null,
            organizationCode: null,
            regno: null,
            address: null,
            phone: null,
            email: null,
            industry: null,
            businessModel: null,
            enterpriseType: null,
            registeredCapital: null,
            remarks: null,
            showCompanyInfo: true,
            showIndustryInfo: false,
            showContactMethod: false,
            //企业规模
            enterpriseScale:null
        },
        industryList: [],
        regionList: [],
        selectedDatas: [],
        selectedRegionDatas: [],
        enterpriseScaleList:[{value:"1",name:"1-49"},{value:"2",name:"50-99"},{value:"3",name:"100-149"},{value:"4",name:"150-299"},{value:"5",name:"300-499"},{value:"6",name:"499以上"},],
        rules: {
            name: [
                {required: true, message: '请输入企业名称'},
                LIB.formRuleMgr.length(20)
                //{max: 20, message: '长度在 0 到 20 个字符'}
            ],
            legalPerson: [  //type可不写，默认为string，同一字段非string类型需多次配置type
                {required: true, message: '请输入企业法人'},
                LIB.formRuleMgr.length(15)
                //{max: 15, message: '长度在 0 到 15 个字符'}
            ],
            organizationCode: [
                {required: true, message: '请输入组织机构代码'},
                //{max: 15, message: '长度在 0 到 15 个字符'}
                LIB.formRuleMgr.length(15)
            ],
            regno: [
                {type: 'integer', required: true, message: '请输入注册号'}
            ],
            attr1: [
                {required: true, message: '请输入地域分布'},
                LIB.formRuleMgr.length(50)
                //{max: 50, message: '长度在 0 到 50 个字符'}
            ],
            businessModel: [
                {required: true, message: '请输入经营模式'},
                LIB.formRuleMgr.length(50)
                //{max: 20, message: '长度在 0 到 20 个字符'}
            ],
            registeredCapital: [
                //{type: 'number', required: true, min: 1, max: 9999999999999.99, message: '类型不匹配'}
                {type: 'number', required: true,message: '请输入注册资金'},
                LIB.formRuleMgr.length(17)
            ],
            phone: [
                {required: true, message: '只允许输入数字'},
                {type: 'phone', message: '联系电话格式错误'}
            ],
            email: [
                {required: true, message: '请输入电子邮箱'},
                {type: 'email', message: '电子邮箱格式错误'}
            ],
                //industry: [
                //    {required: true, message: '请选择行业'},
                //],
            enterpriseType: [
                {required: true, message: '请选择企业类型'},
            ],
            address: [
                {required: true, message: '请输入通讯地址'},
                LIB.formRuleMgr.length(100)
                //{max: 500, message: '长度在 0 到 100 个字符'}
            ]
        }
    };

    //使用Vue方式，对页面进行事件和数据绑定
    var vm = LIB.Vue.extend({
            template: require("text!./main.html"),
            components: {
                cascader: cascader
            },
            data: function () {
                return dataModel
            },
            methods: {
                doShowCompanyInfo: function () {
                    var _this = this;
                    _this.mainModel.showCompanyInfo = true;
                    _this.mainModel.showIndustryInfo = false;
                    _this.mainModel.showContactMethod = false;
                },
                doShowIndustryInfo: function () {
                    var _this = this;
                    _this.mainModel.showCompanyInfo = false;
                    _this.mainModel.showIndustryInfo = true;
                    _this.mainModel.showContactMethod = false;
                },
                doShowContactMethod: function () {
                    var _this = this;
                    _this.mainModel.showCompanyInfo = false;
                    _this.mainModel.showIndustryInfo = false;
                    _this.mainModel.showContactMethod = true;
                },
                doModify: function () {
                    var _this = this;
                    this.$refs.ruleform.validate(function (valid) {
                        if (valid) {
                            var industry = "";
                            var region = "";
                            _.each(_this.selectedDatas, function (value) {
                                industry = industry + "," + value;
                            });
                            _.each(_this.selectedRegionDatas, function (value) {
                                region = region + "," + value;
                            });
                            _this.mainModel.industry = industry.substring(1, industry.length);
                            _this.mainModel.attr1 = region.substring(1, region.length);
                            if (_this.mainModel.id == "") {
                                //API.create(dataModel.mainModel).then(function () {
                                API.create(_.omit(dataModel.mainModel, "showCompanyInfo", "showIndustryInfo", "showContactMethod")).then(function () {
                                    LIB.Msg.info("新增成功！");
                                });
                            } else {
                                API.update(_.omit(dataModel.mainModel, "showCompanyInfo", "showIndustryInfo", "showContactMethod")).then(function () {
                                    LIB.Msg.info("修改成功！");
                                });
                            }
                        } else {
                            return false;
                        }
                    });
                }
            },
        watch:{
            selectedRegionDatas:function(){
                if(this.selectedRegionDatas.length>0){
                    var region;
                    _.each(this.selectedRegionDatas, function (value) {
                    region = region + "," + value;
                    });
                    this.mainModel.attr1 = region.substring(1, region.length);
                }else{
                    this.mainModel.attr1 = null;
                }
            },
            selectedDatas:function(){
                if(this.selectedDatas.length>0){
                    var industry;
                    _.each(this.selectedDatas, function (value) {
                        industry = industry + "," + value;
                    });
                    this.mainModel.industry = industry.substring(1, industry.length);
                }else{
                    this.mainModel.industry = null;
                }
            },
        },
            ready: function () {
                API.getIndustry().then(function (data) {
                    dataModel.industryList = data.body;

                    API.getRegion().then(function (data) {
                        dataModel.regionList = data.body;

                        API.get().then(function (data) {
                            if (data.body.industry) {
                                dataModel.selectedDatas = data.body.industry.split(",");
                            }
                            if (data.body.attr1) {
                                dataModel.selectedRegionDatas = data.body.attr1.split(",");
                            }
                            _.extend(dataModel.mainModel, data.body);
                        });
                    });
                });

            }
        })
        ;
    return vm;
});
