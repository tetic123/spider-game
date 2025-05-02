class Deck {
    constructor(spider) {
        this.spider = spider;
        this.deck = this.spider.deck;
        this.slots = [];
        for(let i = 0; i < 10; i++){
            this.slot = document.createElement('div');
            this.slot.classList.add('slot');
            this.deck.appendChild(this.slot);
            this.newSlot = new Slot(this, i + 1, this.slot);
            this.slots.push(this.newSlot);
        }
        
    }
}