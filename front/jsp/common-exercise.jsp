<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE HTML>
<html>
<head>
	<title>考试系统</title>
	<link rel="stylesheet" type="text/css" href="/static/css/red-matter.css">
	<link rel="stylesheet" type="text/css" href="/static/css/theme.css">
	<link rel="stylesheet" type="text/css" href="/static/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/static/css/global.css">
	<link rel="stylesheet" type="text/css" href="/static/css/exam-style.css">
	<script type="text/javascript" src="/static/script/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="/static/script/webutils.js"></script>
	<script type="text/javascript" src="/static/script/common-exercise.js"></script>
	<script type="text/javascript" src="/static/script/examJs.js"></script>
	<script>
		$(function(){
			quesCard();
			leftMenuScroll();
			$(".p-ques-list>ul>li").children(".is-options").children(".fl").children(".ans-edit").click(function(){
				var _this=$(this),
						_tBox=_this.parent().parent().next().children();
				if(_tBox.hasClass("undisa-text")){
					_this.html("完成编辑");
					_tBox.removeClass("undisa-text");
					_tBox.removeAttr("disabled");
				}else{
					_this.html("修改答案");
					_tBox.addClass("undisa-text");
					_tBox.attr("disabled","enabled");
				}
			});
			
			timer = setInterval("CountDown()",1000);
			
			if("${topicList.size()}">0){
				cookiesName = "test_time${paper.id}";
			}
			//设置时间
			if(getCookie(cookiesName)==null){
				maxtime =${paper.replyTime}*60; //按秒计算，自己调整!
			}else{
				maxtime=getCookie(cookiesName);
			}
			
			//答题选项点击事件
			$('input:radio').click(function(){
				var numinder = $(this).parent().attr("numinder");
				if(numinder!=null){
					var numinder1 = numinder*1+1;
					$('#datikaCurrent'+numinder1+" a").click();
				}
			});

			//单题模式初始化
			danti($("#checkboxdanti"));
		});
		function leftMenuScroll() {
			var lM = function() {
				var sTop = parseInt(document.documentElement.scrollTop || document.body.scrollTop, 10);
				if (sTop > 165) {
					$("#p-test-box").css("position" , "fixed");
				} else {
					$("#p-test-box").css("position" , "absolute");
				}
			};
			$(window).bind("scroll" , lM);
		}
		//答题卡点击
		function datikaAnchor(titleheiddenNum,num){
			//$(".titleHeiddenAndShow"+titleheiddenNum).click();
			/* alert($(".datikaQstAnchor"+num).offset().top);*/
			$("html,body").animate({scrollTop: $(".datikaQstAnchor"+num).offset().top-50}, 50);

		}
		$(window).bind('unload',function(){
			return'您确定要离开此页面吗';
		});
		$(window).bind('beforeunload',function(){return'您确定要离开此页面吗';});
	</script>
	<style type="text/css">
		.global-nav-wrap {display: none;}
	</style>
