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
    ACTIONS_TYPES = {
        'dealCards': 0,
        'moveToSlot': 1,
        'moveToTrash': 2
    }

    constructor() {
        this.cards = [];
        this.mainSlotCards = [];
        this.trashCards = [];
        this.actions = [];

        //upper deck
        this.upperDeck = document.createElement('div');
        this.upperDeck.classList.add('upper-deck');
        document.querySelector('.spider').appendChild(this.upperDeck);

        //trash
        this.trash = document.createElement('div');
        this.trash.classList.add('trash');
        this.upperDeck.appendChild(this.trash);

        //deck
        this.deck = document.createElement('div');
        this.deck.classList.add('deck');
        document.querySelector('.spider').appendChild(this.deck);
        
        //content
        this.mainSlot = document.createElement('div');
        this.mainSlot.classList.add('main-slot');
        this.upperDeck.appendChild(this.mainSlot);
        
        
        this.deckContent = new Deck(this);
        this.upperDeckContent = new UpperDeck(this, this.mainSlot);
    }
}