define(function (require) {
    return {

        //主要设备/安全附件/管道/监控设备属性说明
        mrsEquipment: function (pms) {
            return _.extend({
                //编码
                code: null,
                //名称
                name: null,
                //数量
                quantity: null,
                //类型 1:设备,2:管道,3:监控系统,4:设备子件
                type: null,
                //生产厂家
                manufacturer: null,
                //公称直径
                nominalDiameter: null,
                //管道材质
                pipingMaterial: null,
                //出厂日期
                productionDate: null,
                //规格型号
                specification: null,
                //储存介质
                storageMedium: null,
                //工程壁厚
                wallThickness: null,
                //重大危险源
                majorRiskSource: {id: '', name: ''},
                //父设备id
                parentId: null,
                //安全附件
                equipmentItems: [],//也是mrsEquipment对象
                // 所属属地
                dominationArea:{id:'',name:''},

            }, pms)
        },
        mrsSafeAttachment: function (pms) {
            return _.extend({
                name: "",
                //类型 1:设备,2:管道,3:监控系统,4:设备子件
                type: "4",
                quantity: undefined,
                mrsId: undefined,
                majorRiskSource: {id: '', name: ''},
            }, pms)
        },
        //维护记录属性说明
        mrsEquipMaintRecord:function(pms){ return  _.extend({
            //检测结果 1:合格,2:不合格
            attr1 : "1",
            //编码
            code : null,
            //作业类别 1:内部,2:外部
            operationType : "1",
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //检验/检测机构
            inspectOrgan : "",
            //设备类型 1:设备,2:管道,3:监控系统
            mrsEquipmentType : "1",
            //维护/保养/检验/检测数量
            quantity : null,
            //作业阶段 1:检修抢修,2:维护保养,3:检验检测
            phase : null,
            //操作/检验/检测内容
            operationContent : null,
            //维护/保养/检验/检测时间
            operateTime : null,
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //外部作业人员作业/检验/检测操作人员
            operators : null,
            //内部作业操作人员
            users : [],
            //重大危险源
            mrsEquipment : {id:'', name:''},
            //重大危险源
            majorRiskSource : {id:'', name:''},


        },pms)},
        //安全评价报告属性说明
        mrsSafetyEvaluation:function (pms) {
            return _.extend( {
                //编码
                code: null,
                //安全评价单位
                evaluateUnit: null,
                //委托单位
                trusteeUnit: null,
                //评价时间
                evaluateDate: null,
                //重大危险源名称
                mrsName: null,
                //编制日期
                compileDate: null,
                //危险源控制程序
                controlProcedure: null,
                //评价原因
                // 1:重大危险源安全评估已满三年的,
                // 2:构成重大危险源的装置、设施或者场所进行新建、改建、扩建的,
                // 3:危险化学品种类、数量、生产、使用工艺或者储存方式及重要设备、设施等发生变化，影响重大危险源级别或者风险程度的,
                // 4:外界生产安全环境因素发生变化，影响重大危险源级别和风险程度的,
                // 5:发生危险化学品事故造成人员死亡，或者10人以上受伤，或者影响到公共安全的
                evaluateReason: null,
                //重大危险源级别
                mrsRiskLevel: null,
                //备注
                remark: null,
                //安全评价报告编号
                reportNumber: null,
                //委托单位法人
                trusteeCorp: null,
                //委托单位法人电话
                trusteeCorpMobile: null,
                //委托单位联系人
                trusteeLinkman: null,
                //委托单位联系人电话
                trusteeLinkmanMobile: null,
                reportBak: "0", //报告是否备案
                planBak: "0", //预案是否备案
                //重大危险源
                majorRiskSource: {id: '', name: ''},
                files:[],

            },pms)
        },
        enum: {
            workPhase: {
                "1": "检修抢修", "2": "维护保养", "3": "检验检测"
            },
            mrsEquipmentType: {
                "1": "设备", "2": "管道"
            },
            operationType: {
                "1": "内部", "2": "外部"
            },
            checkResult: {
                "1": "合格", "2": "不合格"
            },
            evaluateReason:{
                "1":"重大危险源安全评估已满三年的",
                "2":"构成重大危险源的装置、设施或者场所进行新建、改建、扩建的",
                "3":"危险化学品种类、数量、生产、使用工艺或者储存方式及重要设备、设施等发生变化，影响重大危险源级别或者风险程度的",
                "4":"外界生产安全环境因素发生变化，影响重大危险源级别和风险程度的",
                "5":"发生危险化学品事故造成人员死亡，或者10人以上受伤，或者影响到公共安全"
            }
        }
    }
})