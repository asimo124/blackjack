import { Injectable } from '@angular/core';
import { DeckCard } from '../models/deck-card';

@Injectable({
  providedIn: 'root'
})
export class BlackJackService {

  private numberOfCards = 104;
  private deck: DeckCard[] = [];

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

  shuffleDeck(numDecks = 1): DeckCard[] {
    this.numberOfCards = numDecks * 52;

    this.deck = [];
    for (let i = 0; i < this.numberOfCards; i++) {
      while (true) {
        const randomValue = Math.floor(Math.random() * 13);
        const randomSuit = Math.floor(Math.random() * 4);
        const eachDeck: DeckCard = {
          suit: this.suites[randomSuit],
          value: this.values[randomValue]
        };

        let existsCount = 0;
        this.deck.forEach(function getItem(item) {
          if (eachDeck.suit === item.suit && eachDeck.value === item.value) {
            existsCount++;
          }
        });
        if (existsCount < numDecks) {
          this.deck.push(eachDeck);
          // suiteValuePairs.push(eachDeck.suit + '~' + eachDeck.value);
          break;
        }

      }
    }
    return this.deck;
  }

  getCardValue(value: string, _numDecks = 1): number {
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
