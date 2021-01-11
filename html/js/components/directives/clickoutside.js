define(function(require) {	

	return {
		bind: function bind() {
	        var _this = this;

	        this.documentHandler = function (e) {
	            if (_this.el.contains(e.target)) {
	                return false;
	            }
	            if (_this.expression) {
	                _this.vm[_this.expression]();
	            }
	        };
	        document.addEventListener('click', this.documentHandler);
	    },
	    update: function update() {},
	    unbind: function unbind() {
	        document.removeEventListener('click', this.documentHandler);
	    }
	}
    
});