import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BlackJackService} from './services/black-jack.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('currentCountText') input: ElementRef;

  public title = 'jack';

  public maxCardsNum = 0;

  public numPlayers = 2;
  public playerSpan;

  public numDecks = 1;
  public deck: any[] = [];

  public currentDeckIndex = 0;
  public playerHands: any[] = [];

  public dealCount = 0;
  public runningCount = 0;
  public guessedRunningCount = 0;
  public lastGuessedCount = null;
  public currentCount = null;
  public invalidCurrentCount = false;

  public hitStack: any[] = [];
  public playedRounds = [];
  public currentRound = [];
  public currentHitRound = [];
  public currentRoundIndex = 0;
  public roundsGuessedCount = [];
  public roundsGuessedRunningCount = [];
  public roundsCorrectCount = [];
  public roundsCorrectRunningCount = [];

  public logCount = 0;

  isReplayingDeck = false;
  canShowReplay = false;

  constructor(private blackJackService: BlackJackService) {

  }

  ngOnInit(): void {
    this.maxCardsNum = (this.numDecks * 52) - 1;
    this.startGame(true);
  }

  startGame(doShuffle = false) {

    if (doShuffle) {
      this.deck = this.blackJackService.shuffleDeck(this.numDecks);
    }
    this.playedRounds = [];
    this.currentRound = [];
    this.canShowReplay = false;
    this.isReplayingDeck = false;

    switch (this.numPlayers) {
      case 2:
        this.playerSpan = 8;
        break;
      case 3:
        this.playerSpan = 6;
        break;
      case 4:
        this.playerSpan = 5;
        break;
      case 5:
        this.playerSpan = 4;
        break;
      case 6:
        this.playerSpan = 4;
        break;
      case 7:
        this.playerSpan = 3;
        break;
      case 8:
        this.playerSpan = 3;
        break;
    }

    this.dealCount = 0;
    this.runningCount = 0;
    this.guessedRunningCount = 0;
    this.hitStack = [];

    this.currentRoundIndex = 0;
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
    if (this.lastGuessedCount === null) {
      return false;
    }
    if (isNaN(this.lastGuessedCount)) {
      return false;
    }
    const lastGuessedCount = parseFloat(String(this.lastGuessedCount));
    this.lastGuessedCount = lastGuessedCount;
    return true;
  }

  setCountAndDeal() {

    //*/
    this.invalidCurrentCount = false;
    if (!this.validateCurrentCount()) {
      this.invalidCurrentCount = true;
      return;
    }
    //*/
    this.dealNextHand();
  }

  hasNotFinishedHand() {

    if (this.currentDeckIndex < this.maxCardsNum) {
      return true;
    }
    return false;
  }

  canDealNextHand() {

    if (this.currentDeckIndex < this.maxCardsNum + 1) {
      return true;
    }
    return false;
  }

  canShowReplayButton() {

    if (!this.hasNotFinishedHand() && this.playedRounds.length === this.roundsGuessedCount.length) {
      this.canShowReplay = true;
    } else {
      this.canShowReplay = false;
    }
  }

  dealNextHand() {

    let didPushRound = false;
    if (!this.canDealNextHand()) {
      didPushRound = true;
      this.playedRounds.push(this.currentRound);
    }
    if (this.currentRound.length > 0) {
      if (!didPushRound && this.hasNotFinishedHand()) {
        this.playedRounds.push(this.currentRound);
      }
    }

    if (this.currentRound.length > 0 || !this.canDealNextHand()) {

      if (this.validateCurrentCount()) {

        let guessedRoundCount = 0;
        this.roundsGuessedRunningCount.push(this.lastGuessedCount);
        if (this.roundsGuessedRunningCount.length > 1) {
          guessedRoundCount = this.lastGuessedCount - this.roundsGuessedRunningCount[this.roundsGuessedRunningCount.length - 2];
        } else {
          guessedRoundCount = this.lastGuessedCount;
        }
        this.roundsGuessedCount.push(guessedRoundCount);

        this.roundsCorrectCount.push(this.dealCount);
        this.roundsCorrectRunningCount.push(this.runningCount);
      }

      this.lastGuessedCount = null;
    }
    if (!this.canDealNextHand()) {
      const self = this;
      // setTimeout(() => {
      self.canShowReplayButton();
      // }, 1500);

      // this.currentRoundIndex++;
      return;
    }
    this.currentRoundIndex++;

    if (this.input) {
      this.input.nativeElement.focus();
    }

    this.currentRound = [];
    this.hitStack = [];
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
          eachValue = this.blackJackService.getCardValue(nextCard.value, this.numDecks);
          this.dealCount += eachValue;
          eachPlayerHand.push(nextCard);
          this.currentRound.push(nextCard);
          this.currentDeckIndex++;
        } else {
          // this.playedRounds.push(this.currentRound);
        }
      }
      this.playerHands.push(eachPlayerHand);
    }
    // Dealer
    eachPlayerHand = [];
    if (this.canDealNextHand()) {
      nextCard = this.deck[this.currentDeckIndex];
      eachValue = this.blackJackService.getCardValue(nextCard.value, this.numDecks);
      this.dealCount += eachValue;
      eachPlayerHand.push(nextCard);
      this.currentRound.push(nextCard);
      this.currentDeckIndex++;
    } else {
      // this.playedRounds.push(this.currentRound);
    }

    this.playerHands.push(eachPlayerHand);

    this.runningCount += this.dealCount;
  }

  changedPlayersNum() {
    this.startGame(true);
  }

  changedDecksNum() {
    this.maxCardsNum = (this.numDecks * 52) - 1;
    this.startGame(true);
  }

  hitPlayer() {

    let nextCard = null;
    if (this.hitStack.length < 30) {
      if (this.canDealNextHand()) {
        nextCard = this.deck[this.currentDeckIndex];
        this.hitStack.push(nextCard);
        this.currentRound.push(nextCard);

        const eachValue = this.blackJackService.getCardValue(nextCard.value, this.numDecks);
        this.dealCount += eachValue;
        this.runningCount += eachValue;

        this.currentDeckIndex++;
        /*/
        if (this.currentRoundIndex > 0) {

          const curRoundIndex = this.currentRoundIndex;

          if (this.playedRounds[curRoundIndex]) {
            (this.playedRounds[curRoundIndex]).push(nextCard);
          }
        }
        //*/

      } else {

        // this.playedRounds[this.currentRoundIndex].push(nextCard);
      }
    }
  }

  replayDeck() {
    this.currentRoundIndex--;
    this.isReplayingDeck = true;
  }

  movePrevious() {
    if (this.currentRoundIndex > 0) {
      this.currentRoundIndex--;
    }
  }

  moveNext() {
    if (this.currentRoundIndex < this.playedRounds.length - 1) {
      this.currentRoundIndex++;
    }
  }

  moveFirst() {
    this.currentRoundIndex = 0;
  }

  moveLast() {
    this.currentRoundIndex = this.playedRounds.length - 1;
  }

  getRoundStyles() {
    if (this.roundsGuessedCount[this.currentRoundIndex] === this.roundsCorrectCount[this.currentRoundIndex]) {
      return '#98fab8';
    } else {
      return '#fcb7a9';
    }
  }

  getCountStyles() {
    if (this.roundsGuessedRunningCount[this.currentRoundIndex] === this.roundsCorrectRunningCount[this.currentRoundIndex]) {
      return '#98fab8';
    } else {
      return '#fcb7a9';
    }
  }

  getCardPosition(index) {
    return String((index) * 20) + 'px';
  }
}
