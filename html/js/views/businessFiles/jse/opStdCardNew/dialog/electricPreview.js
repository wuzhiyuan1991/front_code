define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./electricPreview.html");
    var Roman = [["","Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ"],
        ["","Ⅹ","ⅩⅩ","ⅩⅩⅩ","ⅩＬ","Ｌ","ＬⅩ","ＬⅩⅩ","ＬⅩⅩⅩ","ⅩＣ"],
        ["","Ｃ","ＣＣ","ＣＣＣ","ＣＤ","Ｄ","ＤＣ","ＤＣＣ","ＤＣＣＣ","ＣＭ"],
        ["","Ｍ","ＭＭ","ＭＭＭ","  "," ","  ","   ","    ","  "]];
    //Vue数据
    var dataModel = {
        vo: null,
        items: null,
        itemPage:[],
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
            }
        },
        computed: {
            orgName: function () {
                return this.getDataDic('org', this.vo.orgId)['deptName'];
            },
            showEquipment:function () {
                var _this = this;
                var _vo = _this.vo;
                if (_vo && _vo.specialityType === '3') {
                    return true;
                }
                return false;
            }
        },
        methods:{
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            _init: function () {
                this._getVO();
                this._getItems();
            },
            _getVO: function () {
                var _this = this;
                api.get({id: this.id}).then(function (res) {
                    _this.vo = _.pick(res.data, ["name", "content", "code", "orgId", "attr1","specialityType"]);
                })
            },
            _getItems: function () {
                var _this = this;
                this.items = null;
                api.getGroupAndItem({id: this.id}).then(function (res) {
                    if(res.data.OpStdStepItem.length == 0){
                        _this.itemPage = _this.groupPage([{}],20);
                        // _this.itemPage =[[]];
                        return;
                    }
                    var items = _.map(res.data.OpStdStepItem, function (item) {
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