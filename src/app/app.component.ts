import {Component, OnInit} from '@angular/core';
import {BlackJackService} from './services/black-jack.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jack';

  public numPlayers = 2;
  public playerSpan;

  public deck: any[] = [];

  private currentDeckIndex = 0;
  public playerHands: any[] = [];

  public dealCount = 0;
  public runningCount = 0;
  public guessedRunningCount = 0;
  public currentCount = null;
  public invalidCurrentCount = false;

  public hitStack: any[] = [];

  public logCount = 0;

  constructor(private blackJackService: BlackJackService) {

  }

  ngOnInit(): void {
    this.deck = this.blackJackService.shuffleDeck();
    this.startGame();
  }

  startGame(doShuffle = false) {

    if (doShuffle) {
      this.deck = this.blackJackService.shuffleDeck();
    }

    switch (this.numPlayers) {
      case 2:
        this.playerSpan = 6;
        break;
      case 3:
        this.playerSpan = 8;
        break;
      case 4:
        this.playerSpan = 6;
        break;
    }

    this.dealCount = 0;
    this.runningCount = 0;
    this.guessedRunningCount = 0;
    this.hitStack = [];

    this.currentDeckIndex = 0;
    this.dealNextHand();
  }

  restartGame() {
    this.startGame();
  }

  shuffleAndRestartGame() {
    this.startGame(true);
  }

  validateCurrentCount() {
    if (this.currentCount === null) {
      return false;
    }
    if (isNaN(this.currentCount)) {
      return false;
    }
    return true;
  }

  setCountAndDeal() {

    /*/
    this.invalidCurrentCount = false;
    if (!this.validateCurrentCount()) {
      this.invalidCurrentCount = true;
      return;
    }
    //*/
    this.dealNextHand();
  }

  canDealNextHand() {
    if (this.currentDeckIndex < 52) {
      return true;
    }
    return false;
  }

  dealNextHand() {

    if (!this.canDealNextHand()) {
      return;
    }

    let eachPlayerHand = [];
    let nextCard = null;
    let eachValue = null;
    this.dealCount = 0;
    this.playerHands = [];
    for (let i = 1; i <= this.numPlayers; i++) {
      eachPlayerHand = [];
      for (let j = 1; j <= 2; j++) {

        if (this.canDealNextHand()) {

          nextCard = this.deck[this.currentDeckIndex];
          eachValue = this.blackJackService.getCardValue(nextCard.value);
          this.dealCount += eachValue;
          eachPlayerHand.push(nextCard);
          this.currentDeckIndex++;
        }
      }
      this.playerHands.push(eachPlayerHand);
    }
    // Dealer
    eachPlayerHand = [];
    if (this.canDealNextHand()) {
      nextCard = this.deck[this.currentDeckIndex];
      eachValue = this.blackJackService.getCardValue(nextCard.value);
      this.dealCount += eachValue;
      eachPlayerHand.push(nextCard);
      this.currentDeckIndex++;
    }

    this.playerHands.push(eachPlayerHand);

    this.runningCount += this.dealCount;
    this.currentCount = null;

    console.log('runningCount ' + this.logCount + ': ', this.runningCount);
  }

  changedPlayersNum() {
    this.deck = this.blackJackService.shuffleDeck();
    this.startGame();
  }

  hitPlayer() {

    if (this.hitStack.length < 13) {
      if (this.canDealNextHand()) {
        const nextCard = this.deck[this.currentDeckIndex];
        this.hitStack.push(nextCard);

        const eachValue = this.blackJackService.getCardValue(nextCard.value);
        this.dealCount += eachValue;
        this.runningCount += this.dealCount;

        this.currentDeckIndex++;
      }
    }
  }
}
