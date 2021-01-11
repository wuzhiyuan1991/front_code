<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<!-- saved from url=(0147)http://test.safeway.com/views/learn/bloc/exam.html?paperId=10&courseId=3&kpointId=11&examKey=d05046d98746c3417218559728e0581b&scheduleId=elo793p69e -->
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>考试</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <link rel="stylesheet" href="/static/css/common.css">
        <link rel="stylesheet" href="/static/css/learn.css">
        <script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="/static/script/webutils.js"></script>
		<script type="text/javascript" src="/static/script/common.js"></script>
    <style>.modal-component{display:none;position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:88;-webkit-transition:all .6s cubic-bezier(.58,.03,.59,1.04)}.modal-component .bg-mask{position:inherit;width:inherit;height:inherit;opacity:0;background:rgba(0,0,0,.4);z-index:-1;-webkit-transition:all .3s cubic-bezier(.58,.03,.59,1.04)}.modal-warpper{width:312px;height:auto;opacity:0;margin-top:-80px;background:#fff;border:1px solid #eee;border-radius:5px;-webkit-transition:all .2s cubic-bezier(.58,.03,.59,1.04) .1s}.modal-component:after,.modal-warpper{display:inline-block;vertical-align:middle}.modal-component:after{content:'';height:80%;margin-left:-0.25em}.modal-show .bg-mask{opacity:.5}.modal-show .modal-warpper{opacity:1;margin-top:0}.modal-component .ui-modal{padding:0}.modal-component .modal-content{min-height:140px;font-size:1.4rem;display:box;display:-webkit-box;-webkit-box-pack:center;box-pack:center;-webkit-box-align:center;margin:0 15px}.modal-component .modal-buttons{height:auto;display:flex;display:-webkit-flex;margin-bottom:10px;padding-left:15px}.modal-component .modal-buttons button{flex:1;height:50px;border:0;line-height:50px;font-size:1.2rem;border-radius:3px;margin:15px 15px 15px 0}.modal-component .btn-confirm{color:#fff;background:#52C2FF}.modal-component .btn-cancel{color:#222;background:#eee}.tips-component{position:fixed;bottom:110px;left:0;width:100%;opacity:0;z-index:88;text-align:center;-webkit-transition:all .6s cubic-bezier(.58,.03,.59,1.04)}.tips-component.tips-show{opacity:1;bottom:90px}.tips-component .ui-tips-warp{display:inline-block;max-width:70%;padding:0 20px;height:auto}.tips-component .ui-tips{min-width:20%;min-height:32px;padding:0 25px;display:flex;display:-webkit-flex;align-items:center;background:#fff;color:#ccc;-webkit-border-radius:50px;border-radius:50px;border:1px solid transparent;box-shadow:1px 1px 5px #ccc}.tips-component .tips-content{flex:auto;padding:8px 0;font-size:1rem}.tips-component.tips-default .ui-tips{color:#fff;background:rgba(0,0,0,.4);box-shadow:1px 1px 3px rgba(0,0,0,.4)}.loading-component{position:fixed;bottom:100px;left:0;opacity:0;width:100%;text-align:center;transition:opacity,bottom .5s,.5s cubic-bezier(0.68,-0.55,0.265,1.55),cubic-bezier(0.68,-0.55,0.265,1.55);-webkit-transition:opacity,bottom .5s,.5s cubic-bezier(0.68,-0.55,0.265,1.55),cubic-bezier(0.68,-0.55,0.265,1.55)}.loading-component.loading-show{opacity:1;bottom:90px}.loading-component .ui-loading{display:inline-block;color:#fff;min-width:20%;min-height:32px;padding:3px 20px;border-radius:50px;-webkit-border-radius:50px;border:1px solid transparent}.loading-component img{vertical-align:middle;margin-right:5px}.thr-ld .loading-warpper{display:inline-block;width:100px;height:3em;border:0 solid red}.thr-ld .loader:before,.thr-ld .loader:after,.thr-ld .loader{border-radius:50%;width:1em;height:1em;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:amThrLd 1.3s infinite ease-in-out;animation:amThrLd 1.3s infinite ease-in-out}.thr-ld .loader{margin:0 auto;font-size:10px;position:relative;text-indent:-9999em;-webkit-animation-delay:-0.2s;animation-delay:-0.2s}.thr-ld .loader:before{left:-1.2em;-webkit-animation-delay:-0.4s;animation-delay:-0.4s}.thr-ld .loader:after{left:1.2em}.thr-ld .loader:before,.loader:after{content:'';position:absolute;top:0}@-webkit-keyframes amThrLd{0%,80%,100%{box-shadow:0 1em 0 -0.4em #3dce3d}40%{box-shadow:0 1em 0 0 #3dce3d}}@keyframes amThrLd{0%,80%,100%{box-shadow:0 1em 0 -0.4em #3dce3d}40%{box-shadow:0 1em 0 0 #3dce3d}}</style></head>
    <body>
        <div class="paper-container">
            <div class="paper-header">
                <span class="alarm-icon"></span>
                <span class="residual-time" id="timer">00:00</span>
            </div>
            <form action="${ctx}/front/learning/record" method="post" id="addExerciseRecord">
            <input type="hidden" name="paperRecord.type" value="2"/>
			<input type="hidden" name="paperRecord.subjectId" value="1"/>
			<input type="hidden" name="paperRecord.testTime" id="testTime" value="0"/>
			<input type="hidden" id="paperId" name="paperRecord.paperId" value="${paper.id }"/>
			<input type="hidden" id="courseId"  name="courseId" value="${courseId}" />
			<input type="hidden" id="kpointId"  name="kpointId" value="${kpointId}" />
			<input type="hidden" id="playFromType"  value="${playFromType}" />
			<input type="hidden" name="paperRecord.paperName" value="${paper.name}" />
			<input type="hidden" id="token" name="token" value="${token }"/>
			<input type="hidden" id="examKey" name="examKey" value="${examKey }"/>
			<input type="hidden" id="taskId" name="taskId" value="${taskId }"/>
			<input type="hidden" id="userId" name="userId" value="${userId }"/>
            <c:set var="qstNum" value="-1" />
            <div id="paper_list" class="paper-list">
            	<c:forEach items="${topicList}" varStatus="topicStatus" var="topic">
            	<c:forEach items="${topic.qstList }" var="qstMiddle" varStatus="qstStatus">
				<c:set var="qstNum" value="${qstNum+1}" />
				<input type="hidden" value="${qstMiddle.qstId }" name="recordList[${qstNum}].qstId"/>
				<input type="hidden" value="${topic.id }" name="recordList[${qstNum}].topicId"/>
				<input type="hidden" value="${topic.score }" name="recordList[${qstNum}].score"/>
				<input type="hidden" value="${qstMiddle.question.answer }" name="recordList[${qstNum}].answer"/>
                
                <div class="paper-item" data-id="${qstNum }" data-type="${qstMiddle.question.type }">
                    <div class="question">${qstNum+1 }、
	                    <span class="red">
	                    <c:if test="${qstMiddle.question.type==1}">（单选题）</c:if>
						<c:if test="${qstMiddle.question.type==2}">（多选题）</c:if>
						<c:if test="${qstMiddle.question.type==3}">（判断题）</c:if>
						<c:if test="${qstMiddle.question.type==4}">（不定项题）</c:if>
						<c:if test="${qstMiddle.question.type==5}">（主观题）</c:if>
						</span>${qstMiddle.question.content }
                    </div>
                    <ul class="answer-list">
                    	<c:forEach items="${qstMiddle.question.optList}" var="option">
                        	<li class="answer answer-${option.opt }">
                        		<span class="answer-opt">${option.opt }.${option.content }</span>
                        	</li>
						</c:forEach>
                    </ul>
                    <ul class="answer-select" id="${topicStatus.index }-${qstStatus.index }">
                    	<c:forEach items="${qstMiddle.question.optList}" var="option">
                        <li class="">
                            <label for="op_${topicStatus.index }_${qstStatus.index }_${option.opt }">
                            	<c:choose>
	                            	<c:when test='${qstMiddle.question.type==2||qstMiddle.question.type==4}'>
	                                	<input type="checkbox" name="opt-${topicStatus.index }-${qstStatus.index }" index="${topicStatus.index }-${qstStatus.index }" id="op_${topicStatus.index }_${qstStatus.index }_${option.opt }" name="rd-${topicStatus.index }-${qstStatus.index }" class="answer-opt-input" value="${option.opt }">
	                                </c:when>
	                                <c:when test='${qstMiddle.question.type==1||qstMiddle.question.type==3}'>
	                                	<input type="radio" name="opt-${topicStatus.index }-${qstStatus.index }" index="${topicStatus.index }-${qstStatus.index }" id="op_${topicStatus.index }_${qstStatus.index }_${option.opt }" name="rd-${topicStatus.index }-${qstStatus.index }" class="answer-opt-input" value="${option.opt }">
	                                </c:when>
                                </c:choose>
                                <span class="answer-opt">${option.opt }</span>
                            </label>
                        </li>
                        </c:forEach>
                        <input  id="answer-${topicStatus.index }-${qstStatus.index }" value="" type="hidden" name="recordList[${qstNum}].userAnswer"/>
                    </ul>
                </div>
                </c:forEach>
            	</c:forEach>
            </div>
            </form>
            <div class="answer-sheet">
                <div class="answer-sheet-list">
                    <ul>
                    	<c:set var="cardNum" value="-1" />
						<c:forEach items="${topicList }" varStatus="topicS" var="topic" >
                        <c:forEach items="${topic.qstList}" varStatus="qstS">
                        <c:set var="cardNum" value="${cardNum+1 }" />
                        <li id="card-${topicS.index }-${qstS.index}" type="${topic.type }">
                            <span class="sheet-order">${cardNum+1 }</span>
                            <span class="s-answer"><span class="red">未选择</span></span>
                        </li>
                        </c:forEach>
                        </c:forEach>
                    </ul>
                </div>
                <div class="btn-close-sheet">关闭</div>
            </div>
            <nav class="nav-operation">
                <ul class="ul-menus">
                    <li class="pre-sub btn-sheet disable">答题卡</li>
                    <li class="next-sub btn-submit">交卷</li>
                </ul>
            </nav>
        </div>
        <script src="/static/script/template-native.js"></script>
        <script src="/static/script/modal.js"></script>


        <script>
        /*测试以及下次再做页面用js*/

        var maxtime =100;//最大时间每个页面要自己覆盖此值
        var cookiesName="test_time";
        var timer;
        var timeFalg=true;
        var testTime=0;	
        
        	if("${topicList.size()}">0){
				cookiesName = "test_time${paper.id}";
			}
			//设置时间
			if(getCookie(cookiesName)==null){
				maxtime =${paper.replyTime}*60; //一个小时，按秒计算，自己调整!
			}else{
				maxtime=getCookie(cookiesName);
			}
        	timer = setInterval("CountDown()",1000);
        	
            $('.btn-sheet').on('click', function () {
                //$('.answer-sheet-list').html(Tpl.answerSheetList(store.answers))
                $('.answer-sheet').show();
            });
            // 关闭答题卡
            $('.btn-close-sheet').on('click', function () {
                $('.answer-sheet').hide();
            });
            //点击选项事件
            $(".answer-opt-input").on('click',function(){
            	var id = $(this).attr("index");
            	var opts = $("#"+id+" .answer-opt-input:checked");
            	var value = "";
            	if(opts.length == 0) {
            		$("#card-"+id+" .s-answer").html("<span class='red'>未选择</span>");
            	}else{
            		for (var i=0;i<opts.length;i++){
            			var opt = opts[i];
            			value += $(opt).val();
            		}
            		$("#card-"+id+" .s-answer").html(value);
            	}
            	$("#answer-"+id).val(value);
            });
            // 交卷
            $('.btn-submit').on('click', function () {
            	window.Android.jsTouchSubmit(false);
            })
            function androidConfirmSubmit(){
                	var serialize = $("#addExerciseRecord").serialize();
                 	var courseId = $("#courseId").val();
                	var kpointId = $("#kpointId").val();
                	var taskId = $("#taskId").val();
                 	$.ajax({
                 		type:"POST",
                 		dataType:"json",
                 		async:false,
                 		url:baselocation+"/mobile/front/examover/"+taskId+"/"+kpointId,
                 		data:serialize,
                 		success:function(result){
                 			if(result.error == "0"){
                 				window.Android.exerciseResult("E1");
                 			}else if(result.error == "E30001"){
                 				window.Android.exerciseResult("E3");
                 			}else{
                 				window.Android.exerciseResult("E2");
                 			}
                 		}
                 	})
            }
            
            
          //倒计时
            function CountDown(){
                setCookie(cookiesName,maxtime);
            	if(maxtime>0){  
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
            		clearInterval(timer);
            		DeleteCookie(cookiesName);
            		window.Android.jsTouchSubmit(true);
            		
            	}  
            }  
        </script>
    
</body></html>