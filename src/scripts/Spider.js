class Spider {
    MASTS = {
        0: 'src/images/masts/heart.png',
        1: 'src/images/masts/spades.png',
    }
    NOT_NUM_CARDS = {
        1: 'A',
        11: 'J',
        12: 'Q',
        13: 'K',
    }

    constructor() {
        this.cards = [];
        this.mainSlotCards = [];

        //upper deck
        this.upperDeck = document.createElement('div');
        this.upperDeck.classList.add('upper-deck');
        document.querySelector('.spider').appendChild(this.upperDeck);
        
        //deck
        this.deck = document.createElement('div');
        this.deck.classList.add('deck');
        document.querySelector('.spider').appendChild(this.deck);
        
        //content
        this.deckContent = new Deck(this);
        this.upperDeckContent = new UpperDeck(this);
    }
    drawNotVisibleCard(card) {
        card.card.classList.add('not-visible');
        const img = document.createElement('img');
        img.classList.add('back');
        img.src = 'src/images/rubashka.png';
        card.card.appendChild(img);
    }
    drawVisibleCard(card){
        //number
        const num = document.createElement('p');
        num.classList.add('left');
        num.textContent = this.NOT_NUM_CARDS[card.cardNum] ? this.NOT_NUM_CARDS[card.cardNum] : card.cardNum;
        card.card.appendChild(num);
    
        //image
        const image = document.createElement('img');
        image.classList.add('sign');
        image.src = this.MASTS[card.mast];
        card.card.appendChild(image);
    
        //one more number
        const oneMoreNum = document.createElement('p');
        oneMoreNum.classList.add('right');
        oneMoreNum.textContent = this.NOT_NUM_CARDS[card.cardNum] ? this.NOT_NUM_CARDS[card.cardNum] : card.cardNum;
        card.card.appendChild(oneMoreNum);

        if(card.mast == 0 && !num.classList.contains('red') && !oneMoreNum.classList.contains('red')) {
            num.classList.add('red');
            oneMoreNum.classList.add('red');
        }
    }
}