define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./preview.html");

    //Vue数据
    var dataModel = {
        vo: null,
        items: [],
        addition: {bonus: 0, deduction: 0},//加分、减分
        tableClass:{
            totalColumns: 14,//总列数
            firstColspan: 2,//纵向表头默认占2列
            itemColspan: 4,//一个要素默认占4列
            bonusTitleColspan: 3,//加分文案单元格所占列数
            bonusScoreColspan: 3,//加分分值单元格所占列数
            deductionTitleColspan: 3,//减分文案单元格所占列数
            deductionScoreColspan: 3,//减分分值单元格所占列数
            totalTitleColspan: 6,//总分行文案单元格所占列数
            totalScoreColspan: 6//总分行分值单元格所占列数
        }
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
            compName: function () {
                return this.getDataDic('org', this.vo.compId)['compName'];
            },
        },
        methods:{
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            _init: function () {
                this._getPlan();//获取审核计划信息
                this._getScore();//获取要素的总打分项得分
                this._getAddition();//获取总加分项/减分项得分
            },
            _getPlan: function () {
                var _this = this;
                api.get({id: this.id}).then(function (res) {
                    _this.vo = _.pick(res.data, ["compId", "attr1", "actScore"]);
                    _this.vo.attr1 = new Date(_this.vo.attr1).Format("yyyy年MM月dd日");
                })
            },
            _getScore: function () {
                var _this = this;
                this.items = null;
                api.getStatisticsData({id: this.id}).then(function (res) {
                    var items = [];
                    _.each(res.data.tasks, function (item) {
                        if(item.auditElement.name != '附加项') {
                            items.push({
                                name: item.auditElement.name,
                                weight: parseFloat(item.auditWeight.weight),
                                actScore: parseFloat(item.actScore),
                                stdScore: parseFloat(item.attr2),
                                totalScore: parseFloat(item.score),
                            })
                        }
                    });
                    _this.items = items;
                    _this._calcClass();
                })
            },
            _getAddition: function() {
                var _this = this;
                this.addition = {bonus: 0, deduction: 0};
                api.getTreeData({ id: this.id, types: []}).then(function(res) {
                    if(res.data) {
                        _this._setAddition(res.data);
                    }
                })
            },
            _setAddition: function(tasks) {
                var _this = this;
                if(tasks) {
                    _.each(tasks, function(item){
                        if(item.children && item.children.length > 0) {
                           _this._setAddition(item.children);
                       }else if(item.elementType == 10 || item.elementType == 15) {//审核项
                            if(item.auditElement.auditCriterion == 5) {
                                _this.addition.bonus += parseFloat(item.actScore);
                            }else if(item.auditElement.auditCriterion == 10) {
                                _this.addition.deduction += parseFloat(item.actScore);
                            }
                        }
                    });
                }
            },
            _calcClass: function() {
                /**
                 * 以中心线将表格分为左右两部分，左边因为固定有表头列，所以分到左边的要素数量向下取整
                 */
                var num = this.items.length;//要素数量
                if(num > 2) {
                    var leftNum = parseInt(num / 2);//中心线左边的要素数量
                    var rightNum = num - leftNum;//中心线右边的要素数量
                    this.tableClass.bonusTitleColspan = parseInt(leftNum / 2) * this.tableClass.itemColspan  + this.tableClass.firstColspan;
                    this.tableClass.bonusScoreColspan = leftNum * this.tableClass.itemColspan - parseInt(leftNum / 2) * this.tableClass.itemColspan;

                    this.tableClass.deductionScoreColspan = parseInt(rightNum / 2) * this.tableClass.itemColspan ;
                    this.tableClass.deductionTitleColspan = rightNum * this.tableClass.itemColspan - this.tableClass.deductionScoreColspan;
                }else{
                    var leftNum = parseInt(num * this.tableClass.itemColspan / 2);//中心线左边的要素所占列数
                    var rightNum = num * this.tableClass.itemColspan - leftNum;//中心线右边的要素所占列数

                    this.tableClass.bonusTitleColspan = parseInt(leftNum / 2)  + this.tableClass.firstColspan;
                    this.tableClass.bonusScoreColspan = leftNum  - parseInt(leftNum / 2);

                    this.tableClass.deductionScoreColspan = parseInt(rightNum / 2) ;
                    this.tableClass.deductionTitleColspan = rightNum - this.tableClass.deductionScoreColspan;
                }

                this.tableClass.totalTitleColspan = this.tableClass.bonusTitleColspan + this.tableClass.bonusScoreColspan;
                this.tableClass.totalScoreColspan = this.tableClass.deductionTitleColspan + this.tableClass.deductionScoreColspan;

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