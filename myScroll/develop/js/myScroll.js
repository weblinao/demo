// 现在的问题，速度的计算公式有问题，建议映入摩擦系数，另外加速度的初始值也有问题，应该由摩擦系数计算
/*
 *  myScroll
 *  惯性滑动盒子
 *  author: lina@cheok.com
 *  since: 2018-1-12
 *  */
let lastTime = 0;
let prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

let requestAnimationFrame = window.requestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame;

let prefix;
//通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
for( let i = 0; i < prefixes.length; i++ ) {
    if ( requestAnimationFrame && cancelAnimationFrame ) {
        break;
    }
    prefix = prefixes[i];
    requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
    cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
}

//如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
if ( !requestAnimationFrame || !cancelAnimationFrame ) {
    requestAnimationFrame = function( callback, element ) {
        let currTime = new Date().getTime();
        //为了使setTimteout的尽可能的接近每秒60帧的效果
        let timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
        let id = window.setTimeout( function() {
            callback( currTime + timeToCall );
        }, timeToCall );-
        lastTime = currTime + timeToCall;
        return id;
    };

    cancelAnimationFrame = function( id ) {
        window.clearTimeout( id );
    };
}

//得到兼容各浏览器的API
window.requestAnimationFrame = requestAnimationFrame;
window.cancelAnimationFrame = cancelAnimationFrame;

class MyScroll{
    constructor({
        jTarget,    // 目标元素
        nTopStartHeight = 0, // 开始高度（实际显示内容顶部到内容顶部的距离，px）
        nBottomEndHeight = 0, // 结束高度（实际显示内容底部到内容底部的距离，px）
        isScrollY = true  // 是否是纵向滚动
                }){

        if(!window.jQuery){
            throw new Error("MyScroll needs JQuery\'s support!");
        }
        this.STAGE_MARK = "j-show-stage";
        this.CONTENT_MARK = "j-show-content";
        this.isScrollY = isScrollY;

        if(!jTarget){
            throw new Error("MyScroll missing target: jTarget is indispensable");
        }else{
            let $target;
            if(jTarget instanceof jQuery){
                $target = jTarget;
            }else{
                $target = $(jTarget);
            }

            this.jShowStage = $target; // 滚动盒子
            this.jShowContent = $target.children(); // 滚动内容
        }

        this.nTopStartHeight = nTopStartHeight;
        this.nBottomEndHeight = nBottomEndHeight;
        this.nStageTop = this.jShowStage.offset().top;

        this.oSpeed = {
            nScrollSpeed: 0,  // 滚动速度  px/帧 每秒60帧  px/16ms
            nAcceleration: 0, // 加速度
            nLastTime: 0,       // 上次触碰时间
            nCurrTime: 0       // 当前触碰时间
        };
        this.oTCoordinate = {// 触碰坐标
            nTStartX: 0,
            nTLastX: 0,
            nTEndX: 0,
            nTStartY: 0,
            nTLastY: 0,
            nTEndY: 0,
            sStartEvent: "",
            sMoveEvent: "",
            sEndEvent: ""
        };
        this.isMoved = false; // 是否移动过
        this.nMoveDistance = 0;
        this.nTransLate = 0; //已移动的距离
        this.sFrameTimer = null;  // 帧动画标志
        this.isAnimating = false;
        this.isOutOfBounds = false; // 是否越界 低于最小移动，高于最大移动

        this.run();
    }

