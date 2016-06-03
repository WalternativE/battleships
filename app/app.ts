import {ViewChild} from '@angular/core';

import {App, Platform, MenuController, Nav, Config} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

import {MainMenu} from './pages/main-menu/main-menu';

import {GameBoard} from './pages/game-board/game-board';
import {GameStateService} from './services/game-state-service';


@App({
  templateUrl: 'build/app.html',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [GameStateService]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = MainMenu;
  pages: Array<{title: string, component: any}>;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private config: Config
  ) {
    // TODO config here
    
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Main Menu', component: MainMenu },
      { title: 'Game Board', component: GameBoard }
    ];
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
