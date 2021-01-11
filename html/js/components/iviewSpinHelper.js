define(function(require) {

    var instances = {};
    var registerInstance = function(key, value) {
        instances[key] = value;
    }

    var unRegisterInstance = function(data) {
        instances[key] = null;
    }
    var spinHideAll = function() {
        _.each(_.values(instances), function(item) {
            item.showSpin = false;
        });
    }

    var spinShowAll = function() {
        _.each(_.values(instances), function(item) {
            item.showSpin = true;
        });
    }

    return {
        registerInstance : registerInstance,
        unRegisterInstance : unRegisterInstance,
        spinHideAll : spinHideAll,
        spinShowAll:spinShowAll
    }

});