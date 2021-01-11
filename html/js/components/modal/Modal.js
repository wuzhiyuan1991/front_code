define(function(require) {	

	var Vue = require("vue");
	var Button = require("../iviewButton");
	var Icon = require("../iviewIcon");
    var assist = require("../utils/assist");
	var Confirm = require("./iviewConfirm");

	
	var modalInstance = void 0;

	function getModalInstance() {
	    modalInstance = modalInstance || new Confirm({
	        closable: false,
	        maskClosable: false,
	        footerHide: true
	    });

	    return modalInstance;
	}

	function confirm(options) {
	    var instance = getModalInstance();

	    options.onRemove = function () {
	        modalInstance = null;
	    };

	    instance.show(options);
	}

	Confirm.info = function () {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    props.icon = 'info';
	    props.showCancel = false;
	    return confirm(props);
	};

	Confirm.success = function () {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    props.icon = 'success';
	    props.showCancel = false;
	    return confirm(props);
	};

	Confirm.warning = function () {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    props.icon = 'warning';
	    props.showCancel = false;
	    return confirm(props);
	};

	Confirm.error = function () {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    props.icon = 'error';
	    props.showCancel = false;
	    return confirm(props);
	};

	Confirm.confirm = function () {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    props.icon = 'confirm';
	    props.showCancel = true;
	    return confirm(props);
	};

	Confirm.remove = function () {
	    if (!modalInstance) {
	        // at loading status, remove after Cancel
	        return false;
	    }

	    var instance = getModalInstance();

	    instance.remove();
	};
    return Confirm;
});