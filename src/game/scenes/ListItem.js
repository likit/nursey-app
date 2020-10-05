import Phaser from 'phaser'
/**
import {firebaseApp} from "@/firebase-config";
const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();
 **/

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var fontStyles = {
    strokeThickness: 1,
    stroke: '#000',
    font: '16px Arial'
}

export default class listItem extends Phaser.Scene {
    constructor() {
        super("ListItem");
    }

    init(data) {
        this.scenarioId = data.scenarioId
        this.selectedItems = data.selectedItems
        this.user = data.user
        this.playTime = data.playTime === undefined ? 0 : data.playTime
        this.answers = data.answers
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.clock = this.game.plugins.get('rexClock').add(this)
    }

    create() {
        /* eslint-disable no-console */
        /* eslint-enable no-console */
        this.clock.start(this.playTime * 1000)
        this.fontStyles = {
            strokeThickness: 3,
            stroke: '#000',
            font: '20px Arial'
        }
        let backButton = this.add.image(50, 580, "back")
        backButton.setScale(0.1, 0.1)
        backButton.setInteractive();
        backButton.on('pointerdown', () => {
            this.scene.start('Map', {
                selectedItems: this.selectedItems,
                scenarioId: this.scenarioId,
                explore: false,
                answers: this.answers,
                user: this.user,
                playTime: this.clock.now / 1000
            })
        })

        // this.print = this.add.text(0, 0, '');
        var scrollablePanel = this.rexUI.add.scrollablePanel({
            x: 180,
            y: 300,
            width: 300,
            height: 420,

            scrollMode: 1,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: createPanel(this, this.selectedItems),

                mask: {
                    padding: 1
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },

            // scroller: true,

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            }
        })
            .layout()
        //.drawBounds(this.add.graphics(), 0xff0000);

        // Set icon interactive
        this.input.topOnly = false;
        var labels = [];
        labels.push(...scrollablePanel.getElement('#Items.items', true));
        var scene = this;
        labels.forEach(function (label) {
            if (!label) {
                return;
            }

            scene.rexUI.add.click(label.getElement('icon'), { threshold: 10 })
                .on('click', function () {
                    if (!label.getTopmostSizer().isInTouching()) {
                        return;
                    }
                    var category = label.getParentSizer().name;
                    console.log(category)
                    // print.text += `${category}:${label.text}\n`;
                });
        })
    }
}

var createPanel = function (scene, data) {
    var sizer = scene.rexUI.add.sizer({
        orientation: 'x',
        space: { item: 10 }
    })
        .add(
            createTable(scene, data, 2), // child
            { expand: true }
        )
    return sizer;
}

var createTable = function (scene, data, rows) {
    var title = scene.rexUI.add.label({
        orientation: 'x',
        text: scene.add.text(0, 0, 'Items', fontStyles),
    });

    var items = data
    var columns = Math.ceil(items.length / rows)
    var table = scene.rexUI.add.gridSizer({
        column: columns,
        row: rows,

        rowProportions: 1,
        space: { column: 10, row: 10 },
        name: 'Items'  // Search this name to get table back
    });

    var item, r, c;
    var iconSize = (rows === 1) ? 80 : 40;
    for (var i = 0, cnt = items.length; i < cnt; i++) {
        item = items[i];
        r = i % rows;
        c = (i - r) / rows;
        table.add(
            createIcon(scene, item, iconSize, iconSize),
            c,
            r,
            'top',
            0,
            true
        );
    }

    return scene.rexUI.add.sizer({
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 }
    })
        .addBackground(
            scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
        )
        .add(
            title, // child
            0, // proportion
            'left', // align
            0, // paddingConfig
            true // expand
        )
        .add(table, // child
            1, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );
}

let createIcon = function (scene, item) {
    let itemIcon = scene.add.image(0, 0, item.id)
    itemIcon.setScale(0.5,0.5)
    let label = scene.rexUI.add.label({
        orientation: 'y',
        icon: itemIcon,
        text: scene.add.text(0, 0, item.name, fontStyles),

        space: { icon: 6 }
    });
    scene.rexUI.add.click(label.getElement('icon'), { threshold: 10}).on(
        'click', function() {
            if(label.getElement('icon').alpha == 0.3) {
                label.getElement('icon').alpha = 1.0
                scene.selectedItems = scene.selectedItems.filter((selItem)=>{
                    return selItem.id !== item.id
                })
                scene.selectedItems = scene.selectedItems.filter((selItem)=>selItem.image !== null)
            } else {
                label.getElement('icon').alpha = 0.3
                scene.selectedItems.push(item)
            }
            scene.print.text = 'Items: ' + scene.selectedItems.length;
            console.log(item.name)
        }
    )
    return label
}
