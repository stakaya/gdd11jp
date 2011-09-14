Array.prototype.shuffle = function() {
	var i = this.length;
	while (i) {
		var j = Math.floor(Math.random() * i);
		var temp = this[--i];
		this[i] = this[j];
		this[j] = temp;
	}
	return this;
};

var pattern = function() {
	var node = ["U","L","D","R"];
	for (var n = 0; n < 9; n++) {
		var next = [];
		for (var c = 0; c < node.length; c++) {
			for (var j = 0; j < 4; j++) {
				var temp = node[c] + j.toString().replace(/0/g, "U").replace(/1/g, "D").replace(/2/g, "L").replace(/3/g, "R");
				if (temp.indexOf("LR") == -1 && temp.indexOf("RL") == -1 && temp.indexOf("UD") == -1 && temp.indexOf("DU") == -1) {
					next[next.length] = temp;
				}
			}
		}
		node = next.concat();
	}

	return function () {
		return node.shuffle();
	}
};

var elementary = pattern();
var compute = function(parameter) {
	var temp = parameter.split(",");

	// マップ
	var map = [];

	// 問題と解答
	var question = temp[2];
	var answer = "";

	//マップの大きさ
	var width = temp[0];

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

	var time = new Date().getTime();
	var node = elementary();
	var my = [];
	var maps = [];
	var tmpl = ["U","L","D","R"];
	for (var n = 0; n < 100; n++) {
		var next = [];
		var nextme = [];
		var nextmap = [];
		var sum = 0;
		var l = node.length;
		while (l) {
			var c = Math.floor(Math.random() * l--);
			for (var j = 0; j < tmpl.length; j++) {
				var isBreak = false;
				var workmap = [];
				var me = null;
				
				if (node[c].length == 10) {
					// 0キャラ初期化
					me = {"step":0, "name":"0", "x":0, "y":0, "lx":0, "ly":0};
					
					// マップを初期化
					for (var y = 0; y < map.length; y++) {
						workmap[y] = [];
						for (var x = 0; x < map[y].length; x++) {
							if (map[y].charAt(x) == "0") {
								me.ly = me.y = y;
								me.lx = me.x = x;
							}
							workmap[y][x] = map[y].charAt(x); 
						}
					}

				} else {
					workmap = maps[c];
					me = my[c];
				}
				
				temp = node[c] + tmpl[j];
				for (var i = me.step; i < temp.length; i++) {
					if (temp.charAt(i) == "L") {
						if (me.x > 0 && workmap[me.y][me.x -1] != "=") {
							me.ly = me.y;
							me.lx = me.x;
							me.x -= 1;
							me.step = i;
							workmap[me.ly][me.lx] = workmap[me.y][me.x];
							workmap[me.y][me.x] = me.name;
						} else {
							isBreak = true;
							break;
						}
					} else if (temp.charAt(i) == "U") {
						if (me.y > 0 && workmap[me.y -1][me.x] != "=") {
							me.ly = me.y;
							me.lx = me.x;
							me.y -= 1;
							me.step = i;
							workmap[me.ly][me.lx] = workmap[me.y][me.x];
							workmap[me.y][me.x] = me.name;
						} else {
							isBreak = true;
							break;
						}
					} else if (temp.charAt(i) == "R") {
						if (workmap[me.y].length > me.x +1 && workmap[me.y][me.x +1] != "=") {
							me.ly = me.y;
							me.lx = me.x;
							me.x += 1;
							me.step = i;
							workmap[me.ly][me.lx] = workmap[me.y][me.x];
							workmap[me.y][me.x] = me.name;
						} else {
							isBreak = true;
							break;
						}
					} else if (temp.charAt(i) == "D") {
						if (workmap.length > me.y +1 && workmap[me.y +1][me.x] != "=") {
							me.ly = me.y;
							me.lx = me.x;
							me.y += 1;
							me.step = i;
							workmap[me.ly][me.lx] = workmap[me.y][me.x];
							workmap[me.y][me.x] = me.name;
						} else {
							isBreak = true;
							break;
						}
					}

					if (answer == workmap.toString().replace(/,/g, "")) {
						return temp.substr(0, i +1);
					}	
				}

				if (!isBreak && temp.indexOf("LR") == -1 && temp.indexOf("RL") == -1 && temp.indexOf("UD") == -1 && temp.indexOf("DU") == -1) {
					var stat = workmap.toString().replace(/,/g, "");
					var sync = 0;
					for (var i = 0; i < answer.length; i++) {
						if (answer.charAt(i) == stat.charAt(i)) {
                            sync++;
						}
					}

					sum += sync;
					if (sum == sync || Math.floor(sum / (next.length +1)) <= sync) {
						//console.log(Math.floor(sync / answer.length * 10));
						//console.log(temp);
						//console.log(next.length);
						//console.log(workmap.toString());
						next[next.length] = temp;
						nextme[nextme.length] = me;
						nextmap[nextmap.length] = workmap;
					} else if (answer.indexOf(stat.substr(0, Math.floor(sync / answer.length * 10)) +1) == 0) {
						//console.log(stat.substr(0, Math.floor(sync / answer.length * 10)));
						//console.log(temp);
						//console.log(next.length);
						//console.log(workmap.toString());
						next[next.length] = temp;
						nextme[nextme.length] = me;
						nextmap[nextmap.length] = workmap;
					}
				}
			}
		}

		// Time Out
		if (new Date().getTime() - time > 60 * 1000) {
		   return "";
		}

		node = next;
		my = nextme;
		maps = nextmap;
	}

	return "";
};
                           
//console.log(compute("3,3,=25476308"));
//console.log(compute("3,3,=04268753"));
//console.log(compute("3,3,120743586"));
//console.log(compute("6,3,1E3BC620F5A987D=H4"));
//console.log(compute("5,6,12=E4D9HIF8=GN576LOABMTPKQSR0J"));
//return;

var fs = require("fs");
var reader = fs.createReadStream("./problems.txt", {encoding: "utf8"});

reader
.on("data", function(b) {
    var temp = b.split("\n");
	for (var i = 0; i < temp.length; i++) {
        var answer = "";

		if (temp[i].length > 0) {
			answer = compute(temp[i]);     
		}

		console.log(answer);
		var writer = require("fs").createWriteStream("./answer.txt", {flags: "a", encoding: "utf8"}); 
		writer.write(answer + "\n");
		writer.end();
	}     
})
.on("end", function() {
	console.log("finished");
});
