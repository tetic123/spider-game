class Action {

    constructor(actionType, cards, spider, wasOpenedNewCard = false) {
        this.cards = cards;
        this.spider = spider;
        this.actionType = this.spider.ACTIONS_TYPES[actionType];
        this.mainSlot = this.spider.mainSlot;
        this.deck = this.spider.deckContent;
        this.wasOpenedNewCard = wasOpenedNewCard;
    }

    undoDealing(cards) {
        for(let i = cards.length - 1; i >= 0; i--) {
            let card = cards[i];
            this.spider.mainSlotCards.push(card);
            this.deck.slots[card.slot - 1].slotCards.pop();
            card.card.style.top = '0px';
            if(card.card.classList.contains('visible')){
                card.card.classList.remove('visible');
                card.card.classList.add('not-visible');
            }
            this.mainSlot.appendChild(card.card);
            card.card.onclick = null;
        }
        this.spider.actions.pop();
    }

    undoMovingToSlot(cards) {
        const prevSlot = this.deck.slots[cards[0].prevSlots[cards[0].prevSlots.length - 1].id - 1];
        const prevSlotLength = prevSlot.slotCards.length;
        if(!prevSlot.slotCards[prevSlotLength - 2].card.classList.contains('visible')) {
            if(this.spider.actions[this.spider.actions.length - 1].wasOpenedNewCard){
                prevSlot.slotCards[prevSlotLength - 1].card.classList.remove('visible');
                prevSlot.slotCards[prevSlotLength - 1].card.classList.add('not-visible');

            }
        }
        this.deck.slots[0].changeCardSlot(cards[0], this.deck.slots[cards[0].prevSlots[cards[0].prevSlots.length - 1].id - 1], this.deck.slots[cards[0].slot - 1], true);
        this.spider.actions.pop();
    }

    undoMovingToTrash(cards) {
        for(let i = cards.length - 1; i >= 0; i--) {
            let prevSlotIndex = cards[i].prevSlots[cards[i].prevSlots.length - 1] - 1;
            let prevSlot = this.deck.slots[prevSlotIndex];
            prevSlot.insertCard(cards[i]);
            cards[i].slot = prevSlot.id;
            cards[i].prevSlots.pop();
            this.spider.trashCards.pop();
        }
        this.spider.actions.pop();
    }
}