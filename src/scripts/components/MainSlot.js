class MainSlot {
    constructor(upperDeck, spider) {
        this.upperDeck = upperDeck;
        this.spider = spider;
        this.deckContent = this.spider.deckContent;
        this.mainSlot = upperDeck.mainSlot;
        this.firstDeal = true; // Флаг первой раздачи

        this.fillUpMainSlot();
        this.shuffleCards(this.spider.cards);
        this.spider.mainSlotCards = [...this.spider.cards];
        this.renderCards();

        //начальная раздача

        this.dealCardsAtFirst();

        this.mainSlot.addEventListener('click', () => this.dealCards(this.spider));
    }

    fillUpMainSlot() {
        let id = 0;
        for (let coloda = 0; coloda < 2; coloda++) {
            for (let mast = 0; mast < 2; mast++) {
                for (let copy = 0; copy < 2; copy++) {
                    for (let cardNum = 1; cardNum < 14; cardNum++) {
                        id++;
                        const card = new Card(this, mast, cardNum, id - 1);
                        this.spider.cards.push(card);
                        this.spider.mainSlotCards.push(card);
                    }
                }
            }
        }
    }

    shuffleCards(cards) {
        for (let i = cards.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    renderCards() {
        this.mainSlot.innerHTML = '';
        let id = 0;
        this.spider.mainSlotCards.forEach(card => {
            id++;
            console.log(card.isVisible);
            if (card.isVisible) {
                card.card.classList.remove('not-visible');
            }
            this.spider.drawNotVisibleCard(card);

            card.id = (id - 1);
            this.mainSlot.appendChild(card.card);
        });
    }

    dealCardsAtFirst() {
        const initialCardsDistribution = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
        let dealtCards = 0;
        let totalCardsToDeal = 54; // Всего карт, которые нужно раздать
        
        const dealNextCard = (slotIndex, cardIndex) => {
            if (dealtCards >= totalCardsToDeal || this.spider.mainSlotCards.length === 0) {
                return;
            }
        
            let card = this.spider.mainSlotCards.pop();
            let slot = this.deckContent.slots[slotIndex];
            if(cardIndex + 1 === initialCardsDistribution[slotIndex]){
                card.isVisible = true;
            }
            console.log(cardIndex + 1, initialCardsDistribution[slotIndex], card.isVisible);
            slot.insertCard(card);
            dealtCards++;
        
            if (cardIndex + 1 < initialCardsDistribution[slotIndex]) {
                setTimeout(() => dealNextCard(slotIndex, cardIndex + 1), 100);
            } else if (slotIndex + 1 < initialCardsDistribution.length) {
                setTimeout(() => dealNextCard(slotIndex + 1, 0), 100);
            }
        };
        
        dealNextCard(0, 0);
    }                                        

    dealCards(spider) {
        for (let i = 0; i < 10; i++) {
            if(this.spider.mainSlotCards.length === 0) break;
            let card = spider.mainSlotCards.pop();
            this.deckContent.slots[i].insertCard(card);
        }
    }
}
