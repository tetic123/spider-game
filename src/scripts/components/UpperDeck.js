class UpperDeck {
    constructor(spider) {
        this.spider = spider;
        this.upperDeck = this.spider.upperDeck;
        this.mainSlot = document.createElement('div');
        this.mainSlot.classList.add('main-slot');
        this.upperDeck.appendChild(this.mainSlot);
        this.mainSlotContent = new MainSlot(this, this.spider);
        
    }
}