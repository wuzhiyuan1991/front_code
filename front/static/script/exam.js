/*测试以及下次再做页面用js*/

var maxtime =100;//最大时间每个页面要自己覆盖此值
var cookiesName="test_time";
var timer;
var timeFalg=true;
var testTime=0;	

//倒计时
function CountDown(){
	var date = new Date();
    date.setTime(date.getTime() + (10 * 1000)); 
    setCookie(cookiesName,maxtime);
	if(maxtime>=0){  
		var minutes = Math.floor(maxtime/60);
        var seconds = Math.floor(maxtime%60);
        var msg = ""+minutes+"分"+seconds+"秒";
        $("#timer").html(msg);
		$(".examTimerShow").html(msg);
		if(maxtime == 5*60){
			$("#timer").attr("style","color:red");
		} 
		if(timeFalg){
			--maxtime;
			++testTime;
		}
		$("#testTime").val(testTime);
	}  
	else{  
		submit();//交卷
	}  
}  

//计时增加
function CountUp(){
	var date = new Date();
    date.setTime(date.getTime() + (10 * 1000));
    var minutes = Math.floor(testTime/60);
    var seconds = Math.floor(testTime%60);
    var msg = ""+minutes+"分"+seconds+"秒";
	document.all["timer"].innerHTML=msg;
	$(".examTimerShow").html(msg);
    if(timeFalg){
        ++testTime;
    }
	$("#testTime").val(testTime);
	  
} 

//时间暂停
function timePause(){
	timeFalg=false;
	dialog(6);
}

//时间开始
function timeStart(){
	timeFalg=true;
	$(".bg-shadow").remove();
	$("#dcWrap").remove();
	$(".dialog-shadow").remove();
}
function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
// 获取是否需要所有试题都已选择答案
function getAllQuestionsAnswered() {
    var needAllAnswered = false;
    $.ajax({
        type: "GET",
        dataType:"json",
        async: false,
        url: baselocation+"/systembusinessset/getBusinessSetByNamePath?compId=9999999999&namePath=training.answerAllForExam",
        success:function(result){
            if (result.error === '0') {
                var content = result.content;
                needAllAnswered = content.result === '2';
            }
        }
    });
    return needAllAnswered;
}
// 统计未完成的题目数量
function getUnansweredNumber() {
    var data = getFormData($("#addExerciseRecord"));
    var unansweredNumber = 0; // 未回答题目总数， 后面弹窗的时候需要
    for (var k in data) {
        if (k.indexOf("userAnswer") > -1) {
            if (!data[k]) {
                unansweredNumber += 1;
            }
        }
    }
    window.__unansweredNumber__ = unansweredNumber;
    return unansweredNumber;
}

var onRaterNameInput = function (e) {
    $("#raterTip").text("");
};

var examNum;
//我要交卷(考试)
function formSubmit(num){
	var unansweredNumber = getUnansweredNumber();
    var needAllAnswered = getAllQuestionsAnswered();
    examNum=num;


    // 填写评估人
    if (isRaterRequired === '1') {
        var raterName = $("input[name=raterName]").val();
        var reg = /^[a-zA-Z\u4E00-\u9FA5]+$/g;
        var $raterTip = $("#raterTip");

        if (!raterName.trim()) {
            $(".titleHeiddenAndShow999").trigger("click");
            $raterTip.text("请输入评估人");
            return;
		}
        if (!reg.test(raterName)) {
            $(".titleHeiddenAndShow999").trigger("click");
            $raterTip.text("只能输入中、英文字符");
        	return;
		}
		if (raterName.length > 50) {
            $(".titleHeiddenAndShow999").trigger("click");
            $raterTip.text("最多能输入50个字符，当前字符数：" + raterName.length);
            return;
		}
    }

    // 题目全部答完
    if (unansweredNumber === 0) {
        dialog(1);
        return;
	}

    if (needAllAnswered) {
        dialog(24);
	} else {
        dialog(25);
	}
}
//确定交卷(考试)
function submit(){

	if (!window.navigator.onLine) {
		dialog(23);
		return;
	}
	clearInterval(timer);
    DeleteCookie(cookiesName);
	addPaperRecord();
	//解除绑定
	$(window).unbind('unload');
	$(window).unbind('beforeunload');
//	$("#addExerciseRecord").submit();
}

