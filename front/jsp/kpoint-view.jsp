﻿<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件预览</title>
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
            <section class="p-h-head">
                <h2 class="p-h-title"><span class="c-fff" id="contentTitle" style="cursor:pointer">${course.name}</span></h2>
            </section>
        </header>

        <div class="player-box">
            <div class="p-h-video of">
                <section class="p-h-video-box" id="videoPlay" style="text-align: center;">
                    <div id='videoPlayer' style="width: 100%; height: 100%"></div>
                </section>
                <section class="p-h-video-tip tac">
                </section>
            </div>
        </div>
        <!-- /播放器位置 -->

        <!-- /菜单+IM位置 -->
    </section>
    <!-- /学习大厅 主体 结束 -->
</div>


<script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="/static/script/webutils.js"></script>
<script type="text/javascript" src="/static/script/common.js"></script>
<script type="text/javascript" src='/static/script/polyvplayer.min.js'></script>

<script>
    var ctxPath = '${ctxPath}';
    var msg = '${msg}'; // 错误信息
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

    $(function () {
        vP(); // 放器高度动态赋值
    });
    $(window).resize(function () {
        if (checkIsMobile()) {// 移动端环境下效果
        } else {
            vP();
        }
    });
    // 播放器高度动态赋值
    var vP = function () {
        var wH = parseInt(document.documentElement.clientHeight, 10);
    };

    var $videoPlay = $("#videoPlay");

    var fileId = getUrlParmas('id');
    var fileType = getUrlParmas('type');
    var name = getUrlParmas('name');



    // 视频播放
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    function generateMixed(n) {
        var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
    }
    var playsafe = ''
    $.ajax({
		url: '/polyv/token',
		type: 'get',
		data: { 'vid': fileId },
		async: false,
		success: function (result) {
			playsafe = result

		},
		error: function (error) {


		}
	})
	if (playsafe == '') {
		alert('请将播放器切换为flash版本，H5暂时不可用')
	}
    var playerOpt = {
        'width':'100%',
        'height':'100%',
        'vid' : fileId,
        'playsafe': playsafe,
        'code' : generateMixed(10),
        'forceH5':true,
        'flash':false,
        'hideSwitchPlayer':true
    };

    /**
     * 生成预览的html字符串
     * @param fileId
     * @param fileType
     * @param fileName
     */
    function doViewResource(fileId, fileType, fileName) {
        // var ctxPath = fileData.ctxpath;					//文件访问路径

        var imgUrl = '/file/image/' + fileId + '/watermark'; 		// 图片地址
        var pdfUrl = '/file/pdf/' + fileId;
        var str = '';

        $("#contentTitle").html(fileName);

        // 视频
        if(fileType === '1') {
            var player = polyvObject('#videoPlayer').videoPlayer(playerOpt);
            return;
        }

        if(fileType === '3') {
            str = '<img style="max-height: 100%;max-width: 100%;" src="' + imgUrl + '" />';
        }
        else if(fileType === '2') {
            str = '<video id="audio" controls autoplay name="media" class="video"><source src="' + ctxPath + '" type="audio/ogg"> <source src="' + ctxPath + '" type="audio/mpeg">浏览器不支持的格式</video>';
        }
        else if (fileType > 3 && fileType < 8) {
            str = '<iframe width="100%" height="100%" src="/static/pdfjs/web/viewer.html?file=' + encodeURIComponent(pdfUrl) + '"></iframe>';
        }

        $videoPlay.html(str);
    }
    if(msg) {
        dialog('提示', msg, 1);
    } else {
        doViewResource(fileId, fileType, name);
    }
</script>
</body>
</html>
