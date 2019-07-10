window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var cEvent = "touchstart"; //默认是手机->touchstart,PC->click
function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        // document.writeln("phone");
        cEvent = "touchstart";
    } else {
        // document.writeln("pc");
        cEvent = "click";
    }
}

var RPWIDTH = 50;                           //红包宽度
var RPHEIGHT = 50;                          //红包高度
var SWIDTH = window.innerWidth;             //舞台宽度
var SHEIGHT = window.innerHeight;           //舞台高度
var IMGURL = "img/timg.jpg";                //红包图片路径
var chooseN = 10;                           //领取次数
var audio = document.createElement("audio");   //创建音频元素
audio.src = "media/7157.mp3";
var rain = document.getElementById("rain"); //获取canvas元素
var ctx = rain.getContext('2d');            //获取画笔
var drawing = null;
var create = null;
var rpImg = new Image();                    //红包图像
rpImg.src = IMGURL;

var rps = [     //存放红包
    //[x,y,speed]   x坐标，y坐标，下落速度
    [0,0,7],
    [50,-50,3],
    [240,-30,2],
    [20,340,2]
];

//结束，停止生成红包，现有红包继续下落，无法点击
function end() {
    if(create){
        clearInterval(create);  //停止生成红包
        create = null;
    }
    //红包继续下落
    ctx.clearRect(0,0,SWIDTH,SHEIGHT); //clear canvas
    rpDestory();
    rpDown();
    dRps2Canvas();

    if(rps.length == 0){
        rps = null;
        window.cancelAnimationFrame(end);
        console.log("end");
    }else {
        drawing = window.requestAnimationFrame(end);
    }
}
//开始动画
function startRun(){
    create = setInterval(rpCreate,300);     //开始生成红包

    rain.addEventListener(cEvent,getRP);   //添加屏幕触摸事件

    draw();                                 //开始绘画
}
//暂停动画
function stopRun(){
    clearInterval(create);                      //停止生成红包

    rain.removeEventListener(cEvent,getRP);   //清除屏幕触摸事件

    //暂停动画
    if(drawing){
        window.cancelAnimationFrame(drawing);
        drawing = null;
    }
}
//判断是否选中了红包
function isGetRp(x,y) {
    var catchRp = null;
    rps.forEach(function(item,index){
        if(x>=item[0] && x<=(item[0]+RPWIDTH) && y>=item[1] && y<=(item[1]+RPHEIGHT)){
            catchRp = index;   //下表越大，红包越靠上
        }
    });
    return catchRp;
}
//点击获取红包
function getRP(e) {
    //暂停动画
    stopRun();
    //获取事件坐标
    var ex = e.clientX || e.touches[0].clientX;
    var ey = e.clientY || e.touches[0].clientY;

    var isGet = isGetRp(ex,ey);

    if(isGet != null){
        //播放金币下落声
        audio.currentTime = 0; 
        audio.play();
        if(chooseN>1){
            chooseN--;
            rpDestoryOne(isGet);

            var money = Math.floor(Math.random()*99+1);
            console.log("恭喜您获得"+money+"元红包");
            startRun();
        }else{
            var money = Math.floor(Math.random()*99+1);
            console.log("恭喜您获得"+money+"元红包");
            // ctx.clearRect(0,0,SWIDTH,SHEIGHT); //clear canvas
            // rps = null;     //清除红包数组
            alert("您的红包次数已用完");
            end();
        }
    }else{
        startRun();
    }
}
//随机位置创建随机个红包，速度随机
function rpCreate() {
    var rpNum = Math.floor(Math.random()*3+2); //随机2~5个红包
    for(var i=0;i<rpNum;i++){
        var x = Math.floor(Math.random()*(SWIDTH-RPWIDTH));
        var speed = Math.floor(Math.random()*9+2); //速度在2~11

        rps.push([x,-RPHEIGHT,speed]);
    }
}

//红包销毁
function rpDestory() {
    rps.forEach(function(item,index){
        if(item[1]>(SHEIGHT+RPHEIGHT)){ //y坐标>舞台高度和红包高度之和
            rps.splice(index,1);
        }
    })
}
//销毁一个红包
function rpDestoryOne(index) {
    rps.splice(index,1);
}
//红包下落
function rpDown() {
    rps.forEach(function(item,index){
        item[1] += item[2]; //y=y+speed
    })
}
//将数组中的红包数据画到画布上去
function dRps2Canvas(){
    rps.forEach(function(item,index){
        ctx.drawImage(rpImg,item[0],item[1],RPWIDTH,RPHEIGHT);
    })
}
//画图
function draw(){
    ctx.clearRect(0,0,SWIDTH,SHEIGHT); //clear canvas
    rpDestory();
    rpDown();
    dRps2Canvas();

    drawing = window.requestAnimationFrame(draw);
}

//红包图片加载完成后，开始红包雨
rpImg.onload = function(){
    rain.width = SWIDTH;
    rain.height = SHEIGHT;

    browserRedirect();
    startRun();
};