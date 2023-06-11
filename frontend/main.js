// @ts-check
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    // player a = kuaz
    // player b = elaine
    const token = params.has("join") ? "d838682a38a59318dfd2903e604d1665" : "e6b119d9f689547732e12b7a1b92eee9"
    const websocket = new WebSocket(
        `ws://localhost:8765/?token=${token}`
    );

    initWebsockets(websocket);
    receiveMove(websocket);
});

/**
 * Show Message
 * @param {string} message
 */
const showMessage = (message) => {
    // window.setTimeout(() => alert(message), 50);
    const output = document.getElementById("message")

    // @ts-ignore
    output.innerText = message + "\n" + output.innerText;
};

/**
 * Initialize websockets
 * @param {WebSocket} ws
 */
const initWebsockets = (ws) => {
    ws.addEventListener("open", () => {
        const params = new URLSearchParams(window.location.search);
        const event = { type: "init" };
        if (params.has("join")) {
            event["join"] = params.get("join");
            ws.send(JSON.stringify(event));
        }
        init(ws);
    });

    ws.addEventListener("error", (event) => {
        console.log(event);
        showMessage("Websocket Error");
    });
};

/**
 *
 * @param {WebSocket} ws
 */
const createRoom = (ws) => {
    const event = { type: "init" };
    ws.send(JSON.stringify(event));
};

/**
 *
 * @param {WebSocket} ws
 */
const isReady = (ws) => {
    const event = { type: "init", ready: true };
    ws.send(JSON.stringify(event));
};

/**
 *
 * @param {WebSocket} ws
 */
const sendMessage = (ws) => {
    const params = new URLSearchParams(window.location.search);
    const player = params.has("join") ? "player2" : "player1"
    const event = { type: "play", player: player };
    ws.send(JSON.stringify(event));
};

/**
 * @param {WebSocket} ws
 */
const init = (ws) => {
    const createBtn = document.getElementById("createBtn");
    const joinBtn = document.getElementById("joinBtn");
    const readyBtn = document.getElementById("readyBtn");
    const sendBtn = document.getElementById("readyBtn");

    createBtn?.addEventListener("click", () => {
        createRoom(ws);
    });

    joinBtn?.addEventListener("click", () => {
        console.log("clicked");
    });

    readyBtn?.addEventListener("click", () => {
        isReady(ws)
    });

    sendBtn?.addEventListener("click", () => {
        sendMessage(ws);
    });

};

/**
 * Receieve Event from websockets
 * @param {WebSocket} ws
 */
const receiveMove = (ws) => {
    ws.addEventListener("message", ({ data }) => {
        const event = JSON.parse(data);
        switch (event.type) {
            case "info":
                showMessage(event.message);
                break;

            case "init":
                // @ts-ignore
                document.getElementById("roomNum").innerText= event.join;
                showMessage("建立了一個房間，房號為" + event.join)
                break;

            case "error":
                showMessage(event.message);
                break;

            default:
                throw new Error(`unhandle event type ${event.type}`);
        }
    });
};
