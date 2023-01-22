import { AppState } from "../AppState.js";
import { Game } from "../models/Game.js";
import { api } from "./AxiosService.js";


class GamesService {
  async getGames() {
    const res = await api.get('api/games')
    console.log(res.data)

    AppState.games = res.data.map(g => new Game(g))
  }

  async getMyGames() {
    const res = await api.get('api/games/myGames')
    console.log(res.data)

    AppState.myGames = res.data.map(g => new Game(g))
  }
}

export const gamesService = new GamesService();