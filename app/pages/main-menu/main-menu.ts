import {Page, Nav, MenuController} from 'ionic-angular';

import {GameBoard} from '../game-board/game-board';

import {GameStateService} from '../../services/game-state-service';


@Page({
  templateUrl: 'build/pages/main-menu/main-menu.html'
})
export class MainMenu {
  constructor(private _gameStateService: GameStateService,
    private _nav: Nav,
    private _menu: MenuController) {
      _menu.swipeEnable(false);
  }

  resumeRunningGame() {
    this._nav.push(GameBoard);
  }

  startSinglePlayerGame() {
    this._gameStateService.startNewSinglePlayerGame();
    this._nav.push(GameBoard);
  }

  startMultiPlayerGame() {
    this._gameStateService.startNewMultiPlayerGame();
    this._nav.push(GameBoard);
  }

  isGameRunning() {
    return this._gameStateService.isGameRunning();
  }

}
