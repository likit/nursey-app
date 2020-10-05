import Phaser from 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import ClockPlugin from "phaser3-rex-plugins/plugins/clock-plugin";

function launch(containerId) {
    let game = new Phaser.Game({
        type: Phaser.CANVAS,
        width: 375,
        height: 640,
        backgroundColor: '#fcd9fc',
        parent: containerId,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        plugins: {
            global: [{
                key: 'rexClock',
                plugin: ClockPlugin,
                start: true,
            }],
            scene: [{
                key: 'rexUI',
                plugin: UIPlugin,
                mapping: 'rexUI'
            },
            ]
        }
    })
    return game
}

function resizeGame(game){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height; if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px"; }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px"; canvas.style.height = windowHeight + "px";
    }
}

export default launch;
export { launch, resizeGame }