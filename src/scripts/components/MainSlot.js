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
        // Группируем карты по масти
        const hearts = cards.filter(card => card.mast === 1);
        const spades = cards.filter(card => card.mast === 0);
    
        // Перемешиваем каждую масть отдельно
        const shuffle = arr => {
            for (let i = arr.length - 1; i >= 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        };
    
        shuffle(hearts);
        shuffle(spades);
    
        // Перемешиваем с чередованием мастей (по желанию)
        const mixed = [];
        while (hearts.length || spades.length) {
            if (spades.length) mixed.push(spades.pop());
            if (hearts.length) mixed.push(hearts.pop());
        }
    
        // Перезаписываем исходный массив
        for (let i = 0; i < cards.length; i++) {
            cards[i] = mixed[i];
        }
    }
    
    renderCards() {
        this.mainSlot.innerHTML = '';
        let id = 0;
        this.spider.mainSlotCards.forEach(card => {
            id++;
            if (card.isVisible) {
                card.card.classList.remove('not-visible');
            }

            card.id = (id - 1);
            this.mainSlot.appendChild(card.card);
        });
    }

    dealCardsAtFirst() {
        const initialCardsDistribution = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5];
        let dealtCardsQty = 0;
        let dealtCards = [];
        let totalCardsToDeal = 54; // Всего карт, которые нужно раздать
        
        const dealNextCard = (slotIndex, cardIndex) => {
            if (dealtCardsQty >= totalCardsToDeal || this.spider.mainSlotCards.length === 0) {
                return;
            }
        
            let card = this.spider.mainSlotCards.pop();
            let slot = this.deckContent.slots[slotIndex];
            if(cardIndex + 1 === initialCardsDistribution[slotIndex]){
                card.isVisible = true;
            }
            slot.insertCard(card);
            dealtCardsQty++;
            dealtCards.push(card);
        
            if (cardIndex + 1 < initialCardsDistribution[slotIndex]) {
                setTimeout(() => dealNextCard(slotIndex, cardIndex + 1), 100);
            } else if (slotIndex + 1 < initialCardsDistribution.length) {
                setTimeout(() => dealNextCard(slotIndex + 1, 0), 100);
            }
        };
        
        dealNextCard(0, 0);
    }                                        

    dealCards(spider) {
        let dealtCards = [];
        for (let i = 0; i < 10; i++) {
            if(this.spider.mainSlotCards.length === 0) break;
            let card = spider.mainSlotCards.pop();
            dealtCards.push(card);
            card.isVisible = true;
            this.deckContent.slots[i].insertCard(card);
        }
        this.spider.actions.push(new Action('dealCards', dealtCards, this.spider));
    }
}
