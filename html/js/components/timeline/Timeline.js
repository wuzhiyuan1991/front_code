define(function(require) {	

	var TimeLine = require("./iviewTimeline");
	var TimelineItem = require("./iviewTimelineItem");
//	TimeLine.Item = TimelineItem;
	
    return {"TimeLine" : TimeLine, "TimelineItem" : TimelineItem};
});
