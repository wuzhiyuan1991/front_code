//播放来源 1 课程详情 2 播放大厅
var playFromType = $("#playFromType").val();
var courseId = $("#courseId").val();
var playId = null;//当前播放章节id
var playType = null;//当前播放章节的文件类型
var isDownloadable = $("#isDownloadable").val();
var countPlayTimeOut = '20';//播放后 添加播放播放记录的延时（单位秒）
var setTimeoutflag;//定时
var videoPlayHtml;//id videoPlay 初始化的html
var examTimer = {};//考试监听器
$(function () {
    videoPlayHtml = $("#videoPlay").html();
    $("#contentTitle").click(function () {
        parentClick(playId);
    });
    
    $(window).bind('unload',function(){
    	saveSchedule();//记录之前播放章节的进度
	});
});

function parentClick(kpointId) {
    var parentNode = $("#kpoint" + kpointId).parents(".lh-menu-ol").siblings(".l-m-stitle")[0];
    $(parentNode).parent("li").siblings().children("ol").slideUp(50);
    $(parentNode).siblings("ol").slideDown(150);
    $(parentNode).parent("li").siblings().children("a").removeClass("current-1");
    $(parentNode).addClass("current-1");
}

//视频试听播放方法
function vedioClick(kpointId) {
    if (!!kpointId) {
        parentClick(kpointId);
        // 播放视频
        checkResourceValid(courseId, kpointId);
        // getPlayerHtml(kpointId, $("#kpoint" + kpointId), "");
    } else {
        dialog('提示', "该课程暂不支持播放!", 1);
    }
}
/**
 * 检查课件的状态；比如视频是否审核通过
 * @param course_id 课程id
 * @param k_point_id 章节id
 * @param $ele jquery对象
 */
function checkResourceValid(course_id, k_point_id, $ele) {

    // 默认值
    course_id = course_id || courseId;
    k_point_id = k_point_id || defaultKpoint;

    $.ajax({
        url: baselocation + '/course/' + course_id + '/coursekpoint/' + k_point_id + '/check',
        data: {},
        type: 'get',
        success: function (result) {
            if (result.error === '0') {
                if($ele instanceof jQuery) {
                    getPlayerHtml(k_point_id, $ele, "");
                } else {
                    getPlayerHtml(k_point_id, $("#kpoint" + k_point_id), "");
                }
            } else {
                dialog('提示', result.message, 1);
            }
        },
        error: function () {
            dialog('提示', '课件正在审核中，请审核通过之后再播放', 1);
        }
    })
}

/**
 * 课程目录章节点击事件
 * @param k_point_id
 * @param $ele
 * @param k_point_name
 */
function onCatalogItemClick(k_point_id, $ele, k_point_name) {
    checkResourceValid(defaultKpoint, k_point_id, $ele);
}
/**
 * 获得播放器的html
 */
