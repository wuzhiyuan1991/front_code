define(function (require) {
    var LIB = require("lib");
    var customActions = {

        //入参type：1公司 2部门 3讲师 4课程 5个人 ，idsRange：id数组，startDateRange：开始时间，endDateRange：结束时间

        //培训频次-绝对值
        queryAllTrainingTimes: {method: 'GET', url: 'rpt/stats/training/times/all'},
        //培训频次-平均值
        queryAvgTrainingTimes: {method: 'GET', url: 'rpt/stats/training/times/avg'},
        //培训频次-趋势
        queryTrainingTimesTrend: {method: 'GET', url: 'rpt/stats/training/times/trend'},
        //培训频次-更多
        queryPageTrainingTimesDetails: {method: 'GET', url: 'rpt/stats/training/times/details/{currentPage}/{pageSize}'},
        //导出培训频次数据
        doExportTrainingTimesDetails: {method: 'GET', url: 'rpt/stats/training/times/exportexcel'},

        //培训通过率-绝对值
        queryTrainingPassRate: {method: 'GET', url: 'rpt/stats/training/passrate/all'},
        //培训通过率-更多
        queryPagePassRateDetails: {method: 'GET', url: 'rpt/stats/training/passrate/details/{currentPage}/{pageSize}'},
        //导出培训通过率数据
        doExportPassRateDetails: {method: 'GET', url: 'rpt/stats/training/passrate/exportexcel'},


        //课程开发量-绝对值
        queryCourseDev: {method: 'GET', url: 'rpt/stats/course/dev/all'},
        //课程开发量-趋势
        queryCourseDevTrend: {method: 'GET', url: 'rpt/stats/course/dev/trend'},
        //课程开发量-更多
        queryPageCourseDevDetails: {method: 'GET', url: 'rpt/stats/course/dev/details/{currentPage}/{pageSize}'},
        //导出课程开发量数据
        doExportCourseDevDetails: {method: 'GET', url: 'rpt/stats/course/dev/exportexcel'},


        //课程评价-绝对值
        queryCourseComment: {method: 'GET', url: 'rpt/stats/coursecomment/{commentType}/all'},
        //课程评价-更多
        queryPageCourseCommentDetails: {method: 'GET', url: 'rpt/stats/coursecomment/{commentType}/details/{currentPage}/{pageSize}'},
        //课程评价-标签
        queryPageCourseCommentLabels: {method: 'GET', url: 'rpt/stats/coursecomment/{commentType}/labels/{currentPage}/{pageSize}'},
        //导出课程评价数据
        doExportCourseCommentDetails: {method: 'GET', url: 'rpt/stats/coursecomment/{commentType}/exportexcel'},


        //培训积分-绝对值
        queryTrainingScore: {method: 'GET', url: 'rpt/stats/integralscore/all'},
        //培训积分-更多 （额外入参compIds，为筛选数据的compId集）
        queryPageTrainingScoreDetails: {method: 'GET', url: 'rpt/stats/integralscore/details/{currentPage}/{pageSize}'},
        //导出培训积分
        doExportTrainingScoreDetails: {method: 'GET', url: 'rpt/stats/integralscore/exportexcel'},
        queryDataNumLimit: {method: 'GET', url: 'systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=reportFunction.dataNumLimit'},

        //考试分析
        queryExamResultGroupByExamPoint : {method: 'GET', url: 'rpt/stats/exam/exampoint/result'},

    };
    var resource = LIB.Vue.resource(null, {}, customActions);
    return resource;
});