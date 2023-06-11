export class Food {

    /**
     * 
     * @param {import('./Game.js').Game} gameSnake 
     */
    constructor(gameSnake) {
        this.game = gameSnake;
        let self = this;
        do {
            self.row = parseInt(Math.random() * gameSnake.row);
            self.col = parseInt(Math.random() * gameSnake.col);
        }
        while ((function () {
            for (let i = 0; i < gameSnake.snake.body.length; ++i) {
                if (gameSnake.snake.body[i].row == self.row &&
                    gameSnake.snake.body[i].col == self.col) {
                    return true;
                }
            }
            return false;
        })());
    }

    render() {
        this.game.setHTML(this.row, this.col, "❤");
    }
}