    static describe(){
        return "This is MyScroll: 惯性滑动盒子";
    }
    // 移动到某个位置
    __goTo(nPosition){
        this.isAnimating = true;
        this.jShowContent.css({
            "transition": "all 300ms ease",
            "transform": "translateY(" + (-nPosition) + "px)"
        });
        this.nTransLate = nPosition;

        setTimeout(() => {
            this.jShowContent.css({
                "transition": "unset"
            });
            this.isAnimating = false;
        }, 300);
    }
    // 移动到顶部
    __goToTop(){
        this.__goTo(this.nTopStartHeight);
    }
    // 移动到底部
    __goToBottom(){
        let nMaxMove = this.jShowContent.outerHeight() - this.jShowStage.outerHeight() - this.nBottomEndHeight;
        this.__goTo(nMaxMove);
    }
    // 计算移动坐标
    __calculateMoveCoord(){
        let oCoord = this.oTCoordinate,
            nMoveDistance;
        if(this.isScrollY){
            nMoveDistance = Math.round(oCoord.nTEndY - oCoord.nTLastY);
        }else{
            nMoveDistance = Math.round(oCoord.nTEndX - oCoord.nTLastX);
        }
        // console.log(oCoord.nTEndY, oCoord.nTLastY);
        return nMoveDistance;
    }
    //移动滚动内容
    __moveContent(){
        let nMaxMove = this.jShowContent.outerHeight() - this.jShowStage.outerHeight() - this.nBottomEndHeight;

        if((-this.nTransLate) > this.nTopStartHeight || this.nTransLate > nMaxMove){
            // 超过了最高或最低点，移动距离变为1/3
            this.nTransLate -= this.nMoveDistance / 3;
        }else{
            this.nTransLate -= this.nMoveDistance;
        }

        this.jShowContent.css(
            "transform", "translateY(" + (-this.nTransLate) + "px)"
        );
    }
    // 计算速度相关
    __calculateSpeed(){
        let nMoveDistance = this.__calculateMoveCoord(),
            nTime = this.oSpeed.nCurrTime - this.oSpeed.nLastTime,
            nV, nA;

        if(nTime === 0){
            nV = 0;
        }else{
            nV = (nMoveDistance / nTime) * 16 * 1.5;
        }
        //做阻尼运动，加速度符号应与速度相反
        nA = -nV / 80;

        this.oSpeed.nScrollSpeed = nV;
        this.oSpeed.nAcceleration = nA;
    }
    // 逐帧移动 每一帧移动的距离
    __frameMove(){
        let nVS = this.oSpeed.nScrollSpeed,
            nA = this.oSpeed.nAcceleration,
            isVNegative = nVS < 0,
            nT = 1,  // 时间为1帧（16ms）
            // nSL = this.nMoveDistance,
            nS, nVE;

        if(this.isOutOfBounds){
            // 越界后加速速度衰减
            nA = nA * 150;
            this.oSpeed.nAcceleration = nA;
        }

        nS = (nVS * nT) + (0.5 * nA * nT * nT);
        nVE = nVS + (nA * nT);

        if(isVNegative){
            if(nS < 0 && nVE < 0){
                this.nMoveDistance = nS;
                this.oSpeed.nScrollSpeed = nVE;
            }else{
                this.nMoveDistance = 0;
                this.oSpeed.nScrollSpeed = 0;
            }
        }else{
            if(nS > 0 && nVE > 0){
                this.nMoveDistance = nS;
                this.oSpeed.nScrollSpeed = nVE;
            }else{
                this.nMoveDistance = 0;
                this.oSpeed.nScrollSpeed = 0;
            }
        }
        // if(nSL === this.nMoveDistance){
        //     // this.nMoveDistance--;
        //     // alert(nS, nSL, nA, nVS, nVE);
        //     alert("nS: "+nS + " nSL: " + nSL + " nA: "+ nA+" nVS: "+nVS+" nVE: "+nVE);
        // }
        this.nTransLate -= this.nMoveDistance;

        this.jShowContent.css(
            "transform", "translateY(" + (-this.nTransLate) + "px)"
        );
    }
    // 滚屏
    __scroll(){
        let nMaxMove = this.jShowContent.outerHeight() - this.jShowStage.outerHeight() - this.nBottomEndHeight;
        if((-this.nTransLate) > this.nTopStartHeight || this.nTransLate > nMaxMove){
            this.isOutOfBounds = true;
        }else{
            this.isOutOfBounds = false;
        }



        this.__frameMove();

        if(Math.abs(this.nMoveDistance) > 3 && Math.abs(this.oSpeed.nScrollSpeed) > 1){
            this.sFrameTimer = requestAnimationFrame(this.__scroll.bind(this));
        }else if(this.oSpeed.nScrollSpeed === 0 && (-this.nTransLate) > this.nTopStartHeight){
            this.__goToTop(); // 上拉到头，返回顶部
        }else if(this.oSpeed.nScrollSpeed === 0 && this.nTransLate > nMaxMove){
            this.__goToBottom(); // 下拉到头，返回底部
        }
    }
    // 停止滚屏
    __stopScroll(){
        if(this.sFrameTimer){
            cancelAnimationFrame(this.sFrameTimer);
            this.sFrameTimer = null;
        }
        this.oSpeed = {
            nScrollSpeed: 0,
            nAcceleration: 0,
            nLastTime: 0,
            nCurrTime: 0
        };
        this.nMoveDistance = 0;
    }
    __coorDinateInit(){
        this.isMoved = false;
        let oInit = {
            nTStartX: 0,
            nTLastX: 0,
            nTEndX: 0,
            nTStartY: 0,
            nTLastY: 0,
            nTEndY: 0
        };
        this.oTCoordinate = $.extend({}, this.oTCoordinate, oInit);
    }
    __touchStart(e){
        let nTime = new Date().getTime();
        this.oSpeed.nCurrTime = this.oSpeed.nLastTime = nTime;

        this.__stopScroll();
        // 每次清空上次的数据
        this.__coorDinateInit();

        if(this.isInMobile){
            let aTouches = e.targetTouches;
            this.oTCoordinate.nTStartX = this.oTCoordinate.nTLastX = aTouches[0].clientX;
            this.oTCoordinate.nTStartY = this.oTCoordinate.nTLastY = aTouches[0].clientY;
        }
    }
    __touchMove(e){
        let nTime = new Date().getTime();
        this.oSpeed.nLastTime = this.oSpeed.nCurrTime;
        this.oSpeed.nCurrTime = nTime;

        if(this.isInMobile){
            let aTouches = e.changedTouches;
            if(!this.oTCoordinate.nTEndX){
                // console.log(this.oTCoordinate.nTStartX);
                this.oTCoordinate.nTLastX = this.oTCoordinate.nTStartX;
                this.oTCoordinate.nTLastY = this.oTCoordinate.nTStartY;
            }else{
                this.oTCoordinate.nTLastX = this.oTCoordinate.nTEndX;
                this.oTCoordinate.nTLastY = this.oTCoordinate.nTEndY;
            }
            this.oTCoordinate.nTEndX = aTouches[aTouches.length -1].clientX;
            this.oTCoordinate.nTEndY = aTouches[aTouches.length -1].clientY;
        }
        this.isMoved = true;
        // console.log(this.oTCoordinate);
        this.nMoveDistance = this.__calculateMoveCoord();
        this.__moveContent();
    }
    __touchEnd(e){
        // 这里不做时间和坐标获取，只做速度计算
        let nTime = new Date().getTime(),
            isStoppedMove = (nTime - this.oSpeed.nCurrTime) > 80 ;

        if((-this.nTransLate) > this.nTopStartHeight){
            this.__goToTop();
            return;
        }
        let nMaxMove = this.jShowContent.outerHeight() - this.jShowStage.outerHeight() - this.nBottomEndHeight;
        if(this.nTransLate > nMaxMove){
            this.__goToBottom();
            return;
        }

        if(this.isMoved && !isStoppedMove){
            this.__calculateSpeed();
            this.__scroll();
        }
    }
    /*
    * 环境初始化
    * */
    __environmentInit(){
        this.jShowStage.addClass(this.STAGE_MARK);
        this.jShowContent.addClass(this.CONTENT_MARK);

        this.jShowStage.css({
            "overflow": "hidden"
        });

        this.nTransLate = this.nTopStartHeight;
        this.jShowContent.css({
            "transform": "translateY(" + (-this.nTransLate) + "px)"
        });
    }
    /*
    * 监听初始化
    * */
    __eventListenerInit(){
        this.isInMobile = function(){
           return !!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i));
        }();
        // DOMMouseScroll  mousewheel
        // this.jShowContent.on("scroll", (e) => {
        //
        // })
        if(this.isInMobile){
            this.oTCoordinate.sStartEvent = "touchstart";
            this.oTCoordinate.sMoveEvent = "touchmove";
            this.oTCoordinate.sEndEvent = "touchend";
        }else{

        }
        // console.log(this);
        this.jShowStage.on(this.oTCoordinate.sStartEvent, this.__touchStart.bind(this));
        this.jShowStage.on(this.oTCoordinate.sMoveEvent, this.__touchMove.bind(this));
        this.jShowStage.on(this.oTCoordinate.sEndEvent, this.__touchEnd.bind(this));
    }
    // 运行入口
    run(){
        this.__environmentInit();

        this.__eventListenerInit();

        console.log('MyScroll is running');
    }
}
