<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE HTML>
<html>
<head>
    <title>考试报告</title>
    <link rel="stylesheet" type="text/css" href="/static/css/red-matter.css">
    <link rel="stylesheet" type="text/css" href="/static/css/theme.css">
    <link rel="stylesheet" type="text/css" href="/static/css/reset.css">
    <link rel="stylesheet" type="text/css" href="/static/css/global.css">
    <link rel="stylesheet" type="text/css" href="/static/css/exam-style.css">
    <style>
        .mul-options-item {
            font-size: 16px;
            color: #252525;
            display: flex;
        }
        .mul-options-item__right {
            color: #0baaee;
        }
        .mul-options-item__error {
            color: #f00;
        }
        .mul-options-item-opt {
            margin-right: 15px;
            position: relative;
        }
        .mul-options-item-content {
            flex: 1;
        }
        .mul-options-item__right .mul-options-item-opt::before {
            content: '';
            position: absolute;
            height: 20px;
            width: 20px;
            background-color: #0baaee;
            border-radius: 50%;
            left: -5px;
            top: 0;
        }
        .mul-options-item__right .mul-options-item-opt::after {
            content: '';
            position: absolute;
            left: 0;
            top: 4px;
            height: 6px;
            width: 9px;
            border-left: 2px solid #fff;
            border-bottom: 2px solid #fff;
            transform: rotate(-45deg);
        }
        .mul-options-item__error .mul-options-item-opt::before {
            content: '';
            position: absolute;
            height: 20px;
            width: 20px;
            background-color: #f00;
            border-radius: 50%;
            left: -5px;
            top: 0;
        }
        .mul-options-item__error .mul-options-item-opt::after {
            content: '\2716';
            position: absolute;
            left: 0;
            top: 0;
            /* transform: rotate(-45deg); */
            color: #fff;
            font-size: 13px;
        }
    </style>
    <script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="/static/script/webutils.js"></script>
    <script type="text/javascript" src="/static/script/exam.js"></script>
    <script type="text/javascript" src="/static/script/examJs.js"></script>