var timer = {};
var objMap = {};
var currentKPointId;
function getPlayerHtml(kpointId, obj) {
    var $btnBox = $("#phrbtns");
    $btnBox.html('');
    saveSchedule();//记录之前播放章节的进度
    currentKPointId = kpointId;
    playId = kpointId;
    var $this = $(obj);
    var fileData = $this.data()
    var fileType = fileData.filetype; 			  // 文件类型
    playType = fileType;
    var cloudFileId = fileData.cloudfileid;       // 云文件id
    var cloudFileName = fileData.cloudfilename;     // 云文件名称
    var ctxPath = fileData.ctxpath;					//文件访问路径
    var imgUrl = '/file/image/' + cloudFileId + '/scale'; 		// 云文件下载地址
    var cloudFileUrl = '/file/play/' + cloudFileId; 		// 云文件下载地址
    var pdfUrl = '/file/pdf/' + cloudFileId; 		// 云文件生成的pdf地址
    var status = fileData.status;
    //拼接标题内容 开始
    var parentName = fileData.parentname;
    var kpointName = fileData.kpointname;
    var contentTitle = courseName;
    if (!!parentName) {
        contentTitle += "&nbsp;>&nbsp;" + parentName;
    }
    if (!!kpointName) {
        contentTitle += "&nbsp;>&nbsp;" + kpointName;
    }
    $("#contentTitle").html(contentTitle);
    //拼接标题内容 结束

    // 设置点击状态
    var $parent = $this.closest('.kpoint-item');
    $parent.addClass('active');
    $parent.siblings().removeClass('active');

    if (!objMap) {
        objMap = {};
    }
    if (!timer) {
        timer = {};
    }
    // 学习必须先登陆
    if (!isLogin()) {
        lrFun();
        return;
    }

    var b = false; //是否开启强制章节顺序学习功能
    if (b) {
        var index = 0;//当前点击章节的节点下标
        $(".lh-menu-second a").each(function (i, k) {
            if ($(this).attr("kpointId") == kpointId) {
                index = i;
            }
        });
        if (index > 1 && $(".fr>a").eq(index - 1).attr("studyStatus") != 2) {
            dialog('提示', '请先完成上一章节的学习', 1);
            return;
        }
    }
    // 移除一级节点选中
    $(".lh-menu-stair").find("ul").removeClass("current-2");
    // 移除二级节点选中
    $(".lh-menu-stair").find("ol>li").removeClass("current-2");
    //选中当前节点
    $(obj).parent().parent().addClass("current-2");

    //记录当前点击对象
    var order = new Date().getTime() + "";
    objMap[order] = obj;
    var taskId = $("#taskId").val();

    if (fileType == 1) {  // 视频
        $.ajax({
            url: baselocation + "/front/kpoint/" + kpointId + "/" + order,
            data: {},
            type: "get",
            dataType: "text",
            cache: false,
            async: false,
            success: function (result) {
                if (checkIsMobile()) { // 移动端环境下效果
                    //音频播放 单独还原设置  播放器高度动态赋值
                    var wH = parseInt(document.documentElement.clientHeight, 10);
                    //$("#p-h-box").css("height", wH - 258);
                    $("#p-h-r-cont").css("height", wH - 363);
                    $(".p-h-video").css("height", wH - 330);
                }
                /*是否覆盖*/
                if (result.indexOf("noCover=true") == -1) {
                    //设置定时器，监听视频是否看完
                    timer[order] = window.setInterval("IfVideoOver(" + order + ",'" + kpointId + "','" + courseId + "','" + taskId + "')", 500);
                    $("#videoPlay").html(result);
                    if (playFromType == 1) {//课程详情页面
                        //锚定
                        window.location.href = "#header";
                    }
                } else {
                    $("#videoPlay").html(videoPlayHtml);
                    $("#videoPlay").append(result);
                }
            },
            error: function (error) {
                dialog('提示', '系统繁忙，请稍后再操作', 1);
            }
        });
    } else { // 非视频课件
        //renderCourseware(cloudFileUrl, cloudFileName)
        $.ajax({
            url: baselocation + "/front/kpoint/" + kpointId,
            data: {},
            type: 'get',
            success: function (resp) {
                if (resp.error == '0') {
                    var $videoPlay = $("#videoPlay");
                    var $btnBox = $("#phrbtns");
                    var hasExercise = resp.content.hasExercise;
                    var str = '';

                    if (fileType == 2) {
//                    	str = '<embed width="100%" height="100%" style="background:black;" src="' + ctxPath + '" />';
                    	str = '<video id="audio" controls autoplay name="media" class="video"><source src="' + ctxPath + '" type="audio/mpeg"></video>';
                    } else if (fileType == 3) {
                    	str = '<img width="100%" height="100%" src="' + imgUrl + '" />';
                    } else if (fileType > 3 && fileType < 8) {
                    	str = '<iframe width="100%" height="100%" src="/static/pdfjs/web/viewer.html?file=' + encodeURIComponent(pdfUrl) + '"></iframe>';

                    }
                    $videoPlay.html(str);
                    seekSchedule();//继续上次播放进度

                    if(fileType == 2) {
                    	listenAudioPlayEnded(taskId, kpointId)
                    }
                    var btnStr = '';

                    if (status != 2 && hasExercise) {
                        btnStr += '<a href="javascript:void(0);" class="btn-go-test btn-test-new">进入课后测试</a>';
                    }
                    if (isDownloadable == 1) {
                        btnStr += '<a href="' + cloudFileUrl + '" target="_blank" download="' + cloudFileName + '" class="btn-test-new">下载课件</a>'
                    }

                    $btnBox.html(btnStr)
                        .find('.btn-go-test').on('click', function () {
                        IfVideoOver(order, kpointId, courseId, taskId, true)
                    });
//	                if(fileType > 3 && fileType <8) {
//	                	new FlexPaperViewer('/static/script/FlexPaperViewer','viewerPlaceHolder',{config:{SwfFile:swfPath,Scale:1.2,
//	                        ZoomTransition:'easeOut',ZoomTime:0.5,ZoomInterval:0.2,PrintEnabled:false,FitPageOnLoad:false,FitWidthOnload:false,
//	                        FullScreenAsMaxWindow:true,ProgressiveLoading:false,MinZoomSize:0.2,MaxZoomSize:5,SearchMatchAll:false,
//	                        InitViewMode:'SinglePage',RenderingOrder : 'flash',ViewModeToolsVisible:true,ZoomToolsVisible:true,NavToolsVisible:true,CursorToolsVisible:true,
//	                        SearchToolsVisible:true,localeChain:'zh_CN'}});
//	                }

                    // 没有课后练习的非视频课程，直接调用播放完成接口
                    if (!hasExercise && fileType != 1 && fileType != 2) {
                        setKpointStatus(taskId, kpointId, function (result) {
                            if (!result.content.hasExercise && !result.content.isFinished) {
                                //改变章节学习记录状态，绿色为通过，蓝色为未通过
                                $("#kpoint" + kpointId).children("em").attr("style", "background:rgba(0, 128, 0, 0.51)");
                            }
                        })
                    }
                } else {
                    dialog('提示', resp.message, 1);
                }

            },
            error: function (resp) {
                console.log('请求失败', resp);
            }
        })

    }
    // else if (fileType == 2) {
    //     renderCourseware(cloudFileUrl, cloudFileName)
    // } else if (fileType == 3) {
    //     renderCourseware(cloudFileUrl, cloudFileName)
    // } else if (fileType == 4) {
    //     renderCourseware(cloudFileUrl, cloudFileName)
    // } else if (fileType == 5) {
    //     renderCourseware(cloudFileUrl, cloudFileName)
    // } else if (fileType == 6) {
    //     renderCourseware(cloudFileUrl, cloudFileName)
    // } else if (fileType == 7) {
    //     renderCourseware(cloudFileUrl, cloudFileName)
    // }
}


