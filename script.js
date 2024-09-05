// プレイヤーと手札のデータ
let players = [];
let currentPlayerIndex = 0;
let currentPlayer = null;
let hasDrawnThisTurn = false; // カードを引いたかどうかを追跡

// カードのリスト
const cards = [
    'あなたは即勝利！',
    'あなたは即敗北！',
    '他のプレイヤーと場所を入れ替える。',
    '次のターンをスキップ。',
    'カードを2枚引いてください！',
    '他の全員が次のターンをスキップ。',
    'プレイ順を逆にする。',
    '他のプレイヤーからカードを1枚盗む。',
    '追加のターンを得る。',
    'すべてのカードを捨てる。',
];

// プレイヤーオブジェクトを作成する
function createPlayer(name) {
    return {
        name: name,
        hand: [],
        defeated: false,
    };
}

// プレイヤー名を追加する処理
document.getElementById('add-player').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value;
    if (playerName.trim()) {
        const player = createPlayer(playerName);
        players.push(player);
        updatePlayerList();
        document.getElementById('player-name').value = ''; // 入力フィールドをクリア

        // 1人以上プレイヤーが参加している場合、ゲーム開始ボタンを表示
        if (players.length > 0) {
            document.getElementById('start-game').style.display = 'block';
        }
    } else {
        alert("プレイヤー名を入力してください");
    }
});

// プレイヤー一覧を更新して表示
function updatePlayerList() {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = '';  // リストをリセット
    players.forEach(player => {
        const playerItem = document.createElement('li');
        playerItem.innerText = `${player.name}（手札: ${player.hand.length} 枚）`; // 手札の枚数を表示
        playerList.appendChild(playerItem);
    });
}

// ゲーム開始時に2枚のカードを配る
function dealInitialHand(player) {
    drawCard(player, 2); // 2枚引く
}

// カードを引くロジック
function drawCard(player, num = 1) {
    for (let i = 0; i < num; i++) {
        const card = cards[Math.floor(Math.random() * cards.length)];
        player.hand.push(card); // プレイヤーの手札にカードを追加
    }
    updatePlayerList(); // 手札の枚数表示を更新
}

// 手札を画面に表示する
function updateHandDisplay() {
    const handList = document.getElementById('hand-list');
    handList.innerHTML = ''; // 手札表示をクリア

    if (currentPlayer.defeated) {
        players.forEach((player) => {
            handList.innerHTML += `<h3>${player.name} の手札:</h3>`;
            player.hand.forEach(card => {
                const cardItem = document.createElement('li');
                cardItem.innerText = card;
                handList.appendChild(cardItem);
            });
        });
    } else {
        currentPlayer.hand.forEach((card, index) => {
            const cardItem = document.createElement('li');
            cardItem.innerText = card;
            cardItem.addEventListener('click', () => playCard(index));
            handList.appendChild(cardItem);
        });
    }
}

// カードをプレイする
function playCard(index) {
    const playedCard = currentPlayer.hand.splice(index, 1)[0]; // 手札からカードを削除して取得
    logAction(`${currentPlayer.name} がプレイした: ${playedCard}`);
    updateHandDisplay(); // 手札を更新して再表示

    if (playedCard === 'あなたは即勝利！') {
        logAction(`${currentPlayer.name} は勝利しました！`);
        endGame();
        return;
    }

    if (playedCard === 'すべてのカードを捨てる。') {
        currentPlayer.hand = []; // 手札をすべて捨てる
        logAction(`${currentPlayer.name} の手札がすべて捨てられました`);
        updateHandDisplay();
    }

    if (playedCard === 'カードを2枚引いてください！') {
        drawCard(currentPlayer, 2); // 2枚引く
        logAction(`${currentPlayer.name} はカードを2枚引きました`);
    }

    if (playedCard === 'あなたは即敗北！') {
        currentPlayer.defeated = true;
        logAction(`${currentPlayer.name} は敗北しました！`);
    }

    hasDrawnThisTurn = false; // カードを引ける状態をリセット
    nextTurn(); // 次のプレイヤーにターンを移す
}

// アクションをログに追加
function logAction(action) {
    const logList = document.getElementById('log-list');
    const logItem = document.createElement('li');
    logItem.innerText = action;
    logList.appendChild(logItem);
}

// 次のプレイヤーのターンに移動
function nextTurn() {
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].defeated);

    currentPlayer = players[currentPlayerIndex];
    document.getElementById('turn-info').innerText = `${currentPlayer.name} のターンです`;
    document.getElementById('draw-card').style.display = 'block';
    hasDrawnThisTurn = false; // 新しいターンが始まったのでリセット
    updateHandDisplay();
}

// ゲーム終了処理
function endGame() {
    document.getElementById('turn-info').innerText = "ゲーム終了";
    document.getElementById('draw-card').style.display = 'none'; // カードを引くボタンを隠す
    alert("ゲームが終了しました！");
}

// ゲーム開始ボタンをクリックしたときの処理
document.getElementById('start-game').addEventListener('click', () => {
    if (players.length > 0) {
        document.getElementById('player-name-area').style.display = 'none';
        document.getElementById('player-list-area').style.display = 'none';
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('game-area').style.display = 'block';
        document.getElementById('hand-area').style.display = 'block';

        players.forEach(player => dealInitialHand(player));
        currentPlayer = players[0];
        document.getElementById('turn-info').innerText = `${currentPlayer.name} のターンです`;
        document.getElementById('draw-card').style.display = 'block';
    }
});

// カードを引くボタンの動作
document.getElementById('draw-card').addEventListener('click', () => {
    if (!hasDrawnThisTurn) {
        drawCard(currentPlayer); // 1枚引く
        hasDrawnThisTurn = true; // カードを引いた状態にする
        updateHandDisplay();
    } else {
        alert("このターンではもうカードを引けません！");
    }
});