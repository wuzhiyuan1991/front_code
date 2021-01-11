define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./advance.html");
    var api = require("../vuex/api");
    var BASE = require('base'),
        CONST = require('const');
    //初始化数据模型
    var newVO = function () {
        return {

        }
    };

    // LIB.registerDataDic("iptw_work_history_operation_type", [
    //     ["1","作业预约"],
    //     ["2","作业审核"],
    //     ["3","填写作业票"],
    //     ["4","能量隔离"],
    //     ["5","作业前气体检测"],
    //     ["6","措施落实"],
    //     ["7","作业会签"],
    //     ["8","作业批准"],
    //     ["9","安全教育"],
    //     ["10","作业中气体检测"],
    //     ["11","作业监控"],
    //     ["12","能量隔离解除"],
    //     ["13","作业关闭签字"],
    //     ["14","作业关闭"]
    // ]);
    //
    // LIB.registerDataDic("iptw_work_history_work_status", [
    //     ["1","作业预约"],
    //     ["2","待审核"],
    //     ["3","待填报"],
    //     ["4","待核对"],
    //     ["5","待会签"],
    //     ["6","待批准"],
    //     ["7","作业中"],
    //     ["8","待关闭"],
    //     ["9","已取消"],
    //     ["10","已完成"],
    //     ["11","已否决"]
    // ]);
    //
    // LIB.registerDataDic("iptw_work_history_isolation_type", [
    //     ["1","工艺隔离"],
    //     ["2","机械隔离"],
    //     ["3","电气隔离"],
    //     ["4","系统屏蔽"]
    // ]);
    //
    // LIB.registerDataDic("iptw_work_history_result_type", [
    //     ["1","作业取消"],
    //     ["2","作业完成"],
    //     ["3","作业续签"]
    // ]);
    //
    // LIB.registerDataDic("iptw_work_history_sign_type", [
    //     ["1","作业申请人"],
    //     ["2","作业负责人"],
    //     ["3","作业监护人"],
    //     ["4","生产单位现场负责人"],
    //     ["5","主管部门负责人"],
    //     ["6","安全部门负责人"],
    //     ["7","相关方负责人"],
    //     ["8","许可批准人"],
    //     ["9","安全教育人"],
    //     ["10","作业人员"],
    // ]);


    var detail = LIB.Vue.extend({
        computed:{

        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
        },
        props: {
            attr1:{
                type:String,
                default:"0"
            },
            visible: {
                type: Boolean,
                default: false
            },
            vo:{
                type:Object,
                // default:''
            },
            list:{
                type:Array
            },
            compId:{
                type:String
            }
        },
        watch:{
            visible:function(val){
                // val && this._init()
            },

        },

        data:function(){
            return {
                testList:[
                    {
                        name : "方案一",
                        code:'UGJSKHUHG',
                        //步骤 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施
                        step : '1',
                        //禁用标识 0:启用,1:禁用
                        disable : "0",
                        //操作时间
                        operateTime : "2019-10-10 10:38:00",
                        //参与人员
                        participant : "张三，李四",
                        //备注描述
                        remark : "这次会议非常重要",
                        //处理结果 1:未通过,2:通过,3:回退
                        result : '2',
                        //修订频率
                        reviseFrequence : 3,
                        //修订理由(枚举值用英文逗号拼接）
                        reviseReason : null,
                        //修订类型 1:定期修订,2:不定期修订
                        reviseType : 1,
                        //回退节点 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案
                        rollbackStep : null,
                        //预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
                        type : "1",
                        //版本号
                        verNo : "v10.1",
                        compId:"jaja",
                        user:{
                            name:"超管"
                        },
                        isShow:true
                    },
                    {
                        name : "方案一",
                        code:'UGJSKHUHG',
                        //步骤 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施
                        step : '2',
                        //禁用标识 0:启用,1:禁用
                        disable : "0",
                        //操作时间
                        operateTime : "2019-10-10 10:38:00",
                        //参与人员
                        participant : "张三，李四",
                        //备注描述
                        remark : "这次会议非常重要",
                        //处理结果 1:未通过,2:通过,3:回退
                        result : '1',
                        //修订频率
                        reviseFrequence : 3,
                        //修订理由(枚举值用英文逗号拼接）
                        reviseReason : null,
                        //修订类型 1:定期修订,2:不定期修订
                        reviseType : 1,
                        //回退节点 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案
                        rollbackStep : null,
                        //预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
                        type : "1",
                        //版本号
                        verNo : "v10.1",
                        compId:"jaja",
                        user:{
                            name:"超管"
                        },
                        isShow:true
                    }
                ]

            };
        },

        methods:{
            getResultStyle:function (item) {
              return item!=2?'background-color:red;color:#fff;':'background:#66FF00;color:#000;';
            },
            getResultStyle1:function (item) {
                return item!=1?'background-color:red;color:#fff;':'background:#66FF00;color:#000;';
            },
            getComp:function (data) {
                return  LIB.getDataDic("org", data).compName;
                // return this.rebuildOrgName(data, 'comp');
            },
            rebuildOrgName : function(id, type, name) {

                var spliteChar = " / ";

                var curOrgName = name || '';

                //if(type == 'comp') {
                //	return LIB.getDataDic("org", id)["compName"];
                //} else if(type == 'dept') {
                //	return LIB.getDataDic("org", id)["deptName"];
                //}

                //var orgFieldName = type == "comp" ? "compName" :"deptName";
                //使用公司简称csn(company short name)代替compName
                var orgFieldName = type == "comp" ? "csn" : "deptName";

                if (BASE.setting.orgMap[id]) {

                    if (curOrgName != '') {
                        var orgName = LIB.getDataDic("org", id)[orgFieldName]

                        //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                        if (orgName != undefined) {
                            curOrgName = orgName + spliteChar + curOrgName;
                        } else {
                            return curOrgName;
                        }
                    } else {
                        curOrgName = LIB.getDataDic("org", id)[orgFieldName];
                    }

                    var parentId = BASE.setting.orgMap[id]["parentId"];

                    //不存在父级组织机构了,则表示是顶级组织机构
                    if (!!parentId) {

                        //部门的 id==parentId 时表示是顶级部门
                        if (id == parentId) {
                            return curOrgName;
                        }
                        curOrgName = rebuildOrgName(parentId, type, curOrgName);
                    }
                }
                return curOrgName;
            },

            //    获取文件
            //    this.getFileList(this.uploadModel.params.recordId);
            _init:function () {
                this.mainModel.vo.shipOptions = null;
                this.mainModel.vo.user = LIB.user.name;
            },

            getFileList:function (arr) {
                if(arr && arr.length>0){
                    var str = '';
                    for(var i=0; i<arr.length; i++){
                        str += "<a target='_blank' href='/file/down/"+arr[i].id+"'>" + arr[i].orginalName + "</a><br>";
                    }
                    return str;
                }
                return '';
            },

            getColorResult:function (val) {
                if(parseInt(val) == 2){
                    return ''
                }else{
                    return "color:red;"
                }
            },

            getStepsName:function (item) {
                var str = LIB.getDataDic('iptw_operation_type', item.operationType);
                if((item.operationType == 5 || item.operationType == 15)&& item.isolationType && item.isolationType!=0){ //能量隔离
                    str += "("+LIB.getDataDic('iptw_isolation_type', item.isolationType)+")"
                }else if(item.operationType == 10  || item.operationType == 16){ //会签
                    if(item.signType && item.signType!=0){
                        str += "("+LIB.getDataDic('iptw_sign_type', item.signType)+")"
                    }
                }
                // else if(item.operationType == 11 && item.isolationType && item.isolationType!=0){ // 能量隔离解除
                //     str += "("+LIB.getDataDic('iptw_isolation_type', item.isolationType)+")"
                // }
                else if((item.operationType == 14 || item.operationType == 17) && item.resultType && item.resultType!=0){ // 作业关闭
                    str += "("+LIB.getDataDic('iptw_result_type', item.resultType)+")"
                }
                return str;
            },
            getResultAttr:function (val) {
                var arr = ["通过", "不通过" ];
                return   arr[parseInt(val)-1];
            },
            getResult:function (val) {
                var arr = ["不通过", "通过" ];
                return   arr[parseInt(val)-1];
            },
            getType:function (val) {
                // 1:综合应急预案,2:专项应急预案,3:现场处置方案
                var arr = ["综合应急预案", "专项应急预案", "现场处置方案"];
                return   arr[parseInt(val)-1];
            },

            doSaveSelectPoint:function () {
                var _this = this;
                this.$refs.info2ruleform.validate(function (valid) {
                    if(valid){
                        _this.visible = false;
                    }
                })
            },
            doClose:function () {
                this.visible = false;
            },
            doShowCargoPoint:function () {
                this.selectModel.cargoPointSelectModel.filterData.id = this.id;
                this.selectModel.cargoPointSelectModel.visible = true;
            },

            getUUId:function () {
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;

                });
            },
        },
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});