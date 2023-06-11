import { Snake } from "./Snake.js";
import { Food } from "./Food.js";
import { SpeedFood } from "./SpeedFood.js";
import { Wall } from "./Wall.js";

export class Game {
    constructor() {
        this.f;
        this.row;
        this.col;
        this.score;
        this.snake;
        this.food;
        this.speedfood;
        this.speedUP;
        this.timer;
        this.walls;
        this.init();
        this.bindKey();
    }
    init() {
        this.f = 0;
        this.row = 50;
        this.col = 50;
        this.score = 0;
        this.snake = new Snake(this);
        this.food = new Food(this);
        this.speedfood = new SpeedFood(this);
        this.speedUP = 0;
        this.walls = [];
        this.dom = document.createElement("table");
        for (let i = 0; i < this.row; i++) {
            let tr = document.createElement("tr");
            for (let j = 0; j < this.col; j++) {
                let td = document.createElement("td");
                tr.appendChild(td);
            }

            this.dom.appendChild(tr);
        }
        document.getElementById("app").replaceChildren(this.dom);
    }
    getTd(row, col) {
        return this.dom
            .getElementsByTagName("tr")
            [row].getElementsByTagName("td")[col];
    }
    setColor(row, col, color) {
        this.getTd(row, col).style.background = color;
    }
    setHTML(row, col, html) {
        this.getTd(row, col).innerHTML = html;
    }
    getText(row, col) {
        return this.getTd(row, col).innerText;
    }
    clear() {
        for (let i = 0; i < this.row; ++i) {
            for (let j = 0; j < this.col; ++j) {
                this.setColor(i, j, "white");
                this.setHTML(i, j, "");
                if (i == 0) this.setHTML(i, j, j);
                if (j == 0) this.setHTML(i, j, i);
            }
        }
    }
    bindKey() {
        let self = this;
        document.onkeydown = function (event) {
            switch (event.key) {
                case "ArrowLeft":
                case "a":
                    if (self.snake.direction == "R") return;
                    self.snake.changeDirection("L");
                    break;
                case "ArrowUp":
                case "w":
                    if (self.snake.direction == "D") return;
                    self.snake.changeDirection("U");
                    break;
                case "ArrowRight":
                case "d":
                    if (self.snake.direction == "L") return;
                    self.snake.changeDirection("R");
                    break;
                case "ArrowDown":
                case "s":
                    if (self.snake.direction == "U") return;
                    self.snake.changeDirection("D");
                    break;
                case "v":
                    if (event.ctrlKey) {
                        document
                            .querySelector(".debug")
                            .classList.toggle("hidden");
                    }
                    break;
                case "r":
                    self.start()
                    break;
                case "g":
                    self.generateWall()
                    break;
            }
        };
    }
    getSpeed() {
        let during;

        if (this.snake.body.length >= 12) {
            during =
                this.snake.body.length < 30 ? 34 - this.snake.body.length : 4;
        } else if (
            this.snake.body.length >= 10 &&
            this.snake.body.length < 12
        ) {
            during = 17;
        } else if (this.snake.body.length >= 8 && this.snake.body.length < 10) {
            during = 20;
        } else {
            during = 23;
        }

        if (this.speedUP > 0)
        {
            if (this.snake.body.length <= 27) {
                during = Math.ceil(during * 0.5)
                this.speedUP--;
            } else {
                during = 4;
            }
        }

        return during;
    }
    generateWall() {
        this.walls.push(new Wall(this));
    }
    start() {
        this.init();
        this.update();
    }
    pause() {

    }
    update() {
        self = this;
        this.f = 0;
        this.timer = setInterval(function () {
            self.f++;
            self.clear();

            // 物件應該先比蛇先 render()
            self.food.render();
            self.speedfood.render();
            self.snake.render();

            self.walls = self.walls.filter((wall) => wall.count > 0);
            for (let i = 0; i < self.walls.length; i++) {
                self.walls[i].render();
            }

            // 27 -> 7  sf  4
            // 28 -> 6      3
            // 29 -> 5      3
            // 30 -> 4      2
            // 30  <        2
            let during = self.getSpeed();

            self.f % during == 0 && self.snake.update();

            document.getElementById("during").innerHTML = `During：${during}`;
            document.getElementById("f").innerHTML = `幀數號：${self.f}`;
            document.getElementById(
                "sff"
            ).innerHTML = `加速幀數號：${self.speedUP}`;

            document.getElementById(
                "score"
            ).innerHTML = `分　數：${self.score}`;
            document.getElementById(
                "snake"
            ).innerHTML = `snake status：length->${self.snake.body.length}; head->(${self.snake.body[0].row}, ${self.snake.body[0].col})`;
        }, 15);
    }
}
