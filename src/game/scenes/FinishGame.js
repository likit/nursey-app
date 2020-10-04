import Phaser from 'phaser'

const Random = Phaser.Math.Between;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class finishGame extends Phaser.Scene {
    constructor() {
        super("FinishGame");
    }

    init(data) {
        this.selectedItems = data.selectedItems
        this.answers = data.answers
        this.scenarioId = data.scenarioId
        this.playTime = data.playTime
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        /* eslint-disable no-console */
        /* eslint-enable no-console */
        var totalPoints = 0

        this.add.image(100, 100, "background")
        let fontStyles = {
            strokeThickness: 3,
            stroke: '#000',
            font: '20px Arial'
        }
        let mainScene = this
        let scrollMode = 0; // 0:vertical, 1:horizontal
        let gridTable = this.rexUI.add.gridTable({
            x: 190,
            y: 250,
            width: (scrollMode === 0) ? 300 : 420,
            height: (scrollMode === 0) ? 350 : 300,

            scrollMode: scrollMode,

            background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

            table: {
                cellWidth: (scrollMode === 0) ? undefined : 60,
                cellHeight: (scrollMode === 0) ? 60 : undefined,

                columns: 1,

                mask: {
                    padding: 2,
                },

                reuseCellContainer: true,
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },

            header: this.rexUI.add.label({
                width: (scrollMode === 0) ? undefined : 30,
                height: (scrollMode === 0) ? 30 : undefined,

                orientation: scrollMode,
                background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
                text: this.add.text(0, 0, 'Results'),
            }),

            footer: GetFooterSizer(this, scrollMode),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                let scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item
                if (cellContainer === null) {
                    cellContainer = scene.rexUI.add.label({
                        width: width,
                        height: height,

                        orientation: scrollMode,
                        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                        text: scene.add.text(0, 0, ''),

                        space: {
                            icon: 10,
                            left: (scrollMode === 0) ? 15 : 0,
                            top: (scrollMode === 0) ? 0 : 15,
                        }
                    });
                    console.log(cell.index + ': create new cell-container');
                } else {
                    console.log(cell.index + ': reuse cell-container');
                }

                // Set properties from item value
                cellContainer.setMinSize(width, height); // Size might changed in this demo
                cellContainer.getElement('text').setText(item.name); // Set text of text object
                cellContainer.getElement('icon').setFillStyle(item.color); // Set fill color of round rectangle object
                cellContainer.getElement('background').setStrokeStyle(2, COLOR_DARK).setDepth(0);
                return cellContainer;
            },
            items: createItems(mainScene)
        }).layout()
        //.drawBounds(this.add.graphics(), 0xff0000);

        this.add.text(800, 600, 'Reset item')
            .setOrigin(1, 1)
            .setInteractive()
            .on('pointerdown', function () {
                var itemCount = Random(10, 50);
                gridTable
                    .setItems(createItems(mainScene))
                    .scrollToBottom()
                console.log(`Create ${itemCount} items`)
            })
        this.selectedItems.forEach((item)=>{
            if (mainScene.answers.includes(item.id)) {
                totalPoints = totalPoints + 1
            }
        })
        this.print = this.add.text(50, 430, 'Total Points: ' + totalPoints, fontStyles)
        this.print = this.add.text(190, 430, 'Total Time: ' + this.playTime + 's', fontStyles)
        let backButton = this.add.image(50, 580, "back")
        backButton.setScale(0.1, 0.1)
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('Map', {
                selectedItems: this.selectedItems,
                scenarioId: this.scenarioId,
                explore: false,
                answers: this.answers
            })
        })
        // this.add.image(200,550,"box").setScale(0.2, 0.2)
        // var nurseImg = this.add.image(280,500,"nurse1")
        let nurseImage = this.add.image(290, 570, "nurse1")
        nurseImage.setScale(0.6, 0.6)
    }
}

let GetFooterSizer = function (scene, orientation) {
    return scene.rexUI.add.sizer({
        orientation: orientation
    })
        .add(
            CreateFooterButton(scene, 'Restart', orientation),   // child
            1,         // proportion
            'center'   // align
        )
        .add(
            CreateFooterButton(scene, 'Done', orientation),    // child
            1,         // proportion
            'center'   // align
        )
}

let CreateFooterButton = function (scene, text, orientation) {
    return scene.rexUI.add.label({
        height: (orientation === 0) ? 40 : undefined,
        width: (orientation === 0) ? undefined : 40,
        orientation: orientation,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
        text: scene.add.text(0, 0, text),
        icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
        align: 'center',
        space: {
            icon: 10
        }
    })
        .setInteractive()
        .on('pointerdown', function () {
            console.log(`Pointer down ${text}`)
            if (text === 'Restart') {
                scene.scene.start('ScenarioScene', {
                    scenarioId: scene.scenarioId
                })
            } else {
                window.location.replace('/#/lessons')
            }
        })
        .on('pointerover', function(){
            this.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('pointerout', function(){
            this.getElement('background').setStrokeStyle();
        })
}

let createItems = function (mainScene) {
    let items = []
    console.log(mainScene.answers)
    mainScene.selectedItems.forEach((item)=>{
        let color
        if (mainScene.answers.includes(item.id)) {
            color = 0x33cc33
        } else {
            color = 0xff0000
        }
        items.push({
            id: item.id,
            name: item.name,
            color: color
        })
    })
    return items
}