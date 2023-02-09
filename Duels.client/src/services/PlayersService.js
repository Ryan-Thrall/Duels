import { AppState } from "../AppState.js";
import { api } from "./AxiosService.js";
import { Player } from "../models/Player.js";

class PlayersService {
  async joinGame(data, gameId) {
    const res = await api.post(`api/players/${gameId}`, data)
    console.log(res.data)
  }

  async getPlayers(gameId) {
    const res = await api.get(`api/players/${gameId}`)
    console.log(res.data)

    AppState.players = res.data.map(p => new Player(p))
  }


}

export const playersService = new PlayersService();