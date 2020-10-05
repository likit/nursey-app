import Phaser from 'phaser'
import {firebaseApp} from "@/firebase-config";

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var fontStyles = {
    strokeThickness: 1,
    stroke: '#000',
    font: '16px Arial'
}

export default class playGame extends Phaser.Scene{
    constructor() {
        super("PickItem");
    }
    init(data) {
        this.user = data.user
        this.scenarioId = data.scenarioId
        this.selectedItems = data.selectedItems
        this.containerId = data.containerId
        this.answers = data.answers
        this.playTime = data.playTime
        this.selectedItemIds = []
        this.selectedItems.forEach((item)=>{
            this.selectedItemIds.push(item.id)
        })
    }
    preload() {
        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.clock = this.game.plugins.get('rexClock').add(this)
    }
    create(){
        /* eslint-disable no-console */
        /* eslint-enable no-console */
        console.log('In PickItem scene')
        console.log(this.user)
        this.clock.start(this.playTime * 1000)
        this.fontStyles = {
            strokeThickness: 3,
            stroke: '#000',
            font: '20px Arial'
        }
        this.timer = this.add.text(120, 530, 'Time: ' + 0, this.fontStyles)
        this.print = this.add.text(120, 570, 'Items: ' + this.selectedItems.length, this.fontStyles)
        let backButton = this.add.image(50,580,"back")
        backButton.setScale(0.1, 0.1)
        backButton.setInteractive();
        backButton.on('pointerdown', ()=>{
            this.scene.start('Map', {
                selectedItems: this.selectedItems,
                scenarioId: this.scenarioId,
                explore: false,
                answers: this.answers,
                user: this.user,
                playTime: this.clock.now / 1000
            })
        })
        // this.add.image(200,550,"box").setScale(0.2, 0.2)
        // var nurseImg = this.add.image(280,500,"nurse1")
        let nurseImage = this.add.image(290,580,"nurse1")
        nurseImage.setScale(0.5, 0.5)
        let scene = this
        this.images = []
        let self = this
        db.collection('holders').doc(this.containerId).get().then((doc)=>{
            if(doc.exists) {
                let container = doc.data()
                let pathRef = null
                container.images.forEach(function (img) {
                    db.collection('images').doc(img).get().then(function (rec) {
                        if (rec.exists) {
                            pathRef = storage.ref(rec.data()['fileUrl'])
                            pathRef.getDownloadURL().then(function (url) {
                                let imageItem = {
                                    url: url,
                                    fileUrl: rec.data()['fileUrl'],
                                    id: rec.id,
                                    name: rec.data()['name'],
                                    description: rec.data()['description']
                                }
                                self.images.push(imageItem)
                                console.log('item was pushed' + ' ' + imageItem.name)
                                scene.load.image(imageItem.id, imageItem.url)
                                scene.load.once('complete', ()=>{
                                    createScroller(self, self.images)
                                    console.log(imageItem.id)
                                })
                                scene.load.start()
                            })
                        }
                    })
                })
            }
        })
    }
    update() {
        this.playTime = this.clock.now / 1000
        this.timer.text = 'Time: ' + this.playTime.toFixed(0) + 's'
    }
}

let createScroller = function(scene, data) {
    scene.rexUI.add.scrollablePanel({
        x: 190,
        y: 280,
        width: 330,
        height: 420,
        scrollMode: 1,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),
        panel: {
            child: createPanel(scene, data),
            mask: {
                padding: 1
            },
        },
        slider: {
            track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
            thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
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
    scene.input.topOnly = false;
}

let createPanel = function (scene, data) {
    let sizer = scene.rexUI.add.sizer({
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
            createTable(scene, data, 1), // child
            { expand: true }
        )
    return sizer;
}

let createTable = function (scene, data, rows) {
    let items = data
    let columns = Math.ceil(items.length / rows);
    let table = scene.rexUI.add.gridSizer({
        column: columns,
        row: rows,
        rowProportions: 1,
        space: { column: 10, row: 10 },
        name: 'table'  // Search this name to get table back
    });

    let item, r, c;
    for (let i = 0, cnt = items.length; i < cnt; i++) {
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
        )
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

let createIcon = function (scene, item) {
    let itemIcon = scene.add.image(0, 0, item.id)
    itemIcon.setScale(0.5,0.5)
    let label = scene.rexUI.add.label({
        orientation: 'y',
        icon: itemIcon,
        text: scene.add.text(0, 0, item.name, fontStyles),

        space: { icon: 6 }
    });
    scene.selectedItems.forEach((selItem)=>{
        if (selItem.id === item.id) {
            label.getElement('icon').alpha = 0.3
        }
    })
    scene.rexUI.add.click(label.getElement('icon'), { threshold: 10}).on(
        'click', function() {
            if(label.getElement('icon').alpha == 0.3) {
                label.getElement('icon').alpha = 1.0
                scene.selectedItems = scene.selectedItems.filter((selItem)=>{
                    return selItem.id !== item.id
                })
                scene.selectedItemIds = []
                scene.selectedItems.forEach((i)=>{
                    scene.selectedItemIds.push(i.id)
                })
                scene.selectedItems = scene.selectedItems.filter((selItem)=>selItem.image !== null)
            } else {
                label.getElement('icon').alpha = 0.3
                if (!scene.selectedItemIds.includes(item.id)) {
                    scene.selectedItems.push(item)
                    scene.selectedItemIds.push(item.id)
                    console.log(scene.selectedItemIds)
                }
            }
            scene.print.text = 'Items: ' + scene.selectedItems.length;
        }
    )
    return label
}
