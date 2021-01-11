<%@ page import="com.safewaychina.safeye.common.base.constants.SessionConstants" %>
<%@ page import="com.safewaychina.safeye.common.base.constants.SystemConstants" %>
<%@ page import="java.util.Objects" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%
    if(session.getAttribute(SessionConstants.LOGIN_USER_ID) != null && !Objects.equals(session.getAttribute(SessionConstants.RESET_PWD), true)) {
        response.sendRedirect("/html/main.html");
    }
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html style="overflow: hidden;height: 100%;">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <%--强制360浏览器使用IE内核，触发下载Chrome浏览器弹窗--%>
    <meta name="renderer" content="ie-stand">
    <script type="text/javascript" src="html/js/libs/jquery/jquery-3.4.0.min.js"></script>
    <script type="text/javascript" src="html/js/libs/RSA_Stripped-min.js"></script>
    <script type="text/javascript" src="html/js/libs/base64.js"></script>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" id="favicon">
    <title></title>
    <style>
        h1 {
            font-size: 30px;
            margin-top: 37px;
        }

        .login form {
            height: 58%;
        }

        .login form .input {
            width: 80%;
            left: 10%;
            position: relative;
        }

        .login form .input .inputItem {
            width: 100%;
            height: 40px;
            line-height: 38px;
            overflow: hidden;
            text-indent: 15px;
            font-size: 16px;
            outline: none;
            border-radius: 40px;
            margin-top: 20px;
            border: 1px solid #c8c8c8;
            color: #333333;
        }

        .login form .input .inputItem.red {
            border: 1px solid #f60;
        }

        .login form button {
            width: 80%;
            height: 45px;
            line-height: 38px;
            overflow: hidden;
            font-size: 24px;
            outline: none;
            border-radius: 40px;
            border: 1px solid #31a8ff;
            background: #31a8ff;
            color: #fff;
        }

        .login form button:hover {
            cursor: pointer;
            background: #2886cc;
        }

        .login .input input:focus {
            border: 1px solid #32a7ff;
        }
        .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 99;
            background-color: rgba(0, 0, 0, 0.3);
            text-align: center;
            display: none;
        }
        .mask-content {
            background-color: #fff;
            padding: 25px 50px 40px;
            border-radius: 10px;
            width: 300px;
            display: inline-block;
            margin-top: 200px;
        }
        .btn-download {
            width: 100%;
            background-color: #5e85ff;
            border: none;
            color: #fff;
            height: 40px;
            outline: none;
            display: block;
            text-align: center;
            line-height: 40px;
            text-decoration: none;
        }
        .login form button[disabled]::before {
            position: absolute;
            top: -1px;
            left: -1px;
            bottom: -1px;
            right: -1px;
            background: #fff;
            opacity: 0.35;
            content: '';
            border-radius: inherit;
            z-index: 1;
            -webkit-transition: opacity .2s;
            transition: opacity .2s;
            pointer-events: none;
            display: none;
            cursor: none;
        }
        .login form button[disabled]::before {
            display: block;
        }
        .login form button[disabled]:hover {
            background: #31a8ff;
            cursor: not-allowed;
        }

        .apk-box {
            font-family: PingFang SC,Helvetica Neue,Hiragino Sans GB,Segoe UI,Microsoft YaHei,微软雅黑,sans-serif;
            position: fixed;
            right: 0;
            bottom: 80px;
            cursor: pointer;
            z-index: 999;
            display: none;
        }
        .apk-box .text {
            writing-mode: vertical-lr;
            position: relative;
            width: 40px;
            height: 130px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: #06f;
            color: #fff;
            border-radius: 2px 0 0 2px;
            letter-spacing: 3px;
        }
        .apk-box .html/images/all {
            position: absolute;
            top: -25px;
            right: 31px;
            visibility: hidden;
            opacity: 0;
            transition: all .2s ease-in-out;
            -webkit-transform: translateX(8px);
            transform: translateX(8px);
            background-color: #fff;
            padding: 10px;
            border-radius: 5px;
        }
        .apk-box:hover .html/images/all {
            -webkit-transform: translateX(-10px);
            transform: translateX(-10px);
            opacity: 1;
            visibility: visible;
        }

        ul, ul li {
            list-style: none;
            margin: 0;
            padding: 0;
            border: none;
            zoom: 1;
        }
        .box {
            font-family: PingFang SC,Helvetica Neue,Hiragino Sans GB,Segoe UI,Microsoft YaHei,微软雅黑,sans-serif;
            width: 52px;
            height: 162px;
            /*border: 1px solid #ccc;*/
            position: fixed;
            right: 0;
            bottom: 80px;
            display: none;
        }
        .box ul li {
            width: 48px;
            display: block;
            height: 50px;
            padding: 2px;
            overflow: hidden
        }
        .weixin {
            background: url(./html/images/all.png) no-repeat;
            background-position: 0 87%;
            -webkit-transition: all .3s;
            -moz-transition: all .3s;
            -ms-transition: all .3s;
            -o-transition: all .3s;
        }
        .weixin:hover {
            background-position: 0 93%
        }
        .weixin:hover .weixin-logo {
            width: 170px;
            height: 204px;
        }
        .idea {
            background: url(./html/images/all.png) no-repeat;
            background-position: 0 43%;
            -webkit-transition: all .3s;
            -moz-transition: all .3s;
            -ms-transition: all .3s;
            -o-transition: all .3s;
        }
        .idea:hover {
            background-position: 0 49%;
        }
        .app, .appios {
            background: url(./html/images/all.png) no-repeat;
            background-position: 0 -490px;
            -webkit-transition: all .3s;
            -moz-transition: all .3s;
            -ms-transition: all .3s;
            -o-transition: all .3s;
        }
        .appios{
            background-position: -67px -490px;
        }

        .app:hover {
            background-position: 0 -550px;
        }
        .appios:hover{
            background-position: -67px -550px;
            cursor: pointer;
        }
        .app:hover .app-logo , .appios:hover .app-logo{
            -webkit-transform: scale(1) rotate(360deg);
            transform: scale(1) rotate(360deg);
        }
        .weixin-logo {
            background: url(./html/images/all.png) no-repeat;
            background-position: 0 0;
            width: 0px;
            height: 0px;
            overflow: hidden;
            position: absolute;
            top: -154px;
            left: -171px;
            -webkit-transition: all .3s;
            -moz-transition: all .3s;
            -ms-transition: all .3s;
            -o-transition: all .3s;
        }
        .app-logo {
            overflow: hidden;
            position: absolute;
            top: -18px;
            left: -171px;
            transform: scale(0) rotate(0);
            -webkit-transition: all .3s;
            transition: all .3s;
            padding: 15px;
            background: #fff;
            border-radius: 4px;
            box-sizing: border-box;
            box-shadow: 0 0 5px 5px #eee;
        }
        .app-logo > p {
            font-size: 12px;
            text-align: center;
            margin-top: 0;
            letter-spacing: 1px;
            color: #666;
        }
        #ios {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #d0d6d9;
            cursor: pointer;
        }
    </style>
