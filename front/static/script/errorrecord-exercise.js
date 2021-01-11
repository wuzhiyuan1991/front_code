var timeFalg = true;
var testTime = 0;

//计时增加
function CountUp() {
    var date = new Date();
    date.setTime(date.getTime() + (10 * 1000));
    var minutes = Math.floor(testTime / 60);
    var seconds = Math.floor(testTime % 60);
    var msg = "" + minutes + "分" + seconds + "秒";
    document.all["timer"].innerHTML = msg;
    $(".examTimerShow").html(msg);
    if (timeFalg) {
        ++testTime;
    }
    $("#testTime").val(testTime);

}

//继续做题
function jixuzuo() {
    $(".d-tips-2").remove();
    $(".dialog-shadow").remove();
    $(".bg-shadow").remove();
}

//我要交卷(考试)
function formSubmit(num) {
    dialog(1);
}

//确定交卷(考试)
function submit() {
//	addPaperRecord();
    //解除绑定
    $(window).unbind('unload');
    $(window).unbind('beforeunload');
    $("#addExerciseRecord").submit();
}


//点击下一部分
var titleheiddenNum = 0;
var titleheiddenNum_size = 1;//最大数量,每个页面要覆盖此值
function nexttitleshow() {
    titleheiddenNum = titleheiddenNum + 1;
    if (titleheiddenNum == titleheiddenNum_size) {
        titleheiddenNum = 0;
    }
    $(".titleHeiddenAndShow" + titleheiddenNum).click();
}

function titleHeiddenAndShow(id, obj) {
    titleheiddenNum = parseInt($(obj).attr("indexNum"));
    var titleValue = $(obj).attr("titlevalue");
    $("#showTitleValue").html(titleValue);
    $(obj).parent().attr("class", "current");
    $(obj).parent().siblings().each(function () {
        $(this).attr("class", "");
    });
    $("#titleHidden" + id).show();
    $("#titleHidden" + id).siblings().hide();
    // $("html").animate({scrollTop: $(".nextTitleAnchor").offset().top}, 0);
}

/**
 * 提交试卷
 */
function addPaperRecord() {
    var serialize = $("#addExerciseRecord").serialize();
    dialog(2);
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        url: baselocation + "/front/exerciseover?_bizModule=errorRecord",
        data: serialize,
        success: function (result) {
            //解除绑定
            $(window).unbind('unload');
            $(window).unbind('beforeunload');
            var passExercise = false;
            if (result.error == "0") {
            } else {
                if (result.error == "E500") {
                    alert(result.message);
                    window.close();
                    return false;
                }
            }
        }
    });
}

//选择是否单题模式
function danti(obj) {
    if ($(obj).prop("checked")) {
        showdanti();
    } else {
        showduoti();
    }
    //默认到第一题
    datikaAnchor(0, 1);
}

//下一题 ToDo
function nextqst(num) {
    //var liLength = tabList(i);
    ////判断是否是最后一题
    //if((i+1) == $(".p-ques-list ul").length && liLength == j){
    //	alert("已经是最后一题了");
    //	return;
    //}
    //if(liLength == j){
    //	i++;
    //	$(".titleHeiddenAndShow"+ i).click();
    //	j = 1;
    //}else {
    //	j++;
    //}
    //选择答题卡  点击答题卡
    if (num % 51 == 1 && num != 1) {
        nextQuestionListShow();
    }
    if ($("#datikaCurrent" + num).children("a")[0]) {
        $("#datikaCurrent" + num).children("a")[0].click();
    } else {
        $("#datikaCurrent1 ").children("a")[0].click();
    }
}

//展示单题模式
function showdanti() {
    $('input:radio').unbind("click");
    //头部部分的html隐藏
    $(".t-p-sub-title-wrap").hide();
    //底部下一部分隐藏
    $(".page-bar").hide();
    //全部试题隐藏
    $("li[class^='datikaQstAnchor']").hide();
    //第一题展示
    $(".datikaQstAnchor1").show();
    //单题模式下一题按钮展示
    $(".nextoneqst").show();
}

