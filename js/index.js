(function(){
	setLoading();
	setPerc();
})();

/* 做图片预加载 */
document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});


// 设置屏幕自适应
function setPerc(){
	resetview();
	window.onresize = resetview;
	function resetview(){
		var view = document.querySelector('#view');
		var main = document.querySelector('#main');
		var height = document.documentElement.clientHeight;
		var deg = 52.5;
		var R = Math.round(Math.tan(deg * Math.PI/180)) * (height / 2);
		view.style.WebkitPerspective = view.style.perspective = R + 'px';
		css(main,'translateZ',R);
	}
}

/**
 * 图片预加载效果
 */
function setLoading(){
	var oLogo1 = document.querySelector('#logo1');
	var oLoadTxt = document.querySelector('#loadText');
	var loadNum = 0;
	// 将图片对象合并到一个数组中
	var aImgArr = [];
	for(var i in imgData){
		aImgArr = aImgArr.concat(imgData[i]);
	}
	var imgLen = aImgArr.length;
	// 预加载图片
	for(var i = 0; i < imgLen; i++){
		var oImg = new Image();
		oImg.src = aImgArr[i];
		oImg.onload = oImg.onerror = function(){
			loadNum++;
			// 加载完成函数
			if(loadNum == imgLen){
				anmt();
			}
			oLoadTxt.innerHTML = '已加载' + Math.floor(loadNum/imgLen*100) + '%';
		};
	}

}

/**
 * 隐藏loding动画，开始让logo2显示出来
 */
function anmt(){
	var view = document.querySelector('#view');
	var logo1 = document.querySelector('#logo1');
	var logo2 = document.createElement('div');
	var logo3 = document.createElement('div');
	logo2.id = 'logo2';
	logo3.id = 'logo3';
	var oImg = new Image();
	var oImg2 = new Image();
	oImg.src = imgData.logo[0];
	oImg2.src = imgData.logo[1];
	logo2.className = logo3.className = 'logoImg';
	logo2.appendChild(oImg);
	logo3.appendChild(oImg2);
	css(logo2,"opacity",0);
	css(logo2,'translateZ',-1000);
	css(logo3,"opacity",0);
	css(logo3,'translateZ',-1000);
	view.appendChild(logo2);
	view.appendChild(logo3);
	MTween({
		el : logo1,
		target : { opacity : 0},
		time : 1000,
		type : "easeOut",
		callBack : function(){
			view.removeChild(logo1);
			css(logo2,"opacity",100);
			MTween({
				el : logo2,
				target : { translateZ : 0},
				time : 800,
				type : 'easeBoth',
				callBack : anmt2
			});
		}
	});
}
/* 隐藏logo2，开始让logo3显示出来 */
function anmt2(){
	var view = document.querySelector('#view');
	var logo2 = document.querySelector('#logo2');
	var logo3 = document.querySelector('#logo3');
	setTimeout(function(){
		MTween({
			el : logo2,
			target : { translateZ : -1000},
			time : 300,
			type : 'easeBoth',
			callBack : function(){
				css(logo3,'opacity',100);
				view.removeChild(logo2);
				MTween({
					el : logo3,
					target : {translateZ : 0},
					time : 1000,
					type : 'easeBoth',
					callBack : anmt3
				});
			}
		});
	},1000);
}

/**
 * 隐藏logo3，显示小的爆炸效果
 */
function anmt3(){
	var view = document.querySelector('#view');
	var logo3 = document.querySelector('#logo3');

	setTimeout(function(){
		MTween({
			el : logo3,
			target : { translateZ : -1000},
			time : 800,
			type : 'easeBoth',
			callBack : function(){
				view.removeChild(logo3);
				anmt4();
			}
		});
	},1000);
}

/**
 * 显示爆炸效果
 */
