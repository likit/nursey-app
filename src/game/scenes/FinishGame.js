import Phaser from 'phaser'
import firebase from "firebase";
import {firebaseApp} from "@/firebase-config";

const db = firebaseApp.firestore();

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class finishGame extends Phaser.Scene {
    constructor() {
        super("FinishGame");
    }

    init(data) {
        this.user = data.user
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
        this.totalPoints = 0

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
                gridTable
                    .setItems(createItems(mainScene))
                    .scrollToBottom()
            })
        this.selectedItems.forEach((item)=>{
            if (mainScene.answers.includes(item.id)) {
                this.totalPoints = this.totalPoints + 1
            } else {
                this.totalPoints = this.totalPoints - 1
            }
        })
        this.print = this.add.text(50, 430, 'Total Points: ' + this.totalPoints, fontStyles)
        this.print = this.add.text(190, 430, 'Total Time: ' + this.playTime.toFixed(0) + 's', fontStyles)
        // this.add.image(200,550,"box").setScale(0.2, 0.2)
        // var nurseImg = this.add.image(280,500,"nurse1")
        let nurseImage = this.add.image(290, 580, "nurse1")
        nurseImage.setScale(0.6, 0.6)
        let content
        if (this.totalPoints === this.answers.length) {
            content = 'เยี่ยมยอดมากค่ะ'
        } else {
            content = 'พยายามฝึกต่อไปมาก ๆ นะคะ'
        }
        createTextBox(this, 20, 500, { wrapWidth: 150, }).start(content, 50);
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
            if (text === 'Restart') {
                scene.scene.start('ScenarioScene', {
                    scenarioId: scene.scenarioId
                })
            } else {
                let selectedItemIds = []
                let correctAnswers = []
                let wrongAnswers = []
                let unpickedItems = []
                scene.selectedItems.forEach((i)=>{
                    selectedItemIds.push(i.id)
                })
                selectedItemIds.forEach((i)=>{
                    if (scene.answers.includes(i)) {
                        correctAnswers.push(i)
                    } else {
                        wrongAnswers.push(i)
                    }
                })
                scene.answers.forEach((i)=>{
                    if (!selectedItemIds.includes(i)) {
                        unpickedItems.push(i)
                    }
                })
                db.collection('plays').add({
                    scenarioId: scene.scenarioId,
                    email: scene.user,
                    selectedItems: selectedItemIds,
                    wrongAnswers: wrongAnswers,
                    correctAnswers: correctAnswers,
                    unpickedItems: unpickedItems,
                    score: scene.totalPoints,
                    time: scene.playTime,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function(){
                    window.location.replace('/#/lessons')
                });
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
