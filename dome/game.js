var Game = /** @class */ (function () {
    function Game(id, width, height) {
        this.width = width;
        this.height = height;
        this.id = id;
        this.init();
    }
    Game.prototype.init = function () {
        var _this = this;
        this.isClear = false;
        this.isStart = false;
        this.bulletY = 0;
        this.tankX = this.width / 2;
        this.foeNumber = 0;
        this.clearfoeNumber = 0;
        this.nodeRoot = this.width / 2;
        this.nodeList = Array.apply(null, Array(this.width)).map(function (x, i) { return i; });
        this.nodeMap = null;
        this.ele = document.getElementById(this.id);
        this.ele.style.width = this.width + 'px';
        this.ele.style.height = this.height + 'px';
        this.nodeList.map(function (x, i) {
            _this.nodeMap = _this.InsertNode(_this.nodeMap, i);
        });
        for (var i = 0; i < 5; i++) {
            this.CreateElementFoe();
        }
        ;
        this.CreateElementTank();
        this.CreateElementBullet();
        console.log(this.nodeMap);
    };
    Game.prototype.CreateElement = function (type) {
        return document.createElement(type);
    };
    Game.prototype.CreateElementTank = function () {
        this.tank = this.CreateElement('div');
        this.tank.id = 'tank';
        this.tank.style.width = 20 + 'px';
        this.tank.style.height = 20 + 'px';
        this.tank.style.backgroundColor = '#f00';
        this.tank.style.position = 'absolute';
        this.tank.style.bottom = 10 + 'px';
        this.tank.style.left = this.tankX + 'px';
        this.ele.appendChild(this.tank);
    };
    Game.prototype.CreateElementBullet = function () {
        this.bulletX = this.tank.offsetLeft + 5;
        this.bullet = this.CreateElement('div');
        this.bullet.id = 'bullet';
        this.bullet.style.width = 10 + 'px';
        this.bullet.style.height = 10 + 'px';
        this.bullet.style.backgroundColor = '#f00';
        this.bullet.style.position = 'absolute';
        this.bullet.style.bottom = 10 + 'px';
        this.bullet.style.left = this.bulletX + 'px';
        this.ele.appendChild(this.bullet);
    };
    Game.prototype.CreateElementFoe = function () {
        if (this.foeNumber >= this.width - 1) { //不在创建敌人
            return;
        }
        var random = this.random(this.width - 10);
        var nodes = this.NodeSearch(this.nodeMap, random);
        if (nodes.isSelected || nodes.isDestroy) {
            this.CreateElementFoe();
            return;
        }
        var isPass = this.CheckIsValid(random);
        if (isPass) {
            nodes.isSelected = true;
        }
        else {
            this.CreateElementFoe();
            return;
        }
        this.foeNumber++;
        this.foe = this.CreateElement('div');
        this.foe.id = random;
        this.foe.className = 'foe';
        this.foe.style.width = 10 + 'px';
        this.foe.style.height = 10 + 'px';
        this.foe.style.backgroundColor = '#fff';
        this.foe.style.position = 'absolute';
        this.foe.style.top = -((this.random(20)) + 10) + 'px';
        // this.foe.style.top = 0 + 'px';
        this.foe.style.left = random + 'px';
        this.ele.appendChild(this.foe);
    };
    Game.prototype.CheckIsValid = function (random) {
        var past = random + 20;
        var forward = random - 20;
        var isPass = true;
        for (var p = random; p <= past; p++) {
            if (p > this.width - 1) {
                break;
            }
            var n = this.NodeSearch(this.nodeMap, p);
            if (n.isSelected && !n.isDestroy) { //如果在范围内已被选中并且没有被销毁那就判断无效值，重新计算
                isPass = false;
                break;
            }
        }
        if (isPass) {
            for (var f = random; f >= forward; f--) {
                if (f < 0) {
                    break;
                }
                var n = this.NodeSearch(this.nodeMap, f);
                if (n.isSelected && !n.isDestroy) { //如果在范围内已被选中并且没有被销毁那就判断无效值，重新计算
                    isPass = false;
                    break;
                }
            }
        }
        return isPass;
    };
    Game.prototype.InsertNode = function (node, key) {
        if (node == null)
            return this.newNode(key);
        if (key < node.key) {
            node.left = this.InsertNode(node.left, key);
        }
        else if (key > node.key) {
            node.right = this.InsertNode(node.right, key);
        }
        else {
            return node;
        }
        node.height = 1 + this.max(this.heights(node.left), this.heights(node.right));
        var balance = this.getBalance(node);
        if (balance > 1 && key < node.left.key) //LL型
            return this.ll_rotate(node);
        if (balance < -1 && key > node.right.key) //RR型
            return this.rr_rotate(node);
        if (balance > 1 && key > node.left.key) //LR型
         {
            node.left = this.rr_rotate(node.left);
            return this.ll_rotate(node);
        }
        if (balance < -1 && key < node.right.key) //RL型
         {
            node.right = this.ll_rotate(node.right);
            return this.rr_rotate(node);
        }
        // console.log(node);
        return node;
    };
    Game.prototype.NodeSearch = function (node, key) {
        if (node.key === key) {
            return node;
        }
        else if (key < node.key) {
            if (node.left !== null) {
                return this.NodeSearch(node.left, key);
            }
        }
        else {
            if (node.right !== null) {
                return this.NodeSearch(node.right, key);
            }
        }
        return;
    };
    Game.prototype.heights = function (N) {
        if (N == null)
            return 0;
        return N.height;
    };
    Game.prototype.max = function (a, b) {
        return (a > b) ? a : b;
    };
    Game.prototype.getBalance = function (N) {
        if (N == null)
            return 0;
        return this.heights(N.left) - this.heights(N.right);
    };
    Game.prototype.newNode = function (key) {
        var node = {
            key: key,
            left: null,
            right: null,
            height: 1,
            isDestroy: false,
            isSelected: false,
        };
        return node;
    };
    Game.prototype.ll_rotate = function (y) {
        var x = y.left;
        y.left = x.right;
        x.right = y;
        y.height = this.max(this.heights(y.left), this.heights(y.right)) + 1;
        x.height = this.max(this.heights(x.left), this.heights(x.right)) + 1;
        return x;
    };
    Game.prototype.rr_rotate = function (y) {
        var x = y.right;
        y.right = x.left;
        x.left = y;
        y.height = this.max(this.heights(y.left), this.heights(y.right)) + 1;
        x.height = this.max(this.heights(x.left), this.heights(x.right)) + 1;
        return x;
    };
    Game.prototype.setDestroy = function (key) {
        var nodes = this.NodeSearch(this.nodeMap, key);
        nodes.isDestroy = true;
        nodes.isSelected = true;
        this.clearfoeNumber++;
        if (this.clearfoeNumber === this.foeNumber) { //已全部消灭敌人
            this.endGame();
        }
        this.CreateElementFoe();
        var clears = document.getElementById('clears');
        clears.innerText = '消灭敌人数量:' + this.clearfoeNumber;
        console.log('消灭敌人数量:' + this.clearfoeNumber);
    };
    Game.prototype.moveFoeInterval = function () {
        var foeTagem = document.getElementsByClassName('foe');
        if (!this.foeInterval || this.foeInterval === null) {
            this.foeInterval = setInterval(function () {
                if (foeTagem) {
                    for (var _i = 0, foeTagem_1 = foeTagem; _i < foeTagem_1.length; _i++) {
                        var i = foeTagem_1[_i];
                        var top_1 = i.offsetTop;
                        top_1++;
                        top_1 = top_1 + 10;
                        i.style.top = top_1 + 'px';
                        // i.style.left = this.random() + 'px';
                    }
                }
            }, 1000);
        }
    };
    Game.prototype.moveFoe = function (x, y) {
        var foeTagem = document.getElementsByClassName('foe');
        if (foeTagem) {
            for (var _i = 0, foeTagem_2 = foeTagem; _i < foeTagem_2.length; _i++) {
                var i = foeTagem_2[_i];
                var top_2 = i.offsetTop;
                var left = i.offsetLeft;
                if ((top_2 >= y + 20) && (x + 10 >= left && x + 10 <= left + 20)) {
                    // this.bulletY = 0;
                    i.remove();
                    var key = parseInt(i.id);
                    this.setDestroy(key);
                    console.log('消灭' + i.id);
                }
                if (top_2 > this.height - 30) {
                    this.endGame();
                }
            }
        }
    };
    Game.prototype.moveBulletInterval = function () {
        var _this = this;
        if (!this.bulletInterval || this.bulletInterval === null) {
            this.bulletInterval = setInterval(function () {
                _this.bulletY++;
                _this.bulletY = (_this.bulletY);
                _this.moveBullet(_this.bulletY);
            }, 1);
        }
    };
    Game.prototype.moveBullet = function (y) {
        var bulletY = 10 + y;
        // console.log(bulletY,this.bulletX);
        if (bulletY > 470) {
            this.bulletY = 0;
            this.bullet.style.bottom = 10 + 'px';
            this.bullet.style.left = this.bulletX + 'px';
        }
        else {
            var offsetX = this.bullet.offsetLeft;
            var offsetY = this.bullet.offsetTop;
            this.moveFoe(offsetX, offsetY);
            this.bullet.style.bottom = (10 + bulletY) + 'px';
        }
    };
    Game.prototype.moveLeft = function () {
        if (this.isStart) {
            this.tankX--;
            this.tankX = this.tankX - 3;
            this.bulletX = this.tankX + 3;
            if (this.tankX < 0) {
                this.tankX = 0;
            }
            this.tank.style.left = this.tankX + 'px';
        }
    };
    Game.prototype.moveRight = function () {
        if (this.isStart) {
            this.tankX++;
            this.tankX = this.tankX + 3;
            this.bulletX = this.tankX + 3;
            if (this.tankX > this.width - this.tank.offsetWidth) {
                this.tankX = this.width - this.tank.offsetWidth;
            }
            this.tank.style.left = this.tankX + 'px';
        }
    };
    Game.prototype.random = function (max) {
        return Math.floor(Math.random() * max);
    };
    Game.prototype.startGame = function () {
        this.isStart = true;
        if (this.isClear) {
            var clears = document.getElementById('clears');
            clears.innerText = '';
            this.ele.innerHTML = '';
            this.init();
        }
        this.moveBulletInterval();
        this.moveFoeInterval();
    };
    Game.prototype.stopGame = function () {
        if (this.bulletInterval) {
            clearInterval(this.bulletInterval);
            this.bulletInterval = null;
        }
        if (this.foeInterval) {
            clearInterval(this.foeInterval);
            this.foeInterval = null;
        }
        // this.bulletY = 0;
        // this.moveBullet(this.bulletY);
    };
    Game.prototype.endGame = function () {
        this.isClear = true;
        this.isStart = false;
        if (this.bulletInterval) {
            clearInterval(this.bulletInterval);
            this.bulletInterval = null;
        }
        if (this.foeInterval) {
            clearInterval(this.foeInterval);
            this.foeInterval = null;
        }
        var massge = this.CreateElement('div');
        massge.style.position = 'absolute';
        massge.style.zIndex = '9';
        massge.style.top = '40%';
        massge.style.left = '35%';
        massge.style.color = '#fff';
        massge.style.fontSize = '30px';
        massge.innerHTML = 'GAME OVER';
        this.ele.appendChild(massge);
    };
    return Game;
}());
