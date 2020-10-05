import Phaser from 'phaser'
import bg from '../assets/bg.png'
import nurse1 from '../assets/nurse1.png'
import nurse2 from '../assets/nurse2.png'
import syringe5 from '../assets/syringe5.png'
import fixomull2 from '../assets/fixomull2.png'
import saline1 from '../assets/saline1.png'
import backArrow from '../assets/arrow.png'
import box from '../assets/package.png'
import playButton from '../assets/play-button.png'

export default class bootGame extends Phaser.Scene{
    constructor() {
        super("BootGame");
    }
    init(data) {
        this.scenarioId = data.scenarioId
        this.user = data.user
    }
    preload(){
        this.load.image("background", bg)
        this.load.image("nurse1", nurse1)
        this.load.image("nurse2", nurse2)
        this.load.image("syringe5",  syringe5)
        this.load.image("fixomull2",  fixomull2)
        this.load.image("saline1",  saline1)
        this.load.image("back", backArrow)
        this.load.image("play", playButton)
        this.load.image("box", box)
    }
    create(){
        console.log('booting..')
        console.log(this.user)
        this.scene.start("Map", {scenarioId: this.scenarioId, explore: true, user: this.user})
    }
}
