<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE HTML>
<html>
<head>
    <title>试卷预览</title>
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
        tr {
            height: 30px;
        }
        td {
            border: 1px solid #e8e8e8;
            padding: 0 8px;
            vertical-align: middle;
        }
        .strategic {
            display: none;
            position: absolute;
            top: 40px;
            right: 20px;
            background-color: #fff;
            border: 1px solid #e8e8e8;
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 2;
        }
    </style>
    <script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="/static/script/webutils.js"></script>
    <script type="text/javascript" src="/static/script/exam.js?v=${v}"></script>
    <script type="text/javascript" src="/static/script/examJs.js"></script>
    <script>
        var paperType = "${paper.type}";
        var maxtime = 100;//最大时间每个页面要自己覆盖此值
        $(function () {
            quesCard();
            leftMenuScroll();
            $(".p-ques-list>ul>li").children(".is-options").children(".fl").children(".ans-edit").click(function () {
                var _this = $(this),
                    _tBox = _this.parent().parent().next().children();
                if (_tBox.hasClass("undisa-text")) {
                    _this.html("完成编辑");
                    _tBox.removeClass("undisa-text");
                    _tBox.removeAttr("disabled");
                } else {
                    _this.html("修改答案");
                    _tBox.addClass("undisa-text");
                    _tBox.attr("disabled", "enabled");
                }
            });

            //答题选项点击事件
            $('input:radio').click(function () {
                var numinder = $(this).parent().attr("numinder");
                if (numinder != null) {
                    var numinder1 = numinder * 1 + 1;
                    $('#datikaCurrent' + numinder1 + " a").click();
                }
            });

            if ("${topicList.size()}" > 0) {
                cookiesName = "test_time";
            }
            //设置时间
            if (getCookie(cookiesName) == null) {
                maxtime =
                ${paper.replyTime}*
                60; //一个小时，按秒计算，自己调整!
            } else {
                maxtime = getCookie(cookiesName);
            }
            //单题模式初始化
            danti($("#checkboxdanti"));
        });

        function leftMenuScroll() {
            var lM = function () {
                var sTop = parseInt(document.documentElement.scrollTop || document.body.scrollTop, 10);
                if (sTop > 165) {
                    $("#p-test-box").css("position", "fixed");
                } else {
                    $("#p-test-box").css("position", "absolute");
                }
            };
            $(window).bind("scroll", lM);
        }

        //答题卡点击
        function datikaAnchor(titleheiddenNum, num) {
            $("html,body").animate({scrollTop: $(".datikaQstAnchor" + num).offset().top - 50}, 50);

        }
        function showExamPoint() {
            $(".strategic").show();
        }
        function hideExamPoint() {
            $(".strategic").hide();
        }
    </script>
</head>
<body>
<div class="strategic">
    <a href="javascript:;" onclick="hideExamPoint()">关闭</a>
    <table>
        <c:forEach items="${topicList}" varStatus="topicListindex" var="paperMiddle">
            <c:set var="trIndex" value="0"/>
            <tr>
                <td>${paperMiddle.name}</td>
                <td>试卷采用考点</td>
                <td>原始考点</td>
            </tr>
            <c:forEach items="${paperMiddle.questions }" var="qstMiddle">
            <c:set var="trIndex" value="${trIndex+1}"/>
            <tr>
                <td>${trIndex}</td>
                <td>${qstMiddle.strategicExamPoint.name}</td>
                <td>
                    <c:forEach items="${qstMiddle.examPoints }" var="examPoint" varStatus="examPointStatus">
                        ${examPoint.name }<c:if
                            test="${examPointStatus.index !=  qstMiddle.examPoints.size() - 1}">,</c:if>
                    </c:forEach>
                </td>
            </tr>
            </c:forEach>
        </c:forEach>
    </table>
