define(function (require) {
    var Vue = require("vue");
    var template = require("text!./security-measures.html");
    var formItemRow=require("./form-item-row");
    var propMixins=require("./mixins");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "formItemRow":formItemRow,
        },

        data: function () {
            return {
                selAll:false,
                kongzhicsList:[],
                list :[]
            }
        },
        watch:{
            'permitModel':function(){
                this.initData();
            },
        },
        methods: {
            initData:function(){
                this.selAll=false;
                this.kongzhicsList=this.permitModel.tempWorkStuffs.kongzhicsList;
                 this.list = this.permitModel.workStuffs.filter(function (item) {
                    return item.type == "4";
                })
                var list2 =this.permitModel.workStuffs.filter(function (item) {
                    return item.type == "4";
                })
                // console.log(this.permitModel, this.model, this.list, list2);
            },
            changeTpl:function(){
                this.initData();
            },
            doChangeAll:function(checked){
                if(checked){
                    for (var i=0;i<this.kongzhicsList.length-1;i++){
                        var item=this.kongzhicsList[i];
                        item.attr1="1";
                    }
                }
                else{
                    for (var i=0;i<this.kongzhicsList.length-1;i++){
                        var item=this.kongzhicsList[i];
                        item.attr1="0";
                    }
                }
            },

            getBracketContents1 :function (context) {
                var bracketContents = [];//所有括号内容

                context = context.replace("（", "(").replace("）", ")");
                var leftBracket = "(";
                var rightBracket = ")";
                var head = context.indexOf(leftBracket); // 标记第一个使用左括号的位置
                if (head == -1) {
                    return bracketContents; // 如果context中不存在括号，什么也不做，直接跑到函数底端返回初值
                } else {
                    var next = head + 1; // 从head+1起检查每个字符
                    var count = 1; // 记录括号情况
                    for(;head != -1;) {
                        if (leftBracket == context.charAt(next)) {
                            count++;
                        } else if (rightBracket == context.charAt(next)) {
                            count--;
                        }
                        next++; // 更新即将读取的下一个字符的位置
                        if (count == 0) { // 已经找到匹配的括号
                            bracketContents.push(context.substring(head, next));//记录括号内容
                            if(context.substring(next).indexOf(leftBracket) != -1) {
                                head = context.substring(next).indexOf(leftBracket) + next; // 找寻下一个左括号
                                next = head + 1; // 标记下一个左括号后的字符位置
                                count = 1; // count的值还原成1
                            }else {
                                head = -1;
                            }
                        }
                    }
                    return bracketContents;
                }
            },

            getInputInfo:function (item) {
                var str = item.name;
                var instr = "<input class='on-input-value' />";
                str = str.replace("（", "(").replace("）", ")");

                var tempObj = _.find(this.list,function (obj) {
                    if(obj.id == item.id){return true}
                })
                if(tempObj && tempObj.name && tempObj.content){
                    tempObj.name = tempObj.name.replace("（", "(").replace("）", ")");
                    tempObj.content = tempObj.content.replace("（", "(").replace("）", ")");
                    str = tempObj.content || tempObj.name;
                    var arr1 = this.getBracketContents1(tempObj.name);
                    var arr2 = this.getBracketContents1(tempObj.content);

                    if(arr1.length == arr2.length){
                        for(var i=0; i<arr1.length; i++){
                            if(arr1[i]=="()" || arr1[i]=='( )' || arr1[i]=='(  )' || arr1[i]=='(  )'){
                                var val =  arr2[i].replace(")", "").replace("(", "");
                                str =  str.replace(arr2[i], "(<input class='on-input-value' value='"+(val || '')+"'/>)");
                            }
                        }
                        return str;
                    }
                }
                str=item.name;
                str = str.replace("（", "(").replace("）", ")");
                var arr = this.getBracketContents1(str);
                for(var i=0; i<arr.length; i++){
                    if(arr[i]=="()" || arr[i]=='( )' || arr[i]=='(  )' || arr[i]=='(  )'){
                       str =  str.replace(arr[i], "(<input class='on-input-value'/>)");
                    }
                }
                return str;
            },

            getInputValue:function () {
                var groups = $(".input-group-name");
                var str = '';
                for(var i=0; i<groups.length; i++){
                    var inputs = groups.eq(i).find(".on-input-value");
                    for(var j=0; j<inputs.length; j++){
                        str+= inputs.eq(j).val() + ", ";
                    }
                }
            },

            setInputVal: function () {
                var groups = $(".input-group-name");
                var str = '';

                for(var i=0; i<groups.length; i++){
                    var tempName = this.kongzhicsList[i].name;
                    tempName = tempName.replace("（", "(").replace("）", ")");
                    tempName = tempName.replace("(", "(").replace(")", ")");
                    tempName = tempName.replace("( )", "()").replace("(  )", "()").replace("(   )", "()").replace("(    )", "()");
                    var arr = this.getBracketContents1(tempName);
                    var inputs = groups.eq(i).find(".on-input-value");

                   var splitStr = tempName.split("()");

var realstr = '';
                    if(splitStr.length>1){
                        for(var j=0; j<inputs.length; j++){
                            realstr += splitStr[j];
                            realstr += "("+(inputs.eq(j).val() || '') + ")"
                        }
                        tempName = realstr + splitStr[j] || '';
                    }

                    // for(var j=0; j<inputs.length; j++){
                        // if(arr[j]=="()" || arr[j]=='( )' || arr[j]=='(  )' || arr[j]=='(  )'){
                        //     var tempsp = tempName.split(arr[j]);
                        //     tempName = tempsp[0];
                        //     // tempName =  tempName.replace(arr[j], "("+(inputs.eq(k).val() || '')+")");
                        //     k++;
                        // }
                    // }
                    // this.kongzhicsList[i].name = tempName;
                    this.kongzhicsList[i].tempContent = tempName;
                }
            },

            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:type});
            }
        },

        events:{
            "setInputValue":function () {
                this.setInputVal();
            }
        }
    })
});
