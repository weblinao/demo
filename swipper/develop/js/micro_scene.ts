//定义微场景类
class MicroScene {
	say = "I'm MicroScene";
	//容器
	container ;
	//各页面
	pages ;
	pagesLen ;
	//各页面宽高
	pageWidth = window.innerWidth;
	pageHeight = window.innerHeight;
	//当前页
	currPage ;
	//前一页
	prevPage = null;
	//下一页
	nextPage = null;
	//准备翻页的页面
	readyPage = {
		index: null,		//预备页页码
		direction: null 	//预备页所在方向
	};
	//已翻页页面
	turnedPage = null;
	//页面切换的时间 默认300ms
	changeTime ;
	//是否正在翻页
	turning = false;
	//是否按圈翻页
	runCircle ;
	//翻页方式：默认0,上下翻   1,左右翻
	type ;
	//是否连接页面
	pageConnected ;
	//运行环境
	environment = "phone";
	//触屏事件坐标
	touchCoord = {
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
	//回调函数, 每个页面切换完执行
	callBack ;
	//是否允许翻页
	isCanRun = true;
	//是否允许不触摸翻页
	isCantTouch ;
	//是否拖拽
	useDrag ;
	//正在监听移动的标志
	moveListening = false;
	//拖拽跳转线
	dragJumpLine ;

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
	constructor(o) {
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
		this.dragJumpLine = o.dragJumpLine || 0.3
	}
	//获取所在环境
	getEnvironment = () => {
		let sUserAgent = navigator.userAgent.toLowerCase();
		let bIsIpad = sUserAgent.indexOf("ipad") >= 0;
		let bIsIphoneOs = sUserAgent.indexOf('iphone os') >= 0;
		let bIsMidp = sUserAgent.indexOf('midp') >= 0;
		let bIsUc7 = sUserAgent.indexOf('rv:1.2.3.4') >= 0;
		let bIsUc = sUserAgent.indexOf('ucweb') >= 0;
		let bIsAndroid = sUserAgent.indexOf('android') >= 0;
		let bIsCE = sUserAgent.indexOf('windows ce') >= 0;
		let bIsWM = sUserAgent.indexOf('windows mobile') >= 0;
		if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
			// document.writeln("phone");
			this.environment = "phone";
		} else {
			// document.writeln("pc");
			this.environment = "pc";
		}
	}
	//监听初始化
	listenerInit = () => {
		if(this.isCantTouch) return;	//不允许触摸翻页，不做监听
		console.log("listenerInit");

		this.touchCoord.touchstart = this.environment == "phone" ? "touchstart" : "mousedown";
		this.touchCoord.touchend = this.environment == "phone" ? "touchend" : "mouseup";

		this.container.addEventListener(this.touchCoord.touchstart, this.getStartCoord );
		// this.container.addEventListener(this.touchCoord.touchend, this.getEndCoord );
	}
	// 页面拖拽监听初始化
	dragListenerInit = () => {
		if (this.isCantTouch) return;	//不允许触摸翻页，不做监听
		console.log("dragListenerInit");

		this.touchCoord.touchstart = this.environment == "phone" ? "touchstart" : "mousedown";
		this.touchCoord.touchend = this.environment == "phone" ? "touchend" : "mouseup";
		this.touchCoord.touchmove = this.environment == "phone" ? "touchmove" : "mousemove";

		this.container.addEventListener(this.touchCoord.touchstart, this.getDragStart);
	}
	//开始监听拖拽
	getDragStart = (e) => {
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		this.moveListening = true;
		this.container.removeEventListener(this.touchCoord.touchstart, this.getDragStart);

		if (this.environment == "phone") {
			this.touchCoord.startX = e.touches[0].pageX;
			this.touchCoord.startY = e.touches[0].pageY;
		} else {
			this.touchCoord.startX = e.pageX;
			this.touchCoord.startY = e.pageY;
		}

		this.container.addEventListener(this.touchCoord.touchmove, this.getMoveCoord);
		this.container.addEventListener(this.touchCoord.touchend, this.setDrageEnd);
	}
	//获取移动坐标
	getMoveCoord = (e) => {
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		this.container.removeEventListener(this.touchCoord.touchmove, this.getMoveCoord);

		if (this.environment == "phone") {
			this.touchCoord.moveX = e.touches[0].pageX;
			this.touchCoord.moveY = e.touches[0].pageY;
		} else {
			this.touchCoord.moveX = e.pageX;
			this.touchCoord.moveY = e.pageY;
		}

		this.calculateDrageCoord();
		setTimeout(()=>{
			if (this.moveListening) {
				this.container.addEventListener(this.touchCoord.touchmove, this.getMoveCoord);
			}
		},30);
	}
	//结束监听拖拽
	setDrageEnd = (e) => {
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		this.moveListening = false;
		this.container.removeEventListener(this.touchCoord.touchend, this.setDrageEnd);
		this.container.removeEventListener(this.touchCoord.touchmove, this.getMoveCoord);

		if (this.environment == "phone") {
			this.touchCoord.endX = e.changedTouches[0].pageX;
			this.touchCoord.endY = e.changedTouches[0].pageY;
		} else {
			this.touchCoord.endX = e.pageX;
			this.touchCoord.endY = e.pageY;
		}

		// 中途跳页就不会再触发touchend事件，运行到这里只有一种情况：放弃拖拽翻页
		// 恢复currPage和readyPage
		this.recoverReadyPage();

		this.container.addEventListener(this.touchCoord.touchstart, this.getDragStart);
	}
	//获取触屏开始时坐标
	getStartCoord = (e) => {
		if(!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		this.container.removeEventListener(this.touchCoord.touchstart, this.getStartCoord);

		if (this.environment == "phone") {
			this.touchCoord.startX = e.touches[0].pageX;
			this.touchCoord.startY = e.touches[0].pageY;
		} else {
			this.touchCoord.startX = e.pageX;
			this.touchCoord.startY = e.pageY;
		}

		this.container.addEventListener(this.touchCoord.touchend, this.getEndCoord);
	}
	//获取触屏结束时坐标
	getEndCoord = (e) => {
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		this.container.removeEventListener(this.touchCoord.touchend, this.getEndCoord);

		if (this.environment == "phone") {
			this.touchCoord.endX = e.changedTouches[0].pageX;
			this.touchCoord.endY = e.changedTouches[0].pageY;
		} else {
			this.touchCoord.endX = e.pageX;
			this.touchCoord.endY = e.pageY;
		}

		this.calculateCoord();

		this.container.addEventListener(this.touchCoord.touchstart, this.getStartCoord);
	}
	//计算拖拽坐标
	calculateDrageCoord = () =>{
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		let path = 0;

		if (this.type == 0) {	//上下翻页，计算Y
			path = this.touchCoord.startY - this.touchCoord.moveY;
			if (Math.abs(path) / this.pageHeight > this.dragJumpLine) {
				this.jumpToReadyPage();
				return;
			}
		}else if(this.type == 1){
			path = this.touchCoord.startX - this.touchCoord.moveX;
			if (Math.abs(path) / this.pageWidth > this.dragJumpLine) {
				this.jumpToReadyPage();
				return;
			}
		}

		if (path > 0) {
			if (this.currPage == this.nextPage) return;
			this.checkReadyPage(this.nextPage, path);
		} else {
			if (this.currPage == this.prevPage) return;
			this.checkReadyPage(this.prevPage, path);
		}
	}
	//拖拽到极限，跳转到下一页
	jumpToReadyPage = () => {
		this.moveListening = false;
		this.container.removeEventListener(this.touchCoord.touchend, this.setDrageEnd);
		this.container.removeEventListener(this.touchCoord.touchmove, this.getMoveCoord);

		this.goReadyPage();

		this.container.addEventListener(this.touchCoord.touchstart, this.getDragStart);	
	}
	//恢复预备页和当前页
	recoverReadyPage = () => {
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;
		if (this.currPage == this.readyPage.index) return; //未预备的情况

		this.turning = true;

		let currPage = this.pages[this.currPage];
		let readyPage = this.pages[this.readyPage.index];
		let direction = this.readyPage.direction;

		readyPage.style.transition = "all " + this.changeTime + "ms linear";
		if (this.pageConnected) {
			currPage.style.transition = "all " + this.changeTime + "ms linear";
		}

		if (direction == 'bottom') {
			readyPage.style.top = this.pageHeight + "px";
		} else if (direction == 'top') {
			readyPage.style.top = -this.pageHeight + "px";
		} else if (direction == 'left') {
			readyPage.style.left = -this.pageWidth + "px";
		} else {
			readyPage.style.left = this.pageWidth + "px";
		}
		
		if (this.pageConnected) {
			currPage.style.top = 0;
			currPage.style.left = 0;
		}

		setTimeout(() => {
			this.pages[this.readyPage.index].style.transition = "none";
			if (this.pageConnected) {
				this.pages[this.currPage].style.transition = "none";
			}
			this.pages[this.currPage].style.zIndex = 100;
			this.pages[this.readyPage.index].style.zIndex = 0;
			this.pages[this.readyPage.index].style.top = 0;
			this.pages[this.readyPage.index].style.left = 0;
			this.turning = false;

		}, this.changeTime);
	}
	/*
	 * 检测待预备页
	 * checkPage: 待预备页页码
	 * path: 待预备页移动距离
	 */
	checkReadyPage = (checkPage, path) => {
		if(checkPage != this.readyPage.index){
			//待检测页（待预备页）与已预备页不一致
			//将已预备页还原
			if(this.readyPage.index != null){
				let page = this.pages[this.readyPage.index];
				page.style.transition = "none";
				page.style.top = 0;
				page.style.left = 0;
				page.style.zIndex = 0;
			}
			this.getPageReady(checkPage);
		} 
		this.dragPage(path);
	}
	//拖拽页面
	dragPage = (path) => {
		let currPage = this.pages[this.currPage];
		let readyPage = this.pages[this.readyPage.index];
		let direction = this.readyPage.direction;

		currPage.style.zIndex = 50;
		readyPage.style.zIndex = 100;
		if(direction == "bottom"){
			readyPage.style.top = this.pageHeight - path + "px";
			if(this.pageConnected){
				currPage.style.top = -path + "px";
			}
		}else if(direction == "top"){
			readyPage.style.top = -this.pageHeight - path + "px";
			if (this.pageConnected) {
				currPage.style.top = -path + "px";
			}
		}else if(direction == "right"){
			readyPage.style.left = this.pageWidth - path + "px";
			if (this.pageConnected) {
				currPage.style.left = -path + "px";
			}
		}else{
			readyPage.style.left = -this.pageWidth - path + "px";
			if (this.pageConnected) {
				currPage.style.left = -path + "px";
			}
		}
	}
	//计算坐标
	calculateCoord = () => {
		if (!this.isCanRun) return; //不允许翻页
		if (this.turning) return;  //正在翻页，不予计算

		let path = 0;

		if (this.type == 0) {   //上下翻页，计算Y
			path = this.touchCoord.startY - this.touchCoord.endY;
		} else if (this.type == 1) { //左右翻页，计算X
			path = this.touchCoord.startX - this.touchCoord.endX;
		}

		if (Math.abs(path) > 3) { //移动距离小于3则不计算
			if (path > 0) {
				if (this.currPage == this.nextPage) return;
				this.goPage(this.nextPage);
			} else {
				if (this.currPage == this.prevPage) return;
				this.goPage(this.prevPage);
			}
		}
	}
	/*
	 * 指定一个页面为待翻页
	 * pageNum: 指定页页码
	 */
	getPageReady = (pageNum) => {

		let dir = pageNum > this.currPage ? 1 : -1;
		if(this.runCircle){
			if(this.currPage == 0 && pageNum == (this.pagesLen - 1)){
				dir = -1;
			} else if (this.currPage == (this.pagesLen - 1) && pageNum == 0){
				dir = 1;
			} 
		}
		// console.log("currPage:" + this.currPage , "nextPage:" + pageNum , "direction:" + dir);
		let page = this.pages[pageNum];;

		if (dir > 0) {		//准备向后翻页

			if (this.type == 0) {
				page.style.top = this.pageHeight + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "bottom";

			} else if (this.type == 1) {
				page.style.left = this.pageWidth + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "right";
			}
		} else { 				//准备向前翻页

			if (this.type == 0) {
				page.style.top = -this.pageHeight + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "top";
			} else if (this.type == 1) {
				page.style.left = -this.pageWidth + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "left";
			}
		}
	}
	/*
	 * 跳转到指定页面
	 * pageNum: 指定页页码
	 */
	goPage = (pageNum) => {
		if (pageNum == this.currPage) return;  //跳当前页，禁止

		this.getPageReady(pageNum);

		setTimeout(() => {
			this.goReadyPage();
		}, 0);
	}
	/*
	 * 跳转到下一页
	 */
	goNextPage = () => {
		this.goPage(this.nextPage);
	}
	/*
	 * 跳转到上一页
	 */
	goPrevPage = () => {
		this.goPage(this.prevPage);
	}
	/*
	 * 翻页
	 * 
	 */
	goReadyPage = () => {	
		if (!this.isCanRun) return; //不允许翻页
		if(this.turning) return;

		this.turning = true;

		let currPage = this.pages[this.currPage];
		let readyPage = this.pages[this.readyPage.index];
		let direction = this.readyPage.direction;

		currPage.style.zIndex = 50;
		readyPage.style.zIndex = 100;
		readyPage.style.transition = "all " + this.changeTime + "ms linear";
		if (this.pageConnected) {
			currPage.style.transition = "all " + this.changeTime + "ms linear";
		}

		readyPage.style.top = 0;
		readyPage.style.left = 0;
		if (this.pageConnected) {
			if (direction == 'bottom') {
				currPage.style.top = -this.pageHeight + "px";
			} else if (direction == 'top') {
				currPage.style.top = this.pageHeight + "px";
			} else if (direction == 'left') {
				currPage.style.left = this.pageWidth + "px";
			} else {
				currPage.style.left = -this.pageWidth + "px";
			}
		}

		this.turnedPage = this.currPage;	//记录当前页为已翻页页面
		this.currPage = this.readyPage.index;
		this.getPrevPage();
		this.getNextPage();

		setTimeout(() => {
			this.pages[this.currPage].style.transition = "none";
			if (this.pageConnected) {
				this.pages[this.turnedPage].style.transition = "none";
			}
			this.pages[this.turnedPage].style.zIndex = 0;
			this.turning = false;

			if (this.callBack) {
				this.callBack({
					currPage: this.currPage,
					turnedPage: this.turnedPage
				});
			}
		}, this.changeTime);
	}
	//获取上一页
	getPrevPage = () => {
		if (!this.runCircle) {
			this.prevPage = this.currPage > 0 ? this.currPage - 1 : this.currPage;
		} else {
			this.prevPage = this.currPage > 0 ? this.currPage - 1 : this.pagesLen - 1;
		}
	}
	//获取下一页
	getNextPage = () => {
		if (!this.runCircle) {
			this.nextPage = this.currPage < this.pagesLen - 1 ? this.currPage + 1 : this.currPage;
		} else {
			this.nextPage = this.currPage < this.pagesLen - 1 ? this.currPage + 1 : 0;
		}
	}
	//微场景初始化
	microSceneInit = () => {
		console.log("init");

		this.getEnvironment();

		this.container.style.position = "fixed";
		this.container.style.top = 0;
		this.container.style.bottom = 0;
		this.container.style.left = 0;
		this.container.style.right = 0;

		for (let i = 0; i < this.pagesLen; i++) {
			this.pages[i].style.position = "absolute";
			this.pages[i].style.width = this.pageWidth + "px";
			this.pages[i].style.height = this.pageHeight + "px";
			this.pages[i].style.top = 0;
			this.pages[i].style.left = 0;
			this.pages[i].style.zIndex = 0;
			// 不能在初始化的时候加上过渡，不然页面预备和页面切换在一瞬间，没有过渡效果
			this.pages[i].style.transition = "none";
		}

		this.getPrevPage();
		this.getNextPage();
		this.pages[this.currPage].style.zIndex = 100;
		if (this.callBack) {
			this.callBack({
				currPage: this.currPage,
				turnedPage: this.turnedPage
			});
		}
	}

	run = () => {
		console.log("start run");
		this.microSceneInit();

		if(this.useDrag){
			this.dragListenerInit();
		}else{
			this.listenerInit();
		}
	}
} 