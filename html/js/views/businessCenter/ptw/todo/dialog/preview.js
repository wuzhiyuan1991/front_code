define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    var api_ptw = require("../../api")
    //右侧滑出详细页
    var tpl = require("text!./preview.html");
    var model = require("../../model");

    //Vue数据
    var dataModel = {
        isShowRepair: false,
        jsonList: [],
        showSign: false,
        imgStyle: "height:24px;max-width: 140px;object-fit: contain;", //transform: scale(1.2)
        vo: null,
        items: null,
        model: null,
        ppeList: null,
        dataTypeGelifh: {
            view: "PTW5",
            isolate: "PTW6",
            disisolate: "PTW7"
        },
        signFileType: "PTW9",
        personList: [],
        isShowList: false,

        //  作业关闭相关
        workClosePersonList: [],
        workResultType: model.workResultType,
        currentWorkResult: "",
        isWorkClose: false,
        personnel: {
            "1": null,
            "7": null,
            "8": null,
        },
        postponeTime: "",
        gasTypeList: [],
        checkBeforeRecords: [],
        checkIngRecords: [],
        enum: model.enum,

        previewCheckBefore: null,
        previewCheckIng1: null,
        previewCheckIng2: null,
        previewCheckIngLists: [],
        applyName: ''

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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
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
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this._init();
                }
            },

        },
        computed: {
            tableList: function () {
                var list = [];
                if (this.model.blindPlates) {
                    for (var i = 0; i < this.model.blindPlates.length; i++) {
                        var blindPlateOperations = this.model.blindPlates[i].blindPlateOperations;
                        // if(blindPlateOperations.length>0){
                        //     blindPlateOperations = blindPlateOperations.sort(function(a,b){
                        //         return a.operateTime < b.operateTime ? 1 : -1
                        //     });
                        // }

                        for (var j = blindPlateOperations.length - 1; j >= 0; j) {
                            var item = _.clone(this.model.blindPlates[i]);
                            if (!item.blindPlateOperations1) {
                                item.blindPlateOperations1 = []
                            }
                            if (blindPlateOperations[j]) {
                                item.blindPlateOperations1.push(blindPlateOperations[j])
                                if (j == blindPlateOperations.length - 1 && blindPlateOperations[j].type == '2') {
                                    list.push(item);
                                    j -= 1;
                                    continue;
                                }
                            }
                            if (blindPlateOperations[j - 1] && blindPlateOperations[j - 1].type != blindPlateOperations[j].type) {
                                item.blindPlateOperations1.push(blindPlateOperations[j - 1]) // 抽堵一组 需合并
                                list.push(item);
                                j -= 2;
                                continue;
                            }
                            list.push(item);
                            j -= 1;
                        }
                        if (blindPlateOperations.length == 0) list.push(this.model.blindPlates[i]);
                    }
                    if (list.length == 0) {
                        return this.model.blindPlates;
                    }
                }
                return list;
            },


            // 申请单位
            applyDepList: function () {
                var list = [].concat(this.model.applDepts, this.model.applContractors);
                return list;
            },
            operateList: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 9;
                });
                return list;
            },

            // 作业人员
            workPersonList: function () {
                var list = [];
                list = this.model.selworkPersonnels['4'] ? list.concat(this.model.selworkPersonnels['4']) : '';
                list = this.model.selworkPersonnels['5'] ? list.concat(this.model.selworkPersonnels['5']) : '';
                return list;
            },
            // 作业单位
            unitLists: function () {
                var list = [];
                list = this.model.workDepts ? list.concat(this.model.workDepts) : '';
                list = this.model.workContractors ? list.concat(this.model.workContractors) : '';
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
            showEquipment: function () {
                var _this = this;
                var _vo = _this.vo;
                if (_vo && _vo.specialityType === '3') {
                    return true;
                }
                return false;
            },
            weihaibsList: function () {
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
                return list;
            },
            kongzhicsList: function () {
                var _this = this;
                var enableCtrlMeasureVerifier = this.model.enableCtrlMeasureVerifier;
                var enableCtrlMeasureSign = this.model.enableCtrlMeasureSign;
                var enableCtrlMeasureGroup = this.model.enableCtrlMeasureGroup;
                var arr = this.model.workStuffs.filter(function (item) {
                    return item.type == 4 && !item.gasType
                });
                var list = [];
                _.each(arr, function (group) {
                    group.rowspan = 0;
                    if (group.children) {
                        group.rowspan = group.children.length;

                        _.each(group.children, function (item) {
                            list.push(item)
                        });
                    }
                });
                // if(!_.find(list,function (item) {
                //         return item.isExtra == '1'
                //     })){
                //     list.push({name:'其他'});
                // }
                // for(var i=0; i<list.length; i++){
                //     if(list[i].isExtra && list[i].isExtra=='1'){
                //         var temp = list[i];
                //         list[i] = list[list.length-1];
                //         list[list.length-1] = temp;
                //         break;
                //     }
                // }
                // var showSign = false;
                // _.each(list, function (item) {
                //     var files = _this.getFiles(item.cloudFiles, 'PTW18') || [];
                //     if(files && files.length>0) {
                //         showSign = true;
                //     }
                // });
                var colspan = 3;
                if (enableCtrlMeasureSign != '1') colspan += 1;
                if (enableCtrlMeasureVerifier != '1') colspan += 1;
                if (enableCtrlMeasureGroup != '1') colspan += 1;
                return {
                    groupArr: arr,
                    list: list,
                    colspan: colspan,
                    showSign: enableCtrlMeasureSign == '1',
                    showVer: enableCtrlMeasureVerifier == 1,
                    showGroup: enableCtrlMeasureGroup == 1
                };
            },
            gelifunName: function () {
                var fun = this.model.workStuffs.filter(function (item) {
                    return item.type == 5 && item.checkResult == 2;
                })[0];
                return fun.name;
            },
            geliffList: function () {
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
                _.each(list2, function (item2) {
                    if (!_.find(list, function (item1) {
                        return item1.id == item2.stuffId
                    })) {
                        list.push({
                            name: item2.ptwStuff.name
                        })
                    }
                });
                return list;
            },
            //隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
            process: function () {
                var obj = _.findWhere(this.model.workIsolations, {
                    type: "1"
                });
                return obj;
            },
            mechanical: function () {
                return _.findWhere(this.model.workIsolations, {
                    type: "2"
                });
            },
            electric: function () {
                return _.findWhere(this.model.workIsolations, {
                    type: "3"
                });
            },
            systemMask: function () {
                return _.findWhere(this.model.workIsolations, {
                    type: "4"
                });
            },
            // 特种作业人员列表
            specialPersonList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "7";
                });
                return list;
            },
            //  维修人员列表
            repairPersonList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "6";
                });
                return list;
            },
            // 安全教育实施人员列表
            securityEducationPersonList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "2";
                });
                return list;
            },
            // 监护人员列表
            custodyPersonRecordList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "3";
                });
                var list = this.vo.superviseRecords;
                return list;
            },
            //属地监护人
            guardianshipPersonList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "15";
                });
                return list;
            },
            // 监护人员列表
            custodyPersonList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "3";
                });
                // list = this.model.superviseRecords;
                // var arr  = [];
                // if(list && list.length >0)
                //     _.each(list[0].users, function (item) {
                //         arr.push({user:{name:item.name, id:item.id}});
                //     })

                return list;
            },

            reasonStr: function () {
                return this.model.workStuffs.filter(function (item) {
                    return item.type == 7 && item.checkResult == 2;
                })[0].name;
            },
            reasonList: function () {
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
            selworkPersonnels45: function () {
                return [].concat(this.model.selworkPersonnels['5'], this.model.selworkPersonnels['4']);
            },
            pplistNew: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 6;
                });
                var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                    return item.stuffType == 6;
                });
                _.each(list, function (item1) {
                    item1.select = true;
                });
                _.each(list2, function (item2) {
                    if (!_.find(list, function (item1) {
                        return item1.id == item2.stuffId
                    })) {
                        list.push({
                            name: item2.ptwStuff.name,
                            ppeCatalogId: item2.ptwStuff.ppeCatalogId
                        })
                    }
                });
                return list;
            },
            getStatusExt: function () {
                var temp = true;
                if (this.vo.workHistories && this.vo.workHistories.length > 0) {
                    var obj = _.find(this.vo.workHistories, function (item) {
                        return item.workStatus == '5'
                    });
                    var len = this.vo.workHistories.length;
                    if (this.vo.workHistories[len - 1].workStatus == '4' && obj) {
                        temp = false;
                    }
                }
                return temp;
            }
        },
        methods: {
            personListItemsLength: function (items) {
                if(items.attr3 == '1' && items.countersignatures && items.countersignatures.length>0){
                    var list =  _.map(items.countersignatures, function (item) {
                        return {
                            users: [item.signer],
                            signCatalog:items.signCatalog,
                            signOpinion: item.signOpinion,
                            enableCtrlMeasureVerification: items.enableCtrlMeasureVerification,
                            cloudFiles: item.cloudFiles,
                        }
                    });
                    return list.length || 1;
                }else {
                    return 1;
                }
            },
            personListItems: function (items) {
                if(items.attr3 == '1' && items.countersignatures && items.countersignatures.length>0){
                    var list =  _.map(items.countersignatures, function (item) {
                        return {
                            users: [item.signer],
                            signCatalog:items.signCatalog,
                            signOpinion: item.signOpinion,
                            enableCtrlMeasureVerification: items.enableCtrlMeasureVerification,
                            cloudFiles: item.cloudFiles
                        }
                    });
                    return list;
                }else {
                    return [items];
                }
            },
            _init: function () {
              this.isShowRepair = LIB.getBusinessSetStateByNamePath('ptw.isSignRequired4Maintainer');
            },
            getBlindPlatePic: function (arr, type, rolType, ptwType) {
                var list = _.filter(arr, function (item) {
                    return item.type == type;
                });
                var newList = [];
                if (list.length > 0) {
                    _.each(list, function (listItems) {
                        var personLists = _.filter(listItems.workPersonnels, function (item) {
                            return item.type == rolType;
                        });
                        _.each(personLists, function (person) {
                            newList = newList.concat(_.filter(person.cloudFiles || [], function (person) {
                                return person.dataType == ptwType
                            }) || [])
                        })
                    })
                }

                return newList;
            },
            getOptionTime: function (arr, type) {
                var obj = _.find(arr, 'type', type)
                if (obj) return obj.operateTime;
                return '';
            },
            getItemName: function (item) {
                return item.name || item.content;
            },
            parseInt: parseInt,
            jsonListFn: function () {
                function sortByKey(arr, key) {
                    var temp = null;
                    for (var i = 0; i < arr.length - 1; i++) {
                        for (var j = i + 1; j < arr.length; j++) {
                            if (arr[i].config.y > arr[j].config.y) {
                                temp = arr[i];
                                arr[i] = arr[j];
                                arr[j] = temp;
                            }
                        }
                    }

                    for (var i = 0; i < arr.length; i++) {
                        if (i == arr.length - 1) {
                            arr[i].config.rowspan = 5 - arr[i].config.y;
                        } else {
                            arr[i].config.rowspan = arr[i + 1].config.y - arr[i].config.y - 1;
                        }
                    }
                }

                var list = [];
                if (this.model && this.model.attr3 && this.model.attr3.length > 5) {
                    var allList = JSON.parse(this.model.attr3);
                    for (var i = 0; i < 15; i++) {
                        var temp = _.filter(allList, function (item) {
                            return item.disable == '0' && item.config && item.config.x == i;
                        }) || [];
                        if (temp && temp.length > 0) {
                            sortByKey(temp);
                            list.push(temp);
                        }
                    }
                } else {
                    // list = this.baseSetting;
                }

                return list;
            },
            getName: function (arr) {
                var str = '';

                _.each(arr, function (item) {
                    str += item.name + ',';
                });
                if (str) {
                    str = str.slice(0, str.length - 1);
                }
                return str;
            },
            getItemName: function (item, str) {
                if (item.isExtra == '1') {
                    if (str == "kongzhi" && !this.getStatusExt) {
                        return "其他"
                    } else {
                        if (item.content) return "其他（" + item.content + "）";
                        else return "其他";
                    }
                } else {
                    return item.content || item.name;
                }
            },

            certificatePerson: function (personList) {
                var temp = false;
                personList.forEach(function (person) {
                    if ((person.contractorEmp && person.contractorEmp.name) || (person.user && person.user.name)) {
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

            getStuffList: function (id) {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 10 && item.workPersonnelId == id;
                });
                return list;
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
                this.jsonList = [];
                var list = this.jsonListFn(); // 获取配置信息
                this.$set('allList', JSON.parse(this.model.attr3));
                this.$set('jsonList', list);
                //ptw.enableSign4VerifyingSafetyMeasure
                // this.showSign = LIB.getBusinessSetStateByNamePath('ptw.enableSign4VerifyingSafetyMeasure');

                // this.applyName = this.getDataDic('org', this.model.applUnitId)['deptName'];
                // if(!this.applyName){
                //     var _this = this;
                //     this.applyName = this.model.applyUnit.deptName;
                // }

                // this._getVO();
                // this._getItems();
            },

            // 个人防护相关
            getPPEItems: function (data) {
                return this.model.workStuffs.filter(function (item) {
                    return item.type == 6 && item.ppeCatalogId == data.id;
                });
            },

            getPPeList: function () {
                var _this = this;
                _this.ppeList = null;
                api_ptw.getPPETypes().then(function (data) {
                    data.forEach(function (item) {
                        if (_this.model.workTpl.ppeCatalogSetting) {
                            item.enable = !!_this.model.workTpl.ppeCatalogSetting.match(new RegExp(item.id));
                        } else {
                            item.enable = false;
                        }
                        return item;
                    });
                    var list = _this.deelList();
                    if (list.length == 0) _this.isShowList = false;
                    else _this.isShowList = true;

                    _.each(data, function (item1) {
                        if (item1.enable) {
                            var arr = _.filter(list, function (item2) {
                                return item2.ppeCatalogId == item1.id;
                            });
                            item1.lists = [].concat(arr);
                            if (!_.find(arr, function (item) {
                                return item.isExtra == '1'
                            })) {
                                // item1.lists.push({name:'其他'});
                            }
                        }
                    });
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].isExtra && list[i].isExtra == '1') {
                            var temp = list[i];
                            list[i] = list[list.length - 1];
                            list[list.length - 1] = temp;
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

                    // _this.ppeList = data; 以前的
                    _this.ppeList = list;
                })
            },
            deelList: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 6 && !(item.name == '其他' && !item.content && item.attr1 != '1');
                });
                for (var i = 0; i < list.length; i++) {
                    if (list[i].isExtra && list[i].isExtra == '1') {
                        var temp = list[i];
                        list[i] = list[list.length - 1];
                        list[list.length - 1] = temp;
                        break;
                    }
                }
                return list;
            },
            // 个人防护相关 end
            // 会签人员
            getPersonList: function () {
                var _this = this;
                if (this.vo.firstUsedPermit) {
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
            // getFiles(item.cloudFiles, 'PTW18')

            getFileLists: function (data) {
                var arr = [];
                if ((!((data.attr1 == '1' && data.checkResult == '0') || (data.checkResult == '2'))) && this.model.enableUncheckedMeasureSign != '1') return [];
                if (data.ptwWorkVerifiers.length > 0 && this.model.enableCtrlMeasureVerifier == '1') {
                    var verfiersArr = data.ptwWorkVerifiers;
                    _.each(verfiersArr, function (verfier) {
                        if (verfier.cloudFiles) {
                            _.each(verfier.cloudFiles, function (file) {
                                file.fileId = file.id;
                                arr.push(file);
                            });
                        }
                    });
                    if (data.verNum) {
                        arr = _.filter(arr, function (file) {
                            return file.version == data.verNum;
                        })
                    }
                    return arr;
                } else {
                    if (data.cloudFiles && data.cloudFiles.length > 0) {
                        arr = _.filter(data.cloudFiles, function (file) {
                            return file.dataType == 'PTW18';
                        });
                        // _.each(arr, function (file) {
                        //     if(!file.fileId) file.fileId = file.id;
                        // })
                        if (data.verNum) {
                            arr = _.filter(arr, function (file) {
                                return file.version == data.verNum;
                            })
                        }
                    }
                    return [arr[0]];
                }
            },

            getFiles: function (data, type) {
                var files = data.filter(function (item) {
                    return item.dataType == type
                });
                return files;
            },
            getFilesGelifh: function (data, type) {
                var files = data.filter(function (item) {
                    return item.dataType == type
                });
                return files;
            },
            getPersonType: function (data) {
                return _.findWhere(model.personType, {
                    type: data.type
                });
            },
            _getPersonels: function (type) {
                var m = this.model.workPersonnels.filter(function (item) {
                    return item.type == type;
                });
                var m = JSON.parse((JSON.stringify(m)));
                m.forEach(function (item) {
                    item.cloudFiles = item.cloudFiles.filter(function (item) {
                        return item.dataType == "PTW10"
                    })
                });

                return m;
            },

            // 气体检测相关
            _getGasItems: function (data) {
                return this.model.workStuffs.filter(function (item) {
                    return item.gasType == data.type;
                })
            },

            getPreviewGas: function (oldObj, type, listType) {
                if (!oldObj) return {};
                if (this.model.enableGasDetection == 0) return null;
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
                if (type == 1) {
                    obj.harmfulGas = '';
                    obj.harmfulGasList.forEach(function (item) {
                        obj.harmfulGas += item.gasCatalog.name + " : " + '(' + (item.value || 0) + ')' + "\n";
                    });
                    obj.combustibleGas = '';
                    obj.combustibleGasList.forEach(function (item) {
                        obj.combustibleGas += item.gasCatalog.name + " : " + '(' + (item.value || 0) + ')' + "\n";
                    });
                    obj.oxygenGas = '';
                    obj.oxygenGasList.forEach(function (item) {
                        obj.oxygenGas += item.gasCatalog.name + " : " + '(' + (item.value || 0) + ')' + "\n";
                    });
                } else {
                    obj.harmfulGas = '';
                    obj.harmfulGasList.forEach(function (item) {
                        obj.harmfulGas += item.gasCatalog.name + " : " + (item.value ? '上部(' + (item.value || 0) + ')' : '');
                        obj.harmfulGas += item.value2 ? '中部(' + (item.value2 || 0) + ')' : '';
                        obj.harmfulGas += item.value3 ? '下部(' + (item.value3 || 0) + ')' : '' + "\n";
                    });
                    obj.combustibleGas = '';
                    obj.combustibleGasList.forEach(function (item) {
                        obj.combustibleGas += item.gasCatalog.name + " : " + (item.value ? '上部(' + (item.value || 0) + ')' : '');
                        obj.combustibleGas += item.value2 ? '中部(' + (item.value2 || 0) + ')' : '';
                        obj.combustibleGas += item.value3 ? '下部(' + (item.value3 || 0) + ')' : '' + "\n";
                    });
                    obj.oxygenGas = '';
                    obj.oxygenGasList.forEach(function (item) {
                        obj.oxygenGas += item.gasCatalog.name + " : " + (item.value ? '上部(' + (item.value || 0) + ')' : '');
                        obj.oxygenGas += item.value2 ? '中部(' + (item.value2 || 0) + ')' : '';
                        obj.oxygenGas += item.value3 ? '下部(' + (item.value3 || 0) + ')' : '' + "\n";
                    });
                }
                return obj;

            },

            getSpan: function () {
                if (this.previewCheckIngLists.length == 0)
                    return 2;
                else {
                    return 1 + this.previewCheckIngLists.length;
                }
            },

            getGasDetection: function () {
                var _this = this;
                var temp = [];
                for (var key in model.gasType) {
                    var item = {
                        type: key,
                        name: model.gasType[key],
                        items: this._getGasItems({
                            type: key
                        }),
                    };
                    temp.push(item);
                }
                var checkBefore = [],
                    checkIng = [];
                this.vo.gasDetectionRecords.forEach(function (item) {
                    item.signFiles = item.cloudFiles.filter(function (item) {
                        return item.dataType.toUpperCase() == "PTW8"
                    });
                    if (item.type === "1") {
                        checkBefore.push(item);
                    } else if (item.type === "2") {
                        checkIng.push(item);
                    }
                });

                _.each(checkBefore, function (item) {
                    item.gasDetectionDetails = _.sortBy(item.gasDetectionDetails, function (d) {
                        return (d.gasCatalog.name);
                    });
                });
                _.each(checkIng, function (item) {
                    item.gasDetectionDetails = _.sortBy(item.gasDetectionDetails, function (d) {
                        return (d.gasCatalog.name);
                    });
                });
                // 排序
                checkIng = _.sortBy(checkIng, function (item) {
                    return item.detectTime;
                });

                // if (checkBefore && checkBefore[0])
                //     checkBefore = [checkBefore[0]];

                // 取出数据
                _this.previewCheckBefore = [];
                checkBefore.forEach(function (item) {
                    _this.previewCheckBefore.push(_this.getPreviewGas(item, _this.model.gasCheckMethod, "gasDetectionDetails"));
                });
                this.previewCheckIngLists = [];


                checkIng.forEach(function (item) {
                    _this.previewCheckIngLists.push(_this.getPreviewGas(item, _this.model.gasCheckMethod, "gasDetectionDetails"));
                });
                if (checkBefore && checkBefore[0])
                    checkBefore = [checkBefore[0]];


                this.checkBeforeRecords = checkBefore;
                this.checkIngRecords = checkIng;
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

                this.gasTypeList = temp;
            },
            // 气体检测相关 end

            getList: function (arr, type) {
                return arr.filter(function (item) {
                    return item.type == type;
                })
            },

            // jsonList
            findName: function (val) {
                var obj = _.find(this.allList, function (item) {
                    return item.oldName == val;
                });
                if(obj) return obj.name;
                return val
            },

            workclosespan: function (num, arr, type) {
                var count = num;
                if (arr.length == 0) {
                    return count + 1;
                } else count = count + arr.length;
                if (type == '1') {return count;}

                _.each(arr, function (item) {
                    if (item.signCatalog && item.signCatalog.enableCommitment == '1') {
                        count += 1;
                    }
                    if (item.enableCtrlMeasureVerification == '1') {
                        count += 1;
                    }
                });
                return count;
            },

            getWorkClose: function () {
                // status状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,
                // 5:作业监测,6:待关闭,7:作业取消,
                // 8:作业完成,9:作业续签,10:被否决

                //result 作业结果 1:作业完成,2:作业取消,3:作业续签4:作业
                var _this = this;
                _this.workClosePersonList = [];
                _this.isWorkClose = false;

                if (!this.vo.renewedWorkPermits) {
                    return;
                }
                var len = this.vo.renewedWorkPermits.length;
                this.vo.renewedWorkPermits.forEach(function (item) {
                    if (["7", "8", "9", "11"].indexOf(item.status) > -1) {
                        _this.isWorkClose = true;
                    }
                    if ((["7", "8", "9", "11"].indexOf(item.status) > -1)) {
                        if (item.versionNum > 1) {
                            if (item.extensionType == '1')
                                _this.workClosePersonList.push({
                                    type: 'postpone',
                                    list: _this.getList(item.workPersonnels, "1"),
                                    vo: item
                                });
                            else
                                _this.workClosePersonList.push({
                                    type: 'delay',
                                    list: _this.getList(item.workPersonnels, "1"),
                                    vo: item
                                });
                        }
                        if (item.result == '1') {
                            _this.workClosePersonList.push({
                                type: 'success',
                                list: _this.getList(item.workPersonnels, "8"),
                                vo: item
                            });
                        } else if (item.result == '2') {
                            _this.workClosePersonList.push({
                                type: 'cancel',
                                list: _this.getList(item.workPersonnels, "9"),
                                vo: item
                            });
                        }

                    } else {
                        if (len == 1) {
                            _this.workClosePersonList.push({
                                type: 'success',
                                list: _this.getList(item.workPersonnels, "8"),
                                vo: item
                            });
                            _this.workClosePersonList.push({
                                type: 'cancel',
                                list: _this.getList(item.workPersonnels, "9"),
                                vo: item
                            });
                            if (item.extensionType == '1') {
                                if (item.versionNum > 1)
                                    _this.workClosePersonList.push({
                                        type: 'postpone',
                                        list: _this.getList(item.workPersonnels, "1"),
                                        vo: item
                                    });
                                else
                                    _this.workClosePersonList.push({
                                        type: 'postpone',
                                        list: _this.getList(item.workPersonnels, "10"),
                                        vo: item
                                    });
                            } else {
                                if (item.versionNum > 1)
                                    _this.workClosePersonList.push({
                                        type: 'delay',
                                        list: _this.getList(item.workPersonnels, "1"),
                                        vo: item
                                    });
                                else
                                    _this.workClosePersonList.push({
                                        type: 'delay',
                                        list: _this.getList(item.workPersonnels, "10"),
                                        vo: item
                                    });
                            }
                        } else if (len > 1) {
                            if (item.extensionType == '1') {
                                _this.workClosePersonList.push({
                                    type: 'postpone',
                                    list: _this.getList(item.workPersonnels, "1"),
                                    vo: item
                                });
                            } else {
                                _this.workClosePersonList.push({
                                    type: 'delay',
                                    list: _this.getList(item.workPersonnels, "1"),
                                    vo: item
                                });
                            }
                        }
                    }
                });

                var obj = {};
                _this.workClosePersonList.forEach(function (item) {
                    if (obj[item.type]) {
                        obj[item.type].push(item);
                    } else {
                        obj[item.type] = [];
                        item.isOne = true;
                        obj[item.type].push(item);
                    }
                });
                var arrList = []
                for (var key in obj) {
                    arrList = arrList.concat(obj[key])
                };
                _this.workClosePersonList = arrList;
                return;

                var len = this.vo.renewedWorkPermits.length;
                this.vo.renewedWorkPermits.forEach(function (item) {
                    if (["6", "7", "8", "9"].indexOf(item.status) > -1) {
                        _this.isWorkClose = true;
                    }
                    if (item.result == '1') {
                        _this.workClosePersonList.push({
                            type: 'success',
                            list: _this.getList(item.workPersonnels, "8"),
                            vo: item
                        });
                    } else if (item.result == '2') {
                        _this.workClosePersonList.push({
                            type: 'cancel',
                            list: _this.getList(item.workPersonnels, "9"),
                            vo: item
                        });
                    } else if (item.result == '3') {
                        if (len > 1)
                            _this.workClosePersonList.push({
                                type: 'postpone',
                                list: _this.getList(item.workPersonnels, "1"),
                                vo: item
                            });
                        else
                            _this.workClosePersonList.push({
                                type: 'postpone',
                                list: _this.getList(item.workPersonnels, "10"),
                                vo: item
                            });
                    } else if (item.result == '4') {
                        // _this.workClosePersonList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                        if (len > 1)
                            _this.workClosePersonList.push({
                                type: 'delay',
                                list: _this.getList(item.workPersonnels, "1"),
                                vo: item
                            });
                        else
                            _this.workClosePersonList.push({
                                type: 'delay',
                                list: _this.getList(item.workPersonnels, "10"),
                                vo: item
                            });
                    } else {
                        if (len == 1) {
                            _this.workClosePersonList.push({
                                type: 'success',
                                list: _this.getList(item.workPersonnels, "8"),
                                vo: item
                            });
                            _this.workClosePersonList.push({
                                type: 'cancel',
                                list: _this.getList(item.workPersonnels, "9"),
                                vo: item
                            });
                            if (item.extensionType == '1') {
                                _this.workClosePersonList.push({
                                    type: 'postpone',
                                    list: _this.getList(item.workPersonnels, "10"),
                                    vo: item
                                });
                            } else {
                                _this.workClosePersonList.push({
                                    type: 'delay',
                                    list: _this.getList(item.workPersonnels, "10"),
                                    vo: item
                                });
                            }
                        }
                    }
                });
            },

            getPersonVal: function (arr, str) {
                return _.map(arr, _.iteratee(str)).join('，');
            },

            statusOf: function (col) {
                if (col.dataType != '10' && col.dataType != '11' && col.code != 'specialWorker' && col.code != 'mainEquipment' && col.code != 'operatingType' && col.code != '' && col.code != '' && col.code != '' && col.code != '') {
                    return true;
                }
                return false;
            },

            getColValue: function (item) {
                // if(item.dataType == '100'){
                //     return this.vo.code;
                // }
                if (item.isInherent != '1' && item.disable == '0' && (item.dataType == '1' || item.dataType == '2' || item.dataType == '3' || item.dataType == '4' || item.dataType == '5')) {
                    return item.value;
                }
                if (item.isInherent != '1' && item.dataType == '6' && item.disable == '0') {
                    return item.value.value1 + " 至 " + item.value.value2;
                }
                if (item.isInherent != '1' && item.dataType == '7' && item.disable == '0') {
                    return this.getPersonVal(item.value, 'username');
                }
                if (item.isInherent != '1' && item.dataType == '8' && item.disable == '0') {
                    return this.getPersonVal(item.value, 'name');
                }
                if (item.isInherent != '1' && item.dataType == '9' && item.disable == '0') {
                    return this.getPersonVal(item.value.value1, 'username') + this.getPersonVal(item.value.value2, 'name')
                }
                if (item.isInherent != '1' && item.dataType == '10' && item.disable == '0') {
                    return '';

                }
                if (item.isInherent != '1' && item.dataType == '11' && item.disable == '0') {
                    return ''
                }
                /************  固有字段  ************/
                if (item.isInherent == 1 && item.code == 'code') {
                    return this.model.workTpl.code;
                }

                if (item.isInherent == 1 && item.code == 'name') {
                    return this.model.workTpl.name;
                }

                // 作业内容
                if (item.code == 'workContent' && item.disable == '0' && item.isInherent == '1') {
                    return this.model.workContent;
                }

                // 作业类型
                if (item.code == 'workCatalog' && item.disable == '0' && item.isInherent == '1') {
                    return this.vo.workCatalog.name;
                }
                // 作业方式 ==============
                if (item.code == 'operatingType' && item.disable == '0' && item.isInherent == '1') {
                    return '';
                }
                // 申请单位
                if (item.code == 'applUnitId' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.applyDepList.length; i++) {
                        var item = this.applyDepList[i];
                        str += (item.name || item.label || item.deptName || '')
                        if (i != this.applyDepList.length - 1) str += ","
                    }
                    return str;
                }
                // 作业单位
                if (item.code == 'workUnitId' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.unitLists.length; i++) {
                        var item = this.unitLists[i];
                        str += (item.label || item.deptName || '')
                        if (i != this.unitLists.length - 1) str += ","
                    }
                    return str;
                }
                // 生产单位
                if (item.code == 'prodUnitId' && item.disable == '0' && item.isInherent == '1') {
                    return this.getDataDic('org', this.model.prodUnitId)['deptName'];
                }
                // 作业地点
                if (item.code == 'workPlace' && item.disable == '0' && item.isInherent == '1') {
                    return this.model.workPlace;
                }
                // 作业所在的设备
                if (item.code == 'workEquipment' && item.disable == '0' && item.isInherent == '1') {
                    return this.model.workEquipment;
                }
                // 作业申请人
                if (item.code == 'createBy' && item.disable == '0' && item.isInherent == '1') {
                    return this.vo.applicant.name;
                }
                // 作业人员
                if (item.code == 'worker' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.selworkPersonnels45.length; i++) {
                        var item = this.selworkPersonnels45[i];
                        str += (item.user.name || '')
                        if (i != this.selworkPersonnels45.length - 1) str += ","
                    }
                    return str;
                }
                // 作业中所使用的主要工具/设备 ==================
                if (item.code == 'mainEquipment' && item.disable == '0' && item.isInherent == '1') {
                    return '';
                }
                // 特种作业人员/特种设备操作人员资格证 =================
                if (item.code == 'specialWorker' && item.disable == '0' && item.isInherent == '1') {
                    return '';
                }
                // 检维修人员
                if (item.code == 'maintainer' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.repairPersonList.length; i++) {
                        var item = this.repairPersonList[i];
                        str += (item.user.name || '')
                        if (i != this.repairPersonList.length - 1) str += ","
                    }
                    return str;
                }
                // 实施安全教育人
                if (item.code == 'safetyEducator' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.securityEducationPersonList.length; i++) {
                        var item = this.securityEducationPersonList[i];
                        str += this.getName(item.users)
                        if (i != this.securityEducationPersonList.length - 1) str += ","
                    }
                    return str;
                }
                // 作业监护人  =================
                if (item.code == 'supervisior' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.custodyPersonList.length; i++) {
                        var item = this.custodyPersonList[i];
                        str += this.getName(item.users);
                        if (i != this.custodyPersonList.length - 1) str += ","
                    }
                    return str;
                }
                // 属地监护人  =================
                
                if (item.code == 'areaSupervisior' && item.disable == '0' && item.isInherent == '1') {
                    var str = '';
                    for (var i = 0; i < this.guardianshipPersonList.length; i++) {
                        var item = this.guardianshipPersonList[i];
                        str += this.getName(item.users);
                        if (i != this.guardianshipPersonList.length - 1) str += ","
                    }
                    return str;
                }
                // 作业时限
                if (item.code == 'permitTime' && item.disable == '0' && item.isInherent == '1') {
                    return this.model.permitStartTime + " 至 " + this.model.permitEndTime;
                }
                // 工作安全分析
                if (item.code == 'jsaMasterId' && item.disable == '0' && item.isInherent == '1') {
                    return this.model.jsaMaster.name;
                }
                // 备注
                if (item.code == 'remark' && item.disable == '0' && item.isInherent == '1') {
                    return this.model.remark;
                }
                // 作业计划书/方案 ================
                if (item.code == 'workPlan' && item.disable == '0' && item.isInherent == '1') {
                    return '';
                }
                // 应急救援预案 ==========
                if (item.code == 'emerScheme' && item.disable == '0' && item.isInherent == '1') {
                    return '';
                }
                // 附图 ============
                if (item.code == 'attachedPicture' && item.disable == '0' && item.isInherent == '1') {
                    return '';
                }

            },
            isShowPwtRealTime: function () {
                if (!this.vo) {
                    return false
                }
                if (parseInt(this.vo.status) < 7) {
                    return false
                }

                if (!this.vo.realStartTime && !this.vo.realEndTime) {
                    return false
                }
                return true
            }
        },
        filters: {
            isCompleteWork: function (realEndTime) {
                // 任务完成的状态
                var finishStatus = ['8', '9', '10', '11', '12']
                if (finishStatus.indexOf(this.vo.status) === -1) {
                    return '(未结束)'
                } else {
                    realEndTime = realEndTime.split(':')
                    realEndTime.splice(-1, 1)
                    return realEndTime.join(':')
                }
            },
            sliceInvalidDate: function (date) {
                if (date) {
                    var splitDate = date.split(':')
                    splitDate.splice(-1, 1)
                    return splitDate.join(':')
                }
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        created: function () {

        }
    });

    return detail;
});