function saveSchedule() {
	//切换章节时需要缓存之前章节的播放进度(音频/office/pdf需要缓存，视频文件播放器自带记录进度功能)
	if(!!playId && !!playType && (playType == 2 ||  (playType >= 4 && playType <= 7))) {
		var key = "kpoint_schedule_" + playId;//缓存的key
		if(playType == 2) {
		    var audio = document.getElementById("audio");
			var currentTime = audio ? document.getElementById("audio").currentTime : 0;
			localStorage.setItem(key, currentTime + "_" + playType);
		}
//		else if(playType >= 4 && playType <= 7) {
//			var pageNumber = $("#pageNumber").val();
//			localStorage.setItem(key, pageNumber + "_" + playType);
//		}
	}
}

function seekSchedule() {
	//播放章节时从上次退出的进度继续播放(只处理音频/office/pdf，视频文件播放器自带记录进度功能)
	if(!!playId && !!playType && (playType == 2 ||  (playType >= 4 && playType <= 7))) {
		var key = "kpoint_schedule_" + playId;//缓存的key
		var item = localStorage.getItem(key);//获取缓存中的信息
		var typeInStorage = null;//缓存的课件类型
		var scheduleInStorage = null;//缓存的进度
		if(!!item) {
			var arr = item.split("_");
			if(!!arr && arr.length == 2) {
				scheduleInStorage = parseFloat(arr[0]);
				typeInStorage = parseFloat(arr[1]);
			}
		}
		if(playType == 2) {
			document.getElementById("audio").currentTime = scheduleInStorage;
		}
//		else if(playType >= 4 && playType <= 7) {
//			$("#pageNumber").val(scheduleInStorage);
//		}
	}
}