</head>
<body>
<form action="${ctx}/front/exerciseover" method="post" id="addExerciseRecord">
	<input type="hidden" name="paperRecord.testTime" id="testTime" value="0"/>
	<input type="hidden" name="paperRecord.paperName" value="${paper.name}" />
	<input type="hidden" name="paperRecord.examPaper.score" value="${paper.score}" />
	<c:set var="questionNumIndex" value="0" />
	<c:set var="numIndex" value="-1" />

	<div class="e-main">
		<section class="container">
			<div class="clearfix mt30">
				<div class="col18 fl pr">
					<div class="p-test-box" id="p-test-box">
						<c:if test="${not empty topicList}">
							<dl class="paper-test">
								<dt><em class="e-clock"></em><span id="timer"></span></dt>
								<dd><a href="javascript:void(0)" title=""  onclick="formSubmit(${examNum})">提交</a></dd>
							</dl>
						</c:if>
						<!-- /答题卡 开始 -->
						<c:if test="${topicList!=null&&topicList.size()>0 }">
							<div class="mt20">
								<dl class="paper-test q-card-box q-card-wrap">
									<dt><a href="javascript:;"><span class="ques-card">答题卡</span><em class="q-card-icon icon16"></em></a></dt>
									<dd>
										<table class="ques-card-tab">
											<c:set var="daTiKaNumIndex" value="0" />
											<c:forEach items="${topicList }" varStatus="topicListindex" var="paperMiddle" >
												
													<c:forEach items="${paperMiddle.questions}" varStatus="qstMiddleIndex">
														<c:set var="daTiKaNumIndex" value="${daTiKaNumIndex+1}" />
														<c:if test="${(daTiKaNumIndex-1)%4==0}"><tr></c:if>
															<td id="datikaCurrent<c:out value="${daTiKaNumIndex}"/>"><a href="javascript:void(0)" onclick="datikaAnchor(${topicListindex.index },<c:out value="${daTiKaNumIndex}"/>)" title="第<c:out value="${daTiKaNumIndex}"/>题"><c:out value="${daTiKaNumIndex}"/></a></td>
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
						</div>
						<ul class="ques-type mt20 clearfix">
							<c:forEach items="${topicList }" varStatus="index" var="paperMiddle">
								<li <c:if test="${index.first}">class="current"</c:if> >
									<a href="javascript:void(0)" class="titleHeiddenAndShow${index.index}" indexNum="${index.index }" title="${name }" titleValue="${paperMiddle.title}[&nbsp;每小题${topicList[index.index].score }分&nbsp;]" onclick="titleHeiddenAndShow('${paperMiddle.id }',this)" >
										${paperMiddle.name }
									</a>
								</li>
							</c:forEach>
						</ul>
							<div class="pt10 pb10 pr20">
								<h6 class="hLh30 of unFw ml15"><font class="c-333 fsize12" id="showTitleValue">
									<c:if test="${not empty topicList }">
										${topicList[0].title }[&nbsp;每小题${topicList[0].score }分&nbsp;]
									</c:if></font></h6>
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
												<c:set var="questionNumIndex" value="${questionNumIndex+1}" />
												<c:set var="numIndex" value="${numIndex+1}" />
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
														</span><span class="c-666 fsize16">${qstMiddle.content }</span>
													</div>
													<section class="t-p-options">
															<ol>
																<c:if test="${qstMiddle.type!=3	}">
																	<c:forEach items="${qstMiddle.opts}" var="option">
																		<li><a href="javascript:void(0);">${option.opt }、${option.content }</a></li>
																	</c:forEach>
																</c:if>
																<c:if test="${qstMiddle.type==3}">
																	<li><a href="javascript:void(0);">A、是</a></li>
																	<li><a href="javascript:void(0);">B、否</a></li>
																</c:if>
															</ol>
													</section>
													<section class="is-options clearfix">
															<div class="fl t-p-is-options">
																<c:forEach items="${qstMiddle.opts}" var="option">
																	<c:choose>
																		<c:when test="${qstMiddle.type==1||qstMiddle.type==3}">
																			<label for="<c:out value="${questionNumIndex}"/>_${option.opt}" numInder="<c:out value="${questionNumIndex}"/>">
																				<em class="icon18 o-radio">&nbsp;</em>
																				<input type="radio" name="recordList[${numIndex}].userAnswer" id="<c:out value="${questionNumIndex}"/>_${option.opt }" value="${option.opt }"/>
																				<span>${option.opt }</span>
																			</label>
																		</c:when>
																		<c:otherwise>
																			<label for="<c:out value="${questionNumIndex}"/>_${option.opt }" numInder="<c:out value="${questionNumIndex}"/>">
																				<em class="icon18 o-checkbox">&nbsp;</em>
																				<input type="checkbox" name="recordList[${numIndex}].userAnswer" id="<c:out value="${questionNumIndex}"/>_${option.opt }" value="${option.opt }"/>
																				<span>${option.opt}</span>
																			</label>
																		</c:otherwise>
																	</c:choose>

																</c:forEach>
																<input class="ml10" value="" type="hidden" name="recordList[${numIndex}].userAnswer"/>
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