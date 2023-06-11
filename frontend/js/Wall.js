export class Wall {
    /**
     *
     * @param {import('./Game.js').Game} gameSnake
     */
    constructor(gameSnake) {
        this.game = gameSnake;

        //--隨機選擇一個除了玩家牆壁之外的中心點--//
        this.row = 0;
        this.col = 0;

        this.snakeRow_min = this.game.row;
        this.snakeRow_max = 0;
        this.snakeCol_min = this.game.col;
        this.snakeCol_max = 0;

        this.getBoundness();
        this.getRandomPoint();

        this.rotate = Math.random() < 0.5; // 是否旋轉
        this.wall = [];

        this.generateWall(Math.floor(Math.random() * 4) + 1, 1); //確定牆壁座標 寬度在1~4之間(暫定)
        // this.generateWall(10, 10); //確定牆壁座標 寬度在1~4之間(暫定)
        //this.generateWall(1, 1);
        this.check();
        this.count = 600; //牆持續顯示的
    }

    getRandomPoint() {
        do {
            this.row = Math.floor(Math.random() * this.game.row);
            this.col = Math.floor(Math.random() * this.game.col);
            console.table(this.row, this.col);
        } while (
            this.row >= this.snakeRow_min &&
            this.row <= this.snakeRow_max &&
            this.col >= this.snakeCol_min &&
            this.col <= this.snakeCol_max
        );
    }

    // 找玩家牆壁邊界座標
    getBoundness() {
        this.snakeCol_min = this.snakeCol_max = this.game.snake.body[0].col;
        this.snakeRow_min = this.snakeRow_max = this.game.snake.body[0].row;

        for (let i = 0; i < this.game.snake.body.length; i++) {
            if (this.snakeRow_min > this.game.snake.body[i].row)
                this.snakeRow_min = this.game.snake.body[i].row;
            if (this.snakeRow_max < this.game.snake.body[i].row)
                this.snakeRow_max = this.game.snake.body[i].row;
            if (this.snakeCol_min > this.game.snake.body[i].col)
                this.snakeCol_min = this.game.snake.body[i].col;
            if (this.snakeCol_max < this.game.snake.body[i].col)
                this.snakeCol_max = this.game.snake.body[i].col;
        }

        this.snakeRow_min =
            this.snakeRow_min - 2 < 0 ? 0 : this.snakeRow_min - 2;
        this.snakeRow_max =
            this.snakeRow_max + 2 > this.game.row
                ? this.game.row
                : this.snakeRow_max + 2;
        this.snakeCol_min =
            this.snakeCol_min - 2 < 0 ? 0 : this.snakeCol_min - 2;
        this.snakeCol_max =
            this.snakeCol_max + 2 > this.game.col
                ? this.game.col
                : this.snakeCol_max + 2;
    }

    generateWall(width, thickness = 1) {
        // 根據給定的寬度厚度生成座標 tuple
        for (let w = 0; w < width; w++) {
            for (let t = 0; t < thickness; t++) {
                if (this.rotate) {
                    this.wall.push({ row: this.row + t, col: this.col + w });
                } else {
                    this.wall.push({ row: this.row + w, col: this.col + t });
                }
            }
        }
    }

    check() {
        // 檢查牆壁是否在邊界內
        let counter = 0;
        while (counter < this.wall.length) {
            let pos = this.wall[counter];
            let r = pos.row;
            let c = pos.col;
            if (
                r >= this.game.row ||
                c >= this.game.col ||
                r < 0 ||
                c < 0 ||
                (r > this.snakeRow_min &&
                    r < this.snakeRow_max &&
                    c > this.snakeCol_min &&
                    c < this.snakeCol_max) ||
                (r == this.game.food.row && c == this.game.food.col)
            ) {
                this.wall.splice(counter, 1);
            } else {
                counter++;
            }
        }
    }
    render() {
        for (let i = 0; i < this.wall.length; i++) {
            this.game.setHTML(this.wall[i].row, this.wall[i].col, "🧱");
        }
        this.count--;
    }
}
