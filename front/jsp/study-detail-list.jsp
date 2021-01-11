<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<script type="text/javascript" src="/static/script/study-detail-list.js"></script>
<c:if test="${not empty studyDeatils }">
	<menu id="lh-menu" class="lh-menu">
		<ul>
			<c:set var="folderIndex" value="1"/>
			<c:forEach items="${studyDeatils }" var="parentKpoint" varStatus="index">
				<c:if test="${parentKpoint.kpointType==0 }"><!-- 文件目录 -->
					<li class="lh-menu-stair">
						<a href="javascript: void(0)" title="${parentKpoint.kpointName }" class="l-m-stitle">
							<span class="fr"><em class="icon14 m-tree-icon">&nbsp;</em></span>
							<em class="lh-menu-i-1 icon24 mr5"><font>${folderIndex }</font></em>${parentKpoint.kpointName }
						</a>
						<ol class="lh-menu-ol"
						>
							<c:forEach items="${parentKpoint.studyDetails}" var="sonKpoint">
								<li class="lh-menu-second ml30 kpoint-item kp-${sonKpoint.kpointId}" >
									<div title="" class="l-m-sbox">
										<span class="fr">
												<em class="lh-p-icon icon14 ml5" >&nbsp;</em>
										</span>
										<a  id="kpoint${sonKpoint.kpointId }"
											data-filetype="${sonKpoint.fileType}"
											data-cloudfileid="${sonKpoint.cloudFile.id}"
											data-cloudfilename="${sonKpoint.cloudFile.orginalName}"
											data-ctxpath="${sonKpoint.cloudFile.ctxPath}"
											data-status="${sonKpoint.status}"
											data-parentname="${parentKpoint.kpointName }"
											data-kpointname="${sonKpoint.kpointName }"
											href="javascript:void(0)" class="max-width-140 fl disIb txtOf p-v-title "
											onclick="onCatalogItemClick('${sonKpoint.kpointId }',this,'${sonKpoint.kpointName }')"
										>
											<c:if test="${task.status == 0 }">
											<em class="lh-menu-i-2 mr5" style="background:<c:choose><c:when test="${sonKpoint.status==1 }">rgba(0, 205, 217, 0.38)</c:when><c:when test="${sonKpoint.status==2 }">rgba(0, 128, 0, 0.51)</c:when></c:choose>">&nbsp;</em>
											</c:if>
											${sonKpoint.kpointName }
										</a>
										<div class="clear"></div>
									</div>
								</li>
							</c:forEach>
						</ol>
					</li>
					<c:set var="folderIndex" value="${folderIndex+1 }"/>
				</c:if>
				<c:if test="${parentKpoint.kpointType==1 }"><!-- 视频 -->
					<li class="lh-menu-stair">
						<ul class="lh-menu-ol no-parent-node">
							<li class="lh-menu-second">
								<a title="" id="kpoint${ parentKpoint.kpointId }"    onclick="onCatalogItemClick('${parentKpoint.kpointId }',this,'${parentKpoint.kpointName }')" class="l-m-stitle" href="javascript:void(0)">
									<span class="fr">
											<em class="lh-p-icon icon14 ml5" style="background:<c:choose><c:when test="${sonKpoint.status==1 }">rgba(0, 205, 217, 0.38)</c:when><c:when test="${sonKpoint.status==2 }">rgba(0, 128, 0, 0.51)</c:when></c:choose>">&nbsp;</em>
									</span>
									<em class="lh-menu-i-2 mr5" style="background:<c:choose><c:when test="${parentKpoint.status==1 }">rgba(0, 205, 217, 0.38)</c:when><c:when test="${parentKpoint.status==2 }">rgba(0, 128, 0, 0.51)</c:when></c:choose>">&nbsp;</em>${parentKpoint.kpointName }
								</a>
							</li>
						</ul>
					</li>
				</c:if>
			</c:forEach>
		</ul>
	</menu>
</c:if>
<!-- /无数据提示 开始-->
<c:if test="${empty studyDeatils}">
	<section class="no-data-wrap">
		<em class="icon30 no-data-ico">&nbsp;</em> <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
	</section>
</c:if>
<input type="hidden" id="playFromType" value="${playFromType}"/>
<input type="hidden" id="courseId" value="${courseId}"/>