</head>
<body>
<div class="e-main">
    <div class="container ">
        <c:if test="${empty paperRecord}">
            <div class="mt50 clearfix paper-result">
                <!-- /无数据提示 开始-->
                <section class="no-data-wrap">
                    <em class="icon30 no-data-ico">&nbsp;</em> <span class="c-666 fsize14 ml10 vam">试卷报告不存在 . . .</span>
                </section>
                <!-- /无数据提示 结束-->
            </div>
        </c:if>
        <c:if test="${not empty paperRecord}">
            <div class="mt50 clearfix paper-result">

                <%--考试结果--%>
                <div class="fl col-6">
                    <div class="p-report-box">
                        <header class="p-rep-title tac">
                            <span>考试结果</span>
                            <s></s>
                        </header>
                        <div class="p-report-wrap" style="min-height:200px">
                            <span class="fsize22 c-333 disIb mb10">${paperRecord.examPaper.name}</span>
                            <div class="p-rep-chart">
                                <div class="mt10 e-s-mod1 chartProgress" id="reportchart" totalNum="${paperRecord.qstCount}"
                                     rigthNum="${paperRecord.correctNum }">
                                </div>
                            </div>
                            <div class="i-report-info">
                                <p class="fsize16 c-666 hLh30">得分：<span class="c-333">
                                    <fmt:formatNumber value="${paperRecord.userScore }" pattern="#0" type="number" minFractionDigits="0"></fmt:formatNumber> 总分：${paperRecord.examPaper.score }</span>
                                </p>
                                <p class="fsize16 c-666 hLh30">答题时长：
                                    <span class="c-333">
									<c:choose>
                                        <c:when test="${paperRecord.testTime != null }">
                                            <fmt:formatNumber value="${(paperRecord.testTime-paperRecord.testTime%60)/60}" pattern="#0" type="number" minFractionDigits="0"></fmt:formatNumber>
                                        </c:when>
                                        <c:otherwise>
                                            --
                                        </c:otherwise>
                                    </c:choose>
									分
									<c:choose>
                                        <c:when test="${paperRecord.testTime != null }">
                                            <fmt:formatNumber value="${paperRecord.testTime%60}" minFractionDigits="0"></fmt:formatNumber>
                                        </c:when>
                                        <c:otherwise>
                                            --
                                        </c:otherwise>
                                    </c:choose>
									秒</span>
                                </p>
                                <p class="fsize16 c-666 hLh30">交卷时间：<span class="c-333">
								<c:choose>
                                    <c:when test="${paperRecord.createDate != null }">
                                        <fmt:formatDate value="${paperRecord.createDate }" pattern="yyyy-MM-dd HH:mm:ss"/>
                                    </c:when>
                                    <c:otherwise>
                                        --
                                    </c:otherwise>
                                </c:choose>
								</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <%--错题记录--%>
                <div class="fr col-4">
                    <div class="ml40">
                        <div class="p-report-box">
                            <header class="p-rep-title tac">
                                <span>错题记录</span>
                                <s></s>
                            </header>
                            <div class="ques-wrong-card">
                                <ul class="clearfix">
                                    <c:set var="questionNumIndex" value="0"/>
                                    <c:forEach items="${paperRecord.questionRecords}" var="questionRecord" varStatus="paperMiddleListindex">
                                        <c:set var="questionNumIndex" value="${questionNumIndex+1}"/>
                                        <li     <c:choose>
                                            <c:when test="${questionRecord.status!=0}">
                                                class="wrong-ans"
                                            </c:when>
                                            <c:otherwise>
                                            </c:otherwise>
                                        </c:choose>
                                        >
                                            <a title="第<c:out value="${questionNumIndex}"/>题" href="javascript:void(0)"
                                               onclick="datikaAnchor(${paperMiddleListindex.index },<c:out value="${questionNumIndex}"/>)"><c:out
                                                    value="${questionNumIndex}"/></a>
                                        </li>
                                    </c:forEach>
                                </ul>
                                <div class="ques-box-explain">
                                    <span>说明：</span><img src="/static/img/1.png"><span>客观题中错误的题目;</span><img class="ml20" src="/static/img/3.png"><span>客观题中正确的题目</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <%--试题解析--%>
            <div>
                <div class="rep-title clearfix pb10">
                    <span class="fsize18 c-666">试题解析</span>
                </div>

                <c:if test="${topicRecordList==null||topicRecordList.size()==0 }">
                    <!-- /无数据提示 开始-->
                    <section class="no-data-wrap">
                        <em class="icon30 no-data-ico">&nbsp;</em> <span class="c-666 fsize14 ml10 vam">本试卷还没有上传试题，小编正在努力整理中 . . .</span>
                    </section>
                    <!-- /无数据提示 结束-->
                </c:if>
                <c:if test="${not empty topicRecordList}">
                    <div class="p-ques-list">
                        <c:set var="questionNumIndex" value="0"/>
                        <c:forEach items="${topicRecordList}" varStatus="paperMiddleListindex" var="paperMiddle">
                            <ul id="titleHidden${paperMiddle.id }">
                                <c:forEach items="${paperMiddle.questionRecords }" var="qstMiddle">
                                    <c:set var="questionNumIndex" value="${questionNumIndex+1}"/>
                                    <!-- /试卷试题列表开始 -->
                                    <li class="datikaQstAnchor<c:out value="${questionNumIndex} p-q-item"/>">
                                        <div class=" p-ques-title">
                                            <tt><c:out value="${questionNumIndex}"/></tt>
                                            <span class="c-master fsize16 ml10">
                                                    <c:if test="${qstMiddle.question.type==1}">（单选题）</c:if>
                                                    <c:if test="${qstMiddle.question.type==2}">（多选题）</c:if>
                                                    <c:if test="${qstMiddle.question.type==3}">（判断题）</c:if>
                                            </span>
                                            <span class="c-666 fsize16">${qstMiddle.question.content }</span>
                                        </div>
                                        <section class="t-p-options">
                                            <ol>
                                                <%--单选题--%>
                                                <c:if test="${qstMiddle.question.type==1}">
                                                    <c:forEach items="${qstMiddle.question.opts}" var="option">
                                                        <li class="mul-options-item<c:if test="${option.opt == qstMiddle.answer}"> mul-options-item__right</c:if><c:if test="${option.opt == qstMiddle.userAnswer && option.opt != qstMiddle.answer}"> mul-options-item__error</c:if>">
                                                            <span class="mul-options-item-opt">${option.opt}</span>
                                                            <span class="mul-options-item-content">${option.content}</span>
                                                        </li>
                                                    </c:forEach>
                                                </c:if>

                                                <%--多选题--%>
                                                <c:if test="${qstMiddle.question.type==2}">
                                                    <c:forEach items="${qstMiddle.question.opts}" var="option">
                                                        <li class="mul-options-item<c:if test="${qstMiddle.answer.contains(option.opt)}"> mul-options-item__right</c:if><c:if test="${qstMiddle.userAnswer.contains(option.opt) && !qstMiddle.answer.contains(option.opt)}"> mul-options-item__error</c:if>">
                                                            <%--<li class="mul-options-item"><a href="javascript:void(0);">${option.opt }、${option.content }</a></li>--%>
                                                            <span class="mul-options-item-opt">${option.opt}</span>
                                                            <span class="mul-options-item-content">${option.content}</span>
                                                        </li>
                                                    </c:forEach>
                                                </c:if>

                                                <%--判断题--%>
                                                <c:if test="${qstMiddle.question.type==3}">
                                                    <li class="mul-options-item<c:if test="${'A' == qstMiddle.answer}"> mul-options-item__right</c:if><c:if test="${'A' == qstMiddle.userAnswer && 'A' != qstMiddle.answer}"> mul-options-item__error</c:if>">
                                                        <span class="mul-options-item-opt">A</span>
                                                        <span class="mul-options-item-content">是</span>
                                                    </li>
                                                    <li class="mul-options-item<c:if test="${'B' == qstMiddle.answer}"> mul-options-item__right</c:if><c:if test="${'B' == qstMiddle.userAnswer && 'B' != qstMiddle.answer}"> mul-options-item__error</c:if>">
                                                        <span class="mul-options-item-opt">B</span>
                                                        <span class="mul-options-item-content">否</span>
                                                    </li>
                                                </c:if>
                                            </ol>
                                        </section>
                                        <section class="bg-fa">
                                            <div class="answer-box">
                                                <span class="fsize16 c-333">正确答案：${qstMiddle.answer}</span>
                                                &nbsp;&nbsp;&nbsp;
                                                <span class="fsize16 c-333">您的答案：${qstMiddle.userAnswer}</span>
                                            </div>
                                            <div class="p-analyse">
                                                <p class="fsize14 c-666">解析：${qstMiddle.question.analysis }</p>
                                                <p class="fsize14 c-666 mt5">知识点：
                                                    <c:forEach items="${qstMiddle.question.examPoints }" var="examPoint" varStatus="examPointStatus">
                                                        ${examPoint.name }<c:if
                                                            test="${examPointStatus.index !=  qstMiddle.question.examPoints.size() - 1}">,</c:if>
                                                    </c:forEach>
                                                </p>
                                        </section>
                                    </li>
                                    <!-- /试卷试题列表结束 -->
                                </c:forEach>
                            </ul>
                        </c:forEach>
                    </div>
                </c:if>


            </div>
        </c:if>
    </div>