//继续做题
function jixuzuo(){
	$(".d-tips-2").remove();
	$(".dialog-shadow").remove();
	$(".bg-shadow").remove();
}

//点击下一部分
var titleheiddenNum = 0;
var titleheiddenNum_size=1;//最大数量,每个页面要覆盖此值
function nexttitleshow(){
	titleheiddenNum = titleheiddenNum+1;
	if(titleheiddenNum ==titleheiddenNum_size){
		titleheiddenNum = 0;
	}
	$(".titleHeiddenAndShow"+titleheiddenNum).click();
}

function titleHeiddenAndShow(id, obj, title, score){

	if (maxtime <= 0 && id !== 999) {
		return
	}
	if (id === 999) {
		$("#showTitleValue").hide();
		setTimeout(function () {
        	$("input[name=raterName]")[0].focus();
        }, 0)
	} else {
		if(!!score) {
			$("#showTitleValue").html(title + "[ 每小题" + score + "分 ]");
		}
        $("#showTitleValue").show();
    }

	titleheiddenNum=parseInt($(obj).attr("indexNum"));
	var titleValue = $(obj).attr("titlevalue");
		$("#showTitleValue").html(titleValue);
	$(obj).parent().attr("class","current");
	$(obj).parent().siblings().each(function(){
		$(this).attr("class","");
	});
	$("#titleHidden"+id).show();
	$("#titleHidden"+id).siblings().hide();

	$("#titleHidden"+id).show();
	$("#titleHidden"+id).siblings().hide();

	$("html,body").animate({scrollTop: $(".nextTitleAnchor").offset().top}, 0);
}
function showDeleteErrorRecordModal(qstId) {
    dialog(22);
    window.errorRecordId = qstId;
}
function deleteErrorRecord(qstId) {
	$.ajax({
 		type:"DELETE",
 		async:false,
 		url:baselocation+"/errorrecord/"+window.errorRecordId,
 		success:function(result){
 			if(result.error == '0') {
 				dialog(21,"删除成功!");
                setTimeout(function() {
                    window.location.reload();
                }, 600);
 			}else{
 				dialog(21,result.message);
 			}
 			setTimeout(function(){
 				$(".d-tips-2").remove();
 	 			$(".dialog-shadow").remove();
 	 			$(".bg-shadow").remove();
 			},500);
 			
 		}
 	});
}

/**
 * 提交试卷
 */
 function addPaperRecord(){
 	var serialize = $("#addExerciseRecord").serialize();
 	dialog(20);
	var examScheduleId = $("#examScheduleId").val();
 	$.ajax({
 		type:"POST",
 		dataType:"json",
 		async:false,
 		url:baselocation+"/front/examover/"+examScheduleId,
 		data:serialize,
 		success:function(result){
			//解除绑定
			$(window).unbind('unload');
			$(window).unbind('beforeunload');
 			if(result.error == "0"){
 				if(timer!=null){
 					clearInterval(timer);
 				}
 				DeleteCookie(cookiesName);
 			}else{
 				if(result.error == "E500") {
 					alert(result.message);
 					window.close();
 					return false;
 				}
 			}
 			setTimeout(function() {
                window.localStorage.setItem("examPaperHandTime", Date.now());
                window.close();
			}, 2000);
 				
 		}
 	});
 }
//答题卡点击
function datikaAnchor(titleheiddenNum,num){
	// alert(11)
	$(".titleHeiddenAndShow"+titleheiddenNum).click();
	$("html,body").animate({scrollTop: $(".datikaQstAnchor"+num).offset().top-200},600);
}

//选择是否单题模式
function danti(obj){
	 if($(obj).prop("checked")){
		 showdanti();
	 }else{
		 showduoti();
	 } 
	 //默认到第一题
	 datikaAnchor(0,1);
}
//下一题
function nextqst(num){
	//选择答题卡  点击答题卡
	if(num%51==1 && num!=1){
		nextQuestionListShow();
	}
	if($("#datikaCurrent"+num).children("a")[0]){
		$("#datikaCurrent"+num).children("a")[0].click();
	}else{
		$("#datikaCurrent1").children("a")[0].click();
	}
}
//展示单题模式
function showdanti(){
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
	datikaAnchor = function(titleheiddenNum,num){
		//隐藏材料题
		$(".cailiaohiddle").hide();
		$(".titleHeiddenAndShow"+titleheiddenNum).click();
		//全部试题隐藏
		$("li[class^='datikaQstAnchor']").hide();
		//如果有下一题则展示下一题没有则展示第一题
		if($(".datikaQstAnchor"+num)!=null){
			$(".datikaQstAnchor"+num).show();
			$(".datikaQstAnchor"+num).siblings(".cailiaohiddle").show();
		}else{
			$(".datikaQstAnchor1").show();
		}
	};
}

