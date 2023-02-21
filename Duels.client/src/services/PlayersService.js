import { AppState } from "../AppState.js";
import { api } from "./AxiosService.js";
import { Player } from "../models/Player.js";
import { Game } from "../models/Game.js";

class PlayersService {
  async joinGame(data, gameId) {
    console.log(data)
    const res = await api.post(`api/players/${gameId}`, data)

    AppState.activeGame.playerCount++;
    AppState.myGames.push(new Game(AppState.activeGame))

  }

  async getPlayers(gameId) {
    const res = await api.get(`api/players/${gameId}`)

    AppState.players = res.data.map(p => new Player(p))
  }


}

export const playersService = new PlayersService();