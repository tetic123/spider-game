class UpperDeck {
    constructor(spider, mainSlot) {
        this.spider = spider;
        this.upperDeck = this.spider.upperDeck;
        this.mainSlot = mainSlot;
        this.mainSlotContent = new MainSlot(this, this.spider);

        //usage
        this.usage = document.createElement('div');
        this.usage.classList.add('usage');

        //restart button
        this.restartButton = document.createElement('button');
        this.restartButton.textContent = 'RESTART';
        this.restartButton.classList.add('restartButton');

        this.restartButton.addEventListener('click', () => this.restart());
        
        //undo
        this.undoButton = document.createElement('button');
        this.undoButton.textContent = 'UNDO';
        this.undoButton.classList.add('undoButton');
        this.undoButton.addEventListener('click', () => this.undo())
        
        this.usage.appendChild(this.restartButton);
        this.usage.appendChild(this.undoButton);
        
        this.upperDeck.appendChild(this.usage);
    }

    undo() {
        if(this.spider.actions.length > 0){
            let lastCard = this.spider.actions[this.spider.actions.length - 1];
            if(lastCard.actionType === 0){
                lastCard.undoDealing(lastCard.cards);
            }
            else if(lastCard.actionType === 1) {
                lastCard.undoMovingToSlot(lastCard.cards);
            }
            else if(lastCard.actionType === 2) {
                lastCard.undoMovingToTrash(lastCard.cards);
            }
        }

    }

    restart() {
        this.usage.classList.add('hidden');

        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => slot.classList.add('hidden'));

        const usageForm = document.createElement('div');
        usageForm.classList.add('usage');

        const img = document.createElement('div');
        img.classList.add('okak');

        const deck = document.querySelector('.deck');
        deck.appendChild(usageForm);
        deck.classList.add('restart');

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');
 
        const restartButton = document.createElement('button');
        restartButton.textContent = 'RESTART';
        restartButton.classList.add('restartButton');
        restartButton.addEventListener('click', () => {
            this.usage.classList.remove('hidden');
            slots.forEach(slot => slot.classList.remove('hidden'));
            usageForm.remove();
            deck.classList.remove('restart');
            location.reload();
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'BACK';
        backButton.classList.add('backButton');
        backButton.addEventListener('click', () => {
            this.usage.classList.remove('hidden');
            slots.forEach(slot => slot.classList.remove('hidden'));
            deck.classList.remove('restart');
            usageForm.remove();
        });

        const text = document.createElement('p');
        text.textContent = 'Are you sure?';
        text.style.marginBottom = '15px';

        usageForm.appendChild(img);
        usageForm.appendChild(text);
        buttons.appendChild(restartButton);
        buttons.appendChild(backButton);
        usageForm.appendChild(buttons);

    }
}