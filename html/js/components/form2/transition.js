define(function(require) {	
	var Transition = function() {
	  this.beforeEnter = function(el) {
	    el.dataset.oldPaddingTop = el.style.paddingTop;
	    el.dataset.oldPaddingBottom = el.style.paddingBottom;
	    el.style.height = '0';
	    el.style.paddingTop = 0;
	    el.style.paddingBottom = 0;
	  }
	
	  this.enter = function(el) {
	    el.dataset.oldOverflow = el.style.overflow;
	
	    el.style.display = 'block';
	    if (el.scrollHeight !== 0) {
	      el.style.height = el.scrollHeight + 'px';
	      el.style.paddingTop = el.dataset.oldPaddingTop;
	      el.style.paddingBottom = el.dataset.oldPaddingBottom;
	    } else {
	      el.style.height = '';
	      el.style.paddingTop = el.dataset.oldPaddingTop;
	      el.style.paddingBottom = el.dataset.oldPaddingBottom;
	    }
	
	    el.style.overflow = 'hidden';
	  }
	
	  this.afterEnter = function(el) {
	    el.style.display = '';
	    el.style.height = '';
	    el.style.overflow = el.dataset.oldOverflow;
	  }
	
	  this.beforeLeave = function(el) {
	    el.dataset.oldPaddingTop = el.style.paddingTop;
	    el.dataset.oldPaddingBottom = el.style.paddingBottom;
	    el.dataset.oldOverflow = el.style.overflow;
	
	    el.style.display = 'block';
	    if (el.scrollHeight !== 0) {
	      el.style.height = el.scrollHeight + 'px';
	    }
	    el.style.overflow = 'hidden';
	  }
	
	  this.leave = function(el) {
	    if (el.scrollHeight !== 0) {
	      setTimeout(function(){
	        el.style.height = 0;
	        el.style.paddingTop = 0;
	        el.style.paddingBottom = 0;
	      });
	    }
	  }
	
	  this.afterLeave = function(el) {
	    el.style.display = el.style.height = '';
	    el.style.overflow = el.dataset.oldOverflow;
	    el.style.paddingTop = el.dataset.oldPaddingTop;
	    el.style.paddingBottom = el.dataset.oldPaddingBottom;
	  }
	};
	
	return {
	  functional: true,
	  render:function(h, children) {
	    var data = {
	      on: new Transition()
	    };
	    children = children.map( function(item) {
	      item.data.class = ['collapse-transition'];
	      return item;
	    });
	    return h('transition', data, children);
	  }
	};
	
});