</head>
<body style="background-repeat:no-repeat;background-size: 100% 100%;background-attachment: fixed;font-family: ' 方正兰亭黑简体 ';height:100%; overflow: hidden;">
<div class="login" id="login"
     style="position: absolute;top: calc(50% - 170px);left: calc(50% - 240px);text-align: center;color: #00467c;border-radius: 5px;height: 340px;width: 480px;">
    <h1 id="slogan">欢迎登录安全眼系统</h1>
    <form>
        <div class="input">
            <input class="inputItem" placeholder="请输入用户名" id="loginName">
        </div>
        <div class="input">
            <input type="password" class="inputItem" placeholder="请输入密码" id="password" autocomplete="off">
        </div>
        <div style="display: flex;padding-left: 50px;height: 44px;align-items: center;">
            <label for="checkbox" style="display: none;" id="checkboxLabel">
                <input type="checkbox" id="checkbox">
                自动记住密码
            </label>
        </div>
        <button id="loginButton">登&nbsp;录</button>
    </form>
</div>
<div class="login" id="resetPsw" style="display : none ;position: absolute;top: calc(50% - 170px);left: calc(50% - 240px);text-align: center;color: #00467c;border-radius: 5px;height: 340px;width: 480px;">
    <h1 id="resetPswTitle">修改密码</h1>
    <form>

        <div class="input"  style="display : none;">
            <input type="password" class="inputItem"  id="oldpassword" autocomplete="off">
        </div>
        <div class="input">
            <input type="password" class="inputItem" placeholder="请输入新密码" id="newpassword" autocomplete="off">
        </div>
        <div class="input">
            <input type="password" class="inputItem" placeholder="请确认新密码" id="confpassword" autocomplete="off">
        </div>
        <span id = "pwdRule" style="    color: red;text-align: left;padding-left: 50px;padding-right: 50px;white-space: normal;word-break: break-all;display: block;margin-top: 10px;margin-bottom: 10px;" ></span>
        <div style="display: flex;height: 44px;align-items: center;justify-content: center" >
            <button id="save" type="button">保存</button>
        </div>
    </form>
