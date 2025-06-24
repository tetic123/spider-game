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
        this.prevSlots = [];

        this.card = document.createElement('div');
        this.card.classList.add('card');

        //left number
        this.num = document.createElement('p');
        this.num.classList.add('left');
        this.num.textContent = this.spider.NOT_NUM_CARDS[this.cardNum] ? this.spider.NOT_NUM_CARDS[this.cardNum] : this.cardNum;
        this.card.appendChild(this.num);

        //image
        this.image = document.createElement('img');
        this.image.classList.add('sign');
        this.image.src = this.spider.MASTS[this.mast];
        this.card.appendChild(this.image);

        //one more number
        this.oneMoreNum = document.createElement('p');
        this.oneMoreNum.classList.add('right'); 
        this.oneMoreNum.textContent = this.spider.NOT_NUM_CARDS[this.cardNum] ? this.spider.NOT_NUM_CARDS[this.cardNum] : this.cardNum;
       
        this.card.appendChild(this.oneMoreNum);
        this.mainSlot.appendChild(this.card); 

        //classlist
        if(this.mast == 0 && !this.num.classList.contains('red') && !this.oneMoreNum.classList.contains('red')) {
            this.num.classList.add('red');
            this.oneMoreNum.classList.add('red');
        }

        if(!this.isVisible) {
            this.card.classList.add('not-visible');
        }

        
    }


}
