define(function (require) {
    var Vue = require("vue");
    var template = require("text!./weihaibs.html");
    var formItemRow=require("./form-item-row");
    var propMixins=require("./mixins");


    function ClearBr(key) {
        key = key.replace(/<\/?.+?>/g,"");
        key = key.replace(/[\r\n]/g, "");
        return key;
    }

    var getInputInfo = function (item) {
        var str = item.content || item.name;

        var instr = "<input class='on-input-value' />";
        str = str.replace("（", "(").replace("）", ")");
        // var tempObj = _.find(this.list,function (obj) {
        //     if(obj.id == item.id){return true}
        // })

        var tempObj = item;

        if(tempObj && tempObj.attr2 && tempObj.content){
            tempObj.attr2 = (tempObj.attr2).replace(/（/g, "(").replace(/）/g, ")");
            tempObj.content = tempObj.content.replace(/（/g, "(").replace(/）/g, ")");

            str = tempObj.content || tempObj.attr2;
            var arr1 = getBracketContents1(tempObj.attr2);
            var arr2 = getBracketContents1(tempObj.content);
            if(arr1.length == arr2.length){
                for(var i=0; i<arr1.length; i++){
                    arr1[i] = ClearBr(arr1[i]);
                    arr1[i] = arr1[i].replace(/\s+/g, "");
                    arr1[i] = arr1[i].replace(/ +/g, "");
                    if(arr1[i] == '()'){
                        var val =  arr2[i].replace(")", "").replace("(", "");
                        str =  str.replace(arr2[i], "(<input class='on-input-value' value='"+(val || '')+"'/>)");
                    }
                }
                return str;
            }
        }
        str=item.name;
        str = str.replace(/（/g, "(").replace(/）/g, ")");

        var arr = getBracketContents1(str);
        for(var i=0; i<arr.length; i++){
            if(arr[i]=="()" || arr[i]=='( )' || arr[i]=='(  )' || arr[i]=='(  )'){
                str =  str.replace(arr[i], "(<input class='on-input-value'/>)");
            }
        }
        return str;
    };


    var getBracketContents1 = function (context) {
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
    };

    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "formItemRow":formItemRow,
        },
        data: function () {
            return {
                selAll:false,
                weihaibsList:[],
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
                this.weihaibsList=this.permitModel.tempWorkStuffs.weihaibsList;
            },
            getInputInfo:function(item){
              return  getInputInfo(item)
            },
            changeTpl:function(){
                this.initData();
            },
            doChangeAll:function(checked){
                if(checked){
                    for (var i=0;i<this.weihaibsList.length-1;i++){
                        var item=this.weihaibsList[i];
                        item.attr1="1";
                    }
                }
                else{
                    for (var i=0;i<this.weihaibsList.length-1;i++){
                        var item=this.weihaibsList[i];
                        item.attr1="0";
                    }
                }
            },
            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:type});
            },
            doChangeUser:function () {
                this.showSelUser("weihaisUser")
            },
            setInputVal: function () {
                var _this = this;
                var groups = $(".weihaibianshiListItem");
                var str = '';

                for(var i=0; i<groups.length; i++){
                    var tempName = this.weihaibsList[i].attr2;
                    if(!tempName) continue;
                    tempName = tempName.replace(/（/g, "(").replace(/）/g, ")");
                    // tempName = tempName.replace(/）/g, "(").replace(/）/g, ")");
                    tempName = tempName.replace("( )","()").replace("( )","()").replace("( )","()").replace("( )", "()").replace("(  )", "()").replace("(   )", "()").replace("(    )", "()");
                    var arr = getBracketContents1(tempName);
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
                    this.weihaibsList[i].tempContent = tempName;
                    this.weihaibsList[i].content = tempName;

                }

            },
        },
        events:{
            "setInputValue":function () {
                this.setInputVal();
            }
        }
    })
})
