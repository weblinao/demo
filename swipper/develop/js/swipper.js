//定义微场景类
class MicroScene{
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
	 * }
	 */
	constructor(o){
		this.say = "I'm MicroScene";
		//容器
		this.container = document.getElementsByClassName(o.container)[0];
		//各页面
		this.pages = this.container.children;
		this.pagesLen = this.pages.length;
		//各页面宽高
		this.pageWidth = window.innerWidth;
		this.pageHeight = window.innerHeight;
		//当前页
		this.currPage = o.currPage || 0;
		//前一页
		this.prevPage = null;
		//下一页
		this.nextPage = this.currPage < this.pagesLen - 1 ? this.currPage + 1 : this.currPage;
		//准备翻页的页面
		this.readyPage = {
			index: null,		//预备页页码
			direction: null 	//预备页所在方向
		};
		//已翻页页面
		this.turnedPage = null;
		//页面切换的时间 默认300ms
		this.changeTime = o.changeTime || 300;
		//是否正在翻页
		this.turning = false;
		//是否按圈翻页
		this.runCircle = o.runCircle || false;
		//翻页方式：默认0,上下翻   1,左右翻
		this.type = o.type || 0;
		//是否连接页面
		this.pageConnected = o.pageConnected || false;
		//运行环境
		this.environment = "phone";
		//触屏事件坐标
		this.touchCoord = {
			touchstart: "touchstart",
			touchend: "touchend",
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0
		};
		//回调函数, 每个页面切换完执行
		this.callBack = o.callBack || null;
	}
	//获取所在环境
	getEnvironment(){
		let sUserAgent = navigator.userAgent.toLowerCase();
	    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
	    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	    let bIsAndroid = sUserAgent.match(/android/i) == "android";
	    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
	        // document.writeln("phone");
	        this.environment = "phone";
	    } else {
	        // document.writeln("pc");
	        this.environment = "pc";
	    }
	}
	//监听初始化
	listenerInit(){
		console.log("listenerInit");

		this.touchCoord.touchstart = this.environment == "phone" ? "touchstart" : "mousedown";
		this.touchCoord.touchend = this.environment == "phone" ? "touchend" : "mouseup",

		//使用箭头函数，将this指向MicreScene
		this.container.addEventListener(this.touchCoord.touchstart, (e) => {
			this.getStartCoord(e);
		});
		this.container.addEventListener(this.touchCoord.touchend, (e) => {
			this.getEndCoord(e);
		});
		
	}
	//获取触屏开始时坐标
	getStartCoord(e){

		if(this.turning) return;  //正在翻页，不予计算

		if(this.environment == "phone"){
			this.touchCoord.startX = e.touches[0].pageX;
			this.touchCoord.startY = e.touches[0].pageY;
		}else{
			this.touchCoord.startX = e.pageX;
			this.touchCoord.startY = e.pageY;
		}
	}
	//获取触屏结束时坐标
	getEndCoord(e){

		if(this.turning) return;  //正在翻页，不予计算

		if(this.environment == "phone"){
			this.touchCoord.endX = e.changedTouches[0].pageX;
			this.touchCoord.endY = e.changedTouches[0].pageY;
		}else{
			this.touchCoord.endX = e.pageX;
			this.touchCoord.endY = e.pageY;
		}

		this.calculateCoord();
	}
	//计算坐标
	calculateCoord(){
		let path = 0;

		if(this.type == 0){   //上下翻页，计算Y
			path = this.touchCoord.startY - this.touchCoord.endY;

			if(Math.abs(path) > 3){ //移动距离小于3则不计算
				if(path > 0){
					if(this.currPage == this.nextPage) return;
					this.getReadyPage();
				}else{
					if(this.currPage == this.prevPage) return;
					this.getReadyPage(-1);
				}

				// this.goReadyPage();
				setTimeout(()=>{
					this.goReadyPage();
				},0);
			}
		}else if(this.type == 1){ //左右翻页，计算X
			path = this.touchCoord.startX - this.touchCoord.endX;

			if(Math.abs(path) > 3){ //移动距离小于3则不计算
				if(path > 0){
					if(this.currPage == this.nextPage) return;
					this.getReadyPage();
				}else{
					if(this.currPage == this.prevPage) return;
					this.getReadyPage(-1);
				}

				// this.goReadyPage();
				setTimeout(()=>{
					this.goReadyPage();
				},0);
			}
		}
	}
	/*
	 * 指定一个页面为待翻页
	 * pageNum: 指定页页码
	 */
	getPageReady(pageNum){

		let dir = pageNum > this.currPage ? 1 : -1;
		let page = this.pages[pageNum];;

		if(dir > 0){		//准备向后翻页

			if(this.type == 0){
				page.style.top = this.pageHeight + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "bottom";

			}else if(this.type == 1){
				page.style.left = this.pageWidth + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "right";
			}
		}else{ 				//准备向前翻页

			if(this.type == 0){
				page.style.top = -this.pageHeight + "px";

				this.readyPage.index = pageNum;
				this.readyPage.direction = "top";
			}else if(this.type == 1){
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
	goPage(pageNum){
		if(pageNum == this.currPage) return;  //跳当前页，禁止

		this.getPageReady(pageNum);

		setTimeout(()=>{
			this.goReadyPage();
		},0);
	}
	/*
	 * 准备翻页
	 * direction: 翻页方向 默认为1 向后翻
	 */
	getReadyPage(direction){
		let dir = direction || 1;
		let nextPage = null
		let page = null;

		if(dir > 0){		//准备向后翻页
			nextPage = this.nextPage;
			page = this.pages[nextPage];

			if(this.type == 0){
				page.style.top = this.pageHeight + "px";

				this.readyPage.index = nextPage;
				this.readyPage.direction = "bottom";

			}else if(this.type == 1){
				page.style.left = this.pageWidth + "px";

				this.readyPage.index = nextPage;
				this.readyPage.direction = "right";
			}
		}else{ 				//准备向前翻页
			nextPage = this.prevPage;
			page = this.pages[nextPage];

			if(this.type == 0){
				page.style.top = -this.pageHeight + "px";

				this.readyPage.index = nextPage;
				this.readyPage.direction = "top";
			}else if(this.type == 1){
				page.style.left = -this.pageWidth + "px";

				this.readyPage.index = nextPage;
				this.readyPage.direction = "left";
			}
		}
	}
	/*
	 * 翻页
	 * 
	 */
	goReadyPage(){
		if(this.turning) return;  //正在翻页，不予翻页

		this.turning = true;

		let currPage =  this.pages[this.currPage];
		let readyPage = this.pages[this.readyPage.index];
		let direction = this.readyPage.direction;

		currPage.style.zIndex = 50;
		readyPage.style.zIndex = 100;
		readyPage.style.transition = "all " + this.changeTime + "ms linear";
		if(this.pageConnected){
			currPage.style.transition = "all " + this.changeTime + "ms linear";
		}

		readyPage.style.top = 0;
		readyPage.style.left = 0;
		if(this.pageConnected){

			readyPage.style.top = 0;
			readyPage.style.left = 0;
			if(direction == 'bottom'){
				currPage.style.top = -this.pageHeight + "px";
			}else if(direction == 'top'){
				currPage.style.top = this.pageHeight + "px";
			}else if(direction == 'left'){
				currPage.style.left = this.pageWidth + "px";
			}else{
				currPage.style.left = -this.pageWidth + "px";
			}
		}

		this.turnedPage = this.currPage;	//记录当前页为已翻页页面
		this.currPage = this.readyPage.index;
		this.getPrevPage();
		this.getNextPage();

		setTimeout(() => {
			this.pages[this.currPage].style.transition = "none";
			if(this.pageConnected){
				this.pages[this.turnedPage].style.transition = "none";
			}
			this.pages[this.turnedPage].style.zIndex = 0;
			this.turning = false;
			if(this.callBack){
				this.callBack(this.currPage);
			}
		}, this.changeTime);
	}
	//获取上一页
	getPrevPage(){
		if(!this.runCircle){
			this.prevPage = this.currPage > 0 ? this.currPage - 1 : this.currPage;
		}else{
			this.prevPage = this.currPage > 0 ? this.currPage - 1 : this.pagesLen - 1;
		}
	}
	//获取下一页
	getNextPage(){
		if(!this.runCircle){
			this.nextPage = this.currPage < this.pagesLen - 1 ? this.currPage + 1 : this.currPage;
		}else{
			this.nextPage = this.currPage < this.pagesLen - 1 ? this.currPage + 1 : 0;
		}
	}
	//微场景初始化
	microSceneInit(){
		console.log("init");

		this.getEnvironment();

		this.container.style.position = "fixed";
		this.container.style.top = 0;
		this.container.style.bottom = 0;
		this.container.style.left = 0;
		this.container.style.right = 0;

		for(let i=0;i<this.pagesLen;i++){
			this.pages[i].style.position = "absolute";
			this.pages[i].style.width = this.pageWidth + "px";
			this.pages[i].style.height = this.pageHeight + "px";
			this.pages[i].style.top = 0;
			this.pages[i].style.left = 0;

			// 不能在初始化的时候加上过渡，不然页面预备和页面切换在一瞬间，没有过渡效果
			// this.pages[i].style.transition = "all " + this.changeTime + "ms linear";
			this.pages[i].style.transition = "none";
		}

		this.getPrevPage();
		this.getNextPage();
		this.pages[this.currPage].style.zIndex = 100;
		if(this.callBack){
			this.callBack(this.currPage);
		}
	}

	run(){
		console.log("start run");
		this.microSceneInit();
		this.listenerInit();
	}
} 