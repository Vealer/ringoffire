import { Component, OnInit } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor( private firestore: Firestore, private router: Router) { }

  ngOnInit(): void {
  }

  async newGame(){
    let game = new Game();
    const coll = collection(this.firestore, 'games');
    let gameInfo = addDoc(coll, game.toJson()).then(async (gameInfo: any) =>{
      console.log((await gameInfo).id);
      this.router.navigateByUrl('/game/' +gameInfo.id);
    });


  }

}