</div>
<form action="${ctx}/paper/addPaperRecord" method="post" id="addPaperRecord">
    <input type="hidden" name="paperRecord.type" value="2"/>
    <input type="hidden" name="paperRecord.subjectId" value="1"/>
    <input type="hidden" name="paperRecord.testTime" id="testTime" value="0"/>
    <input type="hidden" name="paperRecord.epId" value="${paper.id }"/>
    <input type="hidden" name="paperRecord.paperName" value="${paper.name}"/>
    <c:set var="questionNumIndex" value="0"/>
    <c:set var="numIndex" value="-1"/>

    <div class="e-main">
        <section class="container">
            <div class="clearfix mt30">
                <div class="col18 fl pr">
                    <div class="p-test-box" id="p-test-box">
                        <c:if test="${not empty topicList}">
                            <dl class="paper-test">
                                <dt>
                                    <a href="javascript:window.close()" title="" style=" color: #999; font-size: 16px;line-height: 36px;">
                                        <em class="dtback vam"></em>关闭</a>
                                </dt>
                                <dd>
                                    <input type="checkbox" class="vam" onclick="danti(this)" id="checkboxdanti">
                                    <a href="javascript:void(0)" title="" class="vam">单题模式</a>
                                </dd>
                            </dl>
                        </c:if>
                        <!-- /答题卡 开始 -->
                        <c:if test="${topicList!=null&&topicList.size()>0 }">
                            <div class="mt20">
                                <dl class="paper-test q-card-box q-card-wrap">
                                    <dt><a href="javascript:;"><span class="ques-card">答题卡</span><em class="q-card-icon icon16"></em></a></dt>
                                    <dd>
                                        <table class="ques-card-tab">
                                            <c:set var="daTiKaNumIndex" value="0"/>
                                            <c:forEach items="${topicList }" varStatus="topicListindex" var="paperMiddle">
                                                <c:forEach items="${paperMiddle.questions}" varStatus="qstMiddleIndex">
                                                    <c:set var="daTiKaNumIndex" value="${daTiKaNumIndex+1}"/>
                                                    <c:if test="${(daTiKaNumIndex-1)%4==0}"><tr></c:if>
                                                    <td id="datikaCurrent<c:out value="${daTiKaNumIndex}"/>"><a href="javascript:void(0)"
                                                                                                                onclick="datikaAnchor(${topicListindex.index },
                                                                                                                    <c:out value="${daTiKaNumIndex}"/>)"
                                                                                                                title="第<c:out value="${daTiKaNumIndex}"/>题"><c:out
                                                            value="${daTiKaNumIndex}"/></a></td>
                                                    <c:if test="${daTiKaNumIndex%4==0 or (topicListindex.last and qstMiddleIndex.last and daTiKaNumIndex%4!=0)}"></tr></c:if>
                                                </c:forEach>
                                            </c:forEach>
                                        </table>
                                    </dd>
                                </dl>
                            </div>
                        </c:if>
                        <!-- /答题卡 结束 -->
                    </div>
                </div>
                <div class="col82 fr">
                    <div class="ml40">

                        <div class="p-test-title">
                            <span class="nextTitleAnchor">${paper.name}</span>
                            <c:if test="${showExamPoint}">
                                <a href="javascript:;" onclick="showExamPoint()">查看考点采用信息</a>
                            </c:if>
                        </div>
                        <ul class="ques-type mt20 clearfix">
                            <c:forEach items="${topicList }" varStatus="index" var="paperMiddle">
                                <li <c:if test="${index.first}">class="current"</c:if>>
                                    <a href="javascript:void(0)" class="titleHeiddenAndShow${index.index}" indexNum="${index.index }" onclick="titleHeiddenAndShow('${paperMiddle.id}',this, '${paperMiddle.title}', '${paperMiddle.score}')">${paperMiddle.name}</a>
                                </li>
                            </c:forEach>
                        </ul>
                        <div class="pt10 pb10 pr20">
                            <h6 class="hLh30 of unFw ml15">
                                <span class="c-333 fsize12" id="showTitleValue"><c:if test="${not empty topicList }">${topicList[0].title }[&nbsp;每小题${topicList[0].score }分&nbsp;]</c:if></span>
                            </h6>
                        </div>
                        <c:if test="${empty topicList}">
                            <!-- /无数据提示 开始-->
                            <section class="no-data-wrap">
                                <em class="icon30 no-data-ico">&nbsp;</em> <span class="c-666 fsize14 ml10 vam">本试卷还没有上传试题，小编正在努力整理中 . . .</span>
                            </section>
                            <!-- /无数据提示 结束-->
                        </c:if>
                        <c:if test="${not empty topicList}">
                            <div class="p-ques-list">
                                <c:forEach items="${topicList}" varStatus="topicListindex" var="paperMiddle">
                                    <ul id="titleHidden${paperMiddle.id }" <c:if test="${!topicListindex.first }">style="display:none"</c:if> >
                                        <c:forEach items="${paperMiddle.questions }" var="qstMiddle">
                                            <c:set var="questionNumIndex" value="${questionNumIndex+1}"/>
                                            <c:set var="numIndex" value="${numIndex+1}"/>
                                            <input type="hidden" value="${qstMiddle.id }" name="recordList[${numIndex}].qstId"/>
                                            <input type="hidden" value="${paperMiddle.id }" name="recordList[${numIndex}].topicId"/>
                                            <input type="hidden" value="${paperMiddle.score }" name="recordList[${numIndex}].score"/>
                                            <input type="hidden" value="${qstMiddle.answer }" name="recordList[${numIndex}].answer"/>
                                            <!-- /试卷试题列表开始 -->
                                            <li class="datikaQstAnchor<c:out value="${questionNumIndex} p-q-item"/>">
                                                <div class=" p-ques-title">
                                                    <tt><c:out value="${questionNumIndex}"/></tt>
                                                    <span class="c-master fsize16 ml10">
                                                        <c:if test="${qstMiddle.type==1}">（单选题）</c:if>
                                                        <c:if test="${qstMiddle.type==2}">（多选题）</c:if>
                                                        <c:if test="${qstMiddle.type==3}">（判断题）</c:if>
                                                        <c:if test="${qstMiddle.type==4}">（不定项题）</c:if>
                                                        <c:if test="${qstMiddle.type==5}">（主观题）</c:if>
                                                    </span>
                                                    <span class="c-666 fsize16">${qstMiddle.content }</span>
                                                </div>
                                                <section class="t-p-options">
                                                    <ol>
                                                        <%--单选题--%>
                                                        <c:if test="${qstMiddle.type==1}">
                                                            <c:forEach items="${qstMiddle.opts}" var="option">
                                                                <li class="mul-options-item<c:if test="${option.opt == qstMiddle.answer}"> mul-options-item__right</c:if>">
                                                                    <span class="mul-options-item-opt">${option.opt}</span>
                                                                    <span class="mul-options-item-content">${option.content}</span>
                                                                </li>
                                                            </c:forEach>
                                                        </c:if>

                                                        <%--多选题--%>
                                                        <c:if test="${qstMiddle.type==2}">
                                                            <c:forEach items="${qstMiddle.opts}" var="option">
                                                                <li class="mul-options-item<c:if test="${qstMiddle.answer.contains(option.opt)}"> mul-options-item__right</c:if>">
                                                                    <span class="mul-options-item-opt">${option.opt}</span>
                                                                    <span class="mul-options-item-content">${option.content}</span>
                                                                </li>
                                                            </c:forEach>
                                                        </c:if>

                                                        <%--判断题--%>
                                                        <c:if test="${qstMiddle.type==3}">
                                                            <li class="mul-options-item<c:if test="${'A' == qstMiddle.answer}"> mul-options-item__right</c:if>">
                                                                <span class="mul-options-item-opt">A</span>
                                                                <span class="mul-options-item-content">正确</span>
                                                            </li>
                                                            <li class="mul-options-item<c:if test="${'B' == qstMiddle.answer}"> mul-options-item__right</c:if>">
                                                                <span class="mul-options-item-opt">B</span>
                                                                <span class="mul-options-item-content">错误</span>
                                                            </li>
                                                        </c:if>
                                                    </ol>
                                                </section>
                                                <section class="bg-fa">
                                                    <div class="answer-box">
                                                        <span class="fsize16 c-333">正确答案：${qstMiddle.answer}</span>
                                                    </div>
                                                    <div class="p-analyse">
                                                        <p class="fsize14 c-666">解析：${qstMiddle.analysis }</p>
                                                        <p class="fsize14 c-666 mt5">知识点：
                                                            <c:forEach items="${qstMiddle.examPoints }" var="examPoint" varStatus="examPointStatus">
                                                                ${examPoint.name}<c:if test="${examPointStatus.index !=  qstMiddle.examPoints.size() - 1}">,</c:if>
                                                            </c:forEach>
                                                        </p>
                                                    </div>
                                                </section>
                                                <div class="tac mt50">
                                                    <a href="javascript:void(0)" class="submit-btn nextoneqst" onclick="nextqst(${numIndex+2})">下一题</a>
                                                </div>
                                            </li>
                                            <!-- /试卷试题列表结束 -->
                                        </c:forEach>

                                    </ul>
                                </c:forEach>
                            </div>
                        </c:if>
                    </div>
                </div>
            </div>
        </section>
    </div>
</form>
</body>
</html>