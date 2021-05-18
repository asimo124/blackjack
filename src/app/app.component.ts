import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BlackJackService} from './services/black-jack.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('currentCountText') input: ElementRef;

  title = 'jack';

  public numPlayers = 2;
  public playerSpan;

  public deck: any[] = [];

  private currentDeckIndex = 0;
  public playerHands: any[] = [];

  public dealCount = 0;
  public runningCount = 0;
  public guessedRunningCount = 0;
  public lastGuessedCount = 0;
  public currentCount = null;
  public invalidCurrentCount = false;

  public hitStack: any[] = [];
  public playedRounds = [];
  public currentRound = [];
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
    this.deck = this.blackJackService.shuffleDeck();
    this.startGame();
  }

  startGame(doShuffle = false) {

    if (doShuffle) {
      this.deck = this.blackJackService.shuffleDeck();
    }
    this.playedRounds = [];
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
        this.playerSpan = 4;
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
    const lastGuessedCount = parseInt(String(this.lastGuessedCount), 10);
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

  canDealNextHand() {

    // return false;

    // console.log('this.currentDeckIndex: ', this.currentDeckIndex);

    if (this.currentDeckIndex < 51) {
      return true;
    }
    return false;
  }

  canShowReplayButton() {

    console.log('this.playedRounds.lenghtn: ', this.playedRounds.length);
    console.log('this.roundsGuessedCount.lenghtn: ', this.roundsGuessedCount.length);
    console.log('this.currentRoundIndex: ', this.currentRoundIndex);
    console.log('this.canDealNextHand: ', this.canDealNextHand());
    if (!this.canDealNextHand() && this.playedRounds.length === this.roundsGuessedCount.length) {
      this.canShowReplay = true;
    } else {
      this.canShowReplay = false;
    }
    console.log('this.canShowReplay: ', this.canShowReplay);
  }

  dealNextHand() {

    console.log('this.currentRoundIndex: ', this.currentRoundIndex);

    let didPushRound = false;
    if (!this.canDealNextHand()) {
      didPushRound = true;
      this.playedRounds.push(this.currentRound);
    }
    if (this.currentRound.length > 0 || !this.canDealNextHand()) {
      if (!didPushRound) {
        this.playedRounds.push(this.currentRound);
      }

      this.roundsGuessedCount.push(this.lastGuessedCount);
      this.guessedRunningCount += this.lastGuessedCount;
      this.roundsGuessedRunningCount.push(this.guessedRunningCount);

      this.roundsCorrectCount.push(this.dealCount);
      this.roundsCorrectRunningCount.push(this.runningCount);

      this.lastGuessedCount = null;

      console.log('this.roundsGuessedCount: ', this.roundsGuessedCount);
    }
    if (!this.canDealNextHand()) {
      this.canShowReplayButton();
      return;
    } else {
      this.currentRoundIndex++;
    }
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
          eachValue = this.blackJackService.getCardValue(nextCard.value);
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
      eachValue = this.blackJackService.getCardValue(nextCard.value);
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
    this.deck = this.blackJackService.shuffleDeck();
    this.startGame(true);
  }

  hitPlayer() {

    if (this.hitStack.length < 13) {
      if (this.canDealNextHand()) {
        const nextCard = this.deck[this.currentDeckIndex];
        this.hitStack.push(nextCard);
        this.currentRound.push(nextCard);

        const eachValue = this.blackJackService.getCardValue(nextCard.value);
        this.dealCount += eachValue;
        this.runningCount += eachValue;

        this.currentDeckIndex++;
      } else {
        // this.playedRounds.push(this.currentRound);
      }
    }
  }

  replayDeck() {
    console.log('currentRoundIndex: ', this.currentRoundIndex);
    console.log('roundsGuessedCount[currentRoundIndex] at 2: ', this.roundsGuessedCount[this.currentRoundIndex]);
    console.log('roundsGuessedCount at 2: ', this.roundsGuessedCount);
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

}
