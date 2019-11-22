
interface Nodes {
    key: number; //
    left: Nodes | null;
    right: Nodes | null;
    isDestroy: boolean; //是否被销毁
    isSelected: boolean; //是否被选中
}
class Game {
    isClear: boolean; //是否初始化
    isStart: boolean; //是否开启游戏
    public width: number; //画布宽
    public height: number; //画布高
    public id: string;
    public ele: any; //当前画布
    public tank: any; //坦克
    public tankX: number;
    public bullet: any; //子弹
    public bulletY: number; //子弹Y轴移动
    public bulletX: number; //子弹X轴移动
    public bulletInterval: null | number; //子弹移动定时器

    foe: any; //敌人
    foeNumber: number //敌人数量
    clearfoeNumber: number //已消灭敌人数量
    foeInterval: null | number; //敌人移动定时器

    nodeList: any[]; //储存池
    nodeMap: Nodes | null; //二叉树列表
    nodeRoot: number;

    constructor(id: string, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.id = id;
        this.init();
    }
    private init() {
        this.isClear = false;
        this.isStart = false;
        this.bulletY = 0;
        this.tankX = this.width / 2;
        this.foeNumber = 0;
        this.clearfoeNumber = 0;
        this.nodeRoot = this.width / 2;
        this.nodeList = Array.apply(null, Array(this.width)).map((x: any, i: number) => i);
        this.nodeMap = {
            key: this.nodeRoot,
            left: null,
            right: null,
            isDestroy: false,
            isSelected: false
        };
        this.ele = document.getElementById(this.id);
        this.ele.style.width = this.width + 'px';
        this.ele.style.height = this.height + 'px';

        this.nodeList.map((x: any, i: number) => {
            this.InsertNode(this.nodeMap, i);
        });

        for (let i = 0; i < 5; i++) {
            this.CreateElementFoe();
        };

        this.CreateElementTank();
        this.CreateElementBullet();
        console.log(this.nodeMap);
    }
    public CreateElement(type: string) {
        return document.createElement(type);
    }
    public CreateElementTank() { //创建坦克
        this.tank = this.CreateElement('div');
        this.tank.id = 'tank';
        this.tank.style.width = 20 + 'px';
        this.tank.style.height = 20 + 'px';
        this.tank.style.backgroundColor = '#f00';
        this.tank.style.position = 'absolute';
        this.tank.style.bottom = 10 + 'px';
        this.tank.style.left = this.tankX + 'px';
        this.ele.appendChild(this.tank);
    }
    public CreateElementBullet() { //创建子弹
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
    }
    public CreateElementFoe() { //创建敌人
        if(this.foeNumber >= this.width-1){ //不在创建敌人
            return;
        }
        let random = this.random(this.width - 10);
        let nodes = this.NodeSearch(this.nodeMap, random);
        if (nodes.isSelected || nodes.isDestroy) {
            this.CreateElementFoe();
            return;
        }
        let isPass = this.CheckIsValid(random);
        if (isPass) {
            nodes.isSelected = true;
        } else {
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
    }
    public CheckIsValid(random: number) { //检查随机数是否有效 （重叠 已失效 已选中）
        let past = random + 20;
        let forward = random - 20;
        let isPass = true;
        for (let p = random; p <= past; p++) {
            if (p > this.width - 1) {
                break;
            }
            let n = this.NodeSearch(this.nodeMap, p);
            if (n.isSelected && !n.isDestroy) { //如果在范围内已被选中并且没有被销毁那就判断无效值，重新计算
                isPass = false;
                break;
            }
        }
        if (isPass) {
            for (let f = random; f >= forward; f--) {
                if (f < 0) {
                    break;
                }
                let n = this.NodeSearch(this.nodeMap, f);
                if (n.isSelected && !n.isDestroy) { //如果在范围内已被选中并且没有被销毁那就判断无效值，重新计算
                    isPass = false;
                    break;
                }
            }
        }
        return isPass;
    }
    public InsertNode(node: Nodes, key: number): null | void {
        if (key < node.key) {
            if (node.left === null) {
                node.left = {
                    key: key,
                    left: null,
                    right: null,
                    isDestroy: false,
                    isSelected: false
                }
                return;
            } else {
                return this.InsertNode(node.left, key)
            }
        } else {
            if (node.right === null) {
                node.right = {
                    key: key,
                    left: null,
                    right: null,
                    isDestroy: false,
                    isSelected: false
                }
                return;
            } else {
                return this.InsertNode(node.right, key)
            }
        }
        return;
    }
    public NodeSearch(node: Nodes, key: number): Nodes { //二叉树中序查找
        if (node.key === key) {
            return node;
        } else if (key < node.key) {
            if (node.left !== null) {
                return this.NodeSearch(node.left, key);
            }
        } else {
            if (node.right !== null) {
                return this.NodeSearch(node.right, key);
            }
        }
        return;
    }
    public setDestroy(key:number){
        let nodes = this.NodeSearch(this.nodeMap, key);
        nodes.isDestroy = true;
        nodes.isSelected = true;
        this.clearfoeNumber++;
        if(this.clearfoeNumber === this.foeNumber){ //已全部消灭敌人
            this.endGame();
        }
        this.CreateElementFoe();
        var clears = document.getElementById('clears');
        clears.innerText = '消灭敌人数量:'+this.clearfoeNumber;
        console.log('消灭敌人数量:'+this.clearfoeNumber);
    }
    public moveFoeInterval() {
        let foeTagem: any = document.getElementsByClassName('foe');
        if (!this.foeInterval || this.foeInterval === null) {
            this.foeInterval = setInterval(() => {
                if (foeTagem) {
                    for (let i of foeTagem) {
                        let top = i.offsetTop;
                        top++;
                        top = top + 10;
                        i.style.top = top + 'px';
                        // i.style.left = this.random() + 'px';
                    }
                }
            }, 1000)
        }
    }
    public moveFoe(x: number, y: number) {
        let foeTagem: any = document.getElementsByClassName('foe');
        if (foeTagem) {
            for (let i of foeTagem) {
                let top = i.offsetTop;
                let left = i.offsetLeft;
                if ( ( top >= y+20 ) && (x+10 >= left && x+10 <= left + 20)) {
                    // this.bulletY = 0;
                    i.remove();
                    let key = parseInt(i.id);
                    this.setDestroy(key);
                    console.log('消灭' + i.id);
                }
                if(top > this.height-30){
                    this.endGame();
                }
            }
        }
    }
    public moveBulletInterval() { //子弹定时器
        if (!this.bulletInterval || this.bulletInterval === null) {
            this.bulletInterval = setInterval(() => {
                this.bulletY++;
                this.bulletY = (this.bulletY);
                this.moveBullet(this.bulletY);
            }, 1)
        }
    }
    public moveBullet(y: number) {
        let bulletY = 10 + y;
        // console.log(bulletY,this.bulletX);
        if (bulletY > 470) {
            this.bulletY = 0;
            this.bullet.style.bottom = 10 + 'px';
            this.bullet.style.left = this.bulletX + 'px';
        } else {
            let offsetX = this.bullet.offsetLeft;
            let offsetY = this.bullet.offsetTop;
            this.moveFoe(offsetX, offsetY);
            this.bullet.style.bottom = (10 + bulletY) + 'px';
        }
        
    }
    public moveLeft() {
        if (this.isStart) {
            this.tankX--;
            this.tankX = this.tankX - 3;
            this.bulletX = this.tankX + 3;
            if (this.tankX < 0) {
                this.tankX = 0;
            }
            this.tank.style.left = this.tankX + 'px';
        }
    }
    public moveRight() {
        if (this.isStart) {
            this.tankX++;
            this.tankX = this.tankX + 3;
            this.bulletX = this.tankX + 3;
            if (this.tankX > this.width - this.tank.offsetWidth) {
                this.tankX = this.width - this.tank.offsetWidth;
            }
            this.tank.style.left = this.tankX + 'px';
        }
    }
    public random(max: number) { //返回最大宽度的随机数
        return Math.floor(Math.random() * max);
    }
    public startGame() {
        this.isStart = true;
        if(this.isClear){
            var clears = document.getElementById('clears');
            clears.innerText = '';
            this.ele.innerHTML = '';
            this.init();
        }
        this.moveBulletInterval();
        this.moveFoeInterval();
    }
    public stopGame() {
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
    }
    public endGame(){
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
        let massge = this.CreateElement('div');
        massge.style.position = 'absolute';
        massge.style.zIndex = '9';
        massge.style.top = '40%';
        massge.style.left = '35%';
        massge.style.color = '#fff';
        massge.style.fontSize = '30px';
        massge.innerHTML = 'GAME OVER';
        this.ele.appendChild(massge);
    }
}
