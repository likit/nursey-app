import Phaser from 'phaser'

export default class tileMap extends Phaser.Scene{
    constructor() {
        super("Map");
    }
    preload(){
    }
    create(){
        const level = [
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 38,  39,  39,  39,  39, 39, 39, 40],
            [ 60,  60,  39,  39,  39, 39, 39, 40],
        ];
        const map = this.make.tilemap({ data: level, tileWidth: 48, tileHeight: 48 });
        const tiles = map.addTilesetImage("yellow-tiles");
        map.createStaticLayer(0, tiles, 0, 0);
    }
}