//音频播放完成
function listenAudioPlayEnded(taskId, kpointId) {
    var audio = document.getElementById("audio");
    audio.addEventListener('ended', function () {
    	setKpointStatus(taskId, kpointId, afterPlayEnded);
    })
}

function afterPlayEnded(result) {
    var order = new Date().getTime() + "";
	if (result.message) {
        dialog('提示', result.message, 1);
        return false;
    }
    nextKpointId = result.content.kpointId;
    isNext = result.content.isNext;
    if (!result.content.hasExercise && !result.content.isFinished) {
        //改变章节学习记录状态，绿色为通过，蓝色为未通过
        var playObject = $("#kpoint" + currentKPointId);
        playObject.children("em").attr("style", "background:rgba(0, 128, 0, 0.51)");
        $("#sectionPlayIco").attr("onclick", "vedioClick('" + nextKpointId + "')")
    } else {
        //改变章节学习记录状态，绿色为通过，蓝色为未通过
        var playObject = $("#kpoint" + currentKPointId);
        if (!result.content.isFinished) {
            playObject.children("em").attr("style", "background:rgba(0, 205, 217, 0.38)");
        }
        if (result.content.paperId) {

            var examNum = new Date().getTime();
            var examUrl = baselocation + "/front/exercise/" + result.content.paperId + "?examNum=" + examNum + "&courseId=" + courseId + "&id=" + currentKPointId + "&examKey=" + result.content.examKey + "&taskId=" + taskId;
            dialog('提示', "本章节考试通过才算完成，是否进入章节测试？", 7, examUrl, function () {
                $("#videoPlay").html('');
                $("#videoPlay").next().html('<img src="../../static/img/in-exam.png"><p class="hLh20"><span style="color: #A6B8CC;">考试中...</span></p>');
            });
            //手机浏览，不弹出窗口，直接跳转页面
            if (checkIsMobile()) {
                window.location.href = examUrl;
                return;
            }
            //设置定时器，鉴定考试是否完成
            if (!checkIsMobile()) {
                if (!examTimer) {
                    examTimer = {};
                }
                examTimer[order] = window.setInterval("IfExamOver(" + examNum + "," + order + ",'" + result.content.paperId + "','" + courseId + "','" + currentKPointId + "','" + taskId + "')", 500);
            }
        } else {
            delete objMap[order];
//				$("#kpoint"+result.content.kpointId).click();
            $("#sectionPlayIco").attr("onclick", "vedioClick('" + nextKpointId + "')")
        }
    }
}

/**
 * 播放结束设置状态
 */
function setKpointStatus(taskId, kpointId, callback) {
    $.ajax({
        url: baselocation + "/front/videoover/" + taskId + "/" + kpointId,
        data: {},
        type: "post",
        dataType: "json",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("require-token", "");
        },
        success: function (resp) {
            callback && callback(resp);
        },
        error: function (e) {
            console.log('请求失败', e);
        }
    })
}

var nextKpointId = "";
var isNext = true;

