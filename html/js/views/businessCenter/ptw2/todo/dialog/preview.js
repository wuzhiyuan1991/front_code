define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    var api_ptw = require("../../api")
    //右侧滑出详细页
    var tpl = require("text!./preview.html");
    var model=require("../../model");

    //Vue数据
    var dataModel = {
        imgStyle:"height:20px;width:auto;",
        vo: null,
        items: null,
        model:null,
        ppeList:null,
        dataTypeGelifh:{
            view:"PTW5",
            isolate:"PTW6",
            disisolate:"PTW7"
        },
        signFileType:"PTW9",
        personList:[],
        isShowList:false,

        //  作业关闭相关
        workClosePersonList:[],
        workResultType: model.workResultType,
        currentWorkResult: "",
        isWorkClose: false,
        personnel:{
            "1":null,
            "7":null,
            "8":null,
        },
        postponeTime:"",
        gasTypeList:[],
        checkBeforeRecords:[],
        checkIngRecords:[],
        enum:model.enum,

        previewCheckBefore:null,
        previewCheckIng1:null,
        previewCheckIng2:null,
        previewCheckIngLists:[],
        applyName :''

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
            },

        },
        computed: {

            operateList: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 9;
                });
                return list;
            },

            // 作业人员
            workPersonList: function () {
                var list = [];
                list = this.model.selworkPersonnels['4']?list.concat(this.model.selworkPersonnels['4']):'';
                list = this.model.selworkPersonnels['5']?list.concat(this.model.selworkPersonnels['5']):'';
                return list;
            },

            // 作业单位
            unitLists: function () {
                var list = [];
                list = this.model.workDepts?list.concat(this.model.workDepts):'';
                list = this.model.workContractors?list.concat(this.model.workContractors):'';
                return list;
            },
            //作业单位名称
            equipmentList: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 1;
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 1;
                // });
                // _.each(list, function (item1) {
                //     item1.select = true;
                // });
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name})
                //     }
                // });
                return list;
            },
            certificateList: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 2;
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 2;
                // });
                // var list3 = this.model.workPersonnels.filter(function (item) {
                //     return item.type == 7;
                // });
                //
                // _.each(list, function (item1) {
                //     item1.select = true;
                //     item1.person = _.filter(list3, function (item3) {
                //         return item1.workStuffId == item3.certStuffId;
                //     });
                // });
                //
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name})
                //     }
                // });
                return list;
            },
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
            },
             weihaibsList:function () {
                 var list = this.model.workStuffs.filter(function (item) {
                     return item.type == 3;
                 });

                 // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                 //     return item.stuffType == 3;
                 // });
                 // _.each(list, function (item1) {
                 //     item1.select = true;
                 // });
                 // _.each(list2,function (item2) {
                 //     if(!_.find(list, function (item1) {
                 //             return item1.id == item2.stuffId
                 //         })){
                 //         list.push({name:item2.ptwStuff.name})
                 //     }
                 // });
                 // for(var i=0; i<list.length; i++){
                 //     if(list[i].isExtra && list[i].isExtra=='1'){
                 //         var temp = list[i];
                 //         list[i] = list[list.length-1];
                 //         list[list.length-1] = temp;
                 //         break;
                 //     }
                 // }
                 return  list;
            },
            kongzhicsList:function () {
                // var list =  this.model.workStuffs.filter(function (item) {
                //     return  item.type==4&&!item.gasType;
                // });

                var list = this.model.workStuffs.filter(function (item) {
                    return item.type==4 &&!item.gasType
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 4;
                // });
                if(!_.find(list,function (item) {
                        return item.isExtra == '1'
                    })){
                    list.push({name:'其他'});
                }
                // _.each(list, function (item1) {
                //     item1.select = true;
                // });
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name})
                //     }
                // });
                for(var i=0; i<list.length; i++){
                    if(list[i].isExtra && list[i].isExtra=='1'){
                        var temp = list[i];
                        list[i] = list[list.length-1];
                        list[list.length-1] = temp;
                        break;
                    }
                }
                return list;
            },
            gelifunName: function () {
                var fun= this.model.workStuffs.filter(function (item) {
                    return item.type ==5&&item.checkResult==2;
                })[0];
                return fun.name;
            },
            geliffList :function () {
                // var list= this.model.workStuffs.filter(function (item) {
                //     return item.type ==5;
                // });

                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 5;
                });
                var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                    return item.stuffType == 5;
                });
                _.each(list, function (item1) {
                    item1.select = true;
                });
                _.each(list2,function (item2) {
                    if(!_.find(list, function (item1) {
                            return item1.id == item2.stuffId
                        })){
                        list.push({name:item2.ptwStuff.name})
                    }
                });
                return list;
            },
            //隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
            process: function () {
                return _.findWhere(this.model.workIsolations, {type: "1"});
            },
            mechanical: function () {
                return _.findWhere(this.model.workIsolations, {type: "2"});
            },
            electric: function () {
                return _.findWhere(this.model.workIsolations, {type: "3"});
            },
            systemMask: function () {
                return _.findWhere(this.model.workIsolations, {type: "4"});
            },
            // 特种作业人员列表
            specialPersonList:function () {
                var list =  _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "7";
                });
                return list;
            },
             //  维修人员列表
            repairPersonList:function () {
                return _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "6";
                });
            },
            // 安全教育实施人员列表
            securityEducationPersonList:function () {
                return _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "2";
                });
            },
            // 监护人员列表
            custodyPersonList: function () {
                // var list = _.filter(this.model.workPersonnels, function (item) {
                //     return item.type == "3";
                // });
                var list = this.vo.superviseRecords;
                return list;
            },
            reasonStr: function () {
                return this.model.workStuffs.filter(function (item) {
                    return item.type == 7&&item.checkResult==2;
                })[0].name;
            },
            reasonList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 7;
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 7;
                // });
                // _.each(list, function (item1) {
                //     item1.select = true;
                // });
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name})
                //     }
                // });

                return list;
            },
            selworkPersonnels45:function () {
                return [].concat(this.model.selworkPersonnels['5'], this.model.selworkPersonnels['4']);
            },
            pplistNew:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 6;
                });
                var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                    return item.stuffType == 6;
                });
                _.each(list, function (item1) {
                    item1.select = true;
                });
                _.each(list2,function (item2) {
                    if(!_.find(list, function (item1) {
                            return item1.id == item2.stuffId
                        })){
                        list.push({name:item2.ptwStuff.name,ppeCatalogId:item2.ptwStuff.ppeCatalogId})
                    }
                });
                return list;
            },
            getStatusExt:function () {
                var temp = true;
                if(this.vo.workHistories && this.vo.workHistories.length>0){
                    var obj = _.find(this.vo.workHistories,function (item) {
                        return item.workStatus == '5'
                    });
                    var len  = this.vo.workHistories.length;
                    if(this.vo.workHistories[len-1].workStatus == '4' && obj){
                        temp = false;
                    }
                }
                return temp;
            }
        },

        methods:{
            getItemName:function (item, str) {
                if(item.isExtra == '1'){
                    if(str == "kongzhi" && !this.getStatusExt){
                        return "其他"
                    }else{
                        return "其他（" + item.content +"）"
                    }

                }else{
                    return item.content || item.name;
                }
            },

            printTable:  function (ro) {
            var row = 18; //默认分页18行,demo中参数是3行
            if (ro != undefined) {
                row = ro;
            }
            var $tbl = $('#tablexx');
            var $tableparent = $tbl.parent();
            var $thead = $tbl.find('thead');
            // var $tfoot = $tbl.find('tfoot');
            var $tbody = $tbl.find('tbody');
            var $tbodyTr = $tbody.children();
            var $clonefirstTr = $tbodyTr.first().clone();
            $clonefirstTr.children().each(function () {
                $(this).html(' ');
            })
            //打空白行
            var tbodyTrlength = $tbodyTr.length;
            var addrow = 0;
            var remainder = tbodyTrlength % row;
            var nulltr = "";
            if (remainder != 0) {
                addrow = row - remainder;
                for (var i = 0; i < addrow; i++) {
                    nulltr += $clonefirstTr[0].outerHTML;
                }
            }
            $tbody.append(nulltr); //空白行加入到文档
            //再一次获取所有的tr行
            $tbodyTr = $tbody.children();
            //清空tbody
            $tbody.children().remove();
            //再获取整个表格(此时的表格tbody已经没东西了,这样解释是不是有点啰嗦了?)
            $tbl = $('table.printTable');
            //创建一个文档碎片(这里没有用文档碎片了,jQuery操作字符串更简单)
            var fragment = '';
            //给表格加18行tr(主体内容)
            tbodyTrlength = $tbodyTr.length;
            var trFG = '';
            for (var i = 0; i < tbodyTrlength; i++) {
                trFG += $tbodyTr.eq(i)[0].outerHTML;
                if ((i + 1) % row == 0) {
                    var clonetbl = $tbl.clone(); //克隆一个表格
                    clonetbl.find("tbody").append(trFG); //在表格的body中加入内容
                    fragment += clonetbl[0].outerHTML + "<div style='page-break-after:always;' ><br/></div>"; //把表格加入文档碎片中
                    trFG = '';
                }
            }
            $tbl.before(fragment);
            $tbl.remove();

            this.preview(12);
        },

            certificatePerson: function (personList) {
                var temp = false;
                personList.forEach(function (person) {
                    if( (person.contractorEmp && person.contractorEmp.name) || (person.user && person.user.name) ){
                        temp = true;
                    }
                });
                return temp;
            },

            //进行预览打印
            preview: function (oper) {
                if (oper < 10) {
                    bdhtml = window.document.body.innerHTML; //获取当前页的html代码
                    sprnstr = "<!--startprint" + oper + "-->"; //设置打印开始区域
                    eprnstr = "<!--endprint" + oper + "-->"; //设置打印结束区域
                    prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 18); //从开始代码向后取html
                    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html
                    window.document.body.innerHTML = prnhtml;
                    window.print();
                    window.document.body.innerHTML = bdhtml;
                } else {
                    window.print();
                }
            },


            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },
            init: function (obj, permit) {
                this.vo = obj;
                this.model = permit;
                this.getPPeList();
                this.getPersonList();
                this.getGasDetection();
                this.getWorkClose();

                this.applyName = this.getDataDic('org', this.model.applUnitId)['deptName'];
                if(!this.applyName){
                    var _this = this;
                    this.applyName = this.model.applyUnit.deptName;
                    // var resource = this.$resource("/contractor/list/1/10?id="+this.model.applUnitId);
                    // resource.get().then(function(res){
                    //     console.log(res)
                    //     var list = res.data.list;
                    //     if(list.length>0){
                    //         _this.applyName = list[0].deptName;
                    //     }
                    // });
                }

                // this._getVO();
                // this._getItems();

            },

            // 个人防护相关
            getPPEItems:function(data){
                return  this.model.workStuffs.filter(function (item) {
                    return  item.type==6&&item.ppeCatalogId==data.id;
                });
            },

            getPPeList:function () {
                var _this=this;
                _this.ppeList = null;
                api_ptw.getPPETypes().then(function (data) {
                    data.forEach(function (item) {
                        if(_this.model.workTpl.ppeCatalogSetting){
                            item.enable=!!_this.model.workTpl.ppeCatalogSetting.match(new RegExp(item.id));
                        }
                        else{
                            item.enable=false;
                        }
                        return item;
                    });
                    var list = _this.deelList();
                    if(list.length == 0) _this.isShowList = false;
                    else _this.isShowList = true;

                    _.each(data,function (item1) {
                        if(item1.enable){
                            var arr =  _.filter(list,function (item2) {
                                return item2.ppeCatalogId == item1.id;
                            });
                            item1.lists = [].concat(arr);
                            if(!_.find(arr,function (item) {
                                    return item.isExtra == '1'
                                })){
                                item1.lists.push({name:'其他'});
                            }
                        }
                    });
                    for(var i=0; i<list.length; i++){
                        if(list[i].isExtra && list[i].isExtra=='1'){
                            var temp = list[i];
                            list[i] = list[list.length-1];
                            list[list.length-1] = temp;
                            break;
                        }
                    }

                    // for(var i=0; i<data.length; i++){
                    //     if(data[i].lists && data[i].lists.length>0){
                    //         for(var j=0; j<data[i].lists.length; j++){
                    //             if(data[i].lists[j].isExtra == '1'){
                    //                 var temp  = data[i].lists[j];
                    //                 data[i].lists[j] = data[i].lists[data[i].lists.length-1];
                    //                 data[i].lists[data[i].lists.length-1] = temp;
                    //             }
                    //         }
                    //     }
                    // }

                    _this.ppeList = data;
                    // _this.$set("ppeList",data);
                })
            },
            deelList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 6;
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 6;
                // });
                // _.each(list, function (item1) {
                //     item1.select = true;
                // });
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name,ppeCatalogId:item2.ptwStuff.ppeCatalogId})
                //     }
                // });
                for(var i=0; i<list.length; i++){
                    if(list[i].isExtra && list[i].isExtra=='1'){
                        var temp = list[i];
                        list[i] = list[list.length-1];
                        list[list.length-1] = temp;
                        break;
                    }
                }
                return list;
            },
            // 个人防护相关 end
            // 会签人员
            getPersonList: function () {
                var _this = this;
                if(this.vo.firstUsedPermit){
                    this.personList = this.vo.firstUsedPermit.workPersonnels.filter(function (item) {
                        // var type=_this.getPersonType(item);
                        // item.signFile=_this.getFiles(item.cloudFiles,_this.signFileType);
                        // item.typeObj=type;
                        // return ['10','11'].indexOf(item.type)===-1
                        // 3-11
                        return item.type == '1'
                    });
                }
                return [];

            },
            getFiles:function (data,type) {
                var files=data.filter(function (item) {
                    return   item.dataType==type
                });
                return files;
            },
            getFilesGelifh:function(data,type){
                var files=data.filter(function (item) {
                    return   item.dataType==type
                });
                return files;
            },
            getPersonType:function(data){
                return _.findWhere(model.personType,{type:data.type});
            },
            _getPersonels:function(type){
                var m=this.model.workPersonnels.filter(function (item) {
                    return item.type==type;
                });
                var m=JSON.parse((JSON.stringify(m)));
                m.forEach(function (item) {
                    item.cloudFiles=item.cloudFiles.filter(function (item) {
                        return item.dataType=="PTW10"
                    })
                });

                return m;
            },

            // 气体检测相关
            _getGasItems:function(data){
                return  this.model.workStuffs.filter(function (item) {
                    return  item.gasType==data.type;
                })
            },

            getPreviewGas:function (oldObj, type, listType) {
                if(!oldObj) return {};
                if(this.model.enableGasDetection==0) return null;
                var obj = {};
                obj.detectSite = oldObj.detectSite; //地点
                obj.detectTime = oldObj.detectTime;
                obj.signFiles = oldObj.signFiles;
                obj.harmfulGasList = _.filter(oldObj[listType], function (item) {
                   return item.gasType == 1;
                });
                obj.combustibleGasList = _.filter(oldObj[listType], function (item) {
                    return item.gasType == 2;
                });
                obj.oxygenGasList = _.filter(oldObj[listType], function (item) {
                    return item.gasType == 3;
                });
                if(type == 1){
                    obj.harmfulGas = '';
                    obj.harmfulGasList.forEach(function (item) {
                        obj.harmfulGas += item.gasCatalog.name + " : "+ '('+(item.value || 0)+')'+"\n";
                    });
                    obj.combustibleGas = '';
                    obj.combustibleGasList.forEach(function (item) {
                        obj.combustibleGas += item.gasCatalog.name + " : "+ '('+(item.value || 0)+')'+"\n";
                    });
                    obj.oxygenGas = '';
                    obj.oxygenGasList.forEach(function (item) {
                        obj.oxygenGas += item.gasCatalog.name + " : "+ '('+(item.value || 0)+')'+"\n";
                    });
                }else{
                    obj.harmfulGas = '';
                    obj.harmfulGasList.forEach(function (item) {
                        obj.harmfulGas += item.gasCatalog.name + " : "+ (item.value?'上部('+(item.value || 0)+')':'');
                        obj.harmfulGas += item.value2?'中部('+(item.value2 || 0)+')':'';
                        obj.harmfulGas += item.value3?'下部('+(item.value3 || 0)+')':''+"\n";
                    });
                    obj.combustibleGas = '';
                    obj.combustibleGasList.forEach(function (item) {
                        obj.combustibleGas += item.gasCatalog.name + " : "+ (item.value?'上部('+(item.value || 0)+')':'');
                        obj.combustibleGas += item.value2?'中部('+(item.value2 || 0)+')':'';
                        obj.combustibleGas += item.value3?'下部('+(item.value3 || 0)+')':''+"\n";
                    });
                    obj.oxygenGas = '';
                    obj.oxygenGasList.forEach(function (item) {
                        obj.oxygenGas += item.gasCatalog.name + " : "+ (item.value?'上部('+(item.value || 0)+')':'');
                        obj.oxygenGas += item.value2?'中部('+(item.value2 || 0)+')':'';
                        obj.oxygenGas += item.value3?'下部('+(item.value3 || 0)+')':''+"\n";
                    });
                }
                return obj;

            },

            getSpan:function(){
                if(this.previewCheckIngLists.length==0)
                return 2;
                else{
                    return 1+this.previewCheckIngLists.length;
                }
            },

            getGasDetection:function () {
                var _this = this;
                var temp=[];
                for (var key in model.gasType){
                    var item={
                        type:key,
                        name:model.gasType[key],
                        items:this._getGasItems({type:key}),
                    };
                    temp.push(item);
                }
                var checkBefore=[],checkIng=[];
                this.vo.gasDetectionRecords.forEach(function (item) {
                    item.signFiles=item.cloudFiles.filter(function (item) {
                        return item.dataType.toUpperCase()=="PTW8"
                    });
                    if(item.type==="1"){
                        checkBefore.push(item);
                    }
                    else if(item.type==="2"){
                        checkIng.push(item);
                    }
                });

                _.each(checkBefore,function (item) {
                    item.gasDetectionDetails = _.sortBy(item.gasDetectionDetails,function (d) {
                        return (d.gasCatalog.name);
                    });
                });
                _.each(checkIng,function (item) {
                    item.gasDetectionDetails = _.sortBy(item.gasDetectionDetails,function (d) {
                        return (d.gasCatalog.name);
                    });
                });
                // 排序
                checkIng =  _.sortBy(checkIng,function (item) {
                    return item.detectTime;
                });

                if(checkBefore && checkBefore[0])
                    checkBefore = [checkBefore[0]];

                // 取出数据
                _this.previewCheckBefore = [];
                checkBefore.forEach(function (item) {
                    _this.previewCheckBefore.push(_this.getPreviewGas(item,_this.model.gasCheckMethod,"gasDetectionDetails"));
                });
                this.previewCheckIngLists = [];


                checkIng.forEach(function (item) {
                    _this.previewCheckIngLists.push(_this.getPreviewGas(item,_this.model.gasCheckMethod,"gasDetectionDetails"));
                });
                if(checkBefore && checkBefore[0])
                    checkBefore = [checkBefore[0]];


                this.checkBeforeRecords=checkBefore;
                this.checkIngRecords=checkIng;
                // this._columnsHandler("preCheckRecord",checkBefore);
                // this._columnsHandler("checkingRecord",checkIng);
                // if(checkBefore){
                //     checkBefore.cloudFiles=[checkBefore.cloudFile];
                //     this.tableModel.preCheckRecord.values=checkBefore.gasDetectionDetails||[];
                //     this.checkBefore=checkBefore;
                // }
                // if(checkIng){
                //     checkIng.cloudFiles=[checkIng.cloudFile];
                //     this.tableModel.checkingRecord.values=checkIng.gasDetectionDetails||[];
                //     this.checkIng=checkIng;
                // }

                this.gasTypeList=temp;
            },
            // 气体检测相关 end

            getList:function (arr, type) {
                return arr.filter(function (item) {
                    return item.type == type;
                })
            },

            workclosespan:function (num, arr) {
                if(arr.length == 0){
                    return num +1;
                }
                else return num + arr.length;
            },

            getWorkClose: function () {
                // status状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,
                // 5:作业监测,6:待关闭,7:作业取消,
                // 8:作业完成,9:作业续签,10:被否决

                //result 作业结果 1:作业完成,2:作业取消,3:作业续签4:作业
                var _this=this;
                _this.workClosePersonList = [];
                _this.isWorkClose = false;

                if(!this.vo.renewedWorkPermits){
                    return;
                }
                var len = this.vo.renewedWorkPermits.length;
                this.vo.renewedWorkPermits.forEach(function (item) {
                    if(["7", "8", "9", "11"].indexOf(item.status) > -1) {
                        _this.isWorkClose = true;
                    }
                    if((["7", "8", "9", "11"].indexOf(item.status) > -1)) {
                        if(item.versionNum > 1) {
                            if(item.extensionType == '1')
                                _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                            else
                                _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                        }
                        if(item.result=='1'){
                            _this.workClosePersonList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                        }else if(item.result == '2'){
                            _this.workClosePersonList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                        }

                    }else{
                        if(len == 1){
                            _this.workClosePersonList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                            _this.workClosePersonList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                            if(item.extensionType == '1'){
                                if(item.versionNum > 1)
                                    _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                                else
                                    _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "10"),vo:item});
                            }else{
                                if(item.versionNum > 1)
                                    _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                                else
                                    _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "10"),vo:item});
                            }
                        }else if(len>1){
                            if(item.extensionType == '1'){
                                _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                            }else{
                                _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                            }
                        }
                    }
                });

                var obj = {};
                _this.workClosePersonList.forEach(function (item) {
                    if(obj[item.type]){
                        obj[item.type].push(item);
                    } else{
                        obj[item.type] = [];
                        item.isOne = true;
                        obj[item.type].push(item);
                    }
                });
                var arrList = []
                for(var key  in obj){
                    arrList = arrList.concat(obj[key])
                };
_this.workClosePersonList = arrList;

                return ;

                var len = this.vo.renewedWorkPermits.length;
                this.vo.renewedWorkPermits.forEach(function (item) {
                    if(["6","7", "8", "9"].indexOf(item.status) > -1) {
                        _this.isWorkClose = true;
                    }
                    if(item.result=='1'){
                        _this.workClosePersonList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                    }else if(item.result == '2'){
                        _this.workClosePersonList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                    }else if(item.result == '3'){
                        if(len>1)
                        _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                        else
                        _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "10"),vo:item});
                    }else if(item.result == '4'){
                        // _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                        if(len>1)
                            _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                        else
                            _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "10"),vo:item});
                    }else{
                        if(len == 1){
                            _this.workClosePersonList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                            _this.workClosePersonList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                            if(item.extensionType == '1'){
                                _this.workClosePersonList.push({type:'postpone',list:_this.getList(item.workPersonnels, "10"),vo:item});
                            }else{
                                _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "10"),vo:item});
                            }
                        }
                    }
                });
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