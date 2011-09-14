// パラメータ設定部
var augment = "3,3,=25476308";

// マップ
var workmap = [];

// キャラクタ
var me = {"name":"0", "x":0, "y":0, "lx":0, "ly":0};

//マップの大きさ
var width = 0;
var height = 0;

// 問題と解答
var question = "";
var answer = "";
var result = "";
var next = [];

// ブラウザ用インタフェース
var log = null;
var note = null;
var canvas = null;

// 描画
var drow = function() {
	canvas.innerHTML =  ""  + "\n";
	for (var i = 0; i < workmap.length; i++) {
		canvas.innerHTML += workmap[i].toString().replace(/,/g, "") + "\n";
	}
};

// キーダウンイベント
var onkeydown = function(event) {
	// undo
	if (event.keyCode == 17) {
		undo();
		return;
	}

	// スペース (リセット)
	if (event.keyCode == 32) {
		note.value = "";
		location.reload();
		return;
	}

	// ← (左方向へ移動)
	if (event.keyCode == 37) {
		note.value += "L";
		if (me.x > 0 && workmap[me.y][me.x -1] != "=") {
			me.ly = me.y;
			me.lx = me.x;
			me.x -= 1;
			workmap[me.ly][me.lx] = workmap[me.y][me.x];
			workmap[me.y][me.x] = me.name;
		}

		// ↑ (上方向へ移動)
	} else if (event.keyCode == 38) {
		note.value += "U";
		if (me.y > 0 && workmap[me.y -1][me.x] != "=") {
			me.ly = me.y;
			me.lx = me.x;
			me.y -= 1;
			workmap[me.ly][me.lx] = workmap[me.y][me.x];
			workmap[me.y][me.x] = me.name;
		}

		// → (右方向へ移動)
	} else if (event.keyCode == 39) {
		note.value += "R";
		if (workmap[me.y].length > me.x +1 && workmap[me.y][me.x +1] != "=" ) {
			me.ly = me.y;
			me.lx = me.x;
			me.x += 1;
			workmap[me.ly][me.lx] = workmap[me.y][me.x];
			workmap[me.y][me.x] = me.name;
		}

		// ↓ (下方向へ移動)
	} else if (event.keyCode == 40) {
		note.value += "D";
		if (workmap.length > me.y +1 && workmap[me.y +1][me.x] != "=") {
			me.ly = me.y;
			me.lx = me.x;
			me.y += 1;
			workmap[me.ly][me.lx] = workmap[me.y][me.x];
			workmap[me.y][me.x] = me.name;
		}
	}

	drow();

	if (answer == workmap.toString().replace(/,/g, "")) {
		log.innerHTML = "クリアだよ。";
	}
};

var onload = function() {
	log = document.querySelector("body > p");
	note = document.querySelector("body > input");
	canvas = document.querySelector("body > pre");

	init(augment);
	drow();
};

// アンドゥ
var undo = function() {
    width = 0;
    height = 0;
    question = "";
    answer = "";
    log = null;
    note = null;
    canvas = null;
    me = {"name":"0", "x":0, "y":0, "lx":0, "ly":0};
	workmap = [];
	onload();
	log.innerHTML = "";

	// undo
	note.value = note.value.substring(0, note.value.length -1);
	for (var i = 0; i < note.value.length; i++) {
		if (note.value.charAt(i) == "L") {
			if (me.x > 0 && workmap[me.y][me.x -1] != "=") {
				me.ly = me.y;
				me.lx = me.x;
				me.x -= 1;
				workmap[me.ly][me.lx] = workmap[me.y][me.x];
				workmap[me.y][me.x] = me.name;
			}
		} else if (note.value.charAt(i) == "U") {
			if (me.y > 0 && workmap[me.y -1][me.x] != "=") {
				me.ly = me.y;
				me.lx = me.x;
				me.y -= 1;
				workmap[me.ly][me.lx] = workmap[me.y][me.x];
				workmap[me.y][me.x] = me.name;
			}
		} else if (note.value.charAt(i) == "R") {
			if (workmap[me.y].length > me.x +1 && workmap[me.y][me.x +1] != "=") {
				me.ly = me.y;
				me.lx = me.x;
				me.x += 1;
				workmap[me.ly][me.lx] = workmap[me.y][me.x];
				workmap[me.y][me.x] = me.name;
			}
		} else if (note.value.charAt(i) == "D") {
			if (workmap.length > me.y +1 && workmap[me.y +1][me.x] != "=") {
				me.ly = me.y;
				me.lx = me.x;
				me.y += 1;
				workmap[me.ly][me.lx] = workmap[me.y][me.x];
				workmap[me.y][me.x] = me.name;
			}
		}
	}

	canvas.innerHTML =  ""  + "\n";
	for (var i = 0; i < workmap.length; i++) {
		canvas.innerHTML += workmap[i].toString().replace(/,/g, "") + "\n";
	}
};

var init = function(parameter) {
	var map = [];
	var temp = parameter.split(",");
    
	answer = "";
    me = {"name":"0", "x":0, "y":0, "lx":0, "ly":0};
	workmap = [];

	width = temp[0];
	height = temp[1];
	question = temp[2];

	temp = question.split("=").join().split("").sort().toString().replace(/[0,]/g, "");
	for (var i = 0; i < question.length; i++) {
		if (i % width == 0) {
			map[map.length] = question.charAt(i);
		} else {
			map[map.length -1] += question.charAt(i);
		}

		if (question.charAt(i) == "=") {
			answer += "=";
		} else {
			answer += temp.charAt(0);
			temp = temp.slice(1);
		}
	}
	answer += "0";

	for (var y = 0; y < map.length; y++) {
		workmap[y] = [];
		for (var x = 0; x < map[y].length; x++) {
			if (map[y].charAt(x) == "=") {
				workmap[y][x] = "=";
			} else if (map[y].charAt(x) == "0") {
				workmap[y][x] = "0";
				me.ly = me.y = y;
				me.lx = me.x = x;
			} else {
				workmap[y][x] = map[y].charAt(x); 
			}
		}
	}
};


