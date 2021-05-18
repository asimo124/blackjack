import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlackJackService {

  // private numberOfCards = 52;
  private numberOfCards = 104;
  private deck: any[];

  private suites = [
    'SPADE',
    'CLUB',
    'HEART',
    'DIAMOND'
  ];

  private values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11-JACK',
    '12-QUEEN',
    '13-KING',
    '1'
  ];

  constructor() { }

  shuffleDeck(numDecks = 1) {

    this.numberOfCards = numDecks * 52;

    this.deck = [];
    // const suiteValuePairs = [];
    for (let i = 0; i < this.numberOfCards; i++) {
      while (true) {
        const randomValue = Math.floor(Math.random() * 13);
        const randomSuit = Math.floor(Math.random() * 4);
        const eachDeck = {
          suit: this.suites[randomSuit],
          value: this.values[randomValue]
        };

        let existsCorrectTimes = false;
        let existsCount = 0;
        this.deck.forEach(function getItem(item) {
          if (eachDeck.suit === item.suit && eachDeck.value === item.value) {
            existsCount++;
          }
        });
        if (existsCount < numDecks) {
          existsCorrectTimes = true;
        }

        if (existsCorrectTimes) {
          this.deck.push(eachDeck);
          // suiteValuePairs.push(eachDeck.suit + '~' + eachDeck.value);
          break;
        }

      }
    }
    return this.deck;
  }

  getCardValue(value, numDecks = 1) {

    let retValue = 0;
    switch (value) {
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        retValue = 1;
        break;
      case '10':
      case '11-JACK':
      case '12-QUEEN':
      case '13-KING':
      case '1':
        retValue = -1;
        break;
      default:
        retValue = 0;
    }
    // if (numDecks) {
    return retValue;
    /*} else {
      return retValue / 2;
    }*/
  }
}
