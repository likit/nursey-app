import Phaser from 'phaser'

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var data = {
    name: 'ตู้พยาบาล',
    containers: [
        { name: 'Syringe', id: 1, image: "syringe5" },
        { name: 'Fixomull', id: 2, image: "fixomull2" },
        { name: 'Saline', id: 3, image: "saline1" },
    ]
};

var selectedItems = [];

export default class playGame extends Phaser.Scene{
    constructor() {
        super("PickItem");
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }
    create(){
        /* eslint-disable no-console */
        console.log('scene changed..')
        /* eslint-enable no-console */
        this.add.image(100,100,"background")
        var fontStyles = {
            strokeThickness: 3,
            stroke: '#000',
            font: '32px Arial'
        }
        this.print = this.add.text(70, 420, 'Items: ' + selectedItems.length, fontStyles)
        var backButton = this.add.image(50,550,"back")
        backButton.setScale(0.1, 0.1)
        backButton.setInteractive();
        backButton.on('pointerdown', ()=>{
            this.scene.start('PlayGame', {selectedItems: selectedItems})
        })
        this.add.image(200,550,"box").setScale(0.2, 0.2)
        // var nurseImg = this.add.image(280,500,"nurse1")
        var nurseImg = this.add.image(290,530,"nurse1")
        nurseImg.setScale(0.25, 0.25)
        this.rexUI.add.scrollablePanel({
            x: 190,
            y: 200,
            width: 330,
            height: 320,

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
    var itemIcon = scene.add.image(0, 0, item.image)
    itemIcon.setScale(0.6,0.6)
    var label = scene.rexUI.add.label({
        orientation: 'y',
        icon: itemIcon,
        text: scene.add.text(0, 0, item.name),

        space: { icon: 6 }
    });
    scene.rexUI.add.click(label.getElement('icon'), { threshold: 10}).on(
        'click', function() {
            if(label.getElement('icon').alpha == 0.3) {
                label.getElement('icon').alpha = 1.0
                selectedItems.forEach((selItem)=>{
                    if (selItem.item.id == item.id){
                        selItem.image.destroy();
                        selItem.image = null;
                    }
                })
                selectedItems = selectedItems.filter((selItem)=>selItem.image !== null)
                /* eslint-disable no-console */
                console.log(selectedItems.length)
                /* eslint-enable no-console */
            } else {
                label.getElement('icon').alpha = 0.3
                var newItem = scene.add.image(199+(Math.random()*5),540, item.image).setScale(0.1, 0.1)
                newItem.rotation += Math.random() * 20;
                selectedItems.push({
                    item: item,
                    image: newItem,
                })
            }
            scene.print.text = 'Items: ' + selectedItems.length;
        }
    )

    return label;
};

