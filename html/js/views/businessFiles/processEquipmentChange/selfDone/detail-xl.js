define(function (require) {
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var entrust = require("./dialog/entrust");
	var deliver = require("./dialog/deliver");
	var approval = require("./dialog/approval");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var fileList = require('./dialog/fileListSimpleCard')
	//初始化数据模型
	var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//所属专业
			profession: null,
			//变更事由
			changeReason: null,
			//变更模式 1:临时变更,2:永久变更
			changeMode: '1',
			//变更结束时间
			endTime: null,
			//变更开始时间
			startTime: null,
			//业务类型 1:管理处,2:公司业务处
			bizType: null,
			//申请日期
			applyDate: null,
			//变更所在功能区
			functionalZone: null,
			//变更项目
			projectName: null,
			//禁用标识 0:启用,1:禁用
			disable: "0",
			//公司id
			compId: null,
			//部门id
			orgId: null,
			//申请人类型 0:基层站队人员,1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
			applicantType: null,
			//auditStatus 审批状态 0:未审核,1:第一步审批,2:第二步审批,3:第三步审批,4:第三步审批
			auditStatus: null,
			//阶段性审批时间
			auditTime: null,
			//变更期限
			changeDeadline: null,
			//变更等级 0:未评估,1:一般变更,2:重大变更
			level: null,
			//状态 0:待申请提交,1:待评估,2:待审批,3:待填写变更实施,4:待验收,5:待评估范围,6:已评估范围,7:线下执行
			status: 0,
			//申请人
			user: { id: '', name: '' },
			//检查项
			pecCheckItems: [],
			//待办
			pecTodos: [],
			//委托记录
			pecDelegateRecords: [],
			//审批记录
			pecAuditRecords: [],
			pecDetail: {
				id: null,
				//编码
				code: null,
				//工艺设备变更详细说明
				description: null,
				//变更的技术依据
				technicalBase: null,
				//变更带来的问题陈述
				problem: null,
				//是否有其他影响 0:否,1:是
				otherInfluence: null,
				//是否影响成本/效益 0:否,1:是
				benefitInfluence: null,
				//是否影响安全健康 0:否,1:是
				safetyInfluence: null,
				//是否影响环境 0:否,1:是
				envInfluence: null,
				//禁用标识 0:启用,1:禁用
				disable: "0",
				//成本/效益影响结论
				benefitSummary: null,
				//环境影响结论
				envSummary: null,
				//其他影响结论
				otherSummary: null,
				//安全与健康影响结论
				safetySummary: null,
			}
		}
	};
	//Vue数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			opType: 'view',
			isReadOnly: true,
			title: "",
			//验证规则
			rules: {
				"code": [LIB.formRuleMgr.length(100)],
				"profession": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("所属专业")),
				"changeReason": [LIB.formRuleMgr.require("变更事由"),
				LIB.formRuleMgr.length(200)
				],
				"changeMode": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("变更模式")),
				"endTime": [LIB.formRuleMgr.require("变更结束时间"), {
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.startTime >= vo.endTime) {
								callback(new Error("开始时间应小于结束时间"))
						} 
					}
				}],
				"startTime": [LIB.formRuleMgr.require("变更开始时间"), {
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.startTime >= vo.endTime) {
								callback(new Error("开始时间应小于结束时间"))
						} 
					}
				}],
				"bizType": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("业务类型")),
				"applyDate": [LIB.formRuleMgr.require("申请日期"), {
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.applyDate >= vo.endTime) {
								callback(new Error("申请日期应小于结束时间"))
						} 
					}
				}],
				"functionalZone": [LIB.formRuleMgr.require("变更所在功能区"),
				LIB.formRuleMgr.length(200)
				],
				"projectName": [LIB.formRuleMgr.require("变更项目"),
				LIB.formRuleMgr.length(200)
				],

				"compId": [LIB.formRuleMgr.require("公司")],
				"orgId": [LIB.formRuleMgr.length(10), LIB.formRuleMgr.require("申请单位")],
				"applicantType": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"auditStatus": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"auditTime": [LIB.formRuleMgr.allowStrEmpty],
				"changeDeadline": [{
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.changeMode == '1') {
							if (_.isEmpty(vo.changeDeadline)) {
									callback(new Error("请填写总结"))
							}else{
								callback()
							}

						} else {
								callback()
						}
					}
				}],
				"level": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"user.id": [LIB.formRuleMgr.require("申请人")],
				"description": [LIB.formRuleMgr.require("工艺设备变更详细说明"),
				LIB.formRuleMgr.length(1000)
				],
				"technicalBase": [LIB.formRuleMgr.require("变更的技术依据"),
				LIB.formRuleMgr.length(1000)
				],
				"problem": [LIB.formRuleMgr.require("变更带来的问题陈述"),
				LIB.formRuleMgr.length(1000)
				],
				"otherInfluence": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否有其他影响")),
				"benefitInfluence": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否影响成本/效益")),
				"safetyInfluence": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否影响安全健康")),
				"envInfluence": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否影响环境")),

				"benefitSummary": [LIB.formRuleMgr.length(1000),{
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.pecDetail.benefitInfluence == 1) {
							if (_.isEmpty(vo.pecDetail.benefitSummary)) {
									callback(new Error("请填写总结"))
							}else{
								callback()
							}

						} else {
								callback()
						}
					}
				}],
				"envSummary": [LIB.formRuleMgr.length(1000), {
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.pecDetail.envInfluence == 1) {
							if (_.isEmpty(vo.pecDetail.envSummary)) {
									callback(new Error("请填写总结"))
							}else{
								callback()
							}
						} else {
								callback()
						}
					}
				}],
				"otherSummary": [LIB.formRuleMgr.length(1000),{
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.pecDetail.otherInfluence == 1) {
							if (_.isEmpty(vo.pecDetail.otherSummary)) {
									callback(new Error("请填写总结"))
							}else{
								callback()
							}

						} else {
								callback()
						}
					}
				}],
				"safetySummary": [LIB.formRuleMgr.length(1000), {
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.pecDetail.safetyInfluence == 1) {
							if (_.isEmpty(vo.pecDetail.safetySummary)) {
									callback(new Error("请填写总结"))
							}else{
								callback()
							}

						} else {
								callback()
						}
					}
				}],
			},
			showUserSelectModal: false
		},
		pecAssessment: {
			vo: {
				id: null,
				//编码
				code: null,
				//变更等级 1:一般变更,2:重大变更
				level: null,
				//评估结果 0:同意,1:不同意
				result: null,
				//启用/禁用 0:启用,1:禁用
				disable: "0",
				//评估时间
				assessTime: null,
				//意见
				opinion: null,
				//状态 0:待提交,1:已提交
				status: null,
				//处理人
				user: { id: '', name: '' },
			},
			opType: 'view',
			isReadOnly: true,
			rules: {
				"code": [LIB.formRuleMgr.length(255)],
				"level": [LIB.formRuleMgr.require("变更等级")],
				"result": [LIB.formRuleMgr.require("评估结果")],

				"opinion": [LIB.formRuleMgr.length(500)],
				"status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"user.id": [LIB.formRuleMgr.allowStrEmpty],
			}
		},
		acceptance: {
			vo: {
				id: null,
				//编码
				code: null,
				//启用/禁用 0:启用,1:禁用
				disable: "0",
				//验收日期
				acceptDate: null,
				//效果验证
				description: null,
				//实施结束时间
				implEndTime: null,
				//实施情况
				presentation: null,
				//状态 0:待提交,1:已提交
				status: null,
				//验收项
				pecAcceptDetails: [],
			},
			opType: 'view',
			isReadOnly: true,
			rules: {
				"code": [LIB.formRuleMgr.length(255)],
				"disable": LIB.formRuleMgr.require("状态"),
				"acceptDate": [LIB.formRuleMgr.require("变更验收日期")],
				"description": [LIB.formRuleMgr.length(1000)],
				"implEndTime": [LIB.formRuleMgr.allowStrEmpty],
				"presentation": [LIB.formRuleMgr.length(1000)],
				"status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
			}
		},
		useRangeEvaluation: {
			vo: {
				id: null,
				//编码
				code: null,
				//变更等级 1:一般变更,2:重大变更
				level: null,
				//变更类别 1:工艺,2:设备
				changeType: null,
				//启用/禁用 0:启用,1:禁用
				disable: "0",
				//控制措施落实描述
				ctrlMeasureDesc: null,
				//控制措施落实意见 0:同意,1:不同意
				ctrlMeasureResult: null,
				//资料更新落实描述
				dataUpdateDesc: null,
				//资料更新落实意见 0:同意,1:不同意
				dataUpdateResult: null,
				//意见
				opinion: null,
				//状态 0:待提交,1:已提交
				status: null,
				//处理人
				user: { id: '', name: '' },
			},
			opType: 'view',
			isReadOnly: true,
			rules: {
				"code": [LIB.formRuleMgr.length(255)],
				"level": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("变更等级")),
				"changeType": LIB.formRuleMgr.require("变更类别"),
				"disable": LIB.formRuleMgr.require("状态"),
				"ctrlMeasureDesc": [LIB.formRuleMgr.length(1000)],
				"ctrlMeasureResult": [LIB.formRuleMgr.require("控制措施落实意见")].concat(LIB.formRuleMgr.allowIntEmpty),
				"dataUpdateDesc": [LIB.formRuleMgr.length(1000)],
				"dataUpdateResult": [LIB.formRuleMgr.require("资料更新落实意见")].concat(LIB.formRuleMgr.allowIntEmpty),
				"opinion": [LIB.formRuleMgr.length(500)],
				"status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"user.id": [LIB.formRuleMgr.allowStrEmpty],
			}
		},
		implementation: {
			vo: {
				id: null,
				//编码
				code: null,
				//启用/禁用 0:启用,1:禁用
				disable: "0",
				//实施结束时间
				implEndTime: null,
				//实施开始时间
				implStartTime: null,
				//实施情况
				presentation: null,
				//状态 0:待提交,1:已提交
				status: null,
				//提交时间
				submitTime: null,
				//处理人
				user: { id: '', name: '' },
			},
			opType: 'view',
			isReadOnly: true,
			rules: {
				"code": [LIB.formRuleMgr.length(255)],
				"disable": LIB.formRuleMgr.require("状态"),
				"implEndTime": [LIB.formRuleMgr.require("实施结束时间"), {
					validator: function (rule, val, callback) {
						var vo = dataModel.mainModel.vo;
						if (vo.implStartTime >= vo.implEndTime) {
								callback(new Error("开始时间应小于开始结束时间"))
						} else {
								callback()
						}
					}
				}],
				"implStartTime": [LIB.formRuleMgr.require("实施开始时间")],
				"presentation": [LIB.formRuleMgr.length(1000)],
				"status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"submitTime": [LIB.formRuleMgr.allowStrEmpty],
				"user.id": [LIB.formRuleMgr.allowStrEmpty],
			}
		},
		getItemList: [{
			num: 1,
			index: 0,
			name: "变更申请"
		},
		{
			num: 2,
			index: 1,
			name: "变更评估"
		},
		{
			num: 3,
			index: 2,
			name: "变更审批"
		},
		{
			num: 4,
			index: 3,
			name: "变更实施"
		},
		{
			num: 5,
			index: 4,
			name: "变更验收"
		},
		{
			num: 6,
			index: 5,
			name: "应用评估范围"
		}],
		replaceTable: {
			show: false,
			values: [
				{
					name: '阀门',
					same: '<div>同类型：闸阀一闸阀，截止阀一截止阀等</div>' +

						'<div>同类材料：碳钢一碳钢，不锈钢--不锈钢等</div>' +

						'<div>同等压力等级：15~15kg/cm2，30~30kg/cm2，60~60kg/cm2等</div>' +

						'<div>同尺寸：4"~4”，6"~6", 10"-10"等v' +

						'<div>同种填料：箔衬—箔衬，石墨一石墨，石棉绳—石棉绳</div>',
					diff: '<div>不同类型：闸阀一截止阀，闸阀一球阀等</div>' +

						'<div>不同材料：碳钢一不锈钢，碳钢一铬钢等</div>' +

						'<div>不同压力等级：30-15kg/cm2，30-45kg/cm2，30-60kg/cm2等</div>' +

						'<div>不同尺寸：4"〜6", 6"-8", 10"-12",等</div>' +

						'<div>不同填料：石墨一非石墨，绳—衬，衬—绳等</div>'
				},
				{
					name: '管道与法兰',
					same: '<div>同材料：碳钢—碳钢，不锈钢--不锈钢等</div>' +

						'<div>同压力等级：15～15kg/cm2，30～30kg/cm2，60～60kg/cm2等</div>',
					diff: '<div>不同材料：碳钢—不锈钢，碳钢—铬钢等</div>' +

						'<div>不同压力等级：30～15kg/cm2，30～45kg/cm2，30～60kg/cm2等</div>'
				},
				{
					name: '管道与法兰',
					same: '<div>同尺寸：4"～4",6"～6",10"～10",等</div>' +

						'<div>同类法兰密封面：凸面－凸面，对接－对接等</div>' +

						'<div>同厚度等级：管线厚度相同</div>' +

						'<div>临时管线——只是用在停用的设备上做清洗用途，在设备投运前应将其拆下</div>',
					diff: '<div>不同尺寸：4"～6",6"～8",10"～12",等</div>' +

						'<div>不同法兰密封面：凸面－对接，对接－凸面等</div>' +

						'<div>不同厚度等级：管线厚度不相同</div>' +

						'<div>临时管线——用于维持运行的、内部有工艺物料的管段，如内部有物料流的临时短管等</div>'
				},
				{
					name: '压缩机',
					same: '<div>相同的材料(包括内部材料)如：碳钢－碳钢，不锈钢－不锈钢等</div>' +

						'<div>相同法兰：压力等级，尺寸，密封面</div>' +

						'<div>相同能力：200～200m3/h,2000～2000m3/h,等</div>' +

						'<div>相同密封：允许不同的制造商， 但必须是同样的规格，同样的维护程序等</div>' +

						'<div>同样的润滑：允许不同的制造商，但必须是同样的规格</div>',
					diff: '<div>不同材料(包括内部材料)如：碳钢－不锈钢，不锈钢－碳钢等</div>' +

						'<div>不同法兰：压力等级，尺寸，密封面</div>' +

						'<div>不同能力：200～300m3/h,200～150m3/h,等</div>' +

						'<div>不同密封：不同的实际规格，不同的维护程序等</div>' +

						'<div>不同润滑：不同规格</div>'
				},
				{
					name: '物料',
					same: '<div>同样的物料：必须是完全相同，包括制造商，有同样的功能，进行同样的反应</div>',
					diff: '<div>不同物料：不同制造商，不同功能表现，或不同反应</div>'
				},
				{
					name: '仪表/电气',
					same: '<div>同量程：0-50～0-50，200-250～200-250，0-100%LEL～0-100%LEL等</div>' +

						'<div>同样放大倍数：X10－X10，X50－X50，等</div>' +

						'<div>同样单位：m3/h－m3/h，L/min－L/min等</div>' +

						'<div>同样的额定值：因流量、产品规格等变化，需要经常调整报警的上下限，但不超过最高和最低限值</div>' +

						'<div>同样功能：感温探测～感温探测，感烟探测～感烟探测；火焰探测～火焰探测</div>',
					diff: '<div>不同量程：0-50～0-100，250-300～250-500，等</div>' +

						'<div>不同放大倍数：X10－X20，X15－X2，等</div>' +

						'<div>不同单位：m3/h－L/min，L/min－m3/h等</div>' +

						'<div>不同额定值：改动压力、温度、流量、液位等的最高和最低限值</div>' +

						'<div>不同功能：对不同对象的探测等</div>'
				},
				{
					name: '其他',
					same: '<div>除应急系统与中央控制室以外的，其他电话号码的改变</div>' +

						'<div>更新工艺区标志牌</div>' +

						'<div>非工艺设备的移位</div>',
					diff: '<div>将原来设计中不应旁通或没有旁通程序的设备旁通</div>' +

						'<div>可能影响工艺操作的，对计算机软件或计算机控制方案的改动</div>' +

						'<div>改变中央控制室或紧急响应电话号码</div>' +

						'<div>移走工艺区内的标志牌</div>' +

						'<div>工艺设备或应急设备的移位</div>' +

						'<div>改变工艺说明，过程说明，或企业标准</div>' +

						'<div>临时维修(如：管卡、盘根、法兰临时泄漏修补，等)</div>' +

						'<div>临时或实验性设备</div>' +

						'<div>设备的拆除</div>' +

						'<div>工艺建筑内的通风设施安装，及旧通风系统的改造</div>' +

						'<div>工艺过程引入新的或改换不同的添加剂</div>' +

						'<div>根据工艺安全评估或其它工艺安全分析建议作的变更</div>' +

						'<div>因工艺或设备上的改变或改造，造成设备卸压变化</div>' +

						'<div>盛装工艺物料、添加剂或反应物的容器(包装)的替代,例如临时桶或槽</div>'
				},
			],
			columns: [{

				title: "工艺设备变更",
				fieldName: "name",
				width: 120,
				showTip:false,
			},
			{

				title: "同类替换",
				render: function (data) {
					return data.same
				},
				showTip:false,
				width: 450
			},
			{

				title: "非同类替换（变更）",
				render: function (data) {
					return data.diff
				},
				showTip:false,
				width: 450
			},]
		},
		deliver: {
			show: false
		},
		entrust: {
			show: false
		},
		approval: {
			show: false
		},
		detailTable: LIB.Opts.extendMainTableOpt(
			{
				url: "",
				show: false,
				showColumnPicker: false,
				columns: [
					{

						title: "步骤",
						fieldName: "content",

						width: 80
					},
					{

						title: "节点",
						fieldName: "content",

						width: 120
					},

					{

						title: "处理时间",
						fieldName: "content",

					},
					{

						title: "处理人",
						fieldName: "content",

					},
					{

						title: "处理过程描述",
						fieldName: "content",

						width: 600
					},

				]
			}
		),
		safeHealthy: [
			{
				index: 1,
				name: '是否存在任何易燃易爆化学物质或灰尘？',
				checkResult: null
			},
			{
				index: 2,
				name: '是否存在任何有危险的原材料流速、组分或温度条件变更？',
				checkResult: null
			},
			{
				index: 3,
				name: '是否具有为安全操作所必需的仪表、控制、紧急制动、开关或报警？检查操作人员通道所在地并实施监控。',
				checkResult: null
			},
			{
				index: 4,
				name: '是否有任何出于安全考虑而必须联锁的设备？',
				checkResult: null
			},
		],
		airList: [
			{
				index: 1,
				name: '增加了新的排放源？',
				checkResult: null
			},
			{
				index: 2,
				name: '更换/重建了现有排放源？',
				checkResult: null
			},
			{
				index: 3,
				name: '修改了现有排放源？',
				checkResult: null
			},
			{
				index: 4,
				name: '改变了排放点的相关参数？（高度、速度及横截面）',
				checkResult: null
			},
		],
		waterList: [
			{
				index: 1,
				name: '废水流入量增加了吗？',
				checkResult: null
			},
			{
				index: 2,
				name: '有新包含的化学品吗？（仅列出那些增加、减少或者新出现的)',
				checkResult: null
			},
			{
				index: 3,
				name: '是否需要测试新建废水处理能力？',
				checkResult: null
			},
			{
				index: 4,
				name: '排污流量增加了吗？',
				checkResult: null
			},
		],
		thingList: [
			{
				index: 1,
				name: '本项目的建设是否会导致任何废弃物的产生？',
				checkResult: null
			},
			{
				index: 2,
				name: '是否考虑了废弃物最小化的备选方案？',
				checkResult: null
			},
			{
				index: 3,
				name: '是否会构建新的废弃物管理工具，或者改进现有的废弃物管理工具？',
				checkResult: null
			},
			{
				index: 4,
				name: '本项目需要土方挖掘吗？',
				checkResult: null
			},
		],
		otherList: [
			{
				index: 1,
				name: '此项目是否考虑了地下水保护措施？',
				checkResult: null
			},
			{
				index: 2,
				name: '是否增加了温室气体(二氧化碳，甲烷，等等）排放？',
				checkResult: null
			},
			{
				index: 3,
				name: '此项目是否涉及任何拆除或者翻新项目？',
				checkResult: null
			},
			{
				index: 4,
				name: '需要的其他外部许可？（请列举)：',
				checkResult: null
			},
			{
				index: 5,
				name: '取得所有许可证的估测时间(如果需要)？',
				checkResult: null
			},
		],
		updateList: [
			{
				index: 1,
				name: '图表和图纸',
				checkResult: null
			},
			{
				index: 2,
				name: '操作程序工作惯例',
				checkResult: null
			},
			{
				index: 3,
				name: '风险台帐',
				checkResult: null
			},
			{
				index: 4,
				name: '入职培训程序',
				checkResult: null
			},
			{
				index: 5,
				name: '准则',
				checkResult: null
			},

			{
				index: 6,
				name: '作业许可系统',
				checkResult: null
			},
			{
				index: 7,
				name: '关键工艺参数',
				checkResult: null
			},
			{
				index: 8,
				name: '应急程序',
				checkResult: null
			},
			{
				index: 9,
				name: '检查和审核',
				checkResult: null
			},
			{
				index: 10,
				name: '维修程序',
				checkResult: null
			},
			{
				index: 11,
				name: '警告标识',
				checkResult: null
			},
			{
				index: 12,
				name: '危害因素台帐',
				checkResult: null
			},
			{
				index: 13,
				name: '资产台帐',
				checkResult: null
			},
			{
				index: 14,
				name: '人员变更台账',
				checkResult: null
			},
			{
				index: 15,
				name: '其他事项',
				checkResult: null
			},
		],
		showOther: false,
		showThing: false,
		showSafe: false,
		showAir: false,
		showWater: false,
		environmentEffict: null,
		safeEffict: null,
		safeDisabled: false,
		environmentDisabled: false,
		status: 0,
		principals: '',
		selectModel: {
			userSelectModel: {
				visible: false,
				filterData: { orgId: null }
			},
		},
		PecAuditRecords: [],
		fileList: [],
		uploadModel: {
			params: {
				recordId: null,
				dataType: 'PEC4',
				fileType: 'PEC'
			},
			filters: {
				max_file_size: '50mb',
				mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx" }]
			},
			// url: "/riskjudgmentunit/importExcel",
		},

		fileModel: {
			img: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'PEC5',
						fileType: 'PEC'
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{ title: "file", extensions: "png,jpg,jepg" }]
					}
				},
				data: []
			},
			vedio: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'PEC6',
						fileType: 'PEC'
					},
					filters: {
						max_file_size: '10mb',
						mime_types: [{ title: "file", extensions: "mp4" }],
						max_file_num: 1,
					}
				},
				data: []
			},
			file: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'PEC8',
						fileType: 'PEC'
					},
					filters: {
						max_file_size: '50mb',
						mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,word" }]
					}
				},
				data: []
			},
			default: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'PEC1',
						fileType: 'PEC'
					},
					filters: {
						max_file_size: '50mb',
						mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,word" }]
					}
				},
				data: []
			},
			other: {
				cfg: {
					params: {
						recordId: null,
						dataType: 'PEC2',
						fileType: 'PEC'
					},
					filters: {
						max_file_size: '50mb',
						mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,word" }]
					}
				},
				data: []
			}
		},
		candidates: [],
		isReturn: false,
		accprincipals: ''
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
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
		template: tpl,
		components: {
			'entrust': entrust,
			'deliver': deliver,
			'approval': approval,
			'userSelectModal': userSelectModal,
			'fileList': fileList

		},
		data: function () {
			return dataModel;
		},
		computed: {
			candidate: function () {
				var str = ''
				_.each(this.candidates, function (item) {
					str += item.username + ','
				})
				return str.substring(0, str.length - 1)
			},
			itemList:function(){
			
				if (this.mainModel.vo.bizType == 2 &&this.mainModel.vo.level==2&&this.mainModel.vo.status>0) {
				
					return	this.getItemList.slice(0,2)
				}else{
					return	this.getItemList
				}
				
			},
			isprincipal: function () {
				if (this.principals.indexOf(LIB.user.name) > -1) {
					return true
				} else {
					return false
				}
			},
			isaccprincipals: function () {
				if (this.accprincipals.indexOf(LIB.user.name) > -1) {
					return true
				} else {
					return false
				}
			},
		},
		watch: {
			environmentEffict: function (val) {
				this.mainModel.vo.pecDetail.envInfluence = val + ''
			},
			safeEffict: function (val) {
				this.mainModel.vo.pecDetail.safetyInfluence = val + ''
			},
			'mainModel.vo.mode': function (val) {
				
				if (val == '2') {
					this.mainModel.vo.changeDeadline = ''
				}
			},

		},
		methods: {
			doCancelChange: function () {
				this.status = 2
				this.isReturn = false
				this.changeView('view')
			},
			doChange: function () {
				var _this = this
				_this.status = 0
				this.changeView('update')
				this.isReturn = true
			},
			doStatusChange: function (val) {
				if (val > parseInt(this.mainModel.vo.status)) {
					return
				}
				var _this = this
				_this.status = val
				// api.queryCandidates({ id: this.mainModel.vo.id }).then(function (res) {
				// 	_this.candidates = res.data

				// })
			},
			doEdit: function () {
				this.mainModel.opType = 'update'
				this.mainModel.isReadOnly = false
			},
			doEdituseRangeEvaluation: function () {
				this.useRangeEvaluation.opType = 'update'
				this.useRangeEvaluation.isReadOnly = false
			},
			doEditacceptance: function () {
				this.acceptance.opType = 'update'
				this.acceptance.isReadOnly = false
			},
			doEditImplementation: function () {
				this.implementation.opType = 'update'
				this.implementation.isReadOnly = false
			},
			doEditAssessment: function () {
				this.pecAssessment.opType = 'update'
				this.pecAssessment.isReadOnly = false
			},
			getBizStyle: function (index) {
				if (index == parseInt(this.mainModel.vo.auditStatus)) {
					return 'background: url("images/step/01.png") no-repeat;background-size:100% 100%;color:white;'+"transform:translateX("+ parseInt(index-1)*(-8)+"px)"
				} else if (index <= parseInt(this.mainModel.vo.auditStatus)) {
					return 'background: url("images/step/02.png") no-repeat;background-size:100% 100%;color:white;'+"transform:translateX("+ parseInt(index-1)*(-8)+"px)"
				} else {
					return 'background: url("images/step/03.png") no-repeat;background-size:100% 100%;'+"transform:translateX("+ parseInt(index-1)*(-8)+"px)"
				}
			},
			doDeliver: function (vo) {
				var _this = this
				var data = {}
				if (this.mainModel.vo.status == 1) {
					data.operationType = 203
				} else if (this.mainModel.vo.status == 2) {
					data.operationType = 303
				} else if (this.mainModel.vo.status == 3) {
					data.operationType = 403
				} else if (this.mainModel.vo.status == 4) {
					data.operationType = 503
				}

				data.id = _this.mainModel.vo.id
				data.pecDelegateRecords = [vo]
				_this.$api.saveOperation(null, data).then(function (res) {
					LIB.Msg.info("移交成功");
					_this.$dispatch("ev_dtUpdate");
					_this.$dispatch("ev_dtClose");
					_this.deliver.show = false
				})
			},
			doApproval: function (vo) {
				var _this = this
				var data = {}

				data.operationType = 302


				data.id = _this.mainModel.vo.id
				data.pecAuditRecords = [vo]
				_this.$api.saveOperation(null, data).then(function (res) {
					LIB.Msg.info("审批成功");
					_this.$dispatch("ev_dtUpdate");
					_this.$dispatch("ev_dtClose");
					_this.approval.show = false
				})
			},
			doEntrust: function (vo) {
				var _this = this
				var data = {}
				if (this.mainModel.vo.status == 1) {
					data.operationType = 203
				} else if (this.mainModel.vo.status == 2) {
					data.operationType = 303
				} else if (this.mainModel.vo.status == 3) {
					data.operationType = 403
				} else if (this.mainModel.vo.status == 4) {
					data.operationType = 503
				}

				data.id = _this.mainModel.vo.id
				data.pecDelegateRecords = [vo]
				_this.$api.saveOperation(null, data).then(function (res) {
					LIB.Msg.info("委托成功");
					_this.$dispatch("ev_dtUpdate");
					_this.$dispatch("ev_dtClose");
					_this.entrust.show = false
				})
			},
			doSubmit: function () {

				if (this.mainModel.action === "copy") {
					this.doSave4Copy();
					return;
				}

				//当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoSave() === false) {
					return;
				}

				var _this = this;
				var _data = this.mainModel;
				var isValid = true
				_.each(this.$refs, function (item) {
					item.validate && item.validate(function (valid) {
						if (!valid) {
							isValid = false
						}
					})
				})
				if (isValid) {
					if (_this.afterFormValidate && !_this.afterFormValidate()) {
						return;
					}
					var _vo = _this.buildSaveData() || _data.vo;
					_vo.operationType = 102
					_this.$api.saveOperation(null, _vo).then(function (res) {
						//清空数据
						//_.deepExtend(_vo, _this.newVO());
						//_this.opType = "view";
						LIB.Msg.info("提交成功");
						_this.afterDoSave({ type: "U" }, res.body);
						// _this.changeView("view");
						_this.$dispatch("ev_dtUpdate");
						_this.$dispatch("ev_dtClose");
						_this.storeBeforeEditVo();
					});

				}
			},
			doRefresh:function(){
				 this.init("view", this.mainModel.vo.id)
			},
			afterInit: function () {
				var _this = this
				if (this.mainModel.opType == 'create') {
					api.getUUID().then(function (res) {
						_this.mainModel.vo.id = res.data
						_this.fileModel.default.cfg.params.recordId = res.data
						_this.fileModel.other.cfg.params.recordId = res.data
					})
					this.mainModel.vo.user=LIB.user
					this.mainModel.vo.orgId=LIB.user.orgId
				}
				this.isReturn = false
				this.showOther = false
				this.showThing = false
				this.showSafe = false
				this.showAir = false
				this.showWater = false
				this.fileList=[]
				Object.keys(this.mainModel.vo.pecDetail).forEach(function (key) {
					_this.mainModel.vo.pecDetail[key] = null
				})
				Object.keys(this.pecAssessment.vo).forEach(function (key) {
					_this.pecAssessment.vo[key] = null
				})
				Object.keys(this.implementation.vo).forEach(function (key) {
					_this.implementation.vo[key] = null
				})
				Object.keys(this.acceptance.vo).forEach(function (key) {
					_this.acceptance.vo[key] = null
				})
				Object.keys(this.useRangeEvaluation.vo).forEach(function (key) {
					_this.useRangeEvaluation.vo[key] = null
				})
				this.mainModel.vo.status = '0'
				this.status = '0'
				_.each(this.airList, function (item) {
					item.checkResult = null
				})
				_.each(this.waterList, function (item) {
					item.checkResult = null
				})
				_.each(this.updateList, function (item) {
					item.result = null
				})
				_.each(this.safeHealthy, function (item) {
					item.checkResult = null
				})
				_.each(this.thingList, function (item) {
					item.checkResult = null
				})
				_.each(this.otherList, function (item) {
					item.checkResult = null
				})
				this.safeDisabled = false
				this.environmentDisabled = false
			},

			afterInitData: function (val) {
				var _this = this
				
				if (this.mainModel.vo.status > '5'&&val.hasOwnProperty('status')) {
					this.status = '0'
				}else if (val.hasOwnProperty('status')) {
					this.status = this.mainModel.vo.status
				}else{
					this.$nextTick(function(){
						LIB.Msg.success('刷新成功')
					})
				}
				
				this.fileModel.default.cfg.params.recordId = this.mainModel.vo.id
				this.fileModel.other.cfg.params.recordId = this.mainModel.vo.id
				this.airList = _.filter(this.mainModel.vo.pecCheckItems, function (item) {
					return item.type == 2
				})
				this.waterList = _.filter(this.mainModel.vo.pecCheckItems, function (item) {
					return item.type == 3
				})
				this.safeHealthy = _.filter(this.mainModel.vo.pecCheckItems, function (item) {
					return item.type == 1
				})
				this.thingList = _.filter(this.mainModel.vo.pecCheckItems, function (item) {
					return item.type == 4
				})
				this.otherList = _.filter(this.mainModel.vo.pecCheckItems, function (item) {
					return item.type == 5
				})
				if (this.mainModel.vo.status >= '0') {

					this.$api.queryPecAssessment({ id: this.mainModel.vo.id }).then(function (res) {
						if (res.data) {
							if (res.data.hasOwnProperty('result')) {
								_.extend(_this.pecAssessment.vo, res.data);
								_this.pecAssessment.isReadOnly = true
								_this.pecAssessment.opType = 'view'
							}


						} else {
							_this.pecAssessment.isReadOnly = true
								_this.pecAssessment.opType = 'view'
							// _this.pecAssessment.isReadOnly = false
							// _this.pecAssessment.opType = 'create'
						}
					})
				}
				if (this.mainModel.vo.status >= '1'&& (this.mainModel.vo.bizType != 2 || this.mainModel.vo.level != 2)) {

					this.$api.queryPecAuditRecords({ id: this.mainModel.vo.id }).then(function (res) {
						_this.PecAuditRecords = res.data
					})
				}
				if (this.mainModel.vo.status >= '2'&& (this.mainModel.vo.bizType != 2 || this.mainModel.vo.level != 2)) {

					this.$api.queryPecImplementation({ id: this.mainModel.vo.id }).then(function (res) {
						_this.principals = ''
						if (res.data.hasOwnProperty('id')) {
							_.extend(_this.implementation.vo, res.data);
							_this.uploadModel.params.recordId = res.data.id
							_this.getFileList(res.data.id)
							_this.implementation.isReadOnly = true
							_this.implementation.opType = 'view'
						}
						else {
							_this.implementation.isReadOnly = true
							_this.implementation.opType = 'view'
							// _this.implementation.isReadOnly = false
							// _this.implementation.opType = 'create'
						}
						_.each(res.data.principals, function (item) {
							_this.principals += item.name + ','
						})
						_this.principals = _this.principals.substring(0, _this.principals.length - 1)
					})
				}
				if (this.mainModel.vo.status >= '3'&& (this.mainModel.vo.bizType != 2 || this.mainModel.vo.level != 2)) {
					this.$api.queryPecAcceptance({ id: this.mainModel.vo.id }).then(function (res) {
						_this.accprincipals = ''
						if (res.data.hasOwnProperty('id')) {
							_.extend(_this.acceptance.vo, res.data);
							_this.fileModel.img.cfg.params.recordId = res.data.id
							_this.fileModel.vedio.cfg.params.recordId = res.data.id
							_this.fileModel.file.cfg.params.recordId = res.data.id
							_this.$api.listFile({ recordId: res.data.id }).then(function (res) {
								if (!_this.afterInitFileData && !_.isEmpty(_this.fileModel)) {
									var fileTypeMap = {};
									_.each(_this.fileModel, function (item) {
										_.propertyOf(item)("cfg.params.dataType") && (fileTypeMap[item.cfg.params.dataType] = item);
									});

									_.each(res.data, function (file) {
										var fm = fileTypeMap[file.dataType];
										if (fm) {
											fm.data.push(LIB.convertFileData(file));
										}
									});
								} else {
									_this.afterInitFileData(res.data);
								}
							});
							if (res.data.pecAcceptDetails.length>0) {
								_this.updateList = res.data.pecAcceptDetails
							}
							_this.acceptance.isReadOnly = true
							_this.acceptance.opType = 'view'
						}
						else {
							// api.getUUID().then(function (res) {
							// 	_this.acceptance.vo.id = res.id
							// 	_this.fileModel.img.cfg.params.recordId = res.data
							// 	_this.fileModel.vedio.cfg.params.recordId = res.data
							// 	_this.fileModel.file.cfg.params.recordId = res.data
							// })
							_this.acceptance.isReadOnly = true
							_this.acceptance.opType = 'view'
							// _this.acceptance.isReadOnly = false
							// _this.acceptance.opType = 'create'
						}
						_.each(res.data.principals, function (item) {
							_this.accprincipals += item.name + ','
						})
						_this.accprincipals = _this.accprincipals.substring(0, _this.accprincipals.length - 1)
					})
				}
				if (this.mainModel.vo.status >= '4'&& (this.mainModel.vo.bizType != 2 || this.mainModel.vo.level != 2)) {

					this.$api.queryPecUseRangeEvaluation({ id: this.mainModel.vo.id }).then(function (res) {
						if (res.data) {

							if (res.data.hasOwnProperty('id')) {
								_.extend(_this.useRangeEvaluation.vo, res.data);
								_this.useRangeEvaluation.isReadOnly = true
								_this.useRangeEvaluation.opType = 'view'
							}


						}
						else {
							_this.useRangeEvaluation.isReadOnly = true
								_this.useRangeEvaluation.opType = 'view'
							// _this.useRangeEvaluation.isReadOnly = false
							// _this.useRangeEvaluation.opType = 'create'
						}
					})
				}
				
				
				if (this.mainModel.vo.status > 0) {
					api.queryCandidates({ id: this.mainModel.vo.id }).then(function (res) {
						_this.candidates = res.data

					})
				}
			},
			getFiles: function (file) {
			
				
				return  LIB.convertFilePath(LIB.convertFileData(file))
			  },
			doSubmitAssessmen: function () {
				var _this = this;
				var _vo = this.pecAssessment.vo
				if (this.$refs.assessmentform) {
					this.$refs.assessmentform.validate(function (valid) {
						if (valid) {
							var data = {}
							data.operationType = 202
							data.id = _this.mainModel.vo.id
							data.assessment = _vo
							_this.$api.saveOperation(null, data).then(function (res) {
								LIB.Msg.info("提交成功");
								_this.$dispatch("ev_dtUpdate");
								_this.$dispatch("ev_dtClose");

							})
						}
					})
				} else {
					var data = {}
					data.operationType = 202
					data.id = _this.mainModel.vo.id
					data.assessment = _vo
					_this.$api.saveOperation(null, data).then(function (res) {
						LIB.Msg.info("提交成功");
						_this.$dispatch("ev_dtUpdate");
						_this.$dispatch("ev_dtClose");

					})
				}

			},
			doSaveAssessment: function () {
				var _this = this;
				var _vo = this.pecAssessment.vo

				this.$refs.assessmentform.validate(function (valid) {
					if (valid) {
						var data = {}
						data.operationType = 201
						data.id = _this.mainModel.vo.id
						data.assessment = _vo
						_this.$api.saveOperation(null, data).then(function (res) {
							LIB.Msg.info("保存成功");
							_.deepExtend(_vo, res.data.assessment)
							_this.pecAssessment.opType = 'view'

							_this.pecAssessment.isReadOnly = true
							_this.$dispatch("ev_dtCreate");


						})
					}
				})
			},
			doSaveacceptance: function () {
				var _this = this;
				var _vo = this.acceptance.vo
				_vo.pecAcceptDetails = []
				var isChecked = true
				_.each(this.updateList, function (item) {
					if (item.result == null) {
						isChecked = false
					}
					_vo.pecAcceptDetails.push({
						name: item.name,
						result: item.result,
					})
				})
				if (!isChecked) {
					LIB.Msg.error('请选择确认项')
					return
				}
				this.$refs.acceptancerules.validate(function (valid) {
					if (valid) {
						var data = {}
						data.operationType = 501
						data.id = _this.mainModel.vo.id
						data.acceptance = _vo
						_this.$api.saveOperation(null, data).then(function (res) {
							LIB.Msg.info("保存成功");
							_.deepExtend(_vo, res.data.acceptance)
							_this.acceptance.opType = 'view'

							_this.acceptance.isReadOnly = true
							_this.$dispatch("ev_dtCreate");


						})
					}
				})
			},
			doSubmitacceptance: function () {
				var _this = this;
				var _vo = this.acceptance.vo
				_vo.pecAcceptDetails = []
				var isChecked = true
				_.each(this.updateList, function (item) {
					if (item.result == null) {
						isChecked = false
					}
					_vo.pecAcceptDetails.push({
						name: item.name,
						result: item.result,
					})
				})
				if (!isChecked) {
					LIB.Msg.error('请选择确认项')
					return
				}
				this.$refs.acceptancerules.validate(function (valid) {
					if (valid) {
						var data = {}
						data.operationType = 502
						data.id = _this.mainModel.vo.id
						data.acceptance = _vo
						_this.$api.saveOperation(null, data).then(function (res) {
							if (_this.isaccprincipals) {
								LIB.Msg.info("提交成功");
							} else {
								LIB.Msg.info("提交负责人成功");
							}

							_.deepExtend(_vo, res.data.acceptance)
							_this.acceptance.opType = 'view'

							_this.acceptance.isReadOnly = true
							_this.$dispatch("ev_dtCreate");


						})
					}
				})
			},
			doSubmitImplementation: function () {
				var _this = this;
				var _vo = this.implementation.vo
				if (this.fileList.length==0) {
					LIB.Msg.error('请上传培训告知记录')
					return 
				}
				if (this.$refs.implementationrules) {
					this.$refs.implementationrules.validate(function (valid) {
						if (valid) {
							var data = {}
							data.operationType = 402
							data.id = _this.mainModel.vo.id
							data.implementation = _vo
							_this.$api.saveOperation(null, data).then(function (res) {
								if (_this.isprincipal) {
									LIB.Msg.info("提交成功");
								} else {
									LIB.Msg.info("提交负责人成功");
								}


								_this.$dispatch("ev_dtUpdate");
								_this.$dispatch("ev_dtClose");

							})
						}
					})
				}
			},
			doSaveImplementation: function () {
				var _this = this;
				var _vo = this.implementation.vo
				if (this.fileList.length==0) {
					LIB.Msg.error('请上传培训告知记录')
					return 
				}
				this.$refs.implementationrules.validate(function (valid) {
					if (valid) {
						var data = {}
						data.operationType = 401
						data.id = _this.mainModel.vo.id
						data.implementation = _vo
						_this.$api.saveOperation(null, data).then(function (res) {
							LIB.Msg.info("保存成功");
							_.extend(_vo, res.data.implementation)
							_this.implementation.opType = 'view'

							_this.implementation.isReadOnly = true
							_this.$dispatch("ev_dtCreate");


						})
					}
				})
			},
			doSubmituseRangeEvaluation: function () {
				var _this = this;
				var _vo = this.useRangeEvaluation.vo

				this.$refs.userange.validate(function (valid) {
					if (valid) {
						var data = {}
						data.operationType = 602
						data.id = _this.mainModel.vo.id
						data.useRangeEvaluation = _vo
						_this.$api.saveOperation(null, data).then(function (res) {
							LIB.Msg.info("提交成功");
							_.deepExtend(_vo, res.data.useRangeEvaluation)
							_this.useRangeEvaluation.opType = 'view'

							_this.useRangeEvaluation.isReadOnly = true
							_this.$dispatch("ev_dtUpdate");
							_this.$dispatch("ev_dtClose");

						})
					}
				})
			},
			doSaveuseRangeEvaluation: function () {
				var _this = this;
				var _vo = this.useRangeEvaluation.vo

				this.$refs.userange.validate(function (valid) {
					if (valid) {
						var data = {}
						data.operationType = 601
						data.id = _this.mainModel.vo.id
						data.useRangeEvaluation = _vo
						_this.$api.saveOperation(null, data).then(function (res) {
							LIB.Msg.info("保存成功");
							_.deepExtend(_vo, res.data.useRangeEvaluation)
							_this.useRangeEvaluation.opType = 'view'

							_this.useRangeEvaluation.isReadOnly = true
							_this.$dispatch("ev_dtCreate");


						})
					}
				})
			},
			doSave: function (val) {

				if (this.mainModel.action === "copy") {
					this.doSave4Copy();
					return;
				}

				//当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoSave() === false) {
					return;
				}

				var _this = this;
				var _data = this.mainModel;
				var isValid = true
				var i = 0
				
				_.each(this.$refs, function (item) {
					item.validate && item.validate(function (valid) {
						
						if (!valid) {
							isValid = false
						}else{
							i++
						}
						
					
					})

				})
				if (isValid ) {
						
					if (_this.afterFormValidate && !_this.afterFormValidate()) {
						return;
					}
					this.showOther = false
					this.showThing = false
					this.showSafe = false
					this.showAir = false
					this.showWater = false
					var _vo = _this.buildSaveData() || _data.vo;

					if (val == 301) {
						_vo.operationType = val
					} else {
						_vo.operationType = 101
					}

					_this.$api.saveOperation(null, _vo).then(function (res) {
						//清空数据
						//_.deepExtend(_vo, _this.newVO());
						//_this.opType = "view";
						LIB.Msg.info("保存成功");
						_data.vo.id = res.data.id;
						_.extend(_data.vo, res.data)
						_this._getResultCodeByRequest(res.data.id);
						_this.afterDoSave({ type: "C" }, res.body);
						if (_this.fileModel) {
							_.each(_this.fileModel, function (item) {
								item.cfg && item.cfg.params && (item.cfg.params.recordId = _data.vo.id);
							});
						}
						_this.changeView("view");
						_this.$dispatch("ev_dtCreate");
						_this.storeBeforeEditVo();
					});


				}


			},
			beforeDoSave: function () {
				var _this = this
				var isRequired = false
				if (this.mainModel.vo.pecCheckItems.length == 0) {
					_.each(this.airList, function (item) {

						if (item.checkResult == null) {
							isRequired = true
							return false
						} else {
							_this.mainModel.vo.pecCheckItems.push({
								name: item.name,
								checkResult: item.checkResult,
								type: 2
							})
						}
					})
					_.each(this.waterList, function (item) {
						if (item.checkResult == null) {
							isRequired = true
							return false
						} else {
							_this.mainModel.vo.pecCheckItems.push({
								name: item.name,
								checkResult: item.checkResult,
								type: 3
							})
						}
					})
					_.each(this.safeHealthy, function (item) {
						if (item.checkResult == null) {
							isRequired = true
							return false
						} else {
							_this.mainModel.vo.pecCheckItems.push({
								name: item.name,
								checkResult: item.checkResult,
								type: 1
							})
						}
					})
					_.each(this.thingList, function (item) {
						if (item.checkResult == null) {
							isRequired = true
							return false
						} else {
							_this.mainModel.vo.pecCheckItems.push({
								name: item.name,
								checkResult: item.checkResult,
								type: 4
							})
						}
					})
					_.each(this.otherList, function (item) {
						if (item.checkResult == null) {
							isRequired = true
							return false
						} else {
							_this.mainModel.vo.pecCheckItems.push({
								name: item.name,
								checkResult: item.checkResult,
								type: 5
							})
						}
					})
					if (isRequired) {
						_this.mainModel.vo.pecCheckItems = []
						LIB.Msg.error('请填写变更检查表')
						return false
					}
				} else {
					_.each(this.mainModel.vo.pecCheckItems, function (item) {
						item.pecApplication = null
					})
				}

			},
			doSaveUser: function (selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
					this.mainModel.vo.orgId = selectedDatas[0].orgId
				}
			},
			doShowUserSelectModal: function () {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			newVO: newVO,
			doPreview: function () {
				this.$emit("do-preview", { pecapplication: this.mainModel.vo, 
					pecAssessment: this.pecAssessment.vo,
					 acceptance: this.acceptance.vo ,
					 implementation: this.implementation.vo,
					 accprincipals:this.accprincipals,
					 principals:this.principals});
			},

			getStyle: function (item) {

				if (item.index == parseInt(this.status)) {
					return 'background:#8BCC1E;cursor: pointer;'
				} else if (item.index <= parseInt(this.mainModel.vo.status)) {
					return 'background:#C0EB7A;cursor: pointer;'
				} else {
					return "background:#D8D8D8;"
				}

			},
			getFontStyle: function (item) {
				if (item.index == parseInt(this.status)) {
					return 'color:#8BCC1E;'
				} else if (item.index <= parseInt(this.mainModel.vo.status)) {
					return 'color:#C0EB7A;'
				} else {
					return "color:#666;"
				}

			},
			getLineStyle: function (item) {
				if (item.index == parseInt(this.status)) {
					return 'border-bottom: 2px solid #8BCC1E;'
				} else if (item.index <= parseInt(this.mainModel.vo.status)) {
					return 'border-bottom: 2px solid #C0EB7A;'
				} else {
					return "border-bottom: 2px solid #D8D8D8;"
				}

			},
			doDelete: function () {

				//当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoDelete() === false) {
					return;
				}

				var _vo = this.mainModel.vo;
				var _this = this;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						_this.$api.remove(null, { id: _vo.id, orgId: _vo.orgId }).then(function () {
							_this.afterDoDelete(_vo);
							_this.$dispatch("ev_dtDelete");
							LIB.Msg.info("删除成功");
						});
					}
				});
			},
			safeClick: function (i, val, key) {
				// this[key][i].checkResult = val

				this.$set(key, this[key])
				if (key == 'updateList') {
					return
				}
				if (key == 'safeHealthy' && val == 1) {
					this.safeEffict = 1
					this.safeDisabled = true
				} else if (key == 'safeHealthy' && val !== 1) {
					var count = 0
					_.each(this[key], function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					if (count > 0) {
						this.safeEffict = 1
					} else {
						this.safeEffict = null
						this.safeDisabled = false
					}
				}
				if (key !== 'safeHealthy' && val == 1) {
					this.environmentEffict = 1
					this.environmentDisabled = true
				} else if (key !== 'safeHealthy' && val !== 1) {
					var count = 0
					_.each(this.airList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					_.each(this.waterList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					_.each(this.thingList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					_.each(this.otherList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					if (count > 0) {
						this.environmentEffict = 1
					} else {
						this.environmentEffict = null
						this.environmentDisabled = false
					}
				}
			},
			changeSafe: function (val, key, change) {
				_.each(this[key], function (item) {
					item.checkResult = val
				})
				this[change] = false
				if (key == 'safeHealthy' && val == 1) {
					this.safeEffict = 1
					this.safeDisabled = true
				} else if (key == 'safeHealthy' && val !== 1) {
					this.safeDisabled = false
					this.safeEffict = null
				}
				if (key !== 'safeHealthy' && val == 1) {
					this.environmentEffict = 1
					this.environmentDisabled = true
				} else if (key !== 'safeHealthy' && val !== 1) {
					var count = 0
					_.each(this.airList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					_.each(this.waterList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					_.each(this.thingList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					_.each(this.otherList, function (item) {
						if (item.checkResult == 1) {
							count++
						}
					})
					if (count > 0) {
						this.environmentEffict = 1

					} else {
						this.environmentEffict = null
						this.environmentDisabled = false
					}

				}
			},
			// ------------------- 文件 ---------------------
			getFileList: function (id) {
				var _this = this;
				api.getFileList({ recordId: id }).then(function (res) {
					_this.fileList = res.data;
				})
			},
			uploadClicked: function () {
				this.$refs.uploader.$el.firstElementChild.click();
			},
			doUploadBefore: function () {
				LIB.globalLoader.show();
			},
			doUploadSuccess: function (param) {
				var con = param.rs.content;
				this.fileList.push(con);
				if (this.implementation.vo.presentation) {
					this.implementation.vo.presentation += '培训告知已完成'
				} else {
					this.implementation.vo.presentation = '培训告知已完成'
				}

				LIB.globalLoader.hide();
			},
			onUploadComplete: function () {
				LIB.globalLoader.hide();
			},
			removeFile: function (fileId, index) {
				var _this = this;
				LIB.Modal.confirm({
					title: "确定删除文件？",
					onOk: function () {
						api.deleteFile(null, [fileId]).then(function () {
							_this.fileList.splice(index, 1);
						})
					}
				});
			},
			doClickFile: function (index) {
				var files = this.fileList;
				var file = files[index];
				window.open("/file/down/" + file.id)

			},
		},
		events: {
		},
		init: function () {
			this.$api = api;

		}
	});
	return detail;
});