function anmt4(){
	var view = document.querySelector('#view');
	var logo4 = document.createElement('div');
	var logoIcos = document.createElement('div');
	var logo4Img = new Image();
	logo4Img.id = 'logo4Img';
	logo4Img.src = imgData.logo[2];
	logo4.id = 'logo4';
	logoIcos.id = 'logoIcos';
	var iconsLength = 30;
	for(var i = 0; i < iconsLength; i++){
		var span = document.createElement('span');
		span.style.backgroundImage = 'url('+ imgData['logoIco'][i%3] +')';

		var xR = 20+Math.round(Math.random()*240);
		var xDeg = Math.round(Math.random()*360);
		var yR = 10+Math.round(Math.random()*240);;
		var yDeg = Math.round(Math.random()*360);

		css(span,"rotateY",xDeg);
		css(span,"translateZ",xR);
		css(span,"rotateX",yDeg);
		css(span,"translateY",yR);

		logoIcos.appendChild(span);
	}
	css(logo4,"scale",0);
	logo4.appendChild(logo4Img);
	logo4.appendChild(logoIcos);
	view.appendChild(logo4);
	MTween({
		el : logo4,
		target : {scale : 100},
		time : 600,
		type : 'easeIn',
		callBack: function(){
			setTimeout(function(){
				MTween({
					el : logo4,
					target: { scale:20},
					time : 1000,
					type : 'easeBoth',
					callBack: function(){
						view.removeChild(logo4);
						anmt5();
					}
				});
			},1500);
		}
	});
}
// 主体入场
function anmt5(){
	var tZ = document.querySelector('#tZ');
	css(tZ,"translateZ",-2000);
	anmt7();
	anmt6();
	createPano();
	MTween({
		el:tZ,
		target: {translateZ:-160},
		time: 3600,
		type: "easeBoth"
	});
}
// 生成主体的背景圆柱,圆柱入场
function anmt6(){
	var panoBg = document.querySelector('#panoBg');
	var width = 129;
	var len = imgData.bg.length;
	var deg = 360/len;
	var R = parseInt(Math.tan((180-deg)/2 * Math.PI/180) * (width/2)) - 2;
	var startDeg = 180;
	css(panoBg,"rotateX",0);
	css(panoBg,"rotateY",-695);
	for(var i = 0; i < len; i++){
		var span = document.createElement('span');
		span.style.background = 'url('+imgData.bg[i]+')';
		span.style.display = 'none';
		css(span,'rotateY',startDeg);
		css(span,'translateZ',-R);
		panoBg.appendChild(span);
		startDeg -= deg;
	}
	var nub = 0;
	var timer = setInterval(function(){
		panoBg.children[nub].style.display = 'block';
		nub++;
		if(nub >= len){
			clearInterval(timer);
		}

	},3600/2/len);
	MTween({
		el : panoBg,
		target : { rotateY:25},
		time : 3600,
		type : "linear",
		callBack : setDrag
	});

}
// 添加云朵入场
function anmt7(){
	var cloud = document.querySelector('#cloud');
	var cloudNum = 9;
	css(cloud,'translateZ',-400);
	for(var i = 0; i < cloudNum; i++){
		var span = document.createElement("span");
		span.style.backgroundImage = "url("+imgData.cloud[i%3]+")";
		span.style.display = 'none';
		var R = 200 + Math.random()*150;
		var deg = 360/cloudNum * i;
		var rdDeg = deg*Math.PI/180;
		var x = Math.sin(rdDeg) * R;
		var z = Math.cos(rdDeg) * R;
		var y = (Math.random() - 0.5) * 200;
		css(span,'translateX',x);
		css(span,'translateZ',z);
		css(span,'translateY',y);
		cloud.appendChild(span);
	}
	var nub = 0;
	var timer = setInterval(function(){
		cloud.children[nub].style.display = 'block';
		nub++;
		if(nub >= cloudNum){
			clearInterval(timer);
		}
	},50);
	MTween({
		el : cloud,
		target: {rotateY:540},
		time: 3500,
		type: 'easeIn',
		callIn:function(){
			var deg = -css(cloud,'rotateY');
			var iLen = cloud.children.length;
			for(var i = 0; i < iLen; i++){
				css(cloud.children[i],'rotateY',deg);
			}
		},
		callBack : function(){
			cloud.parentNode.removeChild(cloud);
			bgShow();
		}
	});
}
// 设置拖拽效果
function setDrag(){
	var pano = document.querySelector('#pano');
	var panoBg = document.querySelector('#panoBg');
	var tZ = document.querySelector('#tZ');
	var startPoint = {x:0,y:0};
	var panoBgDeg = {x:0,y:0};
	var scale = {x:129/18,y:1170/80};

	var startZ = css(tZ,'translateZ');
	var lastDeg = {x:0,y:0};
	var lastDis = {x:0,y:0};

	document.addEventListener('touchstart',function(ev){
		// 请求原来的计时器，防止卡顿
		clearInterval(pano.timer);
		clearInterval(panoBg.timer);
		clearInterval(tZ.timer);
		
		startPoint.x  = ev.changedTouches[0].pageX;
		startPoint.y  = ev.changedTouches[0].pageY;
		panoBgDeg.x = css(panoBg,'rotateY');
		panoBgDeg.y = css(panoBg,'rotateX');
	});
	document.addEventListener('touchmove',function(ev){
		var nowPoint = {};
		var nowDeg = {};
		var nowDeg2 = {};
		nowPoint.x = ev.changedTouches[0].pageX;
		nowPoint.y = ev.changedTouches[0].pageY;
		var dis = {};
		dis.x = nowPoint.x - startPoint.x;
		dis.y = nowPoint.y - startPoint.y;
		var disDeg = {};
		disDeg.x = -(dis.x / scale.x);
		disDeg.y = dis.y / scale.y;
		nowDeg.y = panoBgDeg.y + disDeg.y;
		nowDeg.x =  panoBgDeg.x + disDeg.x;
		nowDeg2.y = panoBgDeg.y + disDeg.y * 0.75;
		nowDeg2.x = panoBgDeg.x + disDeg.x * 0.75;
		if(nowDeg.y > 40){
			nowDeg.y = 40;
		}else if(nowDeg.y < -40){
			nowDeg.y = -40;
		}
		css(pano,'rotateX',nowDeg2.y);
		css(pano,'rotateY',nowDeg2.x);
		css(panoBg,'rotateX',nowDeg.y);
		css(panoBg,'rotateY',nowDeg.x);

		lastDis.x = nowDeg.x - lastDeg.x;
		lastDis.y = nowDeg.y - lastDeg.y;
		lastDeg.x = nowDeg.x;
		lastDeg.y = nowDeg.y;
		var disZ = Math.max(Math.abs(dis.x),Math.abs(dis.y));
		if(disZ > 300){
			dis.x = 300;
		}
		css(tZ,'translateZ',startZ - disZ);
	});
	document.addEventListener('touchend',function(ev){
		MTween({
			el:tZ,
			target:{translateZ:startZ},
			time: 800,
			type: "easeOut"
		});
		// 缓冲距离
		var nowDeg = {x:css(panoBg,'rotateY'),y:css(panoBg,'rotateX')};
		var disDeg = {x:lastDis.x * 10,y:lastDis.y*10};
		MTween({
			el:panoBg,
			target:{rotateY:nowDeg.x + disDeg.x},
			time : 800,
			type : 'easeOut',
		});
		MTween({
			el:pano,
			target:{rotateY:nowDeg.x + disDeg.x},
			time: 800,
			type: "easeOut"
		});
	});
}
// 显示背景
function bgShow(){
	var pageBg = document.querySelector('#pageBg');
	MTween({
		el : pageBg,
		target : {opacity:100},
		time : 500,
		type : 'easeBoth',
	});
}
// 生成漂浮层
function createPano(){
	var pano = document.querySelector('#pano');
	var deg = 18;
	var R = 406;
	var nub = 0;
	var startDeg = 180;
	css(pano,"rotateX",0);
	css(pano,"rotateY",-180);
	css(pano,"scale",0);
	var pano1 = document.createElement("div");
	pano1.className = "pano";
	css(pano1,"translateX",1.564);
	css(pano1,"translateZ",-9.877);
	for(var i = 0; i < 2; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:344px;margin-top:-172px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",-163);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano1.appendChild(span)
	}
	pano.appendChild(pano1);

	var pano2 = document.createElement("div");
	pano2.className = "pano";
	css(pano2,"translateX",20.225);
	css(pano2,"translateZ",-14.695);
	for(var i = 0; i < 3; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:326px;margin-top:-163px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",278);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano2.appendChild(span)
	}
	pano.appendChild(pano2);

	var pano3 = document.createElement("div");
	pano3.className = "pano";
	css(pano3,"translateX",22.175);
	css(pano3,"translateZ",-11.35);
	for(var i = 0; i < 4; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:195px;margin-top:-97.5px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",192.5);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano3.appendChild(span)
	}
	pano.appendChild(pano3);

	var pano4 = document.createElement("div");
	pano4.className = "pano";
	css(pano4,"translateX",20.225);
	css(pano4,"translateZ",14.695);
	startDeg = 90;
	for(var i = 0; i < 5; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:468px;margin-top:-234px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",129);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano4.appendChild(span)
	}
	pano.appendChild(pano4);

	var pano5 = document.createElement("div");
	pano5.className = "pano";
	css(pano5,"translateX",-4.54);
	css(pano5,"translateZ",9.91);
	startDeg = 18;
	for(var i = 0; i < 6; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:444px;margin-top:-222px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",-13);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano5.appendChild(span)
	}
	pano.appendChild(pano5);

	var pano6 = document.createElement("div");
	pano6.className = "pano";
	css(pano6,"translateX",-11.35);
	css(pano6,"translateZ",22.275);
	startDeg = 18;
	for(var i = 0; i < 6; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:444px;margin-top:-222px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",256);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano6.appendChild(span)
	}
	pano.appendChild(pano6);
	setTimeout(function(){
		MTween({
			el:pano,
			target: {
				rotateY: 25,
				scale:100
			},
			time: 1200,
			type: "easeBoth"
		});
	},2800);
}