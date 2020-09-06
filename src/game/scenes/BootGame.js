import Phaser from 'phaser'
import bg from '../assets/bg.png'
import nurse1 from '../assets/nurse1.png'
import syringe5 from '../assets/syringe5.png'
import fixomull2 from '../assets/fixomull2.png'
import saline1 from '../assets/saline1.png'
import backArrow from '../assets/arrow.png'
import box from '../assets/package.png'
import yellow from '../assets/Yellow_free_48x48.png'

export default class bootGame extends Phaser.Scene{
    constructor() {
        super("BootGame");
    }
    preload(){
        this.load.image("background", bg)
        this.load.image("nurse1", nurse1)
        this.load.image("syringe5",  syringe5)
        this.load.image("fixomull2",  fixomull2)
        this.load.image("saline1",  saline1)
        this.load.image("back", backArrow)
        this.load.image("box", box)
        this.load.image("mario", "https://miro.medium.com/max/176/1*nYRQLN_J6TOMcurufrT7TQ.png")
        this.load.image("yellow-tiles", yellow)
    }
    create(){
        this.scene.start("Map")
    }
}
