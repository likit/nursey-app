import Phaser from 'phaser'
import bg from '../assets/bg.png'
import nurse1 from '../assets/nurse1.png'
import backArrow from '../assets/arrow.png'
import playButton from '../assets/play-button.png'

import {firebaseApp} from '../../firebase-config'
// import firebase from 'firebase'

// const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();
let scenarioInfo = {}

export default class scenarioScene extends Phaser.Scene{
    constructor() {
        super("ScenarioScene");
    }
    init(data) {
        this.scenarioId = data.scenarioId
    }
    preload(){
        this.load.image("background", bg)
        this.load.image("nurse1", nurse1)
        this.load.image("back", backArrow)
        this.load.image("play", playButton)
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }
    create(){
        this.add.image(100,100,"background")
        let playButton = this.add.image(190, 580, "play")
        playButton.setScale(0.10, 0.1)
        playButton.setInteractive()
        this.add.text(220,580, 'Start')
        playButton.on('pointerdown', ()=>{
            this.scene.start('Map', {explore: false, scenarioId: this.scenarioId})
        })

        let scene = this
        db.collection('scenarios').doc(this.scenarioId)
            .get().then(function(doc){
            if(doc.exists) {
                scenarioInfo = {
                    title: doc.data()['title'],
                    id: doc.id,
                    description: doc.data()['description'],
                    holders: doc.data()['holders'],
                    answers: doc.data()['answers'],
                }
                var countDown = doc.data()['timeLimit'];
                // var timelimit = countDown;
                scene.rexUI.add.dialog({
                    x: 190,
                    y: 250,
                    width: 350,

                    background: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),
                    title: createLabel(scene, scenarioInfo.title, 16),
                    toolbar: [],
                    leftToolbar: [],
                    description: createLabel(scene, scenarioInfo.description, 14),
                    choices: [
                        createLabel(scene, 'จำนวนอุปกรณ์คือ ' + scenarioInfo.answers.length + ' ชิ้น', 14),
                        createLabel(scene, 'เวลาทั้งหมดคือ ' + countDown + ' วินาที', 14)
                    ],
                    actions: [],
                    space: {
                        left: 20,
                        right: 20,
                        top: -20,
                        bottom: -20,

                        title: 25,
                        titleLeft: 30,
                        content: 25,
                        description: 25,
                        descriptionLeft: 20,
                        descriptionRight: 20,
                        choices: 25,

                        toolbarItem: 5,
                        choice: 15,
                        action: 15,
                    },

                    expand: {
                        title: false,
                        // content: false,
                        // description: false,
                        // choices: false,
                        // actions: true,
                    },

                    align: {
                        title: 'center',
                        // content: 'left',
                        // description: 'left',
                        // choices: 'left',
                        actions: 'right', // 'center'|'left'|'right'
                    },

                    click: {
                        mode: 'release'
                    }
                }).layout().popUp(100);
            }
        })
    }
    update() {
    }
}

const createLabel = function (scene, text, fontSize) {
    return scene.rexUI.add.label({
        width: 40, // Minimum width of round-rectangle
        height: 40, // Minimum height of round-rectangle

        background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x5e92f3),

        text: scene.add.text(0, 0, text, {
            fontSize: fontSize+'px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}