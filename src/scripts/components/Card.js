class Card {

    constructor(mainSlot, mast, cardNum, id, isVisible = false, isSelected = false) {
        this.mainSlot = mainSlot.mainSlot;
        this.spider = mainSlot.spider;
        this.mast = mast;
        this.cardNum = cardNum;
        this.id = id;
        this.isVisible = isVisible;
        this.isSelected = isSelected;
        this.slot = 11;

        this.card = document.createElement('div');
        this.card.classList.add('card');
        this.mainSlot.appendChild(this.card); 

        
    }


}