</div>
<script type="text/javascript" src="${ctximg}/static/script/echarts.min.js" charset="UTF-8"></script>
<script>
    $(function () {
        $(window).load(function () {
            $(".chartProgress").each(function () {
                var _this = $(this);
                var _id = _this.attr("id");
                var _total = _this.attr("totalNum");
                var _rigthNum = _this.attr("rigthNum");
                _this.css("width", "172px");
                _this.css("height", "172px");
                init(_id, _total, _rigthNum);
            });
        });
    });

    // 初始化echart
    function init(id, totalTime, completeTime) {
        var myChart = echarts.init(document.getElementById(id));
        var percentage = (Math.round(completeTime / totalTime * 10000) / 100.00 + "%");
        var option = {
            title: {
                text: '正确率\n' + percentage,
                x: 'center',
                y: 'center',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {d}%"
            },
            series: [
                {
                    name: '正确率',
                    type: 'pie',
                    radius: ['50%', '90%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: [
                        {
                            value: totalTime - completeTime,
                            name: '错误',
                            itemStyle: {
                                normal: {color: '#CFD8E6'}
                            }
                        },
                        {
                            value: completeTime,
                            name: '正确',
                            itemStyle: {
                                normal: {color: '#F60'}

                            }
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    }
</script>
</body>
</html>