//展示多题模式
function showduoti() {

    $(".t-p-sub-title-wrap").show();
    $(".page-bar").show();
    //单题模式下一题按钮隐藏
    $(".nextoneqst").hide();
    //全部试题隐藏
    $("li[class^='datikaQstAnchor']").show();
    //材料显示
    $(".cailiaohiddle").show();
}

//解析时显示正确错题
function showErrorQuestion() {
    $(".rightQuestion").hide();
}

//解析时显示所有
function showAllQuestion() {
    $(".rightQuestion").show();
}

//解析时显示错题
function lookErrorQuestion(obj) {
    if ($(obj).prop("checked")) {
        showErrorQuestion();
    } else {
        showAllQuestion();
    }
}

function changecheck() {
    var len = $("#checkContent").val().length;
    if (len == 0) {
        $("#notetips").html("请输入内容");
        return;
    }
    $("#notetips").html("您还可以输入" + (200 - len) + "个字");
}

function checkAnswer(paperId, qstId, obj) {
    dialog(8);
    $("#checksubmit").click(function () {
        var content = $("#checkContent").val();
        if (content == null || content.trim() == '') {
            alert("内容不能为空");
            return false;
        }
        if (content.length > 200) {
            alert("你最多能输入200个字");
            return false;
        } else {
            $.ajax({
                url: baselocation + "/quest/addQuestErrorCheck",
                data: {"questErrorCheck.paperId": paperId, "questErrorCheck.questionId": qstId, "questErrorCheck.content": content},
                dataType: "json",
                type: "post",
                async: false,
                success: function (result) {
                    if (result.message == "success") {
                        $("#dialog-shadow #dcWrap .dtClose").click();
                        alert("成功提交，等待处理");
                    } else {
                        alert("失败，请稍后重试");
                    }
                }
            });

        }
    });
}

function getvideoCode(freeUrl) {
    dialog(12);
    var str = "<script src='http://union.bokecc.com/player?vid=" + freeUrl + "&siteid=${websitemapCC.cc.ccappID }&autoStart=true&width=100%&height=100%&playerid==D86AD47DE27F8F5A&playertype=1' type='text/javascript'/>";
    $("#vHtml").html(str);
    //alert(qstId);
    /*$.ajax({
        url : "" + baselocation + "/paper/getVideoHtml",
        data : {
            "qstId" : qstId
        },
        type : "post",
        dataType : "text",
        success : function(result) {
            var str = "<script src='http://union.bokecc.com/player?vid="+freeUrl+"&siteid=${websitemapCC.cc.ccappID }&autoStart=true&width=100%&height=100%&playerid==D86AD47DE27F8F5A&playertype=1' type='text/javascript'/>";
            $("#playcc").html(str);
            //$("#vedioSpace").html(result);
            dialog(12,result);
            //$("#vHtml").html(result);
        }
    });*/
}

//添加标记
function doMark(index, obj) {
    $("#mark" + index).show();
    $(obj).title = "取消标签";
    $(obj).html("取消标签");
    $(obj).parent().html('<em class=""><img src="/static/exam/images/bqian.png" /></em><a href="javascript:void(0)" onclick="notMark(' + index + ',this)" title="取消标记" qstId="notMark' + index + '" class="vam c-666 ml5" style="display: inline-block;margin-top: -10px;">取消标记</a>');
}

function notMark(index, obj) {
    $("#mark" + index).hide();
    $(obj).title = "添加标签";
    $(obj).html("添加标签");
    $(obj).parent().html('<em class=""><img src="/static/exam/images/bqian.png" /></em><a href="javascript:void(0)" onclick="doMark(' + index + ',this)" title="添加标记" qstId="doMark' + index + '" class="vam c-666 ml5" style="display: inline-block;margin-top: -10px;">添加标记</a>');
}
