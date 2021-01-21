/**
 * 统计查询--方案相关常量
 */
define(function (require) {
	var LIB = require('lib');

	var scheme = {
		//统计项目-对象范围
		items: [
			{
				value: 'person',
				label: LIB.lang('gb.common.checkUser')
			},
			{
				value: 'equip',
				label: LIB.lang('gb.common.areafacility')
			},
			{
				value: 'checkItem',
				label: LIB.lang('bs.bac.sp.ci'),
				children: [
					{ value: '1', label: LIB.lang('gb.common.unqualifiedi') },
					{ value: '2', label: LIB.lang('gb.common.passRate') }
				]
			},
			{
				value: 'rectification',
				label: LIB.lang('gb.common.rectification'),
				children: [
					{ value: '1', label: LIB.lang('gb.common.rectificationr') },
					{ value: '2', label: LIB.lang('gb.common.withoutr') }
				]
			},
			{
				value: 'taskPlan',
				label: LIB.lang('gb.common.planningt'),
				children: [
					{
						value: '1',
						label: LIB.lang('gb.common.actuali')
					},
					{
						value: '2',
						label: LIB.lang('gb.common.overduee')
					}
				]
			}
		],
		typeOfRanges: {
			"0": [
				{ value: "frw", label: LIB.lang('gb.common.company') },
				{ value: "dep", label: LIB.lang('gb.common.dept') }
			],
			"1": [
				{ value: "frw", label: LIB.lang('gb.common.company') },
				{ value: "dep", label: LIB.lang('gb.common.dept') },
				{ value: "per", label: LIB.lang('bs.orl.personnel') }
			],
			"2": [
				{ value: "frw", label: LIB.lang('gb.common.company') },
				{ value: "dep", label: LIB.lang('gb.common.dept') },
				//{value:"obj",label:'受检对象'},
				{
					value: "equip", label: LIB.lang('gb.common.equipmentAndFacilities')
				}
			]
		},
		urlOfRange: {
			frw: 'organization/list',//公司
			dep: 'organization/list',//部门
			per: 'organization/list',//人员
			obj: 'organization/list'//受检对象
		},
		//项目指标
		indicators: {
			checkItem: [
				{ value: '1', label: LIB.lang('gb.common.unqualifiedi') },
				{ value: '2', label: LIB.lang('gb.common.passRate') }
			],
			rectification: [
				{ value: '1', label: LIB.lang('gb.common.rectificationr') },
				{ value: '2', label: LIB.lang('gb.common.withoutr') }
			]
		},
		//数据来源
		sourceInfos: [
			{ value: '0', label: LIB.lang('gb.common.whole') },
			{ value: '1', label: LIB.lang('gb.common.samplingi') }
		]
	};
	return scheme;
});