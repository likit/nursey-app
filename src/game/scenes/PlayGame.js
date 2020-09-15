import Phaser from 'phaser'
import trolley from '../assets/trolley.png'

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const content = "เลือกตู้หรือกล่องที่บรรจุอุปกรณ์"

let data = {
    name: 'ตู้พยาบาล',
    containers: [
        {name: 'A', id: 1},
        {name: 'B', id: 2},
        {name: 'C', id: 3},
    ]
};

export default class playGame extends Phaser.Scene{
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.image("trolley",  trolley)
    }
    create(){
        this.add.image(100,100,"background")
        createTextBox(this, 20, 350, {
            wrapWidth: 100,
        })
            .start(content, 50);
        var nurseImg = this.add.image(330,530,"nurse1")
        nurseImg.setScale(0.25, 0.25)
        nurseImg.alpha = 0;
        this.tweens.add({
            targets: [nurseImg],
            alpha: 1,
            duration: 2000,
        })
        this.rexUI.add.scrollablePanel({
            x: 190,
            y: 200,
            width: 330,
            height: 220,

            scrollMode: 1,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: createPanel(this, data),

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
        }).layout()
        this.input.topOnly = false;
    }
}

var createPanel = function (scene, data) {
    var sizer = scene.rexUI.add.sizer({
        orientation: 'x',
        space: { item: 10 }
    })
        /**
        .add(
            createHeader(scene, data), // child
            { expand: true }
        )
         */
        .add(
            createTable(scene, data, 'containers', 1), // child
            { expand: true }
        )
    return sizer;
}

/**
var createHeader = function (scene, data) {
    var title = scene.rexUI.add.label({
        orientation: 'y',
        text: scene.add.text(0, 0, 'Container'),
    });
    var header = scene.rexUI.add.label({
        orientation: 'y',
        text: scene.add.text(0, 0, data.name),

        space: { icon: 10 }
    });

    return scene.rexUI.add.sizer({
        orientation: 'y',
        space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }
    })
        .addBackground(
            scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
        )
        .add(
            title, // child
            { expand: true, align: 'left' }
        )
        .add(header, // child
            { proportion: 1, expand: true }
        );
};
*/

var createTable = function (scene, data, key, rows) {
    /*
    var capKey = key.charAt(0).toUpperCase() + key.slice(1);
    var title = scene.rexUI.add.label({
        orientation: 'x',
        text: scene.add.text(0, 0, capKey),
    });
    */

    var items = data[key];
    var columns = Math.ceil(items.length / rows);
    var table = scene.rexUI.add.gridSizer({
        column: columns,
        row: rows,

        rowProportions: 1,
        space: { column: 10, row: 10 },
        name: key  // Search this name to get table back
    });

    var item, r, c;
    for (var i = 0, cnt = items.length; i < cnt; i++) {
        item = items[i];
        r = i % rows;
        c = (i - r) / rows;
        table.add(
            createIcon(scene, item),
            c,
            r,
            'top',
            0,
            true
        );
    }

    return scene.rexUI.add.sizer({
        orientation: 'x',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 }
    })
        .addBackground(
            scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
        )
        /*
        .add(
            title, // child
            0, // proportion
            'left', // align
            0, // paddingConfig
            true // expand
        )
         */
        .add(table, // child
            1, // proportion
            'center', // align
            0, // paddingConfig
            true // expand
        );
}

var createIcon = function (scene, item) {
    var trolleyIcon = scene.add.image(0, 0, "trolley")
    trolleyIcon.setScale(0.25,0.25)
    var label = scene.rexUI.add.label({
        orientation: 'y',
        icon: trolleyIcon,
        text: scene.add.text(0, 0, item.name),
        space: { icon: 3 },
        objId: item.id
    });
    scene.rexUI.add.click(label.getElement('icon'), { threshold: 10}).on(
        'click', function() {
            /* eslint-disable no-console */
            console.log(`${item.id} was clicked`)
            /* eslint-enable no-console */
            scene.scene.start('PickItem', { containerId: item.id })
        }
    )

    return label;
};

const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var textBox = scene.rexUI.add.textBox({
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
            var icon = this.getElement('action').setVisible(false);
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

            var icon = this.getElement('action').setVisible(true);
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

/*
var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
        fontSize: '20px',
        wordWrap: {
            width: wrapWidth
        },
        maxLines: 3
    })
        .setFixedSize(fixedWidth, fixedHeight);
}
*/

let getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '20px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3
    })
}