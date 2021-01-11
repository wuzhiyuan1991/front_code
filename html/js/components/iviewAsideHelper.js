define(function(require) {	

	var instances = {};
	
	var registerInstance = function(key, value) {
		instances[key] = value;
	}
	
	var unRegisterInstance = function(data) {
		instances[key] = null;
	}

	var hideAll = function() {
		_.each(_.values(instances), function(item) {
			item.show = false;
		});
	}

	var showAll = function(id) {
		_.each(_.values(instances), function(item) {
			if(id == item._uid){
				item.show = true;
			}
		});
	}

	var hasVisibleOne = function () {
		return _.some(instances,function(item){return item.show == true;})
	}

	var hasVisibleModal = function () {
		var $modals = document.querySelectorAll(".ivu-modal-wrap");

		return _.some($modals, function ($modal) {
			return !$modal.classList.contains("ivu-modal-hidden");
        })
    };
	
	return {
		registerInstance : registerInstance,
		unRegisterInstance : unRegisterInstance,
		hideAll : hideAll,
		showAll:showAll,
		hasVisibleOne : hasVisibleOne,
        instances: instances,
        hasVisibleModal: hasVisibleModal
	}
    
});