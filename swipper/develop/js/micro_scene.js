//定义微场景类
var MicroScene = (function () {
    /*
     * 构造函数
     * 接受参数
     * o{
     * 	 container: 容器class名
     * 	 currPage: 当前页,默认为0
     * 	 changeTime: 页面切换的时间,ms
     * 	 runCircle: 是否按圈翻页  true/false
     * 	 pageConnected: 页面间是否连接，默认不连接
     * 	 type: 翻页方式：默认0,上下翻   1,左右翻
     * 	 isCantTouch： 是否不允许触摸翻页，默认允许
     * 	 useDrag: 是否使用拖拽
     * 	 dragJumpLine： 拖拽跳转线
     * }
     */
    function MicroScene(o) {
        var _this = this;
        this.say = "I'm MicroScene";
        //各页面宽高
        this.pageWidth = window.innerWidth;
        this.pageHeight = window.innerHeight;
        //前一页
        this.prevPage = null;
        //下一页
        this.nextPage = null;
        //准备翻页的页面
        this.readyPage = {
            index: null,
            direction: null //预备页所在方向
        };
        //已翻页页面
        this.turnedPage = null;
        //是否正在翻页
        this.turning = false;
        //运行环境
        this.environment = "phone";
        //触屏事件坐标
        this.touchCoord = {
            touchstart: "touchstart",
            touchend: "touchend",
            touchmove: "touchmove",
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            moveX: 0,
            moveY: 0
        };
        //是否允许翻页
        this.isCanRun = true;
        //正在监听移动的标志
        this.moveListening = false;
        //获取所在环境
        this.getEnvironment = function () {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.indexOf("ipad") >= 0;
            var bIsIphoneOs = sUserAgent.indexOf('iphone os') >= 0;
            var bIsMidp = sUserAgent.indexOf('midp') >= 0;
            var bIsUc7 = sUserAgent.indexOf('rv:1.2.3.4') >= 0;
            var bIsUc = sUserAgent.indexOf('ucweb') >= 0;
            var bIsAndroid = sUserAgent.indexOf('android') >= 0;
            var bIsCE = sUserAgent.indexOf('windows ce') >= 0;
            var bIsWM = sUserAgent.indexOf('windows mobile') >= 0;
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                // document.writeln("phone");
                _this.environment = "phone";
            }
            else {
                // document.writeln("pc");
                _this.environment = "pc";
            }
        };
        //监听初始化
        this.listenerInit = function () {
            if (_this.isCantTouch)
                return; //不允许触摸翻页，不做监听
            console.log("listenerInit");
            _this.touchCoord.touchstart = _this.environment == "phone" ? "touchstart" : "mousedown";
            _this.touchCoord.touchend = _this.environment == "phone" ? "touchend" : "mouseup";
            _this.container.addEventListener(_this.touchCoord.touchstart, _this.getStartCoord);
            // this.container.addEventListener(this.touchCoord.touchend, this.getEndCoord );
        };
        // 页面拖拽监听初始化
        this.dragListenerInit = function () {
            if (_this.isCantTouch)
                return; //不允许触摸翻页，不做监听
            console.log("dragListenerInit");
            _this.touchCoord.touchstart = _this.environment == "phone" ? "touchstart" : "mousedown";
            _this.touchCoord.touchend = _this.environment == "phone" ? "touchend" : "mouseup";
            _this.touchCoord.touchmove = _this.environment == "phone" ? "touchmove" : "mousemove";
            _this.container.addEventListener(_this.touchCoord.touchstart, _this.getDragStart);
        };
        //开始监听拖拽
        this.getDragStart = function (e) {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            _this.moveListening = true;
            _this.container.removeEventListener(_this.touchCoord.touchstart, _this.getDragStart);
            if (_this.environment == "phone") {
                _this.touchCoord.startX = e.touches[0].pageX;
                _this.touchCoord.startY = e.touches[0].pageY;
            }
            else {
                _this.touchCoord.startX = e.pageX;
                _this.touchCoord.startY = e.pageY;
            }
            _this.container.addEventListener(_this.touchCoord.touchmove, _this.getMoveCoord);
            _this.container.addEventListener(_this.touchCoord.touchend, _this.setDrageEnd);
        };
        //获取移动坐标
        this.getMoveCoord = function (e) {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            _this.container.removeEventListener(_this.touchCoord.touchmove, _this.getMoveCoord);
            if (_this.environment == "phone") {
                _this.touchCoord.moveX = e.touches[0].pageX;
                _this.touchCoord.moveY = e.touches[0].pageY;
            }
            else {
                _this.touchCoord.moveX = e.pageX;
                _this.touchCoord.moveY = e.pageY;
            }
            _this.calculateDrageCoord();
            setTimeout(function () {
                if (_this.moveListening) {
                    _this.container.addEventListener(_this.touchCoord.touchmove, _this.getMoveCoord);
                }
            }, 30);
        };
        //结束监听拖拽
        this.setDrageEnd = function (e) {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            _this.moveListening = false;
            _this.container.removeEventListener(_this.touchCoord.touchend, _this.setDrageEnd);
            _this.container.removeEventListener(_this.touchCoord.touchmove, _this.getMoveCoord);
            if (_this.environment == "phone") {
                _this.touchCoord.endX = e.changedTouches[0].pageX;
                _this.touchCoord.endY = e.changedTouches[0].pageY;
            }
            else {
                _this.touchCoord.endX = e.pageX;
                _this.touchCoord.endY = e.pageY;
            }
            // 中途跳页就不会再触发touchend事件，运行到这里只有一种情况：放弃拖拽翻页
            // 恢复currPage和readyPage
            _this.recoverReadyPage();
            _this.container.addEventListener(_this.touchCoord.touchstart, _this.getDragStart);
        };
        //获取触屏开始时坐标
        this.getStartCoord = function (e) {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            _this.container.removeEventListener(_this.touchCoord.touchstart, _this.getStartCoord);
            if (_this.environment == "phone") {
                _this.touchCoord.startX = e.touches[0].pageX;
                _this.touchCoord.startY = e.touches[0].pageY;
            }
            else {
                _this.touchCoord.startX = e.pageX;
                _this.touchCoord.startY = e.pageY;
            }
            _this.container.addEventListener(_this.touchCoord.touchend, _this.getEndCoord);
        };
        //获取触屏结束时坐标
        this.getEndCoord = function (e) {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            _this.container.removeEventListener(_this.touchCoord.touchend, _this.getEndCoord);
            if (_this.environment == "phone") {
                _this.touchCoord.endX = e.changedTouches[0].pageX;
                _this.touchCoord.endY = e.changedTouches[0].pageY;
            }
            else {
                _this.touchCoord.endX = e.pageX;
                _this.touchCoord.endY = e.pageY;
            }
            _this.calculateCoord();
            _this.container.addEventListener(_this.touchCoord.touchstart, _this.getStartCoord);
        };
        //计算拖拽坐标
        this.calculateDrageCoord = function () {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            var path = 0;
            if (_this.type == 0) {
                path = _this.touchCoord.startY - _this.touchCoord.moveY;
                if (Math.abs(path) / _this.pageHeight > _this.dragJumpLine) {
                    _this.jumpToReadyPage();
                    return;
                }
            }
            else if (_this.type == 1) {
                path = _this.touchCoord.startX - _this.touchCoord.moveX;
                if (Math.abs(path) / _this.pageWidth > _this.dragJumpLine) {
                    _this.jumpToReadyPage();
                    return;
                }
            }
            if (path > 0) {
                if (_this.currPage == _this.nextPage)
                    return;
                _this.checkReadyPage(_this.nextPage, path);
            }
            else {
                if (_this.currPage == _this.prevPage)
                    return;
                _this.checkReadyPage(_this.prevPage, path);
            }
        };
        //拖拽到极限，跳转到下一页
        this.jumpToReadyPage = function () {
            _this.moveListening = false;
            _this.container.removeEventListener(_this.touchCoord.touchend, _this.setDrageEnd);
            _this.container.removeEventListener(_this.touchCoord.touchmove, _this.getMoveCoord);
            _this.goReadyPage();
            _this.container.addEventListener(_this.touchCoord.touchstart, _this.getDragStart);
        };
        //恢复预备页和当前页
        this.recoverReadyPage = function () {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return;
            if (_this.currPage == _this.readyPage.index)
                return; //未预备的情况
            _this.turning = true;
            var currPage = _this.pages[_this.currPage];
            var readyPage = _this.pages[_this.readyPage.index];
            var direction = _this.readyPage.direction;
            readyPage.style.transition = "all " + _this.changeTime + "ms linear";
            if (_this.pageConnected) {
                currPage.style.transition = "all " + _this.changeTime + "ms linear";
            }
            if (direction == 'bottom') {
                readyPage.style.top = _this.pageHeight + "px";
            }
            else if (direction == 'top') {
                readyPage.style.top = -_this.pageHeight + "px";
            }
            else if (direction == 'left') {
                readyPage.style.left = -_this.pageWidth + "px";
            }
            else {
                readyPage.style.left = _this.pageWidth + "px";
            }
            if (_this.pageConnected) {
                currPage.style.top = 0;
                currPage.style.left = 0;
            }
            setTimeout(function () {
                _this.pages[_this.readyPage.index].style.transition = "none";
                if (_this.pageConnected) {
                    _this.pages[_this.currPage].style.transition = "none";
                }
                _this.pages[_this.currPage].style.zIndex = 100;
                _this.pages[_this.readyPage.index].style.zIndex = 0;
                _this.pages[_this.readyPage.index].style.top = 0;
                _this.pages[_this.readyPage.index].style.left = 0;
                _this.turning = false;
            }, _this.changeTime);
        };
        /*
         * 检测待预备页
         * checkPage: 待预备页页码
         * path: 待预备页移动距离
         */
        this.checkReadyPage = function (checkPage, path) {
            if (checkPage != _this.readyPage.index) {
                //待检测页（待预备页）与已预备页不一致
                //将已预备页还原
                if (_this.readyPage.index != null) {
                    var page = _this.pages[_this.readyPage.index];
                    page.style.transition = "none";
                    page.style.top = 0;
                    page.style.left = 0;
                    page.style.zIndex = 0;
                }
                _this.getPageReady(checkPage);
            }
            _this.dragPage(path);
        };
        //拖拽页面
        this.dragPage = function (path) {
            var currPage = _this.pages[_this.currPage];
            var readyPage = _this.pages[_this.readyPage.index];
            var direction = _this.readyPage.direction;
            currPage.style.zIndex = 50;
            readyPage.style.zIndex = 100;
            if (direction == "bottom") {
                readyPage.style.top = _this.pageHeight - path + "px";
                if (_this.pageConnected) {
                    currPage.style.top = -path + "px";
                }
            }
            else if (direction == "top") {
                readyPage.style.top = -_this.pageHeight - path + "px";
                if (_this.pageConnected) {
                    currPage.style.top = -path + "px";
                }
            }
            else if (direction == "right") {
                readyPage.style.left = _this.pageWidth - path + "px";
                if (_this.pageConnected) {
                    currPage.style.left = -path + "px";
                }
            }
            else {
                readyPage.style.left = -_this.pageWidth - path + "px";
                if (_this.pageConnected) {
                    currPage.style.left = -path + "px";
                }
            }
        };
        //计算坐标
        this.calculateCoord = function () {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return; //正在翻页，不予计算
            var path = 0;
            if (_this.type == 0) {
                path = _this.touchCoord.startY - _this.touchCoord.endY;
            }
            else if (_this.type == 1) {
                path = _this.touchCoord.startX - _this.touchCoord.endX;
            }
            if (Math.abs(path) > 3) {
                if (path > 0) {
                    if (_this.currPage == _this.nextPage)
                        return;
                    _this.goPage(_this.nextPage);
                }
                else {
                    if (_this.currPage == _this.prevPage)
                        return;
                    _this.goPage(_this.prevPage);
                }
            }
        };
        /*
         * 指定一个页面为待翻页
         * pageNum: 指定页页码
         */
        this.getPageReady = function (pageNum) {
            var dir = pageNum > _this.currPage ? 1 : -1;
            if (_this.runCircle) {
                if (_this.currPage == 0 && pageNum == (_this.pagesLen - 1)) {
                    dir = -1;
                }
                else if (_this.currPage == (_this.pagesLen - 1) && pageNum == 0) {
                    dir = 1;
                }
            }
            // console.log("currPage:" + this.currPage , "nextPage:" + pageNum , "direction:" + dir);
            var page = _this.pages[pageNum];
            ;
            if (dir > 0) {
                if (_this.type == 0) {
                    page.style.top = _this.pageHeight + "px";
                    _this.readyPage.index = pageNum;
                    _this.readyPage.direction = "bottom";
                }
                else if (_this.type == 1) {
                    page.style.left = _this.pageWidth + "px";
                    _this.readyPage.index = pageNum;
                    _this.readyPage.direction = "right";
                }
            }
            else {
                if (_this.type == 0) {
                    page.style.top = -_this.pageHeight + "px";
                    _this.readyPage.index = pageNum;
                    _this.readyPage.direction = "top";
                }
                else if (_this.type == 1) {
                    page.style.left = -_this.pageWidth + "px";
                    _this.readyPage.index = pageNum;
                    _this.readyPage.direction = "left";
                }
            }
        };
        /*
         * 跳转到指定页面
         * pageNum: 指定页页码
         */
        this.goPage = function (pageNum) {
            if (pageNum == _this.currPage)
                return; //跳当前页，禁止
            _this.getPageReady(pageNum);
            setTimeout(function () {
                _this.goReadyPage();
            }, 0);
        };
        /*
         * 跳转到下一页
         */
        this.goNextPage = function () {
            _this.goPage(_this.nextPage);
        };
        /*
         * 跳转到上一页
         */
        this.goPrevPage = function () {
            _this.goPage(_this.prevPage);
        };
        /*
         * 翻页
         *
         */
        this.goReadyPage = function () {
            if (!_this.isCanRun)
                return; //不允许翻页
            if (_this.turning)
                return;
            _this.turning = true;
            var currPage = _this.pages[_this.currPage];
            var readyPage = _this.pages[_this.readyPage.index];
            var direction = _this.readyPage.direction;
            currPage.style.zIndex = 50;
            readyPage.style.zIndex = 100;
            readyPage.style.transition = "all " + _this.changeTime + "ms linear";
            if (_this.pageConnected) {
                currPage.style.transition = "all " + _this.changeTime + "ms linear";
            }
            readyPage.style.top = 0;
            readyPage.style.left = 0;
            if (_this.pageConnected) {
                if (direction == 'bottom') {
                    currPage.style.top = -_this.pageHeight + "px";
                }
                else if (direction == 'top') {
                    currPage.style.top = _this.pageHeight + "px";
                }
                else if (direction == 'left') {
                    currPage.style.left = _this.pageWidth + "px";
                }
                else {
                    currPage.style.left = -_this.pageWidth + "px";
                }
            }
            _this.turnedPage = _this.currPage; //记录当前页为已翻页页面
            _this.currPage = _this.readyPage.index;
            _this.getPrevPage();
            _this.getNextPage();
            setTimeout(function () {
                _this.pages[_this.currPage].style.transition = "none";
                if (_this.pageConnected) {
                    _this.pages[_this.turnedPage].style.transition = "none";
                }
                _this.pages[_this.turnedPage].style.zIndex = 0;
                _this.turning = false;
                if (_this.callBack) {
                    _this.callBack({
                        currPage: _this.currPage,
                        turnedPage: _this.turnedPage
                    });
                }
            }, _this.changeTime);
        };
        //获取上一页
        this.getPrevPage = function () {
            if (!_this.runCircle) {
                _this.prevPage = _this.currPage > 0 ? _this.currPage - 1 : _this.currPage;
            }
            else {
                _this.prevPage = _this.currPage > 0 ? _this.currPage - 1 : _this.pagesLen - 1;
            }
        };
        //获取下一页
        this.getNextPage = function () {
            if (!_this.runCircle) {
                _this.nextPage = _this.currPage < _this.pagesLen - 1 ? _this.currPage + 1 : _this.currPage;
            }
            else {
                _this.nextPage = _this.currPage < _this.pagesLen - 1 ? _this.currPage + 1 : 0;
            }
        };
        //微场景初始化
        this.microSceneInit = function () {
            console.log("init");
            _this.getEnvironment();
            _this.container.style.position = "fixed";
            _this.container.style.top = 0;
            _this.container.style.bottom = 0;
            _this.container.style.left = 0;
            _this.container.style.right = 0;
            for (var i = 0; i < _this.pagesLen; i++) {
                _this.pages[i].style.position = "absolute";
                _this.pages[i].style.width = _this.pageWidth + "px";
                _this.pages[i].style.height = _this.pageHeight + "px";
                _this.pages[i].style.top = 0;
                _this.pages[i].style.left = 0;
                _this.pages[i].style.zIndex = 0;
                // 不能在初始化的时候加上过渡，不然页面预备和页面切换在一瞬间，没有过渡效果
                _this.pages[i].style.transition = "none";
            }
            _this.getPrevPage();
            _this.getNextPage();
            _this.pages[_this.currPage].style.zIndex = 100;
            if (_this.callBack) {
                _this.callBack({
                    currPage: _this.currPage,
                    turnedPage: _this.turnedPage
                });
            }
        };
        this.run = function () {
            console.log("start run");
            _this.microSceneInit();
            if (_this.useDrag) {
                _this.dragListenerInit();
            }
            else {
                _this.listenerInit();
            }
        };
        //容器
        this.container = document.getElementsByClassName(o.container)[0];
        //各页面
        this.pages = this.container.children;
        this.pagesLen = this.pages.length;
        //当前页
        this.currPage = o.currPage || 0;
        //页面切换的时间 默认300ms
        this.changeTime = o.changeTime || 500;
        //是否按圈翻页
        this.runCircle = o.runCircle || false;
        //翻页方式：默认0,上下翻   1,左右翻
        this.type = o.type || 0;
        //是否连接页面
        this.pageConnected = o.pageConnected || false;
        //回调函数, 每个页面切换完执行
        this.callBack = o.callBack || null;
        //是否不允许触摸翻页
        this.isCantTouch = o.isCantTouch || false;
        //是否拖拽
        this.useDrag = o.useDrag || false;
        //拖拽跳转线 拖拽内容占页面百分比多少时，跳转到下一页
        this.dragJumpLine = o.dragJumpLine || 0.3;
    }
    return MicroScene;
}());
