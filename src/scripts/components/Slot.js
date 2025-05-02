class Slot {
    constructor(deck, id, slot) {
        this.slotCards = [];
        this.slot = slot;
        this.deck = deck;
        this.spider = this.deck.spider;
        this.id = id;

        if (!this.slot.dataset.listener) {
            this.slot.dataset.listener = "true";
            this.slot.addEventListener('click', () => {
                this.moveCard();
            });
        }
    }

    isCorrectPlaceToInsert(prevSelectedCard, currentSelectedCard = null, slot = null) {
        if (currentSelectedCard) {
            return (
                currentSelectedCard.cardNum === prevSelectedCard.cardNum + 1 &&
                currentSelectedCard.mast !== prevSelectedCard.mast
            );
        } else if (slot) {
            return slot.slotCards.length === 0;
        }
        return false;
    }

    moveCard(card = null) {
        let prevSelectedCard = this.spider.cards.find(c => c.slot !== 11 && c.isSelected);
        let prevCardSlot = prevSelectedCard ? this.spider.deckContent.slots[prevSelectedCard.slot - 1] : null;

        if (card) { // Клик по карте
            let currentSelectedCard = card;

            if (prevSelectedCard === currentSelectedCard) {
                prevSelectedCard.isSelected = false;
                prevSelectedCard.card.classList.remove('selected');
                return;
            }

            if (!prevSelectedCard) {
                currentSelectedCard.isSelected = true;
                currentSelectedCard.card.classList.add('selected');
                return;
            }

            if (this.isCorrectPlaceToInsert(prevSelectedCard, currentSelectedCard)) {
                let currentCardSlot = this.spider.deckContent.slots[currentSelectedCard.slot - 1];
                this.changeCardSlot(prevSelectedCard, currentCardSlot, prevCardSlot);
            }

            prevSelectedCard.isSelected = false;
            prevSelectedCard.card.classList.remove('selected');
            currentSelectedCard.isSelected = false;
            currentSelectedCard.card.classList.remove('selected');

        } else { // Клик по пустому слоту

            if (prevSelectedCard) {
                if (this.slotCards.length === 0) {
                    this.changeCardSlot(prevSelectedCard, this, prevCardSlot);
                }
            }
        }
    }

    changeCardSlot(prevSelectedCard, currentCardSlot, prevCardSlot) {
        if (!prevCardSlot) {
            console.warn("Ошибка: нет предыдущего слота!");
            return;
        }

        let movingIndex = prevCardSlot.slotCards.indexOf(prevSelectedCard);
        if (movingIndex === -1) {
            console.warn("Ошибка: prevSelectedCard не найдена в prevCardSlot!");
            return;
        }

        let movingCards = prevCardSlot.slotCards.slice(movingIndex);

        if (!this.isSequenceValid(movingCards)) {
            console.warn("Ошибка: некорректная последовательность карт!");
            movingCards.forEach(card => card.card.classList.add('error'));
            setTimeout(() => {
                movingCards.forEach(card => card.card.classList.remove('error'));
            }, 1000);
            return;
        }

        prevCardSlot.slotCards = prevCardSlot.slotCards.slice(0, movingIndex);

        movingCards.forEach(card => {
            currentCardSlot.insertCard(card);
            card.slot = currentCardSlot.id;
        });
    }

    isSequenceValid(cards) {
        for (let i = 0; i < cards.length - 1; i++) {
            let current = cards[i];
            let next = cards[i + 1];
            if (current.cardNum !== next.cardNum + 1 || current.mast === next.mast) {
                return false;
            }
        }
        return true;
    }

    insertCard(card) {
        if(card.isVisible && card.card.classList.contains('not-visible')){
            card.card.classList.remove('not-visible');
            card.card.classList.add('visible');
            this.spider.drawVisibleCard(card);
        }
        else {
            if(card.card.classList.contains('visible')){
                card.card.classList.remove('visible');
                card.card.classList.add('not-visible');    
            }
            this.spider.drawNotVisibleCard(card);
        }
        card.card.style.top = `${this.slotCards.length * 20}px`;
        this.slotCards.push(card);
        card.slot = this.id;
        this.slot.appendChild(card.card);

        card.card.onclick = (event) => {
            event.stopPropagation();
            this.moveCard(card);
        };

    }
}
