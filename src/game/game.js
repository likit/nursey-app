import Phaser from 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import PlayGame from './scenes/PlayGame'
import BootGame from './scenes/BootGame'
import PickItem from './scenes/PickItem'
import Map from './scenes/Map'

function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: 375,
        height: 640,
        backgroundColor: '#e3e1e6',
        parent: containerId,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: [BootGame, Map, PlayGame, PickItem],
        plugins: {
            scene: [{
                key: 'rexUI',
                plugin: UIPlugin,
                mapping: 'rexUI'
            },
            ]
        }
    })
}

function resizeGame(game){
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height; if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px"; }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px"; canvas.style.height = windowHeight + "px";
    }
}

export default launch;
export { launch, resizeGame }