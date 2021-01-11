define(function (require) {
    var LIB = require('lib');
    return {
        pwtInfoTypes: ['基本信息', '危害辨识', '安全措施','个人防护','能量隔离', '气体检测', '许可签发', '作业关闭'],
        gasType:{
            "1":"有毒有害气体或蒸汽",
            "2":"可燃气体或蒸汽",
            "3":"氧气"
        },
        workResultType:{
            "success":"作业完成",
            "cancel":"作业取消",
            "postpone":"作业续签"
        },
        // pwtInfoTypes:{//使用1个key 防止用index 添加项的时候index都要改
        //     "1":"基本信息",
        //     "2":"危害辨识",
        //     "3":"能量隔离",
        //     "4":"个人防护",
        //     "5":"气体检测",
        //     "6":"许可签发",
        //     "7":"作业关闭",
        // },
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
        enum:{
            enableCommitment:{"1":"是","0":"否"}
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
        gasCheckItem:function (gasType) {
            return  {
                type:4,
                gasType:gasType
            }
        },
        commitmentTypeItem:function () {
            return{
                type:5,
                disabled:"0",
                commitmentType:1
            }
        },
        cardTpl:function() {
            return {

                //是否需要主管部门负责人 0:不需要,1:需要
                // enableDeptPrin : "0",
                // //是否启用电气隔离 0:否,1:是
                // //是否需要生产单位现场负责人是否需要生产单位现场负责人 0:不需要,1:需要
                // enableProdPrin : "0",
                // //是否需要相关方负责人 0:不需要,1:需要
                // enableRelPin :"0",
                // //是否需要安全部门负责人 0:不需要,1:需要
                // enableSecurityPrin :"0",
                //是否需要监护人员 0:不需要,1:需要
                //上面是以前的

                //作业票模板风险库内容
                id : null,
                //编码
                code : null,
                //作业票模板名称
                name : null,
                //启用/禁用 0:启用,1:禁用
                disable : "1",
                //公司Id
                compId :LIB.user.compId,
                //部门Id
                orgId :LIB.user.compId,
                //字段启用禁用设置(json)
                columnSetting : "0",
                //是否启用电气隔离 0:否,1:是
                enableElectricIsolation : "0",
                //是否启用气体检测 0:否,1:是
                enableGasDetection : "0",
                //是否启用机械隔离 0:否,1:是
                enableMechanicalIsolation : "0",
                //是否启用工艺隔离 0:否,1:是
                enableProcessIsolation : "0",
                //是否需要安全教育人  0:不需要,1:需要
                enableSafetyEducator : "1",
                //签发需要按次序执行 0:不需要,1:需要
                enableSignOrder : "1",
                //需要填写现场监护记录 0:不需要,1:需要
                enableSuperviseRecord : "0",
                //是否需要监护人员 0:不需要,1:需要
                enableSupervisor : "1",
                //是否启用系统屏蔽 0:否,1:是
                enableSystemMask : "0",
                //启用的个人防护设备类型id串
                ppeCatalogSetting : null,
                // 是否启用 作业方式 0：否  1：是
                enableOperatingType:'1',
                //作业类型
                workCatalog : {id:'', name:''},
                workLevel : {id:'', name:''},
                //许可签发角色
                ptwCardSignRoles : [],
                //作业票模板风险库内容
                ptwCardStuffs : [],
                extensionTime:null,
                extensionUnit:"2",
                extensionType:"1",//2 延期 1 续签
                enableCompleteOrder:"0",
                enableCancelOrder:"0",
                enableExtendOrder:"0",
                //数据库 4，5 应该都是4 ，通过 extensionType 来判断
                closeRoles:{
                    "2":[],//作业完成
                    "3":[],//作业取消
                    "4":[],//作业续签
                    "5":[],//作业延期
                },
                signRole:[],
                workCatalogId:"",
                workLevelId:"",
                attr1:'0',

            }
        },

        //作业票模板的作业签发角色对象
        ptwCardSignRole :function (pms) {
            return _.extend({
                // id : null,
                //编码
                //签发顺序
                type:"1",
                signStep : null,
                //作业票模板
                // ptwCardTpl : {id:'', name:''},
                //签发角色类型
                signCatalog : {id:'', name:''},
                //签发人员
            // users : [],
            },pms)
        },
        handleTpl:function(model){
            // model.ptwCardSignRoles.forEach(function (item) {
            //    if(item.type in   model.closeRoles){
            //        model.closeRoles[item.type].push(item);
            //    }
            // })
        },
        saveHandleTpl:function (data) {

            data.ptwCardStuffs = data.ptwCardStuffs.map(function (item) {
                var pms =
                    {
                        stuffType: item.gasType ? "8" : item.type,
                        stuffId: item.id,
                        ppeCatalogId: item.ppeCatalogId || null
                        //ptwCardTpl:{id:data.id,name:data.name}
                    };
                return pms;
            });
            var initRole =function (isOrder,list) {
                if(list&&list.length>0){
                    list.forEach(function (item,index) {
                        if(isOrder=="0"){
                            item.signStep="1";
                        }
                        if(item.signCatalog){
                            item.signCatalogId=item.signCatalog.id;
                            delete item.signCatalog;
                        }
                    })
                }
                return list;
            }
            //签发人员处理
             //signRole 许可签发人员  closeRoles 关闭签发人员
            var list=[].concat(initRole(data.enableSignOrder,data.signRole));
            list=list.concat(initRole(data.enableCompleteOrder,data.closeRoles["2"]));
            list=list.concat(initRole(data.enableCancelOrder,data.closeRoles["3"]));
            if(data.extensionType=="1"){
                list=list.concat(initRole(data.enableExtendOrder,data.closeRoles["4"]));
            }
            else  if(data.extensionType=="2"){
                list=list.concat(initRole(data.enableExtendOrder,data.closeRoles["5"]));
            }
            data.ptwCardSignRoles=list;
            delete data.promiseList;//添加的承诺
            delete  data.signRole;
            delete data.closeRoles;
            // console.log("处理后的数据的数据",data);

        }
    }
})