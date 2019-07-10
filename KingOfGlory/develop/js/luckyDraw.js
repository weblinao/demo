console.log("in draw");

var startItem = 0;   //从这里开始转
var currentItem = 0; //当前选中奖品
var endItem = 8;	 //抽奖结果
var speed = 450;	 //抽奖转圈的速度
var acce = 200;		 //加速度
var items = document.querySelectorAll(".game-item");
var CIRNUM = 10;	 //抽奖转的圈数
var curNum = 0;		 //当前圈数
var drawing = null;
var order = [0,1,2,5,8,7,6,3];	//旋转的顺序
var curPo = 0;			//当前位置
// console.log(items);

//开始抽奖
function gameStart(){
	console.log("game start");

 	items.forEach(function(value,index){
 		// console.log(value,index);
 		value.className = "game-item";
 	});

	currentItem = startItem;
	items[currentItem].className += " current-item";
	curPo = 0;
	curNum = 0;
	setTimeout(circle, speed);
}
//转圈
function circle(){

	items[currentItem].className = "game-item";
	if(curPo<7){  //最后一个奖品之前
		curPo++;
		currentItem = order[curPo];
	}else{
		curPo = 0;
		curNum++;
		currentItem = order[curPo];
	}
	items[currentItem].className += " current-item";

	console.log(curNum);
	if(curNum<1){
		setTimeout(circle, speed-acce);
	}else if(curNum<CIRNUM-1){
		setTimeout(circle, speed-acce*2);
	}else if(curNum<CIRNUM){
		setTimeout(circle, speed-acce);
	}else{	//超过最大圈数，将在下一圈决定结果
		setTimeout(decide, speed-acce);
	}
	
}
//决定结果
function decide(){
	if(currentItem == endItem){  //转到结果上，抽奖结束
		alert("抽奖结束");
	}else{
		items[currentItem].className = "game-item";
		curPo++;
		currentItem = order[curPo];
		items[currentItem].className += " current-item";

		setTimeout(decide, speed-acce/2);
	}
}

var startBtn = document.getElementsByClassName('game-start')[0];
startBtn.addEventListener("click",gameStart);