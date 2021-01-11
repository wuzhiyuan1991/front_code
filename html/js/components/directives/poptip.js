define(function(require) {

    return {
        bind: function bind() {
            var _this = this;
            this.hideEl = function () {
                _this.el.style.display = 'none';
                _this.el.style.left = '-1000px';
                _this.el.style.top = '-1000px';
            };
            this.hideHandler = function (e) {
                if (_this.el.contains(e.target)) {
                    return false;
                }
                _this.hideEl();
            };
            document.addEventListener('click', this.hideHandler);
            this.bodyWidth = document.body.clientWidth;
        },
        update: function update(value) {
            var data = JSON.parse(value);
            if(!data.html) {
                return;
            }
            this.el.querySelector('.window-poptip-content').innerHTML = data.html;

            this.el.style.display = 'block';

            // 发生滚动后消失
            // TODO: 需要动态确认需要监听的元素
            document.querySelector('.table-scroll-main-body').addEventListener('scroll', this.hideEl, { once: true });

            // 判断左右
            if(data.position.x > (this.bodyWidth - data.position.width ) / 2) {
                this.el.style.left = data.position.x - this.el.offsetWidth - data.position.width + 'px';
                this.el.style.top = data.position.y - this.el.offsetHeight / 2 + 'px';
            } else {
                this.el.style.top = data.position.y - this.el.offsetHeight / 2 + 'px';
                this.el.style.left = data.position.x + data.position.width + 'px';
            }


        },
        unbind: function unbind() {
            document.removeEventListener('click', this.hideHandler);
        }
    }

});