import { Food } from "./Food.js";
import { SpeedFood } from "./SpeedFood.js";

export class Snake {
    /**
     *
     * @param {import('./Game.js').Game} gameSnake
     */
    constructor(gameSnake) {
        this.body = [
            // { row: 1, col: 29 },
            // { row: 1, col: 28 },
            // { row: 1, col: 27 },
            // { row: 1, col: 26 },
            // { row: 1, col: 25 },
            // { row: 1, col: 24 },
            // { row: 1, col: 23 },
            // { row: 1, col: 22 },
            // { row: 1, col: 21 },
            // { row: 1, col: 20 },
            // { row: 1, col: 19 },
            // { row: 1, col: 18 },
            // { row: 1, col: 17 },
            // { row: 1, col: 16 },
            // { row: 1, col: 15 },
            // { row: 1, col: 14 },
            // { row: 1, col: 13 },
            // { row: 1, col: 12 },
            // { row: 1, col: 11 },
            // { row: 1, col: 10 },
            // { row: 1, col: 9 },
            // { row: 1, col: 8 },
            // { row: 1, col: 7 },
            // { row: 1, col: 6 },
            // { row: 1, col: 5 },
            { row: 1, col: 4 },
            { row: 1, col: 3 },
            { row: 1, col: 2 },
            { row: 1, col: 1 },
            { row: 1, col: 0 },
        ];
        this.game = gameSnake;
        this.direction = "R";
        this.WillDirection = this.direction;
    }

    update() {
        this.direction = this.WillDirection;
        switch (this.direction) {
            case "R":
                this.body.unshift({
                    row: this.body[0].row,
                    col: this.body[0].col + 1,
                });
                break;
            case "D":
                this.body.unshift({
                    row: this.body[0].row + 1,
                    col: this.body[0].col,
                });
                break;
            case "L":
                this.body.unshift({
                    row: this.body[0].row,
                    col: this.body[0].col - 1,
                });
                break;
            case "U":
                this.body.unshift({
                    row: this.body[0].row - 1,
                    col: this.body[0].col,
                });
                break;
        }

        // 撞到邊界
        if (
            this.body[0].col > this.game.col - 1 ||
            this.body[0].row > this.game.row - 1 ||
            this.body[0].col < 0 ||
            this.body[0].row < 0
        ) {
            alert("結束了");
            this.body.shift();
            clearInterval(this.game.timer);
        }

        // 撞到自己
        for (let i = 1; i < this.body.length; ++i) {
            if (
                this.body[0].col == this.body[i].col &&
                this.body[0].row == this.body[i].row
            ) {
                alert("結束了");
                this.body.shift();
                clearInterval(this.game.timer);
            }
        }

        // 撞到牆壁鼠掉
        // 撞到的方塊 === 🧱
        if (this.game.getText(this.body[0].row, this.body[0]. col) === "🧱")
        {
            alert("撞牆");
            this.body.shift();
            clearInterval(this.game.timer);
        }

        // for (let i = 0; i < this.game.wall.length; i++) {
        //     if (
        //         this.body[0].col == this.game.wall[i][1] &&
        //         this.body[0].row == this.game.wall[i][0]
        //     ) {
        //         alert("結束了");
        //         this.body.shift();
        //         clearInterval(this.game.timer);
        //     }
        // }

        if (
            this.body[0].row == this.game.food.row &&
            this.body[0].col == this.game.food.col
        ) {
            this.game.food = new Food(this.game);
            this.game.score++;
            this.game.f = 0;
        } else if (
            this.body[0].row == this.game.speedfood.row &&
            this.body[0].col == this.game.speedfood.col
        ) {
            this.game.speedfood = new SpeedFood(this.game);
            this.game.speedUP += 10 * 30;
            this.body.pop();
            if (this.body.length > 30) {
                this.game.score+=2;
            }
        } else {
            this.game.f = 0;
            this.body.pop();
        }
    }

    changeDirection(d) {
        this.WillDirection = d;
    }

    render() {
        //console.log(gameSnake);
        this.game.setColor(this.body[0].row, this.body[0].col, "pink");
        for (let i = 1; i < this.body.length; ++i) {
            this.game.setColor(this.body[i].row, this.body[i].col, "cyan");
        }
    }
}
