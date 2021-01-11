define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./main.html");
    var api = require("./vuex/api");

    //初始化数据模型
    var newVO = function() {
        return {
            //
            name : null,
            //暂时不用
            type : null,
            //承诺
            promise : null,
            //额定完成时间
            ratedCompleteDate : null,
            //备注
            remark : null,
            //模板
            riskTemplateConfig : {id:'', name:''},
            //风险研判
            riskJudgment : {id:'', name:''},
            //研判单位
            riskJudgmentUnits : [],
            //组
            riskJudgmentGroups : [],


        }
    };

    //Vue数据
    var dataModel = {
        promiseObj:{},
        promiseContent:"",
        mainModel : {
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"添加",
            name:'研判层级名称',
            //验证规则
            rules:{

            },
            emptyRules:{}
        },
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {

        },
        props:{

        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            doRefleshInfo:function (id) {
                var _this = this;
                api.riskjudgmenttaskCompany({id:id}).then(function (res) {
                    var  content = res.content;

                    // 过滤
                    if(!res.body) return;

                    var arr = res.body.riskJudgmentRecordDetails;
                    for(var i=0 ; i<arr.length; i++) {
                        var itemcontent = JSON.parse(arr[i].itemContent);
                        arr[i].riskTemplateConfig.content = arr[i].itemContent;
                        arr[i].itemContent = itemcontent.content;
                        arr[i].itemContent = itemcontent.content;
                    }
                    this.oldList = res.data;
                    _this.initGroup(arr);
                    _this.initPromise(res.data);

                })

            },

            // 初始化承诺
            initPromise:function (val) {
                if(this.mainModel.vo.isComplete == 1){
                    this.promiseObj  = JSON.parse(this.mainModel.vo.riskTemplateConfig.content);
                    this.promiseObj.content = this.mainModel.vo.promiseContent;
                    this.promiseContent = this.deel(this.promiseObj );
                }else{
                    this.promiseObj = JSON.parse(val.promiseContent);
                    this.promiseContent = this.deel(this.promiseObj);
                }
            },

            initGroup: function(valArr){
                var arr = valArr;
                this.groups = [];
                this.mainModel.vo.riskJudgmentGroups = [];
                for(var i=0; i<arr.length; i++){
                    var obj = {name: '', content:' ', textObj:null};
                    var o ={};
                    obj.name = arr[i].groupName;
                    if(arr[i]){
                        var label = arr[i].allExclude;
                        if(label == 1)
                            obj.name += '（不涉及）';
                        else if(label == 0)
                            obj.name += '（涉及）';
                        else  obj.name += '';
                    }
                    obj.allExclude = label;
                    obj.id = arr[i].id;
                    if(arr[i].itemContent) o.content = arr[i].itemContent;
                    else o.content = '';
                    if(valArr[i].riskTemplateConfig && arr[i].riskTemplateConfig.content!=''){
                        var temp = JSON.parse(arr[i].riskTemplateConfig.content);
                        for(var item in temp){
                            o[item] = temp[item];
                        }
                    }
                    obj.content = this.deel(o)
                    obj.textObj = o;
                    this.mainModel.vo.riskJudgmentGroups.push(obj);
                }
            },
            deel : function(textObj) {
                var template = textObj.content;
                if(template == '') return '';
                for(var item in textObj){
                    if(item == "content") continue;
                    // 过滤input
                    if(template.indexOf("{input_"+textObj[item].id+"}")>-1){
                        var str = "<span  disabled   class='"+textObj[item].class+"' >"+textObj[item].value+"</span>"
                        var order = '{input_'+item +"}";
                        template = template.replace(order, str);
                    }
                    // 过滤select
                    if(template.indexOf("templateSelect_"+textObj[item].id)>-1){
                        // var str = "<select  disabled value='"+textObj[item].value+"' id='"+textObj[item].id+"' name='";
                        // str+= textObj[item].name+"' class='"+textObj[item].class+"' >"
                        // str+= "<option>"+textObj[item].value+"</option>";
                        // for(var i=0; i<textObj[item].list.length; i++){
                        //     if(textObj[item].value == textObj[item].list[i]){
                        //         continue;
                        //     }
                        //     str+= "<option>"+textObj[item].list[i]+"</option>"
                        // }
                        // str+="</select>"
                        var str = "" + textObj[item].value
                        var order = '{templateSelect_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                    // 过滤多选框
                    // if(template.indexOf("templateCheck_"+textObj[item].id)>-1){
                    //     var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display:inline-block;'>";
                    //     for(var i=0; i<textObj[item].list.length;i++){
                    //         str+= textObj[item].list[i] + "<input  disabled type='checkBox' value='"+textObj[item].list[i]+"' />";
                    //         // var order = 'templateSelect_'+textObj[item].id;
                    //     }
                    //     str+="</p>";
                    //     var order = '{templateCheck_'+textObj[item].id+"}";
                    //     template = template.replace(order, str);
                    // }
                    if(template.indexOf("templateCheck_"+textObj[item].id)>-1){

                        var str = "<p class='"+textObj[item].class+"'" + "name='mycheckBox' id='"+textObj[item].id+"'  style='display: inline-flex;align-items: center'>";
                        for(var i=0; i<textObj[item].list.length;i++){
                            str+="<span>"
                            if(this.checkUserEdit(textObj[item].value,textObj[item].list[i]) >-1){
                                str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"' checked=true />";
                            }else{
                                str+= textObj[item].list[i] + "<input disabled type='checkBox' value='"+textObj[item].list[i]+"' />";

                            }
                            str+="</span>"
                            // var order = 'templateSelect_'+textObj[item].id;
                        }
                        str+="</p>";
                        var order = '{templateCheck_'+textObj[item].id+"}";
                        template = template.replace(order, str);
                    }
                }
                return template;
            },


            checkUserEdit:function  (arg1, arg2) {
                var a = -1;
                for(var i=0; i<arg1.length; i++){
                    if(arg1[i] == arg2){
                        a = 1;
                    }
                }
                return a;
            },

        }
    });

    return detail;
});