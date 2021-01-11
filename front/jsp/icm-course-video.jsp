﻿<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>播放大厅</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="/static/css/reset.css">
    <link rel="stylesheet" type="text/css" href="/static/css/theme.css">
    <link rel="stylesheet" type="text/css" href="/static/css/global.css">
    <link rel="stylesheet" type="text/css" href="/static/css/web.css">
    <link rel="stylesheet" type="text/css" href="/static/css/video-layout.css">
    <link href="/static/css/mw_320_768.css" rel="stylesheet" type="text/css" media="screen and (min-width: 320px) and (max-width: 768px)">

</head>
<body>

<div class="u-body v-body">
    <!-- /学习大厅 主体 开始 -->
    <section id="p-h-box" class="p-h-box">

        <header class="p-h-header">
            <section class="p-h-head" style="width: 70vw;">
                <h2 class="p-h-title"><span class="c-fff"  id="contentTitle" style="cursor:pointer;">${course.name }</span></h2>
                <aside class="pa" style="right: 40px;top: 22px;">
                    <span class="vam dpBtn">
                        <em class="icon18 dpIcon"></em>
                        <a class="c-fff vam" title="关灯" onclick="" href="javascript:void(0)">关灯</a>
                    </span>
                </aside>
            </section>
        </header>

        <div class="player-box">
            <!-- /学习进度条 开始-->
            <c:if test="${task.status == 0 }">
                <div class="p-h-s-bar">
                    <div class="time-bar-wrap">
                        <div title="已学0%" class="lev-num-wrap">
                            <aside class="lev-num-bar">
                                <p><span class="lev-num"><big>已学习：0%</big></span></p>
                            </aside>
                        </div>
                    </div>
                </div>
            </c:if>
            <!-- /学习进度条 结束-->

            <div class="p-h-video of">
                <section class="p-h-video-box" id="videoPlay">
                    <a id="sectionPlayIco" href="javascript:void(0)" onclick="vedioClick('${playKpointId}')" title="${course.name}" class="v-play-btn"
                    >
                        <em class="icon30">&nbsp;</em>
                    </a>
                </section>
                <section class="p-h-video-tip tac">
                </section>
            </div>
        </div>
        <!-- /播放器位置 -->

        <!-- /菜单+IM位置 -->
    </section>
    <aside class="p-h-r-ele">
        <section class="p-h-r-title">
            <ol id="p-h-r-title">
                <li class="current"><a class="course_mulu" href="javascript: void(0)" title="课程目录">课程目录</a></li>
            </ol>
            <div class="clear"></div>
        </section>
        <div id="p-h-r-cont" class="p-h-r-cont">
            <section class="p-h-r-menu">
                <div class="lh-menu-wrap" id="courseKpointMenu">


                </div>
            </section>
            <!-- /课程目录 -->
        </div>
        <div id="phrbtns" class="p-h-r-btns"></div>
    </aside>
    <!-- /学习大厅 主体 结束 -->
</div>


<input type="hidden" id="courseId" value="${course.id }"/>
<%--<input type="hidden" id="taskId" value="${task.id}"/>--%>
<%--<input type="hidden" id="isDownloadable" value="${course.isDownloadable }"/>--%>
<script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="/static/script/webutils.js"></script>
<script type="text/javascript" src="/static/script/common.js"></script>
<script type="text/javascript" src="/static/script/playVideo.js"></script>
<script>
    <%--var passExercise = '${passExercise}';--%>
    <%--if (passExercise == "true") {--%>
    <%--    dialog('提示', "顺利通过考试，恭喜！", 0);--%>
    <%--} else if (passExercise == "false") {--%>
    <%--    dialog('提示', "很遗憾，考试没能通过", 1);--%>
    <%--}--%>
    <%--var taskId = "${taskId}";--%>
    var courseId = '${course.id}';
    var courseName = '${course.name }';
    //评论类型,类型2为课程 4章节
    var type = 4;
    var isok = "${isok}";//是否可以播放
    var message = "${message}";//提示信息
    <%--var studyPercent = "${task.percent}";//学习进度百分比--%>
    var defaultKpoint = getUrlParmas('kpointId'); // 默认章节参数

    getCourseKpointList("${course.id}");

    window.onbeforeunload  = function(){
        localStorage.setItem("tempStore", 1);
    };


    /**
     * 获得课程章节目录
     */
    function getCourseKpointList(courseId) {



        $.ajax({
            url: baselocation + "/icmfront/kpointlist/" + courseId,
            data: {},
            type: 'get',
            success: function (result) {
                var $courseKpointWarp = $("#courseKpointMenu");

                if (checkIsMobile()) {// 移动端环境下效果
                    $courseKpointWarp.prev().hide();
                    $courseKpointWarp.html(result).show();
                } else {
                    $courseKpointWarp.html(result);
                }

                // 设置默认选中章节
                if (defaultKpoint) {
                    vedioClick(defaultKpoint);
                }
                treeMenu(); //课程树
            }
        });
    }

    //点击查询章节
    function queryCourseKpointList(obj) {
        $(obj).removeClass("current").siblings().removeClass("current");
        $(obj).addClass("current");
        if (isNotEmpty($(".courseKpointHtml").html())) {
            $(".courseKpointHtml").prev().hide();
            $(".courseKpointHtml").show();
        } else {
            getCourseKpointList("${taskId}", "${course.id}");
        }
    }

    /**
     * 获取url参数
     * @param name
     * @returns {*}
     */
    function getUrlParmas(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
</script>
</body>
</html>
