define(function (require) {

    var getTime = function (day) {
        var date = new Date();
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * day);
        return date;
    };

    // 检查表
    var tables = [
        {id: "1", name: "商铺作业管理", level: "3", dynamicLevel: "3"},
        {id: "2", name: "建筑工地内业", level: "3", dynamicLevel: "3"},
        {id: "3", name: "建筑工地设备设施管理", level: "3", dynamicLevel: "2"},
        {id: "4", name: "建筑工地作业管理", level: "3", dynamicLevel: "2"},
        {id: "5", name: "燃气场站危险作业管理", level: "3", dynamicLevel: "2"},
        {id: "6", name: "燃气管道巡检管理", level: "2", dynamicLevel: "1"},
        {id: "7", name: "燃气场站卸车作业管理", level: "2", dynamicLevel: "1"},
        {id: "8", name: "煤气站设备设施管理", level: "2", dynamicLevel: "2"},
        {id: "9", name: "加气站作业管理", level: "2", dynamicLevel: "3"},
        {id: "10", name: "加气站设备设施管理", level: "2", dynamicLevel: "2"}
    ];

    // 坐标点
    var stations = [
        {
            name: '东城置地',
            id: '1',
            level: '1',
            riskLevel: '3',
            x: 109.563302,
            y: 24.384149
        },

        {
            name: '工程管理部',
            x:109.562875,
            y: 24.383486,
            level: '3',
            riskLevel: '1',
            parentId: '1',
            id: '301'
        },
        {
            name: '市场营销部',
            x: 109.562875,
            y: 24.383816,
            level: '3',
            riskLevel: '3',
            parentId: '1',
            id: '401'
        },
        {
            name: '公司领导',
            x: 109.562875,
            y: 24.38504,
            level: '3',
            riskLevel: '2',
            parentId: '1',
            id: '601'
        },
        {
            name: '中燃燃气',
            id: '2',
            level: '1',
            riskLevel: '3',
            x: 109.412159,
            y: 24.327682
        },
        {
            name: '安全技术监察部',
            x: 109.411727,
            y: 24.327478,
            level: '3',
            riskLevel: '2',
            parentId: '2',
            id: '2001'
        },
        {
            name: '生产运营部',
            x: 109.411727,
            y: 24.326986,
            level: '3',
            riskLevel: '1',
            parentId: '2',
            id: '701'
        },
        {
            name: '综合管理部',
            x: 109.411727,
            y: 24.328166,
            level: '3',
            riskLevel: '3',
            parentId: '2',
            id: '801'
        },
        {
            name: '企业管理部',
            x: 109.411727,
            y: 24.327992,
            level: '3',
            riskLevel: '2',
            parentId: '2',
            id: '1001'
        }
    ];

    var dataRanges = [
        {
            id: '1',
            value: '最近十次检查',
            param: {
                startDate: null,
                endDate: null,
                count: 10
            }
        }, {
            id: '2',
            value: '最近一周检查',
            param: {
                startDate: getTime(7),
                endDate: new Date(),
                count: null
            }
        }, {
            id: '3',
            value: '最近一月检查',
            param: {
                startDate: getTime(30),
                endDate: new Date(),
                count: null
            }
        },
        {
            id: '4',
            value: '最近季度检查',
            param: {
                startDate: getTime(30 * 3),
                endDate: new Date(),
                count: null
            }
        },
        {
            id: '5',
            value: '最近半年检查',
            param: {
                startDate: getTime(30 * 6),
                endDate: new Date(),
                count: null
            }
        },
        {
            id: '6',
            value: '最近一年检查',
            param: {
                startDate: getTime(365),
                endDate: new Date(),
                count: null
            }
        }
    ];

    // 静态风险
    var risks = [
        {
            id: '3',
            level: '3',
            num: 5,
            name: '高'
        },
        {
            id: '2',
            level: '2',
            num: 5,
            name: '中'
        },
        {
            id: '1',
            level: '1',
            num: 0,
            name: '低'
        }
    ];

    // 动态风险
    var dynamicRisks = [
        {
            id: '3',
            level: '3',
            num: 3,
            name: '高'
        },
        {
            id: '2',
            level: '2',
            num: 5,
            name: '中'
        },
        {
            id: '1',
            level: '1',
            num: 2,
            name: '低'
        }
    ];

    // 检查项
    // attr2: 风险等级
    // riskLevel: 风险等级名称
    var checkItems = [
        {
            attr2: "3",
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "高风险",
            scene: "按消防规范要求进行安全投入，建设或增加消防系统，通过消防验收后补办法律手续充分梳理既有商铺建筑物现状，实施遵法合规分析、决策，充分规避法律风险",
            parentId: '1'
        },
        {
            attr2: "2",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "中风险",
            scene: "设立与本企业规模相符的安全管理机构"
        },
        {
            attr2: "1",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "各方签订安全管理协议，协议内容具体，界面清晰"
        },
        {
            attr2: "2",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "中风险",
            scene: "各层级人员制订并落实安全检查，确保留有管理痕迹"
        },
        {
            attr2: "1",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "按隐患排查治理“五定”程序，闭环记录"
        },
        {
            attr2: "3",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "高风险",
            scene: "安全生产会议应当研究本单位安全生产工作；制定有效的安全生产措施，并对措施的落实情况进行检查。"
        },
        {
            attr2: "1",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "建立安全投入台账并定期核查"
        },
        {
            attr2: "2",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "中风险",
            scene: "制定新员工安全教育培训计划。确保员工参与培训实施新员工安全教育培训"
        },
        {
            attr2: "1",
            parentId: '1',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "对特种作业人员实施专门培训机构的安全培训，并取得相应资格证书"
        },

        {
            attr2: "3",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "静电接地夹、静电触摸球（如有）是否有效"
        },
        {
            attr2: "3",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "一次油气回收口及其他卸油口是否有效密闭"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "抽查卸油管静电是否导通"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "检查卸油管是否完好"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "卸油口附近是否无杂草等可燃物"
        },
        {
            attr2: "3",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "卸油时是否不用倒车就能到达卸油区域"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "是否有符合实际的卸油路线指引图张贴于卸油区"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "安全带、安全帽是否完好在有效期内"
        },
        {
            attr2: "3",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "卸油区是否无明显坡度"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "卸油区灭火器是否完好有效"
        },
        {
            attr2: "1",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "防雷检测是否在有效期内"
        },
        {
            attr2: "2",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "CCTV是否可以清晰看到卸油口及车身拆接管情况"
        },
        {
            attr2: "1",
            parentId: '2',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "近6个月未发生过任何油车在卸油区的擦碰、泄漏、油气回收系统不畅或其他事件"
        },
        {
            attr2: "2",
            parentId: '7',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "中风险",
            scene: "前庭未出现1名员工服务多车的情况"
        },
        {
            attr2: "2",
            parentId: '7',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "中风险",
            scene: "油岛之间不可供2个以上轿车通行（含加油车位）"
        },
        {
            attr2: "2",
            parentId: '7',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "中风险",
            scene: "是否有STOP提示杆或提示牌"
        },
        {
            attr2: "1",
            parentId: '7',
            hazardFactor: {
                name: "作业场所"
            },
            riskLevel: "低风险",
            scene: "近6个月是否没有发生过逃单或拉断阀事件"
        }
    ];

    var chartData = [
        {level: "2", date: "2018-05-02 18:01:47"},
        {level: "1", date: "2018-04-29 20:14:13"},
        {level: "3", date: "2018-04-27 15:54:25"},
        {level: "2", date: "2018-04-15 05:46:42"},
        {level: "2", date: "2018-04-11 09:29:37"},
        {level: "1", date: "2018-04-02 18:15:35"},
        {level: "3", date: "2018-04-01 19:32:13"},
        {level: "2", date: "2018-03-29 16:51:22"},
        {level: "3", date: "2018-03-29 14:47:31"},
        {level: "1", date: "2018-03-29 13:04:18"}
    ];

    // 风险等级模型
    var riskPojos = [
        {
            level: '3',
            label: '高',
            color: "#ff0000"
        },
        {
            level: '2',
            label: '中',
            color: "#e5e514"
        },
        {
            level: '1',
            label: '低',
            color: "#0033cc"
        }
    ];

    var zoomLevelMap = {
        "1": 13,
        "3": 19
    };
    var dataObj = {
        tables: tables,
        stations: stations,
        dataRanges: dataRanges,
        risks: risks,
        dynamicRisks: dynamicRisks,
        checkItems: checkItems,
        chartData: chartData.reverse(),
        riskPojos: riskPojos,
        minZoom: 13,
        maxZoom: 19,
        zoomLevelMap: zoomLevelMap,
        centerCity: '柳州',  // 中心城市
        boundary: '柳州市' // 高亮区域
    };

    return dataObj;
});