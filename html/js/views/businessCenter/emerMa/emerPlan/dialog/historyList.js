define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./historyList.html");
    var api = require("../vuex/api");
    var BASE = require('base'),
        CONST = require('const');
    //初始化数据模型
    var newVO = function () {
        return {

        }
    };

    var detail = LIB.Vue.extend({
        computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.vo.type) === 3){
                    _.each(arr, function (item, index) {
                        if(index !== 3 && index!==4 && index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }else{
                    _.each(arr, function (item, index) {
                        if(index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }
                return list;
            }
        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
        },
        props: {
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
                        str += "<a target='_blank' href='"+ LIB.convertFilePath(LIB.convertFileData(arr[i])) + "'>" + arr[i].orginalName + "</a><br>";
                    }
                    return str;
                }
                return '';
            },
            getLabelName:function (val) {
                  if(val==2){
                      return '内部评审日期'
                  }else if(val == 3){
                      return '外部评审日期'
                  }else{
                      return '评审日期'
                  }
            },
            getStepName:function (val) {
              return  LIB.getDataDic("iem_emer_plan_status", val);
            },

            getColorResult:function (val) {
                if(parseInt(val) == 2){
                    return ''
                }else{
                    return "color:red;"
                }
            },

            getResult:function (val) {

                var arr = ["未通过", "通过", "回退"];
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