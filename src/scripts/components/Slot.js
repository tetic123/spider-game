class Slot {
    constructor(deck, id, slot) {
        this.slotCards = [];
        this.slot = slot;
        this.deck = deck;
        this.spider = this.deck.spider;
        this.trash = this.spider.trash;
        this.id = id;


        if (!this.slot.dataset.listener) {
            this.slot.dataset.listener = "true";
            this.slot.addEventListener('click', () => {
                this.moveCard();
            });
        }
    }

    isCorrectPlaceToInsert(prevSelectedCard, currentSelectedCard, slot = null) {
        let result = 0;
        if (currentSelectedCard) {
            result = currentSelectedCard.cardNum === prevSelectedCard.cardNum + 1 &&
            currentSelectedCard.mast !== prevSelectedCard.mast;
        }
        else {
            result = 1;
        }
        return result;
    }

    moveCard(card = null) {
        let prevSelectedCard = this.spider.cards.find(c => c.slot !== 11 && c.isSelected);
        let prevCardSlot = prevSelectedCard ? this.spider.deckContent.slots[prevSelectedCard.slot - 1] : null;
        
        let currentSelectedCard = null;
        if (card) { // Клик по карте
            currentSelectedCard = card;
        }
            
        if (prevSelectedCard === currentSelectedCard) {
            prevSelectedCard.isSelected = false;
            prevSelectedCard.card.classList.remove('selected');
            return;
        }
        
        if (!prevSelectedCard && currentSelectedCard) {
            currentSelectedCard.isSelected = true;
            currentSelectedCard.card.classList.add('selected');
            return;
        }
        
        if (this.isCorrectPlaceToInsert(prevSelectedCard, currentSelectedCard)) {
            let currentCardSlot = currentSelectedCard ? this.spider.deckContent.slots[currentSelectedCard.slot - 1] : this;
                this.changeCardSlot(prevSelectedCard, currentCardSlot, prevCardSlot);
                if(prevCardSlot && prevCardSlot.slotCards.length > 0){
                    const nextCard = prevCardSlot.slotCards[prevCardSlot.slotCards.length - 1];
                    nextCard.isVisible = true;
                    nextCard.card.classList.remove('not-visible');
                    nextCard.card.classList.add('visible');
                }
            this.checkIfFullStack(currentCardSlot);
            this.checkIfFullStack(prevCardSlot);

            // if(currentCardSlot.slotCards.length >= 13) this.checkIfFullStack(currentCardSlot);
            // if(prevCardSlot && prevCardSlot.slotCards.length >= 13) this.checkIfFullStack(prevCardSlot);
        }

        prevSelectedCard.isSelected = false;
        prevSelectedCard.card.classList.remove('selected');
        if(currentSelectedCard){
            currentSelectedCard.isSelected = false;
            currentSelectedCard.card.classList.remove('selected');
        }

    }

    changeCardSlot(prevSelectedCard, currentCardSlot, prevCardSlot, isUndo = false) {
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
            currentCardSlot.insertCard(card, true);
            if(!isUndo) {
                card.prevSlots.push(prevCardSlot);
            }
            else {
                card.prevSlots.pop();
            }

            card.slot = currentCardSlot.id;
        });
        
        if(!isUndo) {
            console.log(prevCardSlot.slotCards);
            if(prevCardSlot.slotCards > 0) {
                if(prevCardSlot.slotCards[movingIndex - 1].card.classList.contains('not-visible'))
                    this.spider.actions.push(new Action('moveToSlot', movingCards, this.spider, true));
                else 
                    this.spider.actions.push(new Action('moveToSlot', movingCards, this.spider));
            }
            else {
                this.spider.actions.push(new Action('moveToSlot', movingCards, this.spider, true));
            }
        }
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
        if((card.isVisible && card.card.classList.contains('not-visible')) || card.isSelected){
            card.card.classList.remove('not-visible');
            card.card.classList.add('visible');
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

    checkIfFullStack(slot) {
        // 13 cards
        const slotCards = slot.slotCards;
        const length = slotCards.length;
        if(length >= 13) {
            for(let i = length - 1; i >= length - 12 - 1; i--){
                if(slotCards[i].cardNum + 1 !== slotCards[i - 1].cardNum) return false;
            }
    
            this.moveStackToTrash(slot, length);
        }
    }

    moveStackToTrash(slot, length) {
        let i = length - 1;
        let movingCards = [];
        for(i; i >= length - 13 - 1; i--){
            movingCards.push(slot.slotCards[i]);
            this.moveCardToTrash(slot.slotCards[i], slot);
        }
        if(slot.slotCards[i].card.classList.contains('not-visible')){
            slot.slotCards[i].card.classList.remove('not-visible');
            slot.slotCards[i].card.classList.add('visible');
        }
        this.spider.actions.push(new Action('moveToTrash', movingCards, this.spider));
    }

    moveCardToTrash(card, slot) {
        if(!this.trash.classList.contains('not-empty')) this.trash.classList.add('not-empty');
        card.slot = -1;
        card.prevSlots.push(slot.id);
        card.card.style.top = '0px';
        if(card.card.classList.contains('visible')){
            card.card.classList.remove('visible');
            card.card.classList.add('not-visible');
        }
        this.trash.appendChild(card.card);
        this.spider.trashCards.push(card);
        slot.slotCards.splice(slot.slotCards.indexOf(card), 1);

        if(this.spider.trashCards.length === 104) congratulations(this);
    
    }

    congratulatons() {
        const usageForm = document.querySelector('.usage');
        const undoButton = document.querySelector('.undoButton');
        undoButton.remove();
        
        const h1 = document.createElement('h1');
        h1.textContent = 'Gooooood job!';
        usageForm.appendChild(h1);

    }
}
