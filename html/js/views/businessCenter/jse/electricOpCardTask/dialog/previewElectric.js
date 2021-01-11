define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./previewElectric.html");
    var Roman = [["","Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ"],
        ["","Ⅹ","ⅩⅩ","ⅩⅩⅩ","ⅩＬ","Ｌ","ＬⅩ","ＬⅩⅩ","ＬⅩⅩⅩ","ⅩＣ"],
        ["","Ｃ","ＣＣ","ＣＣＣ","ＣＤ","Ｄ","ＤＣ","ＤＣＣ","ＤＣＣＣ","ＣＭ"],
        ["","Ｍ","ＭＭ","ＭＭＭ","  "," ","  ","   ","    ","  "]];
    //Vue数据
    var dataModel = {
        vo: null,
        items: [],
        itemPage:[],
        auditorSignatures:[],
        operatorSignatures:[],
        supervisorSignatures:[],
        operatorSignFileMap:{},
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	 el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX    			//内部方法
     doXXX 				//事件响应方法
     beforeInit 		//初始化之前回调
     afterInit			//初始化之后回调
     afterInitData		//请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave		//请求 新增/更新 接口后回调
     beforeDoDelete		//请求 删除 接口前回调
     afterDoDelete		//请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            },
            showSignature: {
                type: Boolean,
                default: false
            }
        },
        data: function(){
            return dataModel;
        },
        watch: {
            visible: function (val) {
                if(val && this.id) {
                    this._init();
                }
            },
        },
        computed: {
            orgName: function () {
                return this.getDataDic('org', this.vo.orgId)['deptName'];
            },
            dispatchTime: function () {
                if(this.vo.dispatchTime){
                    return new Date(this.vo.dispatchTime).Format("yyyy 年 MM 月 dd 日 hh 时 mm 分");
                }else{
                    return "<span style='letter-spacing:30px'>年月日时分</span>";
                }

            },
            beginOpTime:function(){
                if(this.vo.publishTime){
                    return new Date(this.vo.publishTime).Format("yyyy 年 MM 月 dd 日 hh 时 mm 分");
                }else{
                    return "<span style='letter-spacing:30px'>年月日时分</span>";
                }

            },
            endOpTime:function(){
                var maxTime = "";
                _.each(this.items,function(item){
                    if(item.operateTime){
                        if(maxTime === ""){
                            maxTime = item.operateTime;
                        }else{
                            var n = new Date(item.operateTime);
                            var o = new Date(maxTime);
                            if(n > o){
                                maxTime = item.operateTime;
                            }
                        }
                    }
                });
                if(maxTime){
                    return new Date(maxTime).Format("yyyy 年 MM 月 dd 日 hh 时 mm 分");
                }else{
                    return "<span style='letter-spacing:30px'>年月日时分</span>";
                }
            }
        },
        methods:{
            calcClass: function(item) {
                if(item.isGroup) {
                    return "font-bold";
                }
                return "";
            },
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            _init: function () {
                this.auditorSignatures = [];
                this.operatorSignatures = [];
                this.supervisorSignatures = [];
                this.operatorSignFileMap = {};
                this._getVO();
            },
            _getVO: function () {
                var _this = this;
                _this.vo = {};
                api.get({id: this.id}).then(function (res) {
                    if(res.data) {
                        _this.vo = res.data;
                        _this.vo.orgName = LIB.setting.orgMap[_this.vo.orgId].name;
                        if(res.data.publishTime) {
                            _this.vo.firstLineDate = new Date(res.data.publishTime).Format("yyyy年MM月dd日");
                        }
                        if(_this.vo.opTaskUserRels) {
                            _this._getSignature();
                        }
                        _this._getItems();
                    }
                })
            },
            _getItems: function () {
                var _this = this;
                this.items = null;
                api.getGroupAndItem({id: this.id}).then(function (res) {
                    if(res.data.OpTaskStepItem.length == 0){
                        _this.itemPage = _this.groupPage([{}],20);
                        // _this.itemPage =[[]];
                        return;
                    }
                    var items = _.map(res.data.OpTaskStepItem, function (item) {
                        return {
                            stepId: item.stepId,
                            orderNo: item.orderNo,
                            content: item.content && item.content.replace(/[\r\n]/g, '<br/>'),
                            operatorId: item.operatorId,
                            operateTime: item.operateTime,
                            finish:_.isEmpty(item.confirmTime) ? false : true
                        }
                    });
                    _this.items = _.sortBy(items, function (group) {
                        return parseInt(group.orderNo);
                    });
                    var index = 1;
                    _.each(_this.items,function(item){
                        item.orderNo = index;
                        index++;
                    })
                    _this.itemPage = _this.groupPage(_this.items,20);
                })
            },
            _getSignature: function() {
                var _this = this;
                var recordIdUserIdMap = {};//附件id和用户id的对应关系
                var recordIds = _.map(this.vo.opTaskUserRels, function(rel){
                    recordIdUserIdMap[rel.id] = rel.userId;//附件id取的是任务与用户关联关系的id
                   return rel.id;
                });
                var operatorIdFilesMap = {};//用户id与操作人签名文件的对应关系
                api.listFile({'criteria.strsValue':JSON.stringify({recordId: recordIds})}).then(function(res){
                    _.each(res.data, function (pic) {
                        if (pic.dataType === "X33") {//审核人签名
                            _this.auditorSignatures.push(LIB.convertPicPath(pic.id, 'scale'));
                        }
                        else if (pic.dataType === "X4") {//操作人签名
                            var userId = recordIdUserIdMap[pic.recordId];
                            var files = [LIB.convertPicPath(pic.id, 'scale')];
                            operatorIdFilesMap[userId ] = files;
                            _this.operatorSignatures.push(LIB.convertPicPath(pic.id, 'scale'));
                        }
                        else if (pic.dataType === "X5") {//监护人签名
                            _this.supervisorSignatures.push(LIB.convertPicPath(pic.id, 'scale'));
                        }
                    });
                    _this.operatorSignFileMap = operatorIdFilesMap;
                });
            },
            getOperatorSignFiles: function(operatorId) {
                if(!operatorId) {
                    return [];
                }
                return this.operatorSignFileMap[operatorId];
            },
            groupPage: function(array, subGroupLength) {
                var index = 0;
                var newArray = [];
                while(index < array.length) {
                    newArray.push(array.slice(index, index += subGroupLength));
                }
                var lastArr = _.last(newArray);
                if(lastArr.length < subGroupLength){
                    var addNum = subGroupLength - lastArr.length;
                    for(var i = 0;i < addNum;i++){
                        lastArr.push({});
                    }
                }
                return newArray;
            },
            convertRoman : function(num) {
                if(isNaN(num)) return num;
                var ReverseArr = num.toString().split("").reverse();
                var CorrectArr = [];
                for (var i = 0; i < ReverseArr.length; i++) {
                    CorrectArr.unshift(Roman[i][ReverseArr[i]]);
                }
                return CorrectArr.join("");
            },
            convertCode:function(num){
                if(!this.vo.code || num > this.itemPage.length){
                    return "";
                }else{
                    return this.vo.code + "-"+ this.convertRoman(num);
                }
            }
        },
        events : {
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});