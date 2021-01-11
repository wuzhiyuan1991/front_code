define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gas-detection.html");
    var api=require("../../api");
    var model=require("../../model");
    var Viewer = require("libs/viewer");
    var videoHelper = require("tools/videoHelper");

    return Vue.extend({
        template: template,
        components:{
        },
        props:{
            model:{
                type:Object,
                required:true,
            },
            vo:Object
        },
        computed:{
            gasHarmList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return  item.gasType==1;
                });
                // list.forEach(function (item) {
                //     item.select = true;
                // });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return  item.stuffType==8 && item.gasCatalog.gasType==1;
                // });
                //
                // list2.forEach(function (item2) {
                //    if(!_.find(list,function (item1) {
                //            return item1.id == item2.stuffId
                //        })){
                //        list.push({name:item2.gasCatalog.name});
                //    }
                // });
                return list;
            },
            gasCombustibleList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return  item.gasType==2;
                });
                // list.forEach(function (item) {
                //     item.select = true;
                // });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return  item.stuffType==8 && item.gasCatalog.gasType==2;
                // });
                //
                // list2.forEach(function (item2) {
                //     if(!_.find(list,function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.gasCatalog.name});
                //     }
                // });
                return list;
            },
            gasOxygenList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return  item.gasType==3;
                });
                // list.forEach(function (item) {
                //     item.select = true;
                // });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return  item.stuffType==8 && item.gasCatalog.gasType==3;
                // });
                //
                // list2.forEach(function (item2) {
                //     if(!_.find(list,function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.gasCatalog.name});
                //     }
                // });
                return list;
            }
            // checkBefore:function () {
            //     return this.model.gasDetectionRecords[0]||{};
            // },
            // checkIng:function () {
            //     return this.model.gasDetectionRecords[1]||{};
            // }
        },
        data: function () {
            return {
                imageBox:null,
                updateNum:0,
                gasTypeList:[],
                tableModel:{
                    preCheckRecord:LIB.Opts.extendMainTableOpt({
                        selectedDatas:[],
                        values:[],
                        options:[3],
                        columns:[
                            {
                                title: '气体类型',
                                fieldName: "gasType",
                                render:function (data) {
                                    return model.gasType[data.gasType];
                                }

                            },
                            {
                                title: '项目',
                                fieldName: "gasCatalog.name",
                            },
                            {
                                title: '单位',
                                fieldName: "gasCatalog.unit",
                            },
                            {
                                title: '上部',
                                fieldName: "value",
                                hide:true,
                            },
                            {
                                title: '中部',
                                fieldName: "value2",
                                hide:true,
                            },
                            {
                                title: '下部',
                                fieldName: "value3",
                                hide:true,
                            },
                            {
                                title: '不按照部位检查',
                                fieldName: "value",
                                hide:true,
                            }
                        ],
                    }),
                    checkingRecord:LIB.Opts.extendMainTableOpt({
                        selectedDatas:[],
                        values:[],
                        options:[3],
                        columns:[
                            {
                                title: '气体类型',
                                fieldName: "gasType",
                                render:function (data) {
                                    return model.gasType[data.gasType];
                                }
                            },
                            {
                                title: '项目',
                                fieldName: "gasCatalog.name",
                            },
                            {
                                title: '单位',
                                fieldName: "gasCatalog.unit",
                            },
                            {
                                title: '上部',
                                fieldName: "value",
                                hide:true,
                            },
                            {
                                title: '中部',
                                fieldName: "value2",
                                hide:true,
                            },
                            {
                                title: '下部',
                                fieldName: "value3",
                                hide:true,
                            },
                            {
                                title: '不按照部位检查',
                                fieldName: "value",
                                hide:true,
                            }
                        ],
                    }),

                    newTable:LIB.Opts.extendMainTableOpt({
                        selectedDatas:[],
                        values:[],
                        options:[3],
                        columns:[
                            {
                                title: '检测时间',
                                fieldName: "detectTime",
                                width:"80px",
                                render:function (data) {
                                    var detectTime = data.detectTime;
                                    var arr = null;
                                    if(detectTime){
                                        arr = detectTime.split(" ");
                                    }
                                    if(arr.length > 0)  return arr[0] + "\n" + arr[1];
                                    else return '';
                                }
                            },
                            {
                                title: '检测地点',
                                fieldName: "detectSite",
                            },
                            {
                                title: '有毒有害气体或蒸汽',
                                // fieldName: "harmfulGas",
                                render:function (data) {
                                    return data.harmfulGas;
                                }
                            },
                            {
                                title: '可燃气体或蒸汽',
                                // fieldName: "combustibleGas",
                                render:function (data) {
                                    return data.combustibleGas;
                                }
                            },
                            {
                                title: '氧气',
                                // fieldName: "oxygenGas",
                                render:function (data) {
                                    return data.oxygenGas;
                                }
                            },
                            {
                                title: '签名',
                                // fieldName: "gasType",
                                render:function (data) {
                                    var a;
                                    if(data.signFiles && data.signFiles.length>0){
                                        var files = data.signFiles;
                                        var str = '';
                                        files.forEach(function (item) {
                                            str+= '<img style="height:20px;width:auto;margin-left:8px;" data-src="'+LIB.convertFilePath(item)+'" src="'+ LIB.convertFilePath(item) +'" />'
                                        });
                                        return str;
                                    }
                                },
                                width:"120px"
                            },
                            // {
                            //     title: '视频',
                            //     // fieldName: "gasType",
                            //     render:function (data) {
                            //        var files = data.videoFilesImg;
                            //         var str = '';
                            //         files.forEach(function (item) {
                            //             str+= '<div style="width:100px;height:42px;position: absolute;z-index:5;" ></div>';
                            //             str+= '<div style="position: relative;width:40px;height: 40px;"><img style="position: absolute;height:40px;width:40px;margin-left:8px;" src="'+item.ctxPath+'" /></div>'
                            //         });
                            //         return str;
                            //     },
                            //     width:"120px",
                            //     event:true
                            // },

                        ],
                    }),
                    beforeList:[],
                    afterList:[]
                },
                checkBeforeRecords:[],
                checkIngRecords:[],
                enum:model.enum,
                playModel: {
                    title: "视频播放",
                    show: false,
                    id: null
                },

                checkBefore:null
            }
        },
        ready: function () {
            this.readViewBox();
        },
        created:function(){
            var  _this=this;
            var temp=[];
            for (key in model.gasType){
                temp.push({
                    type:key,
                    name:model.gasType[key],
                })
            }
            this.gasTypeList=temp;
        },
        methods: {
            onCellClick:function (a, b) {
                if(a.videoFiles && a.videoFiles.length>0)
                    this.doPlay(a.videoFiles[0].id)
            },
            _getGasItems:function(data){
                return  this.model.workStuffs.filter(function (item) {
                    return  item.gasType==data.type;
                })
            },
            //表格列的处理
            //由于上中下，是可配置的。
            _columnsHandler:function(key,arr){
                if(arr.length===0){return}
                arr=arr[0];
                if(!arr.gasDetectionDetails||arr.gasDetectionDetails.length===0){return}
                var columns=this.tableModel[key].columns;
                colVal=_.findWhere(columns,{fieldName:"value"});//3
                colVal2=_.findWhere(columns,{fieldName:"value2"});//4
                colVal3=_.findWhere(columns,{fieldName:"value3"});//5
                var data=arr.gasDetectionDetails[0];
                colVal.hide=!data.hasOwnProperty("value");
                colVal2.hide=!data.hasOwnProperty("value2");
                colVal3.hide=!data.hasOwnProperty("value3");

                if(this.model.gasCheckMethod == 1){
                    colVal.hide = true;
                    columns[6].hide = false;
                }

            },
            initData:function(){
                var _this = this;
                var temp=[];
                for (key in model.gasType){
                    var item={
                        type:key,
                        name:model.gasType[key],
                        items:this._getGasItems({type:key}),
                    };
                    temp.push(item);
                }

                var checkBefore=[],checkIng=[];
                this.vo.gasDetectionRecords.forEach(function (item) {
                    var signFiles = [];
                    _.each(item.cloudFiles,function (item) {
                        if(item.dataType.toUpperCase()=="PTW8") {
                            signFiles.push(LIB.convertFileData(item));
                        }
                    });
                    item.signFiles = signFiles;
                    if(item.type==="1"){
                        checkBefore.push(item);
                    }
                    else if(item.type==="2"){
                        checkIng.push(item);
                    }
                });

                // this.vo.gasDetectionRecords.forEach(function (item) {
                //     item.signFiles=item.cloudFiles.filter(function (item) {
                //         return item.dataType.toUpperCase()=="PTW8"
                //     })
                //     // if(item.type==="1"){
                //     //     checkBefore.push(item);
                //     // }
                //      if(item.type==="2"){
                //         checkIng.push(item);
                //     }
                // });

                this.checkBeforeRecords=checkBefore;
                this.checkIngRecords=checkIng;

                // 勾选处理
                this._columnsHandler("preCheckRecord",checkBefore);
                this._columnsHandler("checkingRecord",checkIng);

                var arr_checkIng = [];
                _.each(checkBefore,function (item) {
                    item.gasDetectionDetails = _.sortBy(item.gasDetectionDetails,function (d) {
                        return (d.gasCatalog.name);
                    });
                });
                if(checkBefore && checkBefore[0])
                    checkBefore = [checkBefore[0]];


                _.each(checkIng,function (item) {
                    item.gasDetectionDetails = _.sortBy(item.gasDetectionDetails,function (d) {
                        return (d.gasCatalog.name);
                    });
                });

                checkIng =  _.sortBy(checkIng,function (item) {
                    return item.detectTime;
                });

                this.tableModel.beforeList = this.getTableShowList(checkBefore);
                this.tableModel.afterList = this.getTableShowList(checkIng);
                this.checkBefore = checkBefore

                this.updateView(); //刷新数据更新图片放大功能

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

            updateView:function () {
                var _this = this;
                if(this.imageBox && this.viewer){
                    _this.$nextTick(function () {
                        _this.viewer.update();
                    });
                    return;
                }
                setTimeout(function () {
                    _this.updateView()
                },3000);
            },

            getFiles:function (arr, type) {
                return arr.filter(function (item) {
                    return item.dataType == type
                })
            },

            getTableShowList:function (arr) {
                var _this = this;
                var list = [];
                var type = this.model.gasCheckMethod;

                _.each(arr, function (arrItem) {
                    var obj = {};
                    obj.detectTime = arrItem.detectTime;
                    obj.detectSite = arrItem.detectSite;
                    obj.signFiles = arrItem.signFiles;
                    obj.videoFiles = arrItem.cloudFiles.filter(function (item) {
                        return item.dataType == 'PTW16'
                    })
                    obj.videoFilesImg = arrItem.cloudFiles.filter(function (item) {
                        return item.dataType == 'PTW17'
                    })
                    var harmfulGasList =  _.filter(arrItem.gasDetectionDetails, function (item) {
                        return item.gasType == 1;
                    });
                    var combustibleGasList =  _.filter(arrItem.gasDetectionDetails, function (item) {
                        return item.gasType == 2;
                    });
                    var oxygenGasList =  _.filter(arrItem.gasDetectionDetails, function (item) {
                        return item.gasType == 3;
                    });
                    if(type == 1){
                        obj.harmfulGas = '';
                        harmfulGasList.forEach(function (item) {
                            obj.harmfulGas += item.gasCatalog.name+"("+ item.gasCatalog.unit+")" + " : "+ ''+(item.value || 0)+'';
                            obj.harmfulGas += '\n';
                        });
                        obj.combustibleGas = '';
                        combustibleGasList.forEach(function (item) {
                            obj.combustibleGas += item.gasCatalog.name+"("+ item.gasCatalog.unit+")" + " : "+ ''+(item.value || 0)+'';
                            obj.combustibleGas += '\n';
                        });
                        obj.oxygenGas = '';
                        oxygenGasList.forEach(function (item) {
                            obj.oxygenGas += item.gasCatalog.name+"("+ item.gasCatalog.unit+")" + " : "+ ''+(item.value || 0)+'';
                            obj.oxygenGas += '\n';
                        });
                    }else {
                        obj.harmfulGas = '';

                        harmfulGasList.forEach(function (item) {
                            obj.harmfulGas += item.gasCatalog.name +"("+ item.gasCatalog.unit+")" + " : " + (item.value ? '上部(' + (item.value || 0) + ')' : '');
                            obj.harmfulGas += item.value2 ? '中部(' + (item.value2 || 0) + ')' : '';
                            obj.harmfulGas += item.value3 ? '下部(' + (item.value3 || 0) + ')' : '';
                            obj.harmfulGas += '\n';
                        });

                        obj.combustibleGas = '';
                        combustibleGasList.forEach(function (item) {
                            obj.combustibleGas += item.gasCatalog.name+"("+ item.gasCatalog.unit+")" + " : " + (item.value ? '上部(' + (item.value || 0) + ')' : '');
                            obj.combustibleGas += item.value2 ? '中部(' + (item.value2 || 0) + ')' : '';
                            obj.combustibleGas += item.value3 ? '下部(' + (item.value3 || 0) + ')' : '';
                            obj.combustibleGas += '\n';
                        });
                        obj.oxygenGas = '';
                        oxygenGasList.forEach(function (item) {
                            obj.oxygenGas += item.gasCatalog.name +"("+ item.gasCatalog.unit+")" + " : " + (item.value ? '上部(' + (item.value || 0) + ')' : '');
                            obj.oxygenGas += item.value2 ? '中部(' + (item.value2 || 0) + ')' : '';
                            obj.oxygenGas += item.value3 ? '下部(' + (item.value3 || 0) + ')' : '';
                            obj.oxygenGas += '\n';
                        });
                    }
                    list.push(obj);
                });

                return list;
            },
            readViewBox:function () {
                this.imageBox = document.getElementById("imageBoxxx");
                this.viewer = new Viewer(this.imageBox, {
                    navbar: false,
                    transition: false,
                    zoomRatio: 0.2,
                    minZoomRatio: 0.3,
                    maxZoomRatio: 5,
                    fullscreen: false,
                    url: "data-src"
                });

                if(this.updateNum === 0 && _.isArray(this.images)) {
                    // if(this.images.length > 0 && this.images.length != this.files.length) {
                    //     this.normalize();
                    // }
                    this.$nextTick(function () {
                        this.viewer.update();
                    });
                }
            },

        },
        watch:{
            'model':function (val) {
                this.initData();
            },
            "tableModel.beforeList": function (nVal) {
                var _this = this;
                if(_.isArray(nVal) && this.viewer) {
                    // this.normalize();
                    this.$nextTick(function () {
                        _this.viewer.update();
                        _this.updateNum++;
                    })
                }
            }
        },

    });
});
