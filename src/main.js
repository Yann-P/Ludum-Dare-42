const Game = require('./game')

CONFIG = { TILESIZE: 30 }


document.addEventListener('DOMContentLoaded', () => {
    window.g = new Game();
});