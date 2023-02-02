import { AppState } from "../AppState.js";
import { Game } from "../models/Game.js";
import { api } from "./AxiosService.js";


class GamesService {
  async getGames() {
    const res = await api.get('api/games')

    AppState.games = res.data.map(g => new Game(g))
  }

  async getMyGames() {
    const res = await api.get('api/games/myGames')

    AppState.myGames = res.data.map(g => new Game(g))
  }

  async getGameById(gameId) {
    const res = await api.get(`api/games/${gameId}`)
    console.log(res.data)
    AppState.activeGame = new Game(res.data)
  }

  async createGame(data) {
    const res = await api.post(`api/games`, data)
    console.log(res.data)
    AppState.games = [new Game(res.data), ...AppState.games]

    AppState.myGames = [new Game(res.data), ...AppState.myGames]
  }
}

export const gamesService = new GamesService();