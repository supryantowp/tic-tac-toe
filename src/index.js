const winningCombinations = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [3, 7, 11, 15],
  [5, 8, 12, 16, 20],
  [2, 7, 13, 19],
  [0, 6, 12, 18, 24],
];

const PEMAIN = "PEMAIN";
const LAWAN = "LAWAN";

let pemainBergerak = [];
let lawanBergerak = [];
let giliranSiapa = "";
let jumlahBergerak = 0;
let isWin = false;
let pemainMenang = false;
let lawan;

let cells = document.querySelectorAll(".cell");
let resetButton = document.getElementById("reset--button");

window.onload = playGame();

function playGame() {
  if (jumlahBergerak === 25 && !isWin) {
    tampilkanHasil("Draw");
    setTimeout(function () {
      reset();
    }, 1000);
  } else if (isWin) {
    setTimeout(function () {
      reset();
    }, 1000);
  }
  //player always starts
  else if (giliranSiapa === PEMAIN || jumlahBergerak === 0) {
    player();
  } else if (giliranSiapa === LAWAN) {
    setTimeout(function () {
      computer();
    }, 500); // pemain lawan bergerak otomati setelah 0,5 detik
  }
}

function player() {
  cells.forEach((cell) => {
    cell.addEventListener("click", function () {
      if (
        lawanBergerak.indexOf(Number(this.id)) !== -1 ||
        pemainBergerak.indexOf(Number(this.id)) !== -1
      ) {
        return;
      }

      this.getElementsByTagName("img")[1].classList.add("clicked");
      pemainBergerak.push(Number(this.id));
      nextTurn(LAWAN, pemainBergerak);
    });
  });
}

function computer() {
  smartLawan();
  let random = pickRandomCells();
  for (let i = 0; i < cells.length; i++) {
    if (jumlahBergerak === 9 && !isWin) {
      return;
    } else if (
      lawanBergerak.indexOf(Number(random.id)) !== -1 ||
      pemainBergerak.indexOf(Number(random.id)) !== -1
    ) {
      return computer();
    }
    random.getElementsByTagName("img")[0].classList.add("clicked");
  }
  if (!lawanBergerak.includes(Number(random.id))) {
    lawanBergerak.push(Number(random.id));
  }
  nextTurn(PEMAIN, lawanBergerak);
}

function pickRandomCells() {
  let random;
  if (pemainMenang) {
    if (
      lawanBergerak.indexOf(lawan) === -1 &&
      pemainBergerak.indexOf(lawan) === -1
    ) {
      random = lawan;
      pemainMenang = false;
    } else {
      random = Math.floor(Math.random() * cells.length);
    }
  } else if (jumlahBergerak === 25 && isWin === false) {
    return;
  } else {
    random = Math.floor(Math.random() * cells.length);
  }
  return cells[random];
}

function smartLawan() {
  let pemainMungkinMenang = winningCombinations.filter((array) => {
    return (
      array.filter((item) => {
        return pemainBergerak.indexOf(item) > -1;
      }).length === 2
    );
  });

  if (pemainMungkinMenang.length > 0) {
    pemainMenang = true;
    pemainMungkinMenang.filter((array) => {
      array.filter((item) => {
        if (
          pemainMungkinMenang.indexOf(item) === -1 &&
          lawanBergerak.indexOf(item) === -1
        ) {
          lawan = item;
        }
      });
    });
  }
}

function nextTurn(lawan, yangBergerak) {
  giliranSiapa = lawan;
  jumlahBergerak++;
  hasWon(yangBergerak, winningCombinations);
  playGame();
}

function hasWon(pindah, winningCombinations) {
  let foundResult = winningCombinations.filter((array) => {
    return (
      array.filter((item) => {
        return pindah.indexOf(item) > -1;
      }).length === 4 // jika semua line sama maka menang
    );
  });

  if (foundResult.length > 0) {
    if (giliranSiapa === LAWAN) {
      tampilkanHasil("Selamat, kamu berhasil mengalahkan virus corona");
    } else if (giliranSiapa == PEMAIN) {
      tampilkanHasil(
        "Yah kamu belum berhasil, coba kembali untuk meraih kemenangan dan akhiri pandemi ini!"
      );
    }

    isWin = true;
  }
}

function reset() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].getElementsByTagName("img")[0].classList.remove("clicked");
    cells[i].getElementsByTagName("img")[1].classList.remove("clicked");
  }
  pemainBergerak = [];
  lawanBergerak = [];
  jumlahBergerak = 0;
  isWin = false;
  pemainMenang = false;
  hideResult();
}

resetButton.addEventListener("click", () => {
  reset();
});

function tampilkanHasil(winningMessage) {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("text").textContent = winningMessage;
  alert(winningMessage);
}

function hideResult() {
  document.getElementById("overlay").style.display = "none";
}
