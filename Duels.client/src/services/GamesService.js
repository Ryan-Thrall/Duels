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
    AppState.activeGame = new Game(res.data)
  }

  async createGame(data) {
    const res = await api.post(`api/games`, data)
    AppState.games = [new Game(res.data), ...AppState.games]

    AppState.myGames = [new Game(res.data), ...AppState.myGames]
  }

  async deleteGame(gameId) {
    const res = await api.delete(`api/games/${gameId}`)

    AppState.games = AppState.games.filter(g => g.id != gameId)

    AppState.myGames = AppState.myGames.filter(g => g.id != gameId)
  }

  async startGame(gameId) {
    const res = await api.put(`api/games/${gameId}/startGame`)

    AppState.games = AppState.games.filter(g => g.id != gameId)
    AppState.myGames.forEach(g => {
      if (g.id = gameId) {
        g.status = "Turn 1";
      }
    })

    return res.data
  }
}

export const gamesService = new GamesService();