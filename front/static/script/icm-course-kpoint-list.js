//播放来源 1 课程详情 2 播放大厅
var playFromType = $("#playFromType").val();
var courseId = $("#courseId").val();
var playId = null;//当前播放章节id
var countPlayTimeOut = '20';//播放后 添加播放播放记录的延时（单位秒）
var setTimeoutflag;//定时
var videoPlayHtml;//id videoPlay 初始化的html
var examTimer = {};//考试监听器
$(function () {
    videoPlayHtml = $("#videoPlay").html();
    $("#contentTitle").click(function () {
        parentClick(playId);
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
        // getPlayerHtml(kpointId,$("#kpoint"+kpointId),"");
        checkResourceValid(courseId, kpointId);
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

    if($ele) {
        var $this  =$($ele);
        var $parent = $this.closest('.kpoint-item');
        $parent.siblings().removeClass('active');
        $parent.addClass('active');
    }
    $("#videoPlay").html('');

    $.ajax({
        url: baselocation + '/icmcourse/' + course_id + '/icmcoursekpoint/' + k_point_id + '/check',
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

function closeDialog() {
    var $dialogBtn = $(".dClose");
    if($dialogBtn) {
        $dialogBtn.click()
    }
}
function isURL (str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
}

function getPlayerHtml(kpointId, obj) {
    closeDialog();
    playId = kpointId;
    var $this = $(obj);
    var fileData = $this.data()
    var fileType = fileData.filetype; 			  // 文件类型
    var cloudFileId = fileData.cloudfileid;       // 云文件id
    var cloudFileName = fileData.cloudfilename;     // 云文件名称
    var ctxPath = fileData.ctxpath;					//文件访问路径
    var imgUrl = '/file/image/' + cloudFileId + '/watermark'; 		// 云文件下载地址
    var cloudFileUrl = '/file/play/' + cloudFileId; 		// 云文件下载地址
    var pdfPath = '/file/pdf/' + cloudFileId;
    //debugger;
    if(isURL(ctxPath)) {
        imgUrl = ctxPath;
        cloudFileUrl = ctxPath;
        //pdfPath = ctxPath.substring(0, ctxPath.lastIndexOf(".")).concat(".pdf");
    }

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

    if (fileType == 1) {  // 视频
        $.ajax({
            url: baselocation + "/icmfront/kpoint/" + kpointId + "/" + order,
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
            url: baselocation + "/icmfront/kpoint/" + kpointId,
            data: {},
            type: 'get',
            success: function (resp) {
                if (resp.error == '0') {
                    var $videoPlay = $("#videoPlay");
                    var str = '';

                    if (fileType == 2) {
                        str = '<video id="audio" controls autoplay name="media" class="video"><source src="' + ctxPath + '" type="audio/ogg"> <source src="' + ctxPath + '" type="audio/mpeg">浏览器不支持的格式</video>';
                    } else if (fileType == 3) {
                        str = '<img width="100%" height="100%" src="' + imgUrl + '" />';
                    } else if (fileType > 3 && fileType < 8) {
                        str = '<iframe width="100%" height="100%" src="/static/pdfjs/web/viewer.html?file=' + encodeURIComponent(pdfPath) + '&page=1"></iframe>';
                    }
                    $videoPlay.html(str);

                    if(fileType == 2) {
                        document.getElementById("audio").currentTime = 0;
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
}

