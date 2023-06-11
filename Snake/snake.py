import random
from enum import IntEnum

class Client:
    def __init__(self):
        pass

PLAYER1 = "PLAYER1";
PLAYER2 = "PLAYER2";

class Game:
    def __init__(self):
        self.Winner = None;
        self.start = False;
        self.Player1 = False;
        self.Player2 = False;

    def setWinner(self, player: str):
        self.Winner = player

    def playerIsReady(self, player: str):
        if player == PLAYER1:
            self.Player1 = True
        if player == PLAYER2:
            self.Player2 = True
        if (self.Player1 and self.Player2):
            self.start = True


class OBJECT(IntEnum):
    GAME_FOOD_NORMAL = 1
    GAME_FOOD_SPEED = 2
    GAME_FOOD_GOLD = 3
    GAME_PLAYER = 7
    GAME_WALL = 999


class Snake:
    """
    貪食蛇類別

    """

    def __init__(self, width: int, height: int) -> None:
        """
        初始化遊戲的寬度與高度

        """
        self.w = width
        self.h = height
        self.box = [[0 for x in range(width)] for y in range(height)]

    def get_an_point_not_equal_to(self, targets: list[int] = [OBJECT.GAME_WALL]) -> tuple[int, int]:
        while True:
            row = random.choice(range(0, self.h))
            column = random.choice(range(0, self.w))
            element = self.box[row][column]
            if (element not in targets):
                return (row, column)

    def generate_wall(self, width: int, thickness: int = 1) -> list[tuple[int, int]]:
        """
        產生牆壁

        - width: 牆壁寬度
        - thickness: 牆壁厚度

        """

        # 牆壁座標陣列
        rect: list[tuple[int, int]]

        # 是否旋轉
        rotate = random.choice([True, False])

        # 隨機選一個除了玩家牆壁之外的中心點
        row, column = self.get_an_point_not_equal_to([
            OBJECT.GAME_WALL,
            OBJECT.GAME_PLAYER
        ])

        # 根據給定的寬度厚度生成座標 tuple
        rect = [(w, t) for w in range(width) for t in range(thickness)]

        # 旋轉
        if (rotate):
            for i, pos in enumerate(rect):
                r, c = pos
                r, c = c, r
                rect[i] = (r, c)

        # 檢查牆壁是否在邊界內
        counter: int = 0
        while counter < len(rect):
            r, c = rect[counter]
            r, c = r + row, c + column

            if (
                r >= self.h or
                c >= self.w or
                r < 0 or
                c < 0
            ):
                del rect[counter]
            else:
                rect[counter] = (r, c)
                counter += 1

        return rect

    def print_box(self) -> None:
        """
        印出目前棋局佈置

        """
        header_index = '     ' + \
            ''.join([str(i).center(4) for i in range(self.w)])
        table_border = '    ' + '+' + ''.join('---+' for i in range(self.w))

        print(header_index)
        print(table_border)
        for i, row in enumerate(self.box):
            str_row = str(i).center(4) + "|"
            str_row += "".join([str(col).center(3) + "|" for col in row])
            print(str_row)
            print(table_border)

    def set_food(self, food_type) -> tuple[int, int]:
        """
        根據 food_type 設定食物出現的位置，並回傳產生的位置

        - food_type: 食物類別

        """
        r, c = self.get_an_point_not_equal_to(
            [
                OBJECT.GAME_FOOD_NORMAL,
                OBJECT.GAME_FOOD_GOLD,
                OBJECT.GAME_FOOD_SPEED,
                OBJECT.GAME_WALL
            ]
        )

        self.box[r][c] = food_type
        return (r, c)

    def set_wall(self, width: int, thickness: int = 1) -> list[tuple[int, int]]:
        """
        設定牆壁

        - width: 牆壁寬度   
        - thickness: 牆壁厚度
        
        """
        wall = self.generate_wall(width, thickness)
        for r, c in wall:
            if not self.box[r][c]:
                self.box[r][c] = OBJECT.GAME_WALL
        return wall

    def remove_wall(self, wall: list[tuple[int, int]]) -> None:
        """
        移除指定地點的牆壁

        - wall: 牆壁位置陣列

        """
        for r, c in wall:
            if self.box[r][c] == OBJECT.GAME_WALL:
                self.box[r][c] = 0

    def set_position(self, position: tuple[int, int]) -> None:
        """
        設定玩家位置

        - position: 位置 tuple

        """
        r, c = position
        self.box[r][c] = OBJECT.GAME_PLAYER
