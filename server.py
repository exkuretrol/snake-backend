from websockets.server import serve, WebSocketServerProtocol
from dotenv import load_dotenv
import os
import asyncio
import json
import logging
from Snake import snake
import signal
import http
import urllib.parse
import redis
from random import choice
from string import digits
from websockets.legacy.protocol import broadcast

load_dotenv()

PLAYER1, PLAYER2 = snake.PLAYER1, snake.PLAYER2


# Utilities
logging.basicConfig(format="%(message)s", level=logging.DEBUG)


def get_query_param(path, key):
    query = urllib.parse.urlparse(path).query
    params = urllib.parse.parse_qs(query)
    values = params.get(key, [])
    if len(values) == 1:
        return values[0]


r = redis.Redis(
    host=os.environ['REDIS_HOST'],
    port=int(os.environ['REDIS_PORT']),
    password=os.environ['REDIS_AUTH'],
    decode_responses=True
)


def get_user(token):
    email = r.get(token)
    info_json = r.get(f"info:{email}")
    info = json.loads(str(info_json))
    display_name = f"{info['user_nickname']}({info['user_name']})"
    return display_name


class QueryParamProtocol(WebSocketServerProtocol):
    async def process_request(self, path, headers):
        token = get_query_param(path, "token")
        if token is None:
            return http.HTTPStatus.UNAUTHORIZED, [], b"Missing token\n"

        user = get_user(token)
        if user is None:
            return http.HTTPStatus.UNAUTHORIZED, [], b"Missing token\n"

        self.user = user


async def error(websocket: WebSocketServerProtocol, message: str):
    event = {
        "type": "error",
        "message": message
    }

    await websocket.send(json.dumps(event))


async def echo(websocket: WebSocketServerProtocol):
    game = snake.Game()

    async for message in websocket:
        print(message, 'received from client')
        event = {
            "type": "info",
            "message": id(game)
        }
        await websocket.send(json.dumps(event))

JOIN = {}


async def start(websocket: QueryParamProtocol):
    game = snake.Game()
    connected = {websocket}
    join_key = ''.join([choice(digits) for _ in range(4)])
    JOIN[join_key] = game, connected

    try:
        event = {
            "type": "init",
            "join": join_key
        }

        await websocket.send(json.dumps(event))
        msg = f"player 1 {websocket.user} joined the game", id(game)
        event = {
            "type": "info",
            "message": msg
        }
        await websocket.send(json.dumps(event))

        async for message in websocket:
            event = json.loads(message)
            if "ready" in event:
                msg = f"player {websocket.user} is ready", id(game)
                event = {
                    "type": "info",
                    "message": msg
                }
                broadcast(connected, json.dumps(event))
                game.playerIsReady(PLAYER1)
                break

        await play(websocket, game, PLAYER1, connected)

    except Exception as e:
        pass
    finally:
        del JOIN[join_key]


async def play(websocket: QueryParamProtocol, game, player, connected):
    event = {
        "type": "info",
        "message": "在遊戲裡面了"
    }
    await websocket.send(json.dumps(event))

    started = False
    async for message in websocket:
        event = json.loads(message)
        assert event['type'] == "play"
        if game.start and game.Winner is None:
            if (not started):
                event = {
                    "type": "info",
                    "message": "遊戲開始"
                }
                broadcast(connected, json.dumps(event))
                started = True
                continue

            msg = {
                "type": "info",
                "message": player
            }
            broadcast(connected, json.dumps(msg))


async def join(websocket: QueryParamProtocol, join_key: str):
    try:
        game, connected = JOIN[join_key]
    except KeyError as e:
        await error(websocket, f"Room {join_key} Not Found")
        return

    connected.add(websocket)
    try:
        msg = f"player 2 {websocket.user} joined the game", id(game)
        event = {
            "type": "info",
            "message": msg
        }
        await websocket.send(json.dumps(event))
        async for message in websocket:
            event = json.loads(message)
            if "ready" in event:
                msg = f"player {websocket.user} is ready", id(game)
                event = {
                    "type": "info",
                    "message": msg
                }
                broadcast(connected, json.dumps(event))
                game.playerIsReady(PLAYER2)
                break

        await play(websocket, game, PLAYER2, connected)
    finally:
        connected.remove(websocket)


async def query_param_handler(websocket: QueryParamProtocol, path):
    user = websocket.user

    event = {
        "type": "info",
        "message": f"{user} join the lobby"
    }
    await websocket.send(json.dumps(event))

    message = await websocket.recv()
    event = json.loads(message)
    if "join" in event:
        await join(websocket, event['join'])
    else:
        await start(websocket)


async def main():
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)
    async with serve(
        query_param_handler,  # type: ignore
        host="localhost",
        port=8765,
        create_protocol=QueryParamProtocol
    ):
        await stop

if __name__ == "__main__":
    asyncio.run(main())