function IfVideoOver(order, kpointId, courseId, taskId, isNotVideo) {
    if (unescape(getCookie("videoOver" + order)) == "true" || isNotVideo) {
        window.clearInterval(timer[order]);
        DeleteCookie("videoOver" + order, "");
        setKpointStatus(taskId, kpointId, function (result) {
            if (result.message) {
                dialog('提示', result.message, 1);
                return false;
            }
            nextKpointId = result.content.kpointId;
            isNext = result.content.isNext;
            if (!result.content.hasExercise && !result.content.isFinished) {
                //改变章节学习记录状态，绿色为通过，蓝色为未通过
                var playObject = $("#kpoint" + kpointId);
                playObject.children("em").attr("style", "background:rgba(0, 128, 0, 0.51)");
                $("#sectionPlayIco").attr("onclick", "vedioClick('" + nextKpointId + "')")
            } else {
                //改变章节学习记录状态，绿色为通过，蓝色为未通过
                var playObject = $("#kpoint" + kpointId);
                if (!result.content.isFinished) {
                    playObject.children("em").attr("style", "background:rgba(0, 205, 217, 0.38)");
                }
                if (result.content.paperId) {

                    var examNum = new Date().getTime();
                    var examUrl = baselocation + "/front/exercise/" + result.content.paperId + "?examNum=" + examNum + "&courseId=" + courseId + "&id=" + kpointId + "&examKey=" + result.content.examKey + "&taskId=" + taskId;
                    dialog('提示', "本章节考试通过才算完成，是否进入章节测试？", 7, examUrl, function () {
                        $("#videoPlay").html('');
                        $("#videoPlay").next().html('<img src="../../static/img/in-exam.png"><p class="hLh20"><span style="color: #A6B8CC;">考试中...</span></p>');
                    });
                    //手机浏览，不弹出窗口，直接跳转页面
                    if (checkIsMobile()) {
                        window.location.href = examUrl;
                        return;
                    }
                    //设置定时器，鉴定考试是否完成
                    if (!checkIsMobile()) {
                        if (!examTimer) {
                            examTimer = {};
                        }
                        examTimer[order] = window.setInterval("IfExamOver(" + examNum + "," + order + ",'" + result.content.paperId + "','" + courseId + "','" + kpointId + "','" + taskId + "')", 500);
                    }
                } else {
                    delete objMap[order];
//						$("#kpoint"+result.content.kpointId).click();
                    $("#sectionPlayIco").attr("onclick", "vedioClick('" + nextKpointId + "')")
                }
            }
        })
    }
}

function IfExamOver(examNum, order, paperId, courseId, kpointId, taskId) {
    if (unescape(getCookie("passExercise" + examNum)) != "null") {
        window.clearInterval(examTimer[order]);
        $("#videoPlay").html(videoPlayHtml);
        $("#videoPlay").next().html("");
        if (unescape(getCookie("passExercise" + examNum)) == "true") {
            //改变章节学习记录状态，绿色为通过，蓝色为未通过
            var playObject = $("#kpoint" + kpointId);
            playObject.children("em").attr("style", "background:rgba(0, 128, 0, 0.51)");
            $("#sectionPlayIco").attr("onclick", "vedioClick('" + nextKpointId + "')")
            dialog('提示', "顺利通过考试，恭喜！", 0);
        } else if (unescape(getCookie("passExercise" + examNum)) == "false") {
//			$("#kpoint"+kpointId).click();

            $("#sectionPlayIco").attr("onclick", "vedioClick('" + kpointId + "')")
            dialog('提示', "很遗憾，考试没能通过", 1);
        }
        delete objMap[order];
        DeleteCookie("passExercise" + examNum, "");
    }
}

/**
 * 记录播放次数
 *
 * @param courseId
 *            课程id
 * @param kpointId
 *            节点id
 */
//function addPlayTimes(courseId, kpointId) {
//	$.ajax({
//		url : baselocation + "/couserStudyHistory/ajax/playertimes",
//		data : {
//			"kpointId" : kpointId,
//			"courseId" : courseId
//		},
//		type : "post",
//		dataType : "text",
//		async : false,
//		success : function(result) {
//		}
//	});
//}