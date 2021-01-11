define(function (require) {
    var Vue = require("vue");
    var template = require("text!./security-measures.html");
    var formItemRow=require("./form-item-row");
    var propMixins=require("./mixins");
    var LIB = require("lib");

    var checkDisTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="background: #ddd;margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkDisFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox dis-none-after"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input disabled type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkTrue = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox ivu-checkbox-checked"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'
    var checkFalse = '<label style="display: flex;justify-content: center;" class="ivu-checkbox-wrapper"><span style="margin-right:0" class="ivu-checkbox"><span style="margin-right:0" class="ivu-checkbox-inner"></span><input  type="checkbox" class="ivu-checkbox-input"></span><span style="display: none;"></span></label>'

    var getGroupModel = function () {
        return {
            show:false,
            title:"添加组名",
            list:[],
            vo:{name: ''},
            rules:{
                "name" : [LIB.formRuleMgr.require("组名"),
                    LIB.formRuleMgr.length(100)
                ],
            },
            index:null // 具体标记操作哪一个组
        }
    };

    var  getColumns = function () {
        return [
            {
                title: "",
                width:"40px",
                render: function (data) {
                    // return "<input disabled type='checkbox' />"
                    if(data.attr1 == '1'){
                        return checkTrue;
                    }else{
                        return checkFalse;
                    }
                },
                event:true
            },
            {
                title : "措施内容",
                fieldName : "name",
                width:"600px",
                render: function (data) {
                     return  '<span class="input-group-name">' + getInputInfo(data) + '</span>';
                }
            }
        ];
    };

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

        if(tempObj && tempObj.name && tempObj.content){
            tempObj.attr2 = tempObj.attr2.replace(/（/g, "(").replace(/）/g, ")");
            tempObj.content = tempObj.content.replace(/（/g, "(").replace(/）/g, ")");
            str = tempObj.content || tempObj.attr2;
            var arr1 = getBracketContents1(tempObj.attr2);
            var arr2 = getBracketContents1(tempObj.content);


            if(arr1.length == arr2.length){
                for(var i=0; i<arr1.length; i++){
                    // if(arr1[i]=="()" || arr1[i]=='( )' || arr1[i]=='(  )' || arr1[i]=='(  )'){
                    //     var val =  arr2[i].replace(")", "").replace("(", "");
                    //     str =  str.replace(arr2[i], "(<input class='on-input-value' value='"+(val || '')+"'/>)");
                    // }
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
        str = str.replace("（", "(").replace("）", ")");

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
                kongzhicsList:[],
                list :[],

                groupItemModel: [],
                tableModel:{
                    list:[],
                    columns:[
                        {
                            title: "",
                            width:"40px",
                            render: function (data) {
                                // return "<input disabled type='checkbox' />"
                                if(data.attr1 == '1'){
                                    return checkTrue;
                                }else{
                                    return checkFalse;
                                }
                            },
                            event:true
                        },
                        {
                            title : "措施内容",
                            fieldName : "name",
                            width:"600px",
                            render: function (data) {
                                return  '<span class="input-group-name">' + getInputInfo(data) + '</span>'
                            }
                        },

                    ]
                },
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
                // this.kongzhicsList=this.permitModel.tempWorkStuffs.kongzhicsList;
                //  this.list = this.permitModel.workStuffs.filter(function (item) {
                //     return item.type == "4";
                // });
                this.updateColumns();
                this.deelGroupItemModel();
                this.deelGroupList();
            },

            onRowClicked: function (row) {
                if(row.attr1 == '1'){
                    row.attr1 = '0';
                }else{
                    row.attr1 = '1';
                }
            },

            deelGroupItemModel: function () {
                var _this = this;
                this.list = [];

                // 获取所有分组
                var list =this.permitModel.tempWorkStuffs.kongzhicsList;
                // groupItemModel 初始化
                this.groupItemModel = getGroupModel();
                _.each(list,function (listItem) {
                    var obj = {name: listItem.content?listItem.content:(listItem.name?listItem.name:''), children:[], id: listItem.id,content: listItem.content?listItem.content:(listItem.name?listItem.name:'')};
                    obj.children = _.map(listItem.children, function (item) {
                        return {
                            attr1: item.attr1,
                            id: item.ptwStuff?item.ptwStuff.id:'',
                            stuffId: item.ptwStuff?item.ptwStuff.id:(item.stuffId?item.stuffId:null),
                            stuffType:item.stuffType,
                            ptwStuff: item.ptwStuff,
                            // name: item.ptwStuff ? item.ptwStuff.name : (item.name?item.name:(item.content?item.content:'')),
                            // content: item.ptwStuff ? item.ptwStuff.name : (item.name?item.name:(item.content?item.content:'')),
                            name:item.attr2 || (item.ptwStuff && item.ptwStuff.name),
                            content: item.content?item.content:(item.name?item.name:(item.ptwStuff ? item.ptwStuff.name:'')),

                            attr2: item.attr2 || (item.ptwStuff && item.ptwStuff.name),
                            requireImg:item.requireImg,
                            ptwWorkVerifiers: _.map(item.ptwWorkVerifiers?item.ptwWorkVerifiers:item.ptwCardVerifiers, function (opt) {
                                return {name: opt.name}
                            }),
                        }
                    });
                    _this.list = _this.list.concat(obj.children);
                    _this.groupItemModel.list.push(obj);
                });

                this.permitModel.groupItemModel = this.groupItemModel;
            },

            deelGroupList:function(){
                var _this = this;
                var list = [];
                _.each( _this.groupItemModel.list, function (group) {
                    if(group.children){
                        _.each(group.children, function (item) {
                            list.push(item);
                        })
                    }
                });

                this.tableModel.list = list;
                return ;

                this.tableModel.list = _.map(list, function (item) {
                    return {
                        attr1: item.attr1,
                        id: item.ptwStuff?item.ptwStuff.id:'',
                        stuffId: item.ptwStuff?item.ptwStuff.id:(item.stuffId?item.stuffId:null),
                        stuffType:item.stuffType,
                        ptwStuff: item.ptwStuff,
                        name: item.ptwStuff ? item.ptwStuff.name : (item.name?item.name:(item.content?item.content:'')),
                        content: item.ptwStuff ? item.ptwStuff.name : (item.name?item.name:(item.content?item.content:'')),
                        attr2: item.attr2,
                        ptwWorkVerifiers: _.map(item.ptwWorkVerifiers?item.ptwWorkVerifiers:item.ptwCardVerifiers, function (opt) {
                            return {name: opt.name}
                        }),
                    }
                });

                // this.tableModel.list = list;
            },

            updateColumns: function () {
                this.tableModel.columns = getColumns();
                // 添加签名列
                if(this.permitModel.enableCtrlMeasureVerifier=='1'){
                    this.tableModel.columns.push(
                        {
                            title: "核对人",
                            width:"100px",
                            render: function (data) {
                                if(data && data.ptwWorkVerifiers){
                                    var str = '';
                                    _.each(data.ptwWorkVerifiers, function (item) {
                                        str += item.name + '，'
                                    });
                                    if(str.length>0){
                                        str = str.substring(0,str.length-1);
                                    }
                                    return str;
                                }
                            }
                        }
                    );
                };
                this.$set('tableModel.columns', this.tableModel.columns);
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
                str = str.replace(/（/g, "(").replace(/）/g, ")");

                var tempObj = _.find(this.list,function (obj) {
                    if(obj.id == item.id){return true}
                })
                if(tempObj && tempObj.name && tempObj.content){
                    tempObj.name = tempObj.name.replace(/（/g, "(").replace(/）/g, ")");
                    tempObj.content = tempObj.content.replace(/（/g, "(").replace(/）/g, ")");
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
                str = str.replace(/（/g, "(").replace(/）/g, ")");
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
                var _this = this;
                var groups = $(".input-group-name");
                var str = '';
                this.kongzhicsList = [];
                _.each(this.groupItemModel.list, function (listItem) {
                    _.each(listItem.children, function (child) {
                        _this.kongzhicsList.push(child);
                    })
                })

                for(var i=0; i<groups.length; i++){
                    var tempName = this.kongzhicsList[i].name;

                    tempName = tempName.replace(/\n/g, "");
                    tempName = tempName.replace(/（/g, "(").replace(/）/g, ")");
                    // tempName = tempName.replace(/\(/g, "(").replace(/\)/g, ")");
                    tempName = tempName.replace(/\( \)/g,"()").replace(/\( \)/g,"()").replace(/\( \)/g,"()").replace(/\( \)/g, "()").replace(/\(  \)/g, "()").replace(/\(   \)/g, "()").replace(/\(    \)/g, "()");
                    var arr = this.getBracketContents1(tempName);


                    var inputs = groups.eq(i).find(".on-input-value");

                   var splitStr = tempName.split("()");
var realstr = '';
                    if(splitStr.length>1){
                        for(var j=0; j<inputs.length; j++){
                            realstr += splitStr[j] || '';
                            realstr += "("+(inputs.eq(j).val() || '') + ")"
                        }
                        tempName = realstr + (splitStr[j] || '');
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