//展示多题模式
function showduoti(){
    //$('input:radio').click(function(){
    //    var numinder = $(this).parent().attr("numinder");
    //    if(numinder!=null){
    //        var numinder1 = numinder*1+1;
    //        datikaAnchor(numinder,numinder1);
    //    }
    //});
	$(".t-p-sub-title-wrap").show();
	$(".page-bar").show();
	//单题模式下一题按钮隐藏
	$(".nextoneqst").hide();
	//全部试题隐藏
	$("li[class^='datikaQstAnchor']").show();
	//材料显示
	$(".cailiaohiddle").show();
	datikaAnchor = function(titleheiddenNum,num){
		//显示部分
		$(".titleHeiddenAndShow"+titleheiddenNum).click();
		//定位到题的位置
		if($(".datikaQstAnchor"+num).length > 0) {
			$("html,body").animate({scrollTop: $(".datikaQstAnchor"+num).offset().top-200}, 600);
		}else{
			$("html,body").animate({scrollTop: $(".datikaQstAnchor"+(num-1)).offset().top-200}, 600);
		}
	};
}

//解析时显示正确错题
function showErrorQuestion(){
	$(".rightQuestion").hide();
}
//解析时显示所有
function showAllQuestion(){
	$(".rightQuestion").show();
}
//解析时显示错题
function lookErrorQuestion(obj){
	if($(obj).prop("checked")){
		showErrorQuestion();
	}else{
		showAllQuestion();
	}
}
function changecheck(){
	var len=$("#checkContent").val().length;
	if(len==0){
		$("#notetips").html("请输入内容");
		return;
	}
	$("#notetips").html("您还可以输入"+(200-len)+"个字");
}
function checkAnswer(paperId,qstId,obj){
	dialog(8);
	$("#checksubmit").click(function(){
		var content=$("#checkContent").val();
		if(content==null||content.trim()==''){
			alert("内容不能为空");
			return false;
		}
		if(content.length>200){
			alert("你最多能输入200个字");
			return false;
		}else{
			$.ajax({
				url:baselocation+"/quest/addQuestErrorCheck",
				data:{"questErrorCheck.paperId":paperId,"questErrorCheck.questionId":qstId,"questErrorCheck.content":content},
				dataType:"json",
				type:"post",
				async:false,
				success:function(result){
					if(result.message=="success"){
						$("#dialog-shadow #dcWrap .dtClose").click();
						alert("成功提交，等待处理");
					}else{
						alert("失败，请稍后重试");
					}
				}
			});
			
		}	
	});
}
function getvideoCode(freeUrl){
	dialog(12);
	var str = "<script src='http://union.bokecc.com/player?vid="+freeUrl+"&siteid=${websitemapCC.cc.ccappID }&autoStart=true&width=100%&height=100%&playerid==D86AD47DE27F8F5A&playertype=1' type='text/javascript'/>";
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
function doMark(index,obj){
	$("#mark"+index).show();
	$(obj).title="取消标签";
	$(obj).html("取消标签");
	$(obj).parent().html('<em class=""><img src="/static/exam/images/bqian.png" /></em><a href="javascript:void(0)" onclick="notMark('+index+',this)" title="取消标记" qstId="notMark'+index+'" class="vam c-666 ml5" style="display: inline-block;margin-top: -10px;">取消标记</a>');
}
function notMark(index,obj){
	$("#mark"+index).hide();
	$(obj).title="添加标签";
	$(obj).html("添加标签");
	$(obj).parent().html('<em class=""><img src="/static/exam/images/bqian.png" /></em><a href="javascript:void(0)" onclick="doMark('+index+',this)" title="添加标记" qstId="doMark'+index+'" class="vam c-666 ml5" style="display: inline-block;margin-top: -10px;">添加标记</a>');
}
