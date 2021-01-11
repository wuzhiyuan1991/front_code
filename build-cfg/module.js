define({
    modules: [
        "views/businessFiles/hiddenDanger/checkItem/main", // 检查项
        "views/businessFiles/hiddenDanger/checkList/main", // 检查表
        "views/businessFiles/equipment/equipment/main", // 设备设施
        "views/businessFiles/hiddenDanger/subjectObject/main",
        "views/businessFiles/riskAssessment/accidentCase/main", // 事故案例
        "views/businessFiles/leadership/asmtBasis/main", // 自评依据
        "views/businessFiles/leadership/asmtTable/main", // 自评表
        "views/businessFiles/riskAssessment/checkMethod/main", // 检查方法
        "views/businessFiles/riskAssessment/inspectionBasis/main", // 检查依据
        "views/businessFiles/riskAssessment/riskFactors/main",
        "views/businessFiles/riskAssessment/riskAssessment/main",  // 危害辨识
        "views/businessFiles/trainingManagement/course/main",  // 课程管理
        "views/businessFiles/trainingManagement/examPaper/main",  // 试卷管理
        "views/businessFiles/trainingManagement/question/main",  // 试题管理
        "views/businessFiles/trainingManagement/examPoint/main",  // 知识点管理
        "views/businessFiles/trainingManagement/teacher/main",  // 讲师管理
        "views/businessFiles/trainingManagement/matrix/main",  // 培训矩阵
        "views/businessCenter/hiddenDanger/checkRecord/main",  // 检查记录
        "views/businessCenter/hiddenDanger/inspectionPlan/main",  // 检查计划
        "views/businessCenter/hiddenDanger/inspectionTask/main",  // 检任务
        "views/businessCenter/hiddenDanger/radomObser/main",  // 随机观察
        "views/businessCenter/hiddenGovernance/reform/main",  // 隐患整改
        "views/businessCenter/hiddenGovernance/regist/main",  // 隐患登记
        "views/businessCenter/hiddenGovernance/setting/main",
        "views/businessCenter/hiddenGovernance/total/main",   // 隐患总表
        "views/businessCenter/hiddenGovernance/verify/main",  // 隐患验证
        "views/businessCenter/trainingManagement/trainingPlan/main",  // 培训计划
        "views/businessCenter/trainingManagement/offlineTrain/main",  // 线下培训
        "views/businessCenter/trainingManagement/myTraining/main",  // 我的培训
        "views/businessCenter/trainingManagement/courseCenter/main",  // 选修课程
        "views/businessCenter/trainingManagement/testCenter/main",  // 我的考试
        "views/businessCenter/trainingManagement/errorRecord/main",  // 错题记录
        "views/businessCenter/trainingManagement/exam/main",  // 考试计划
        "views/businessCenter/trainingManagement/courseFile/main",  // 课程档案
        "views/businessCenter/trainingManagement/userFile/main",  // 员工档案
        "views/businessCenter/trainingManagement/examFile/main",  // 考试档案
        "views/businessCenter/leadership/asmtPlan/main",  // 自评计划
        "views/businessCenter/leadership/asmtTask/main",  // 自评任务
        "views/businessCenter/leadership/asmtShare/main",  // 自评分享
        "views/basicSetting/basicSetting/I18nList/main",  // 国际化
        "views/basicSetting/basicSetting/licence/main",  // 软件授权
        "views/basicSetting/basicSetting/mailbox/main",   // 邮箱配置
        "views/basicSetting/noticeMa/main",  // 发消息
        "views/basicSetting/basicSetting/parameter/main",  // 参数配置
        "views/basicSetting/basicSetting/reminderSettings/main",  // 提醒设置
        "views/basicSetting/basicSetting/setUp/main",
        "views/basicSetting/basicFile/businessMenu/main",  // 业务分类
        "views/basicSetting/dataSecurity/Loglog/main",  // 登录日志
        "views/basicSetting/dataSecurity/MailLog/main",  // 邮件日志
        "views/basicSetting/dataSecurity/onlineUser/main",  // 在线用户
        "views/basicSetting/dataSecurity/OperationLog/main",  // 操作日志
        "views/basicSetting/dataSecurity/safeRule/main",  // 安全规则
        "views/basicSetting/menuMa/main",  // 菜单管理
        "views/basicSetting/quartzMa/main",  // 定时任务
        "views/basicSetting/systemSetting/menuFuncMgr/main",  // 菜单功能权限
        "views/basicSetting/systemSetting/lookupMgr/main",   // lookup
        "views/basicSetting/systemSetting/dataAuthSetting/main",  // 数据权限
        "views/basicSetting/systemSetting/authcode/main",  // 功能权限码
        "views/basicSetting/systemSetting/sysRoleManagement/main",  // 系统权限管理
        "views/basicSetting/systemSetting/compRoleManagement/main",  // 公司权限管理
        "views/basicSetting/systemSetting/superadminFunc/main",  // 超管功能
        "views/basicSetting/organizationalInstitution/CompanyFi/main",  // 公司档案
        "views/basicSetting/organizationalInstitution/DepartmentalFi/main",  // 部门档案
        "views/basicSetting/organizationalInstitution/HseRole/main",  // 安全角色
        "views/basicSetting/organizationalInstitution/PersonnelFi/main",  // 人员维护
        "views/basicSetting/organizationalInstitution/PostManagement/main", // 岗位管理
        "views/basicSetting/organizationalInstitution/RoleManagement/main", // 角色管理
        "views/basicSetting/excitationMechanism/mechanismSetting/main",
        "views/businessCenter/hiddenGovernance/modeler/main", // 工作流
        "views/businessCenter/hiddenGovernance/condition/main", // 工作流条件
        "views/businessCenter/hiddenGovernance/process/main", // 工作流流程
        "views/basicSetting/basicSetting/lookup/main",
        "views/reportManagement/home/main",
        "views/reportManagement/reportDynamic/main",
        "views/reportManagement/riskControl/main",
        "views/reportManagement/improvedTrending/main",
        "views/reportManagement/riskWarning/main",
        "views/reportManagement/keyData/main",
        "views/reportManagement/shareReport/settingsOfShare/main",
        "views/reportManagement/leadership/main",
        "views/reportManagement/keyPost/main",
        "views-audit/businessCenter/safetyAudit/auditPlan/main", // 审查计划
        "views-audit/businessCenter/safetyAudit/auditScore/main", // 审查评分
        "views-audit/businessCenter/safetyAudit/auditConfirm/main", // 结果确认
        "views-audit/businessCenter/safetyAudit/auditStatistics/main", // 审查统计
        "views-audit/businessFiles/safetyAudit/auditTable/main", // 审查表
        "views-audit/tabs/allot/main", // 安全审查
        "views-audit/tabs/confirm/main", // 安全审查确认
        "views-audit/tabs/grade/main", // 安全审查评分
        "views-audit/tabs/table/main", // 安全审查表
        "views/home/main",
        "views/home/work/main", // 工作任务
        "views/home/notice/main", // 公告
        "views/businessFiles/apanageManagement/dominationArea/main", // 属地
        "views/businessFiles/majorRiskSource/baseChemicalObjCatalog/main", // 基础化学品
        "views/businessFiles/majorRiskSource/majorChemicalObj/main", // 重点化学工艺
        "views/businessFiles/majorRiskSource/majorChemicalProcess/main", // 重点危化品
        "views/businessFiles/majorRiskSource/majorRiskSource/main", // 重大危险源
        "views/businessFiles/majorRiskSource/nomalChemicalObj/main", // 一般危化品
        "views/businessCenter/hiddenDanger/notPlanCheckRecord/main", // 非计划检查记录
        "views/businessFiles/routingInspection/riCheckResult/main", // 巡检结果
        "views/businessFiles/routingInspection/riCheckTable/main",  // 巡检表
        "views/businessFiles/routingInspection/riCheckType/main", // 巡检类型
        "views/businessFiles/routingInspection/riCheckPointTpl/main", // 巡检点
        "views/businessFiles/routingInspection/riCheckAreaTpl/main", // 巡检区域
        "views/businessCenter/routingInspection/riCheckPlan/main", // 巡检几乎
        "views/businessCenter/routingInspection/riCheckRecord/main", // 巡检记录
        "views/businessCenter/routingInspection/riCheckTask/main", // 巡检任务
        "views/businessFiles/routingInspection/riCheckTable/tabpage/main" // 巡检表设置页面
    ]
});