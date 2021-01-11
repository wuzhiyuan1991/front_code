({
    // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    appDir: "../../../src/main/webapp/html/js",

    // 模块根目录。默认情况下所有模块资源都相对此目录。
    // 若该值未指定，模块则相对build文件所在目录。
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。
    baseUrl: './',

    // 指定输出目录，若值未指定，则相对 build 文件所在目录
    dir: "../html/js",

    // 在 RequireJS 2.0.2 中，输出目录的所有资源会在 build 前被删除
    // 值为 true 时 rebuild 更快，但某些特殊情景下可能会出现无法预料的异常
    keepBuildDir: true,

    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   uglify2: 新版本
    //   closure: 使用 Google's Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    optimize: "uglify2",

    // 使用 UglifyJS 时的可配置参数
    // See https://github.com/mishoo/UglifyJS for the possible values.
    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000
    },

    //If using UglifyJS2 for script optimization, these config options can be
    //used to pass configuration values to UglifyJS2. As of r.js 2.2, UglifyJS2
    //is the only uglify option, so the config key can just be 'uglify' for
    //r.js 2.2+.
    //For possible `output` values see:
    //https://github.com/mishoo/UglifyJS2#beautifier-options
    //For possible `compress` values see:
    //https://github.com/mishoo/UglifyJS2#compressor-options
    uglify2: {
        //Example of a specialized config. If you are fine
        //with the default options, no need to specify
        //any of these properties.
        output: {
            beautify: false
        },
        compress: {
            sequences: false,
            global_defs: {
                DEBUG: false
            }
        },
        warnings: false,
        mangle: true
    },

    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    optimizeCss: "standard",

    // 是否忽略 CSS 资源文件中的 @import 指令
    // cssImportIgnore: null,


    // 配置文件目录
    // mainConfigFile: 'js-build-config.js',

    // 一般用于命令行，可将多个 CSS 资源文件打包成单个 CSS 文件
    // cssIn: "css/builtcofig.css",
    // out: "css/config.css",

    // 处理所有的文本资源依赖项，从而避免为加载资源而产生的大量单独xhr请求
    inlineText: true,

    // 是否开启严格模式
    // 由于很多浏览器不支持 ES5 的严格模式，故此配置默认值为 false
    useStrict: false,

    // 处理级联依赖，默认为 false，此时能够在运行时动态 require 级联的模块。为 true 时，级联模块会被一同打包
    findNestedDependencies: false,

    //If set to true, any files that were combined into a build layer will be
    //removed from the output folder.
    removeCombined: false,

    // 设置模块别名
    // RequireJS 2.0 中可以配置数组，顺序映射，当前面模块资源未成功加载时可顺序加载后续资源
    paths: {
        'jquery':'libs/jquery/jquery-1.9.1.min',
        "mousewheel": "libs/jquery.mousewheel.min",
        'mCustomScrollbar': 'libs/jquery.mCustomScrollbar.min',
        "lodash": "libs/lodash/3.10.1/lodash.min",
        "underscoreDeepExtend": "libs/underscore-deep-extend",
        "text": "libs/text",
        "jscolor": "libs/jscolor-2.0.4/jscolor",
        'bootstrap':'libs/bootstrap/bootstrap.min',
        'pluploadHelper':'tools/pluploadHelper',
        'jquery-migrate':'libs/jquery/jquery-migrate-1.1.0.min',
        'jquery-ui':'libs/jquery-ui',
        "css":"libs/css.min",
        'plupload':'libs/plupload-2.1.9/js/plupload.full.min',
        'vue':"libs/vue/vue.min",
        'vueResource':"libs/vue/vue-resource.min",
        'vueX':"libs/vue/vuex",
        'vueRouter':"libs/vue/vue-router",
        'charts':"libs/echarts.common.min",
        "popper":"libs/popper",//iview ui组件依赖
        "apiCfg": "app/vue-resource/apiConfig",
        "base64":"libs/base64",
        "sewisePlayer":"libs/sewise-player/sewise.player.min",
        "artTempalte":"libs/template/template-native",
        "iconfont": "libs/iconfont",
        "chart2":"libs/echarts.min2"
    },



    // 仅优化单个模块及其依赖项,不能module同时使用,只适合打包一个单一文件
    //out: "main-built.js",
    //include: ["foo/bar/bee"],
    //insertRequire: ['foo/bar/bop'],
    //out: "main-built.js",
    //name:"index",

    modules: [
        // 入口
        {
            name: "index"
        },
        // ------------------------------------------------
        {
            name: "views/businessFiles/hiddenDanger/checkItem/main", // 检查项
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/hiddenDanger/checkList/main", // 检查表
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/equipment/equipment/main", // 设备设施
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/hiddenDanger/subjectObject/main",
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/businessFiles/riskAssessment/accidentCase/main", // 事故案例
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessFiles/leadership/asmtBasis/main", // 自评依据
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessFiles/leadership/asmtTable/main", // 自评表
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessFiles/riskAssessment/checkMethod/main", // 检查方法
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessFiles/riskAssessment/inspectionBasis/main", // 检查依据
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessFiles/riskAssessment/riskFactors/main",
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/riskAssessment/riskAssessment/main",  // 危害辨识
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/businessFiles/trainingManagement/course/main",  // 课程管理
            exclude: [
                "index",
                "views/businessFiles/trainingManagement/course/uploadify/swfobject",
                "views/businessFiles/trainingManagement/course/uploadify/jquery.uploadify.min.v3.2.1"
            ]
        },
        {
            name: "views/businessFiles/trainingManagement/examPaper/main",  // 试卷管理
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/trainingManagement/question/main",  // 试题管理
            exclude: ["index", "libs/kindeditor/kindeditor"]
        },
        {
            name: "views/businessFiles/trainingManagement/examPoint/main",  // 知识点管理
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/trainingManagement/teacher/main",  // 讲师管理
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/trainingManagement/matrix/main",  // 培训矩阵
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/businessCenter/hiddenDanger/checkRecord/main",  // 检查记录
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessCenter/hiddenDanger/inspectionPlan/main",  // 检查计划
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/hiddenDanger/inspectionTask/main",  // 检任务
            exclude: ["index"]
        },
        // {
        //     name: "views/businessCenter/radomObser/main",  // 随机观察
        //     exclude: ["index","sewisePlayer"]
        // },
        // ------------------------------------------------
        {
            name: "views/businessCenter/hiddenGovernance/reform/main",  // 隐患整改
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessCenter/hiddenGovernance/regist/main",  // 隐患登记
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessCenter/hiddenGovernance/setting/main",
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessCenter/hiddenGovernance/total/main",   // 隐患总表
            exclude: ["index","sewisePlayer"]
        },
        {
            name: "views/businessCenter/hiddenGovernance/verify/main",  // 隐患验证
            exclude: ["index","sewisePlayer"]
        },
        // ------------------------------------------------
        {
            name: "views/businessCenter/trainingManagement/trainingPlan/main",  // 培训计划
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/offlineTrain/main",  // 线下培训
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/myTraining/main",  // 我的培训
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/courseCenter/main",  // 选修课程
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/testCenter/main",  // 我的考试
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/errorRecord/main",  // 错题记录
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/exam/main",  // 考试计划
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/courseFile/main",  // 课程档案
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/userFile/main",  // 员工档案
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/trainingManagement/examFile/main",  // 考试档案
            exclude: ["index"]
        },
        // ----------------------------------------------------------
        {
            name: "views/businessCenter/leadership/asmtPlan/main",  // 自评计划
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/leadership/asmtTask/main",  // 自评任务
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/leadership/asmtShare/main",  // 自评分享
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/basicSetting/basicSetting/I18nList/main",  // 国际化
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/basicSetting/licence/main",  // 软件授权
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/basicSetting/mailbox/main",   // 邮箱配置
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/noticeMa/main",  // 发消息
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/basicSetting/parameter/main",  // 参数配置
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/basicSetting/reminderSettings/main",  // 提醒设置
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/basicSetting/setUp/main",
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/basicSetting/basicFile/businessMenu/main",  // 业务分类
            exclude: ["index"]
        },
        // {
        //     name: "views/basicSetting/basicFile/evaluationModel/main",
        //     exclude: ["index"]
        // },
        // ------------------------------------------------
        {
            name: "views/basicSetting/dataSecurity/Loglog/main",  // 登录日志
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/dataSecurity/MailLog/main",  // 邮件日志
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/dataSecurity/onlineUser/main",  // 在线用户
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/dataSecurity/OperationLog/main",  // 操作日志
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/dataSecurity/safeRule/main",  // 安全规则
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/basicSetting/menuMa/main",  // 菜单管理
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/quartzMa/main",  // 定时任务
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/menuFuncMgr/main",  // 菜单功能权限
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/lookupMgr/main",   // lookup
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/dataAuthSetting/main",  // 数据权限
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/authcode/main",  // 功能权限码
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/sysRoleManagement/main",  // 系统权限管理
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/compRoleManagement/main",  // 公司权限管理
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/systemSetting/superadminFunc/main",  // 超管功能
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/basicSetting/organizationalInstitution/CompanyFi/main",  // 公司档案
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/organizationalInstitution/DepartmentalFi/main",  // 部门档案
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/organizationalInstitution/HseRole/main",  // 安全角色
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/organizationalInstitution/PersonnelFi/main",  // 人员维护
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/organizationalInstitution/PostManagement/main", // 岗位管理
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/organizationalInstitution/RoleManagement/main", // 角色管理
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/excitationMechanism/mechanismSetting/main",
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/businessCenter/hiddenGovernance/modeler/main", // 工作流
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/hiddenGovernance/condition/main", // 工作流条件
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/hiddenGovernance/process/main", // 工作流流程
            exclude: ["index"]
        },
        {
            name: "views/basicSetting/basicSetting/lookup/main",
            exclude: ["index"]
        },

        // -----------------------------------------------
        {
            name: "views/reportManagement/home/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/reportDynamic/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/riskControl/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/improvedTrending/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/riskWarning/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/keyData/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/shareReport/settingsOfShare/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/leadership/main",
            exclude: ["index"]
        },
        {
            name: "views/reportManagement/keyPost/main",
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name:"views-audit/businessCenter/safetyAudit/auditPlan/main", // 审查计划
            exclude: ["index"]
        },
        {
            name:"views-audit/businessCenter/safetyAudit/auditScore/main", // 审查评分
            exclude: ["index"]
        },
        {
            name:"views-audit/businessCenter/safetyAudit/auditConfirm/main", // 结果确认
            exclude: ["index"]
        },
        {
            name:"views-audit/businessCenter/safetyAudit/auditStatistics/main", // 审查统计
            exclude: ["index"]
        },
        {
            name:"views-audit/businessFiles/safetyAudit/auditTable/main", // 审查表
            exclude: ["index"]
        },
        {
            name:"views-audit/tabs/allot/main", // 安全审查
            exclude: ["index"]
        },
        {
            name:"views-audit/tabs/confirm/main", // 安全审查确认
            exclude: ["index"]
        },
        {
            name:"views-audit/tabs/grade/main", // 安全审查评分
            exclude: ["index"]
        },
        {
            name:"views-audit/tabs/table/main", // 安全审查表
            exclude: ["index"]
        },
        // ------------------------------------------------
        {
            name: "views/home/main",
            exclude: ["index"]
        },
        {
            name: "views/home/work/main", // 工作任务
            exclude: ["index"]
        },
        {
            name: "views/home/notice/main", // 公告
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/apanageManagement/dominationArea/main", // 属地
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/majorRiskSource/baseChemicalObjCatalog/main", // 基础化学品
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/majorRiskSource/majorChemicalObj/main", // 重点化学工艺
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/majorRiskSource/majorChemicalProcess/main", // 重点危化品
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/majorRiskSource/majorRiskSource/main", // 重大危险源
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/majorRiskSource/nomalChemicalObj/main", // 一般危化品
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/hiddenDanger/notPlanCheckRecord/main", // 非计划检查记录
            exclude: ["index"]
        },

        {
            name: "views/businessFiles/routingInspection/riCheckResult/main", // 巡检结果
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/routingInspection/riCheckTable/main",  // 巡检表
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/routingInspection/riCheckType/main", // 巡检类型
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/routingInspection/riCheckPointTpl/main", // 巡检点
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/routingInspection/riCheckAreaTpl/main", // 巡检区域
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/routingInspection/riCheckPlan/main", // 巡检几乎
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/routingInspection/riCheckRecord/main", // 巡检记录
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/routingInspection/riCheckTask/main", // 巡检任务
            exclude: ["index"]
        },
        {
            name: "views/businessFiles/routingInspection/riCheckTable/tabpage/main", // 巡检表设置页面
            exclude: ["index"]
        },
        //--------------------------------------------------------------------------------
        {
            name: "views/businessCenter/accidentMa/accident/main", // 事故信息
            exclude: ["index"]
        },
        {
            name: "views/businessCenter/accidentMa/investigation/main", // 调查报告
            exclude: ["index"]
        },
    ],

    //修改了源码r.js,增加忽略的正则文件
    skipOptimizeFiles : [
        /libs\/.+\.js/,
        /demo\/.+\.js/,
    ],

    // 不优化某些文件
//    fileExclusionRegExp: /^\./,
//    fileExclusionRegExp: /^(r|build|\.)\.js$/,
//    fileExclusionRegExp: /\*\*\/demo\/\*\*|(^(r|build)\.js$)|demo\.css|demo\.html|ui\.html|index\.html|iconfont\.css|(\.zip$)|(\.psd$)|(\.ai$)|(\.bak$)/,
//    fileExclusionRegExp: "^demo\.|^test\.",
//     fileExclusionRegExp: "\/js\/demo|const\.js",

    // 在每个文件模块被读取时的操作函数，可在函数体内作适当变换
    // onBuildRead: function (moduleName, path, contents) {
    //     return contents.replace(/foo/g, 'bar');
    // },

    // 在每个文件模块被写入时的操作函数
    onBuildWrite: function (moduleName, path, contents) {

        //去掉html文件中的注释
        if(path.indexOf(".html") > 0 && (path.length - 5) == path.indexOf(".html")) {
            return contents.replace(/<!--[\w\W]*?-->/g, '');
        }

        return contents;
    },

    // 若为true，优化器会强制在文件中包裹一层 define(require, exports, module) {})
    // cjsTranslate: true,

    //Introduced in 2.0.2: a bit experimental.
    //Each script in the build layer will be turned into
    //a JavaScript string with a //@ sourceURL comment, and then wrapped in an
    //eval call. This allows some browsers to see each evaled script as a
    //separate script in the script debugger even though they are all combined
    //in the same file. Some important limitations:
    //1) Do not use in IE if conditional comments are turned on, it will cause
    //errors:
    //http://en.wikipedia.org/wiki/Conditional_comment#Conditional_comments_in_JScript
    //2) It is only useful in optimize: 'none' scenarios. The goal is to allow
    //easier built layer debugging, which goes against minification desires.
    // useSourceUrl: true
})