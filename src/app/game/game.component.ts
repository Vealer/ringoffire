import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  onSnapshot,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game$: Observable<any>;
  gam$: Observable<any>;
  gameId: string;


  game: Game = new Game();

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    //this.newGame();
    this.route.params.subscribe(async (params) => {
      console.log(params['id']);
      this.gameId = params['id'];
      const coll = collection(this.firestore, `games`);
      this.game$ = collectionData(coll, { idField: this.gameId });
      const unsub = onSnapshot(
        doc(this.firestore, `games`, `${this.gameId}`),
        (doc: any) => {
          console.log('Current data: ', doc.data());
          this.game.players = doc.data().players;
          this.game.currentPlayer = doc.data().currentPlayer;
          this.game.playedCards = doc.data().playedCards;
          this.game.stack = doc.data().stack;
          this.game.pickCardAnimation = doc.data().pickCardAnimation;
          this.game.currentCard = doc.data().currentCard;
          console.log(this.game.players);
        }
      );
    });
  }

  async newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
      this.saveGame();

    }
    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name?.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame(){
    setDoc(doc(this.firestore, "games", this.gameId), {
      players : this.game.players,
      currentPlayer : this.game.currentPlayer,
      playedCards : this.game.playedCards,
      stack : this.game.stack,
      pickCardAnimation: this.game.pickCardAnimation,
      currentCard: this.game.currentCard,
    });
  }
}
