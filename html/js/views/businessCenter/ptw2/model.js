define(function (require) {
    var Vue= require("vue");
    var api= require("./api");
    var LIB = require("lib");
    return {
        commitmentTypeDic: {
            key: 'iptw_catalog_commitment_type',
            data: [
                ["1", "作业申请人承诺"],
                ["2", "作业负责人承诺"],
                ["3", "作业监护人承诺"],
                ["4", "生产单位现场负责人承诺"],
                ["5", "主管部门负责人承诺"],
                ["6", "安全部门负责人"],
                ["7", "相关方负责人承诺"],
                ["8", "许可批准人承诺"],
                ["9", "作业完成声明"],
                ["10", "作业取消声明"],
                ["11", "开工前气体检测结论"],
                ["12", "安全教育人承诺"]
            ]
        },
        //人员类型 1:作业申请人,2:作业负责人,3:作业监护人,
        // 4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关
        // 方负责人,8:许可批准人,9:安全教育人,
        // 10:内部作业人员,11:承包商作业人员

        personType:[
            {type:"1",label:"作业申请人"},
            {type:"2",label:"作业负责人"},
            {type:"3",label:"作业监护人"},
            {type:"4",label:"生产单位现场负责人"},
            {type:"5",label:"主管部门负责人"},
            {type:"6",label:"安全部门负责人"},
            {type:"7",label:"相关方负责人"},
            {type:"8",label:"许可批准人"},
            {type:"9",label:"安全教育人"},

        ],
         // pwtInfoTypes: ['基本信息', '危害辨识', '安全措施','个人防护','能量隔离', '气体检测', '许可签发', '作业关闭'],
        gasType: {
            "1": "有毒有害气体或蒸汽",
            "2": "可燃气体或蒸汽",
            "3": "氧气"
        },
        workResultType: {
            "success": "作业完成",
            "cancel": "作业取消",
            "postpone": "作业续签"
        },
        pwtInfoTypes:{//使用1个key 防止用index 添加项的时候index都要改
            "1":"基本信息",
            "2":"危害辨识",
            "3":"安全措施",
            "4":"个人防护",
            "5":"能量隔离",
            "6":"气体检测",
            "7":"许可签发",
            "8":"作业关闭",
        },
        enum:{
            gasCheckCycleUnit:{ "1":"小时","2":"分钟"},
            gasCheckMethod:{"1":"不按照部位检查","2":"按照部位检查"},
            gasCheckPosition:{"1":"上部","2":"中部","3":"下部"},
            gasCheckType:{"1":"定期检查","2":"持续检查"},
            joinNames:function (key,arrVal) {
                  var _this=this;
                   return arrVal.map(function (item) {
                            return _this[key][item];
                   }).join();
            }
        },
        workCatalogLevel: function (workCatalogId, level) {
            return {
                parentId: workCatalogId,
                level: level,
                name: "",
                content: "",
                type: 2,//表示作业分级，不可变动，除非type变了
            }
        },
        gasCheckItem: function (gasType) {
            return {
                type: 4,
                gasType: gasType
            }
        },
        commitmentTypeItem: function () {
            return {
                type: 5,
                disabled: "0",
                commitmentType: 1
            }
        },
        cardTpl: function () {
            return {
                id: null,
                //编码
                code: null,
                //作业票模板名称
                name: null,
                //启用/禁用 0:启用,1:禁用
                disable: "0",
                //公司Id
                compId: null,
                //部门Id
                orgId: null,
                //字段启用禁用设置(json)
                columnSetting: "0",
                //是否需要主管部门负责人 0:不需要,1:需要
                enableDeptPrin: "0",
                //是否启用电气隔离 0:否,1:是
                enableElectricIsolation: "0",
                //是否启用气体检测 0:否,1:是
                enableGasDetection: "0",
                //是否启用机械隔离 0:否,1:是
                enableMechanicalIsolation: "0",
                //是否启用工艺隔离 0:否,1:是
                enableProcessIsolation: "0",
                //是否需要生产单位现场负责人 0:不需要,1:需要
                enableProdPrin: "0",
                //是否需要相关方负责人 0:不需要,1:需要
                enableRelPin: "0",
                //是否需要安全教育人  0:不需要,1:需要
                enableSafetyEducator: "0",
                //是否需要安全部门负责人 0:不需要,1:需要
                enableSecurityPrin: "0",
                //是否需要监护人员 0:不需要,1:需要
                enableSupervisor: "0",
                //是否启用系统屏蔽 0:否,1:是
                enableSystemMask: "0",
                //个人防护启用禁用设置(json)
                ppeCatalogSetting: "",
                //作业类型
                workCatalog: {id: '', name: ''},
                enableOperatingType: '0',
                //作业票模板风险库内容
                ptwCardStuffs: [],
                // 是否启用危害辨识 0 不启用 1 启用
                attr1:'0'
            }
        },
        permitDetail: function () {
            return {
                attr3:null,
                id: null,
                //申请单位id
                applUnitId: null,
                //作业单位id
                workUnitId: null,
                //生产单位id
                prodUnitId: null,
                attr1:"",//承包商id
                // workContractor:{},
                workContractors:[],//作业单位承包商
                workDepts:[],//作业单位内部
                //作业时限结束时间
                permitEndTime: null,
                //作业时限开始时间
                permitStartTime: null,
                //作业地点
                workPlace: null,
                //作业内容
                workContent: null,
                //是否需要主管部门负责人 0:不需要,1:需要
                enableDeptPrin: "0",
                //是否启用电气隔离 0:否,1:是
                enableElectricIsolation: "0",
                //是否启用气体检测 0:否,1:是
                enableGasDetection: "0",
                //是否启用机械隔离 0:否,1:是
                enableMechanicalIsolation:"0",
                //是否启用工艺隔离 0:否,1:是
                enableProcessIsolation: "0",
                //是否需要生产单位现场负责人 0:不需要,1:需要
                enableProdPrin:"0",
                //是否需要相关方负责人 0:不需要,1:需要
                enableRelPin: "0",
                //是否需要安全教育人  0:不需要,1:需要
                enableSafetyEducator: "0",
                //是否需要安全部门负责人 0:不需要,1:需要
                enableSecurityPrin: "0",
                //是否启用作业方式 0:不启用,1:启用
                enableOperatingType: "0",
                //是否需要监护人员 0:否,1:是
                enableSupervisor: "0",
                //是否需要填写现场监护记录
                enableSuperviseRecord:"0",
                //是否启用系统屏蔽 0:否,1:是
                enableSystemMask: "0",
                //作业中气体检测模式 1:定期检查,2:持续检查
                gasCheckType:"1",
                //作业中定期气体检测频率
                gasCheckCycle : null,
                //作业中定期气体检测频率单位 1:小时,2:分钟
                gasCheckCycleUnit : "1",
                //气体检测方式 1:不按照部位检查,2:按照部位检查
                gasCheckMethod : "1",
                //作业中定期气体检测到期提醒提前分钟数
                gasCheckNoticeTime : null,
                //气体检查部门  1：上部 2：中部 3：下部
                gasCheckPosition:[],
                //许可证编号
                permitCode: null,
                //启用的个人防护设备类型id串
                ppeCatalogSetting:"",
                //备注
                remark: null,
                //作业结果 1:作业完成,2:作业取消,3:作业续签
                result: null,
                //序号（续签时重置，重新填报时更新）
                serialNum: null,
                //状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,
                // 5:作业监测,6:待关闭,7:作业取消,
                // 8:作业完成,9:作业续签,10:被否决
                status: null,
                // //作业许可有效期结束时间
                // validityEndTime: null,
                // //作业许可有效期开始时间
                // validityStartTime: null,
                //版本号（续签时更新）
                versionNum: null,
                //作业所在设备
                workEquipment: null,
                //授权气体检测员
                gasInspector: {id: '', name: ''},
                //作业类型
                workCatalog: {id: '', name: ''},
                //作业票模板
                cardTpl: {id: '', name: ''},
                // cardTpl: null,

                //作业票
                workCard: {id: '', name: ''},
                //工作安全分析
                jsaMaster: {id: '', name: ''},
                //能量隔离
                workIsolations: [
                    // {type:"1",isolator: {},disisolator:{}},
                    // {type:"2",isolator: {},disisolator:{}},
                    // {type:"3",isolator: {},disisolator:{}},
                    // {type:"4",isolator: {},disisolator:{}},
                ],
                //气体检测记录
                gasDetectionRecords: [],
                //作业许可风险库内容
                workStuffs: [],
                //监控记录
                superviseRecords: [],
                //作业许可相关人事
                workPersonnels: [],

                //现在 1:作业签发人,2:实施安全教育人,3:作业监护人,4:内部作业人员,
                // 5:承包商作业人员,6:检维修人员,7:特种作业人员,8,9,10
                //todo ptw 现在的问题是  1：签发人，是 selworkPersonnels 保存还是在ptw

                //下面的内容在保存的时候去掉
                ppeVerifier:{id:"",name:""},
                selworkPersonnels:{ '1':[],  '2':[],  '3':[],  '4':[],  '5':[],  '6':[]},
                //这里面存的是对象
                tempWorkStuffs: {//用来缓存workSutff 的，保存的时候将这里面的合并
                    equipmentList: [],
                    certificateList:[],
                    weihaibsList:[],
                    kongzhicsList:[],
                    ppes:[],
                    gas:[],
                    operateList:[]  // 作业方式列表
                },
                figureFiles:[],
                planFiles:[],
                schemeFiles:[],
                otherFiles:[],
                pms:{//jsa 是否需要验证， 本来应该放在另外一个参数上，现在直接放在model 面和model无关
                    requiredJSA:false,
                },
                extensionTime:null,
                extensionUnit:"1",
                extensionType:"",//2 延期 1 续签
            }
        },
        addOther:function(data,pms){
            var item=_.extend({
                id:"qita",
                isExtra:"1",
                name:"其他",
                content:"",
                attr1:"0",
            },pms);
            data.push(item);
        },
        //提交保存前处理对象
        getPermitDetail:function(data,model){
             var data=JSON.parse(JSON.stringify(data));
             if(data.workCard){
                 data.workCard={id:data.workCard.id}
             }
             data.workIsolations=data.workIsolations.map(function(item){
                return {
                    type:item.type,
                    isolatorId:item.isolator.id,
                    disisolatorId:item.disisolator.id
                }
             });
             data.workIsolations=  data.workIsolations.filter(function (item) {
                return item.isolatorId;
             });
             data.workPersonnels=[];
             for (key in  data.selworkPersonnels){
                data.selworkPersonnels[key].forEach(function (item) {
                     if(item.user&&item.user.id){
                         data.workPersonnels.push({type:item.type,personId:item.user.id,unitId:item.unitId});
                     }
                     else{
                         data.workPersonnels.push(item);
                     }
                 })
             }
             // 许可签发人员添加
            if(data.signRoles&&data.signRoles.length>0){
                    data.signRoles.forEach(function (role) {
                            data.workPersonnels.push({
                                type:role.type,
                                user:role.user,
                                users:role.users,
                                signCatalogId:role.signCatalogId,
                                signStep: role.signStep,
                            });
                })

            }
            delete  data.signRoles;
            //作业关闭签发人员添加
            for (rolesKey in data.closeRole){
                var roles=data.closeRole[rolesKey];
                if(roles&&roles.length>0){
                    roles.forEach(function (role) {
                        data.workPersonnels.push({
                            type:role.type,
                            user:role.user,
                            users:role.users,
                            signCatalogId:role.signCatalogId,
                            signStep: role.signStep,
                        });
                    })
                }
            }
            //=================================================
             data.workStuffs=[];
             for (key in  data.tempWorkStuffs){
                 data.tempWorkStuffs[key].forEach(function (stuff) {
                     if(stuff.ptwWorkPersonnels&&stuff.ptwWorkPersonnels.length>0){
                         stuff.ptwWorkPersonnels=stuff.ptwWorkPersonnels.map(function (item) {
                             if(item.user&&item.user.id){
                                return {type:"7",personId:item.user.id};
                             }
                             else{
                                return  item;
                             }
                         })
                     }
                     data.workStuffs.push(stuff);
                 })
             }

             data.workStuffs=data.workStuffs.map(function(item){
                return {
                    stuffId:item.id,
                    ppeCatalogId:item.ppeCatalogId,
                    isExtra:item.isExtra==1?"1":"0",
                    content:item.isExtra==1?item.content:(item.tempContent?item.tempContent:item.name),
                    stuffType:item.gasType?"8":item.type,
                    ptwWorkPersonnels:item.ptwWorkPersonnels,
                    attr1:item.attr1
                }
            });
             //作业单位转换
            if(data.workDepts&&data.workDepts.length>0){
                data.workUnitId=data.workDepts.map(function (item) {
                    return item.key;
                }).join();
            }
            if(data.workContractors&&data.workContractors.length>0){
                data.attr1=data.workContractors.map(function (item) {
                    return item.id;
                }).join();

            }
             //后端需要标注这个被清除
             if(!data.attr1){ //allowStrEmpty 可参考 detailPanel 127行代码
                // 'criteria.' + type + 'Value.' + key + '_empty';
                data.criteria={
                    strValue:{},
                };
                data.criteria["strValue"]["attr1"+"_empty"]="1";//str "1" int :1
             }
             if(data.gasCheckPosition&&data.gasCheckPosition.length>0){
                 data.gasCheckPosition=data.gasCheckPosition.join();
             }
             else{
                 delete   data.gasCheckPosition;
             }
            if(data.ppeVerifier){
                data.ppeVerifierId=data.ppeVerifier.id;
            }
            delete data.ppeVerifier;
            if(data.gasInspector&&!data.gasInspector.id){
                delete  data.gasInspector;
            }
            if(data.cardTpl&&data.cardTpl.id){
                data.cardTpl={id:data.cardTpl.id};
            }

            // 更新Json数据
            // _.each(data.jsonStrList,function (item) {
            //     if(item.dataType == '6'){
            //         item.value = item.value1 + "," + item.value2;
            //     }
            // });

             data.attr3 = JSON.stringify(data.jsonStrList);

            //气体检测互斥清除
            // if(data.gasCheckMethod==1){//清空选择的部位
            //     data.gasCheckPosition=""
            // }
            // if(data.gasCheckType==2){
            //     data.gasCheckCycleUnit="1";
            //     data.gasCheckCycle="";
            //     data.gasCheckNoticeTime="";
            // }
             delete data.workDepts;
             delete data.workContractors;
             delete data.selworkPersonnels;
             delete data.tempWorkStuffs;
             delete data.selWorkStuffs;
             delete data.pms;
             delete data.closeRole;
             delete data.workContractor;
             return data;
        },
        /*
        * data:permitModel,
        * model:模板数据 ：可以是原始模板，也可以是permitModel 的复制模板 workTpl
        * useModel, 是否需要拷贝模板里面数据，在没有创建应用模板之前需要为false,
        * changeTpl 是否是更换模板
        * */
        permitHandler:function(data,model,useModel,changeTpl){
            if(!model){
                model=data.workTpl;
            }
            if(useModel){
                data.workStuffs=model.ptwCardStuffs;
            }
            if(!changeTpl) {
                data.workPersonnels.forEach(function (person) {
                    if (["7", "1", "8", "9", "10"].indexOf(person.type) === -1) {//过滤掉特种人员

                        if (!data.selworkPersonnels[person.type]) data.selworkPersonnels[person.type] = [];
                        var b = data.selworkPersonnels[person.type];

                        if (person.type == "5") {
                            person.user = person.contractorEmp;
                        }
                        b.push(person);
                    }
                });
            }
            //workStuffs 处理
            data.geliffList=[];
            data.workStuffs.forEach(function(workstuff){

                if(workstuff.type==1){
                    data.tempWorkStuffs.equipmentList.push(workstuff);
                }
                else if(workstuff.type==2){
                    data.tempWorkStuffs.certificateList.push(workstuff);
                }
                else if(workstuff.type==3){
                    data.tempWorkStuffs.weihaibsList.push(workstuff);
                }
                else if(workstuff.type==4){
                    if(workstuff.gasType){
                        data.tempWorkStuffs.gas.push(workstuff);
                    }
                    else{
                        data.tempWorkStuffs.kongzhicsList.push(workstuff);
                    }
                }
                else if(workstuff.type==5){
                    data.geliffList.push(workstuff);
                }
                else if(workstuff.type==9){
                    data.tempWorkStuffs.operateList.push(workstuff);
                }
                else if(workstuff.ppeCatalogId){
                    data.tempWorkStuffs.ppes.push(workstuff);
                }
            });


            //添加默认防护措施落实核对人
            if(!data.ppeVerifier.id){
                _.extend(data.ppeVerifier,{
                    id: LIB.user.id, name: LIB.user.name
                })
            }
            //处理作业关闭人员
            var closeRole={
                "2":[],"3":[],"4":[],
            };
            var getCloseRole=function(type){
                //显示是从模板得到 ptwCardSignRoles 里面的人员必须和以选择人员一致
                //保存的时候 是保存 workPersonnels 实际存在temp
                var signRoles=null;
                if(useModel){
                     signRoles=model.ptwCardSignRoles.filter(function (item) {
                        return item.type==type;
                    });
                }
                //已经选中的人员 也表示选择的 role
                var personType={"2":"8","3":"9","4":"10"};
                var hasPersonels=data.workPersonnels.filter(function (item) {
                    return item.type==personType[type];
                })||[];
                if(hasPersonels.length>0){
                    signRoles=hasPersonels;
                }
                else if(signRoles&&signRoles.length>0){
                    signRoles.forEach(function (item) {
                        // if(item.signType==1 || item.signCatalog.signerType ==1){
                        //     if(!item.users||item.users.length===0){
                        //         item.users.push({id:LIB.user.id,name:LIB.user.name})
                        //     }
                        // }
                        item.type=personType[item.type];
                    })
                }
                return signRoles;
            }
            closeRole["2"] =getCloseRole("2");
            closeRole["3"] =getCloseRole("3");
            closeRole["4"] =getCloseRole("4");
            data.closeRole=closeRole;
            //===========创建的时候需要吧作业关闭的几个字段带过来====================================
            if(useModel){
                data.extensionType=model.extensionType;
                data.extensionUnit=model.extensionUnit;
                data.extensionTime=model.extensionTime;
                data.enableOperatingType = model.enableOperatingType;
                data.enableOperatingType = model.enableOperatingType; // enableSuperviseRecord
                data.enableSuperviseRecord = model.enableSuperviseRecord;
                data.enableSafetyEducator = model.enableSafetyEducator;
            }
            //=========给model 添加 comments 里面暂时存了作业关闭的生命 ====================================================
            if(model&&!model.comments){
                api.listCatalogs({
                    'criteria.intsValue':JSON.stringify({type:[6,7]})
                }).then(function(res){
                    var comments={};
                    res.data.forEach(function (item) {
                        comments[item.type]=item.name;
                    })
                    LIB.Vue.set(model,"comments",comments)
                })
                //
            }
            //作业单位承包商转换
            if(!changeTpl) {
                if (data.workDepts && data.workDepts.length > 0) {
                    data.workDepts = data.workDepts.map(function (item) {
                        return {
                            label: item.name,
                            key: item.id,
                            type: "2",
                        }
                    })
                }
                //文件处理
                data.figureFiles = [];
                data.planFiles = [];
                data.schemeFiles = [];
                data.otherFiles = [];
                if (data.fileList && data.fileList.length > 0) {
                    data.fileList.forEach(function (item) {
                        if (item.dataType === "PTW1") {
                            data.schemeFiles.push(LIB.convertFileData(item))
                        }
                        else if (item.dataType === "PTW2") {
                            data.planFiles.push(LIB.convertFileData(item))
                        }
                        else if (item.dataType === "PTW3") {
                            data.figureFiles.push(LIB.convertFileData(item))
                        }
                        else if (item.dataType === "PTW4") {
                            data.otherFiles.push(LIB.convertFileData(item))
                        }
                    })
                }
            }
        },
        valiSavePerimit:function(data,tplModel,isSubmit){
            if(data.permitCode&&data.permitCode.length>30){
                return "许可证编号不要超过30个字符";
            }
            // if(model.enableOperatingType=='1' && (!_.find(data.tempWorkStuffs.operateList,function (item) {
            //        return item.attr1 == '1'
            //    }))){
            //    return "请选择作业方式";
            // }
            for(var i=0; i<  data.jsonStrList.length; i++){
                var item = data.jsonStrList[i];
                if(item.dataType == '1' && item.isRequired=='1' && item.disable=='0'){

                    if(!item.value){
                        return "请填写" + item.name;
                    }
                }
                if(item.dataType == '2' && item.isRequired=='1' && item.disable=='0'){

                    if(!(item.value==0 ||item.value)){
                        return "请填写" + item.name;
                    }
                }
                if(item.dataType == '3'  && item.disable=='0'){
                    if((item.value==0 ||item.value) && ((isNaN(item.value)) || item.value%1 !== 0)){
                        return item.name + " 为整数";
                    }
                }
                if(item.dataType == '3' && item.isRequired=='1' && item.disable=='0'){
                    if(!(item.value==0 ||item.value)){
                        return "请填写" + item.name;
                    }
                }
                if(item.dataType == '4' && item.disable=='0'){
                    if((item.value==0 ||item.value) && isNaN(item.value)){
                        return " " +  item.name + " 为小数";
                    }
                }
                if(item.dataType == '4' && item.isRequired=='1' && item.disable=='0'){
                    if(!(item.value==0 ||item.value)){
                        return "请填写 " +  item.name + " 为小数";
                    }
                }
                if(item.dataType == '5' && item.isRequired=='1' && item.disable=='0'){
                    if(!item.value){
                        return "请填写" + item.name;
                    }
                }
                if(item.dataType == '6' && item.isRequired=='1' && item.disable=='0'){
                    if(!item.value1 || !item.value2){
                        return "请填写" + item.name;
                    }
                }

// 固化字段校验
                if(!data.applUnitId && item.code == 'applUnitId' && item.isRequired=='1' && item.disable=='0'){
                    return "请选择" + item.name;
                }
                if((!data.workDepts||!data.workDepts.length) && (!data.workContractors||!data.workContractors.length) && item.code == 'workUnitId' && item.isRequired=='1' && item.disable=='0'){
                    return "请选择" + item.name;
                }

                {
                    // 校验长度
                    if(data.workDepts&&data.workDepts.length&&data.workDepts.length>30){
                        return "选择的公司内部作业单位，请不要超过30个";
                    }
                    if(data.workContractors&&data.workContractors.length&&data.workContractors.length>30){
                        return "选择的承包商作业单位，请不要超过30个";
                    }
                }

                if(!data.prodUnitId && item.code=='prodUnitId' && item.isRequired=='1' && item.disable=='0'){
                    return "请填写" + item.name;
                }

                if (!data.workPlace && item.code=='workPlace' && item.isRequired=='1' && item.disable=='0') {
                    return "请填写" + item.name;
                }
                else if (data.workPlace && data.workPlace.length > 200) {
                    return item.name + "不要超过200个字符";
                }

                if (!data.workPlace && item.code=='workEquipment' && item.isRequired=='1' && item.disable=='0') {
                    return "请填写" + item.name;
                }

                if (!data.workContent && item.code=='workContent' && item.isRequired=='1' && item.disable=='0') {
                    return "请填" + item.name;
                }
                else if (data.workContent && data.workContent.length > 500) {
                    return item.name + "不要超过500个字符";
                }
                if(data.selworkPersonnels["4"].length===0 && data.selworkPersonnels["5"].length===0 && item.code=='worker' && item.isRequired=='1' && item.disable=='0'){
                    return "选择公司内部作业人员或者承包商作业人员";
                }
                // if(data.workContractors&&data.workContractors.length&&data.selworkPersonnels["5"].length===0){
                //     return "作业单位选择了承包商，作业人员必须也选择承包商人员";
                // }
                //
                // // 作业中所使用的主要工具/设备
                // if ( item.code=='mainEquipment' && item.isRequired=='1' && item.disable=='0') {
                //     if(!_.find(data.tempWorkStuffs.equipmentList,function (item) {return item.attr1 == '1'}))
                //         return "请填" + item.name;
                // }
                // // 特种作业人员/特种设备操作人员资格证
                // if ( item.code=='specialWorker' && item.isRequired=='1' && item.disable=='0') {
                //     if(!_.find(data.tempWorkStuffs.certificateList,function (item) {return item.attr1 == '1'}))
                //         return "请填" + item.name;
                // }

                // 检维修人员
                if(data.selworkPersonnels["6"].length===0 && item.code=='maintainer' && item.isRequired=='1' && item.disable=='0'){
                    return "选择" + item.name;
                }

                // 工作安全分析
                if(data.jsaMaster.length===0 && item.code=='jsaMasterId' && item.isRequired=='1' && item.disable=='0'){
                    return "选择" + item.name;
                }

                // 备注
                if (!data.remark && item.code=='remark' && item.isRequired=='1' && item.disable=='0') {
                    return "请填" + item.name;
                }

                // 应急救援预案
                if(data.schemeFiles.length===0 && item.code=='emerScheme' && item.isRequired=='1' && item.disable=='0'){
                    return "选择" + item.name;
                }

                // 作业计划书/方案
                if(data.planFiles.length===0 && item.code=='workPlan' && item.isRequired=='1' && item.disable=='0'){
                    return "选择" + item.name;
                }

                // 附图
                if(data.figureFiles.length===0 && item.code=='attachedPicture' && item.isRequired=='1' && item.disable=='0'){
                    return "选择" + item.name;
                }

                // 其他附件
                if(data.otherFiles.length===0 && item.code=='otherAttachment' && item.isRequired=='1' && item.disable=='0'){
                    return "选择" + item.name;
                }

                if((!data.permitStartTime||!data.permitEndTime) && item.code=='permitTime' && item.isRequired=='1' && item.disable=='0'){
                    return "请填写作业时限";
                }
                //  extensionUnit : 1小时  2天
                if(data.extensionTime && data.extensionUnit){
                    //  permitStartTime permitEndTime
                    var start = parseInt((new Date(data.permitStartTime).getTime())/1000);
                    var end  = parseInt((new Date(data.permitEndTime).getTime())/1000);
                    var count = end - start;
                    var extensionTime = data.extensionUnit == '1'?(data.extensionTime*3600) : (data.extensionTime*3600*24);

                    var day = new Date((start + extensionTime)*1000);
                    day = day.Format("yyyy-MM-dd hh:mm:ss");

                    if(count>=extensionTime){
                        return "作业时限不能超出" + day
                    }
                }

                //  作业方式
                if(tplModel.enableOperatingType == '1' && item.code=='operatingType' && item.isRequired=='1' && item.disable=='0' && isSubmit ){
                    var temp = data.workStuffs.some(function (item) {
                        return item.type=='9' && item.attr1=='1';
                    });
                    if(!temp){return '请选择' + item.name}
                }
                // 作业监护人
                if(tplModel.enableSupervisor=="1" && data.selworkPersonnels["3"].length===0 && item.code=='supervisior' && item.isRequired=='1' && item.disable=='0' && isSubmit){
                    return "请选择" + item.name;
                }
                // 实施安全教育人
                if(tplModel.enableSafetyEducator=="1" && data.selworkPersonnels["2"].length===0 && item.code=='safetyEducator' && item.isRequired=='1' && item.disable=='0' && isSubmit){
                    return "请选择" + item.name;
                }
                //
                if(data.pms.requiredJSA&&!data.jsaMaster.id && item.code=='jsaMasterId' && item.isRequired=='1' && item.disable=='0' && isSubmit){
                    return "请选择一个" + item.name;
                }
            }
        },
        valiSubmitPermit:function (data,tplModel) {
            var saveerror=this.valiSavePerimit(data,tplModel, true);  // 第三个参数控制校验
            if(saveerror){return saveerror}
            // if(tplModel.enableOperatingType == '1' ){
            //     var temp = data.workStuffs.some(function (item) {
            //         return item.type=='9' && item.attr1=='1';
            //     });
            //     if(!temp){return '请选择作业方式'}
            // }
            // if(tplModel.enableSupervisor=="1"&&data.selworkPersonnels["3"].length===0){
            //     return "请选择作业监护人"
            // }
            // if(tplModel.enableSafetyEducator==1){
            //     if(data.selworkPersonnels["2"].length===0){
            //         return "请选择实施安全教育人"
            //     }
            // }
            // if(data.pms.requiredJSA&&!data.jsaMaster.id){
            //     return "请选择一个工作安全分析";
            // }

            if(!data.tempWorkStuffs.weihaibsList.some(function (item) {
                return item.attr1=="1";
            }) && data.attr1=='1'){
                return "请至少勾选一个危害辨识";
            }
            if(!data.tempWorkStuffs.kongzhicsList.some(function (item) {
                return item.attr1=="1";
            })){
                return "请至少勾选一个安全措施";
            }

            if(data.enableProcessIsolation==1){
                var item= _.findWhere(data.workIsolations,{type:"1"});
                if(!item||!item.isolator.id){
                    return "请选择工艺隔离的隔离实施人"
                }
                if(!item.disisolator.id){
                    return "请选择工艺隔离的解除隔离实施人"
                }
            }
            if(data.enableMechanicalIsolation==1){
                var item= _.findWhere(data.workIsolations,{type:"2"});

                if(!item||!item.isolator.id){
                    return "请选择机械隔离的隔离实施人"
                }
                if(!item.disisolator.id){
                    return "请选择机械隔离的解除隔离实施人"
                }
            }
            if(data.enableElectricIsolation==1){
                var item= _.findWhere(data.workIsolations,{type:"3"});
                if(!item||!item.isolator.id){
                    return "请选择电气隔离的隔离实施人"
                }
                if(!item.disisolator.id){
                    return "请选择电气隔离的解除隔离实施人"
                }
            }
            if(data.enableSystemMask==1){
                var item= _.findWhere(data.workIsolations,{type:"4"});
                if(!item||!item.isolator.id){
                    return "请选择授权系统屏蔽的隔离实施人"
                }
                if(!item.disisolator.id){
                    return "请选择授权系统屏蔽的解除隔离实施人"
                }
            }
            if(data.enableGasDetection == 1){
                if(!data.gasInspector||!data.gasInspector.id){
                    return ' 请选择气体检测员'
                }
            }
            for (var i=0;i<data.signRoles.length;i++){
                var role=data.signRoles[i];
                if(role.users.length==0){
                    return "在许可签发中，请至少选择一个"+role.signCatalog.name;
                }
            }

            for (rolesKey in data.closeRole) {
                var roles=data.closeRole[rolesKey];
                if(roles){
                    for (var i=0;i<roles.length;i++){
                        var role=roles[i];
                        if(role.users.length==0){
                            var typeStr={"2":"作业完成","3":"作业取消"}[rolesKey];
                            if(!typeStr){
                                typeStr=data.extensionType=="1"?"作业续签":"作业延期";
                            }
                            return "在作业关闭的"+typeStr +"中请至少选择一个"+role.signCatalog.name;
                        }
                    }
                }
            }
        },
        getViewData:function(permitModel,model){
            this.permitHandler(permitModel);
            var otherModel=permitModel;
            //羡慕是获取是否会 特种作业人员/特种设备操作人员需要签字确认
            otherModel.isSignRequired4SpecialWorke=LIB.getBusinessSetByNamePath('ptw.isSignRequired4SpecialWorker').result === '2';
            var list=model.ptwCardStuffs.filter(function (item) {
                return item.type == 2;
            });
            var users=permitModel.workPersonnels.filter(function (item) {
                return   item.certStuffId
            });
            var keyIndex=[];
            list.forEach(function (item) {
                keyIndex.push(item.id);
                Vue.set(item,"ptwWorkPersonnels",[]);
            });
            var  tempworkStuffs=permitModel.tempWorkStuffs.certificateList;
            users.forEach(function (item) {
                if(item.cert){
                    var index=keyIndex.indexOf(item.cert.stuffId);
                    if(index>-1){
                        list[index].ptwWorkPersonnels.push(item);
                    }}
                var tempIndex=_.findIndex(tempworkStuffs,function (stuff) {
                    return item.cert.stuffId===stuff.id;
                })
                var tempworkStuff=tempworkStuffs[tempIndex];
                tempworkStuff.ptwWorkPersonnels=list[index].ptwWorkPersonnels;//这里使用同1个引用；
            })
            otherModel.certificateList=list;//工具设备

            //特种作业人员
            otherModel.equipmentList=model.ptwCardStuffs.filter(function (item) {
                return item.type == 1;
            });
            otherModel.weihaibsList=model.ptwCardStuffs.filter(function (item) {
                return  item.type==3;
            });
            otherModel.kongzhicsList=model.ptwCardStuffs.filter(function (item) {
                item.type==4&&!item.gasType;
            });
            otherModel.kongzhicsList=model.ptwCardStuffs.filter(function (item) {
                item.type==4&&!item.gasType;
            });
            //个人防护
            (function(){
                var allTypeList=[];
                var ppe= {
                    ppeList:[],
                    enablePPEs:[],
                  initData: function () {
                      var ppeList=allTypeList.filter(function (item) {
                          return model.ppeCatalogSetting ? model.ppeCatalogSetting.indexOf(item.id) > -1 : true;
                      });
                      this.initPPEList(ppeList);
                      var m = JSON.parse(JSON.stringify(ppeList));
                      this.ppeList=m;
                  },
                  _getPPEItems: function (data) {
                      return model.ptwCardStuffs.filter(function (item) {
                          return item.type == 6 && item.ppeCatalogId == data.id;
                      })
                  },
                  _getEnable: function (item) {
                      var _this = this;
                      if (permitModel.ppeCatalogSetting) {
                          Vue.set(item, 'enable', !!permitModel.ppeCatalogSetting.match(new RegExp(item.id)));
                          if (item.enable) {
                              _this.enablePPEs.push(item.id);
                          }
                      } else {
                          item.enable = false;
                      }
                  },
                  _getSel: function (data) {
                      if (permitModel.workStuffs && permitModel.workStuffs.length > 0) {
                          var sel = permitModel.workStuffs.filter(function (item) {
                              return item.type == 6 && item.ppeCatalogId == data.id;
                          });
                          data.selppes = sel;
                          data.selppesId = sel.map(function (item) {
                              return item.id
                          })
                      } else {
                          data.selppes = [];
                          data.selppesId = [];
                      }
                  },
                  initPPEList: function (data) {
                      var _this = this;
                      data.forEach(function (item) {
                          item.ppes = _this._getPPEItems(item);
                          _this._getEnable(item);
                          _this._getSel(item);
                      });
                  },
              };
                api.getPPETypes().then(function (data) {//模板里面的ppe
                    allTypeList=data;
                     ppe.initData();
                     otherModel.ppeList=ppe.ppeList;
                     otherModel.enablePPEs=ppe.enablePPEs;
                })

            })();
            //气体检测
            (function(){

            })();
            //许可签发
            otherModel.signRoles= permitModel.workPersonnels.filter(function (item) {
                return item.type=="1";
            })||[];
            otherModel.closeRole={
                "2":null,
                "3":null,
                "4":null,
            };
            otherModel.closeRole["2"]= permitModel.workPersonnels.filter(function (item) {
                return item.type=="2";
            })||[];
            otherModel.closeRole["3"]= permitModel.workPersonnels.filter(function (item) {
                return item.type=="3";
            })||[];
            //延期 和续签 都是4
            otherModel.closeRole["4"]= permitModel.workPersonnels.filter(function (item) {
                return item.type=="4";
            })||[];
            //可以没有选中不选中 ，就是这些 取消原因
            otherModel.cancelReasonList=model.ptwCardStuffs.filter(function (item) {
                return  item.type==7
            })
            // 取消原因 如果permitmodel 里面有，冲这里去
            otherModel.cancelReasonList=model.ptwCardStuffs.filter(function (item) {
                return  item.type==7
            })


        }
    }
})