import Phaser from 'phaser'
import room from '../assets/room3.png'

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;

export default class Map extends Phaser.Scene{
    constructor() {
        super("Map");
    }
    init(data) {
        this.scenarioId = data.scenarioId
        this.explore = data.explore
        this.selectedItems = data.selectedItems === undefined ? [] : data.selectedItems
    }
    preload(){
        this.load.image("tiles", room)
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }
    create(){
        this.add.image(100,100,"background")
        this.add.rectangle(185, 380, 362, 320, 0xe0e0d1);
        const level = []
        let row = []
        for(let i=0; i<=132;i = i + 11) {
            for(let j=i; j<i+11;j++) {
                row.push(j)
            }
            level.push(row)
            row = []
        }
        let nurseImg = this.add.image(300,130,"nurse1")
        nurseImg.setScale(0.20, 0.20)
        const map = this.make.tilemap({key: "map", data: level, tileWidth: 32, tileHeight: 32})
        const tiles = map.addTilesetImage("tiles")
        map.createStaticLayer(0, tiles, 10, 150)
        let playButton
        if(this.explore) {
            playButton = this.add.image(190, 580, "play")
            playButton.setScale(0.10, 0.1)
            playButton.setInteractive()
            this.add.text(220,580, 'Play')
        }
        let content = ''
        if(this.explore) {
            content = 'คลิกที่ตำแหน่งต่าง ๆ\nเพื่อสำรวจหอผู้ป่วย'
        } else {
            content = 'คลิกเพื่อค้นหาอุปกรณ์\nจากตู้หรือรถเข็น'
        }
        createTextBox(this, 20, 50, { wrapWidth: 300, }).start(content, 50);
        let dialog = undefined
        this.input.on('pointerdown', (pointer)=>{
            let scene = this
            let title = ''
            let desc = ''
            let containerId = ''
            let t = map.getTileAtWorldXY(pointer.x, pointer.y)
            if (t !== null) {
                console.log(t.index)
                switch (t.index) {
                    case 40:
                    case 18:
                    case 29:
                        containerId = '3bQSljR3OOLT6wQcEi2Q'
                        title = 'ตู้เย็นเก็บยา'
                        desc = 'ตู้สำหรับเก็บยาต่างๆ'
                        break
                    case 30:
                    case 19:
                    case 41:
                        title = 'ตู้เก็บสารละลาย'
                        desc = 'ตู้สำหรับเก็บสารละลาย\nต่างๆ'
                        break
                    case 123:
                    case 124:
                    case 112:
                    case 113:
                        title = 'รถ feed'
                        desc = 'รถ feed'
                        break
                    default:
                        title = ''
                        desc = ''
                        containerId = ''
                }
                if (dialog !== undefined) {
                    dialog.scaleDownDestroy(100)
                    dialog = undefined
                } else {
                    if (title !== '') {
                        if(scene.explore) {
                            dialog = createDialog(scene, title, desc, pointer.x, pointer.y)
                        } else {
                            this.scene.start('PickItem',
                                {
                                    scenarioId: this.scenarioId,
                                    selectedItems: this.selectedItems,
                                    containerId: containerId
                                })
                        }
                    }
                }
            } else {
                console.log('Tile index not found.')
            }
        })
        if(this.explore) {
            // this chunk needs to be here or the event won't fire
            let scene = this
            playButton.on('pointerdown', ()=>{
                this.scene.start('ScenarioScene',
                    {
                        scenarioId: scene.scenarioId,
                        explore: false
                    })
            })
        } else {
            this.add.text(100,550, 'Selected Items: ' + this.selectedItems.length)
            var buttons = this.rexUI.add.buttons({
                x: 200, y: 600,
                width: 300,
                orientation: 'x',
                buttons: [
                    createButton(this, 'Quit'),
                    createButton(this, 'Finish'),
                    createButton(this, 'List'),
                ],
                expand: true
            })
                .layout()
            //.drawBounds(this.add.graphics(), 0xff0000)
            buttons
                .on('button.click', function (button) {
                    console.log(`Click button-${button.text}`);
                })
        }
    }
}

let createDialog = function(scene, title, desc, x, y) {
    let dialog = scene.rexUI.add.dialog({
        x: x,
        y: y,
        background: scene.rexUI.add.roundRectangle(0, 0, 100, 30, 20, 0x996633),
        title: scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 100, 30, 20, COLOR_PRIMARY),
            text: scene.add.text(0, 0, title, {
                fontSize: '15px',
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        }),
        content: scene.add.text(0, 0, desc, {
            fontSize: '14px',
        }),
        actions: [
        ],
        space: {
            title: 25,
            content: 25,
            action: 15,

            left: 10,
            right: 10,
            top: 15,
            bottom: 5,
        },
        align: {
            actions: 'right', // 'center'|'left'|'right'
        },
        expand: {
            content: false, // Content is a pure text object
        }
    })
        .layout()
        // .drawBounds(this.add.graphics(), 0xff0000)
        .popUp(100);
    dialog
        .on('button.click', function (button, groupName, index) {
            console.log(index)
            if (index==1) {
                dialog.scaleDownDestroy(50)
                dialog = undefined
            }
        }, this)
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        });
    return dialog
}

var createButton = function (scene, text) {
    return scene.rexUI.add.label({
        width: 40,
        height: 40,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
        text: scene.add.text(0, 0, text, {
            fontSize: 18
        }),
        space: {
            left: 10,
            right: 10,
        },
        align: 'center'
    });
}


/**
let createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,

        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

        text: scene.add.text(0, 0, text, {
            fontSize: '11px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}
 **/
const GetValue = Phaser.Utils.Objects.GetValue;
let createTextBox = function (scene, x, y, config) {
    let wrapWidth = GetValue(config, 'wrapWidth', 0);
    let fixedWidth = GetValue(config, 'fixedWidth', 0);
    let fixedHeight = GetValue(config, 'fixedHeight', 0);
    let textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

        space: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
            icon: 10,
            text: 10,
        }
    })
        .setOrigin(0)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            let icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }

            let icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 30;
            scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}

let getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '14px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}