</div>
<div class="mask" id="not-chrome-mask">
    <div class="mask-content">
        <h3>为了您更好的体验“安全眼”系统，请使用谷歌浏览器登录浏览</h3>
        <div>
            <a href="https://pc.qq.com/" class="btn-download">下载谷歌浏览器</a>
        </div>
    </div>
</div>
<div class="box">
    <ul>
        <%--<li class="weixin">--%>
        <%--<div class="weixin-logo"></div>--%>
        <%--</li>--%>
        <%--<li class="idea"></li>--%>
        <li class="app" id="android">
            <div class="app-logo">
                <p>请使用安卓手机<br>浏览器扫码下载</p>
                <img id="apkImg" width="130" height="130" alt="">
            </div>
        </li>
        <li class="appios" id="iosapp">
            <div class="app-logo">
                <p>请使用苹果手机<br>二维码扫码器扫码</p>
                <img id="iosImg" width="130" height="130" alt="">
            </div>
        </li>
        <li class="ios" id="ios" title="iOS安装教程">
            <img src="./html/images/ios.png" alt="">
        </li>
    </ul>
</div>

</body>
</html>
<script>
    var $loginButton = $("#loginButton");
    var resetLoginButton = function () {
        $loginButton.prop("disabled", false);
        $loginButton.html("登&nbsp;录")
    };
    resetLoginButton();

    var isChrome = (function () {
        var userAgent = navigator.userAgent;
        return (userAgent.indexOf("Chrome") > -1);
    })();

    if(!isChrome) {
        document.getElementById("not-chrome-mask").style.display = 'block';
        document.getElementById("login").style.display = 'none';
    }
    var ctxpath = "";
    var key = "";
    var address = "";
    var t = "";
    var isAutoLogin = "<%=SystemConstants.IS_LOGIN_AUTOMATIC %>" === '2';
    if (isAutoLogin) {
    	$("#checkboxLabel").css("display", "block");
        var hasChecked = window.localStorage.getItem("INDEXJSP03") === "1";
        if (hasChecked) {
        	$("#checkbox").prop("checked", true);
            var username = window.localStorage.getItem("INDEXJSP01");
            var password = window.localStorage.getItem("INDEXJSP02");
            if (username) {
                $("#loginName").val(username);
            }
            if (password) {
                $("#password").val(atob(password));
            }
        }
    }
    // if(isResetPwd){
    //     $("#login").css("display", "none");
    //     $("#resetPsw").css("display", "block");
    // }
            
    window.localStorage.removeItem("accessUrl");
    //从服务器获取加密钥匙
    $.getJSON(ctxpath + "/user/key?v=" + Math.random(), function (data) {
        if (data && data.content) {
            if(data.content.accessUrl) {
                window.localStorage.setItem("accessUrl", data.content.accessUrl);
            }
            if(data.content.loginStyle){
                $("#login")[0].style = data.content.loginStyle;
            }
            setMaxDigits(130);
            if(data.content.refreshIcon) {
                $("#favicon").prop("href", "/favicon.ico?t=" + new Date().getTime());
            }
            key = new RSAKeyPair(data.content.e, "", data.content.m);
            t = data.content.t;
            $("title").html(data.content.title);
            $("#slogan").html(data.content.slogan);
            $("body").css('background', 'url(' + data.content.bgImg + ') no-repeat');
            $("body").css('background-size', '100% 100%');
            $(".login").css('background', 'url(' + data.content.lgImg + ')');
            $(".login").css('background-size', 'cover');
            if (data.content.apkImg) {
                $("#apkImg").prop("src", data.content.apkImg);
                $(".box").show();
                $("#android").show();
            } else {
                $("#android").hide();
            }
            if (data.content.iosname) {
                $(".box").show();
                $("#ios").show();
                $("#ios").on("click", function () {
                    window.open("/html/ios-helper.html?name=" + data.content.iosname)
                })
            } else {
                $("#ios").hide();
            }
            if (data.content.iosImg) {
                $("#iosImg").prop("src", data.content.iosImg);
                $(".box").show();
                $("#iosapp").show();
                $("#ios").hide();
                $("#iosapp").on("click", function () {
                    window.open("/html/ios-helper.html?type=1");
                })
            } else {
                $("#iosapp").hide();
            }
            var links = document.getElementsByTagName("link");
            var link = {};
            for (var i = 0; i < links.length; i++) {
                link = links[i];
                if (link.rel === "icon") {
                    link.href = data.content.icon;
                }
            }


        } else {
            if (data.error == 'E10019') {
                location.href = '404.html';
            } else {
                alert("服务器异常,请联系管理员!");
            }
        }
    });

    //获取登录使用的地理位置
    $.ajax({
        url: "https://ip.ws.126.net/ipquery?ie=utf-8&v=" + Math.random(),
        type: 'GET',
        dataType: 'script',
        success: function () {
            address = localAddress.province + localAddress.city;
        }
    });

    $("#save").on("click", function (e) {
        var newpassword = $("#newpassword").val().trim();
        var confpassword = $("#confpassword").val().trim();
        var oldpassword = $("#oldpassword").val().trim();
        var loginName = $("#loginName").val().trim();
        if(newpassword == confpassword) {
            var jsonPassword={
                oldPwd:oldpassword,
                newPwd:newpassword,
                resetPwd:confpassword,
                loginName:loginName
            }
            var json_str = JSON.stringify(jsonPassword);
            var  password = Base64.encode(json_str);
            $.ajax({
                type: "PUT",
                url: ctxpath + '/user/reset/pwd',
                data: JSON.stringify({"key" : password}),
                contentType : 'application/json',
                dataType: 'json',
                success: function (data) {
                    if(data.error == "E500"){
                        alert(data.message);
                    }else{
                        alert("修改成功");
                        $.getJSON(ctxpath + "/user/logout", function (data) {
                            window.location.reload();
                        })
                    }

                },
                error: function (data) {
                    alert("重设密码异常,请联系管理员！")
                }
            });
        }else{
            alert("新密码和重置密码不一致 请重新输入");
        }
    });

    //登录
    $loginButton.on("click", function (e) {
        e.preventDefault();
        var loginName = encodeURI($("#loginName").val().trim());
        var password = $("#password").val().trim();
        if ($("#checkbox").prop("checked")) {
            window.localStorage.setItem("INDEXJSP01", loginName);
            window.localStorage.setItem("INDEXJSP02", btoa(password));
            window.localStorage.setItem("INDEXJSP03", "1");
        } else {
            window.localStorage.removeItem("INDEXJSP03");
            window.localStorage.removeItem("INDEXJSP02");
        }

        var plainText = {"loginName": loginName, "password": password, "t": t};
        var encryText = encryptedString(key, JSON.stringify(plainText));
        if (loginName != "" && password != "") {
            $loginButton.prop("disabled", true);
            $loginButton.html("登&nbsp;录&nbsp;中...");
            $.ajax({
                type: "post",
                url: ctxpath + '/user/login',
                data: "key=" + encryText + "&address=" + address,
                dataType: 'json',
                beforeSend: function () {
                    $("#loginBtn").attr({"disabled": true}).css("background-color", "#2F32A5");
                },
                success: function (data) {
                    if (data.error == "0" && !data.content) {
                        window.location.href = ctxpath + "/html/main.html";
                    }else if(data.error == "E10031"){
                        $.getJSON(ctxpath + "/user/resetPwd/rule", function (data) {
                            if (data && data.content) {
                                $("#pwdRule").html(data.content);
                            }
                        })
                        alert("您的密码安全等级较低，请修改后重新登录！");
                        $("#login").css("display", "none");
                        $("#resetPsw").css("display", "block");
                        $("#oldpassword").val(password);
                    }else {
                        alert(data.message);
                        window.location.reload();
//                        resetLoginButton();
                    }
                },
                complete: function () {
//                    resetLoginButton();
                },
                error: function () {
                    alert("登录异常,请联系管理员！")
                    resetLoginButton();
                }
            });
        }
        else if (loginName == "" && password == "") {
            $("#loginName").addClass("red");
            $("#password").addClass("red");
            alert("请输入用户名和密码!");
        }
        else if (loginName == "" && password != "") {
            $("#loginName").addClass("red");
            alert("请输入用户名!");
        }
        else if (password == "" && loginName != "") {
            $("#password").addClass("red");
            alert("请输入密码!");
        }
    });
</script>