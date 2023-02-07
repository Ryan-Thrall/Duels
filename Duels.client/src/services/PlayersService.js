import { api } from "./AxiosService.js";

class PlayersService {
  async joinGame(data, gameId) {
    const res = await api.post(`api/players/${gameId}`, data)
    console.log(res.data)
  }


}

export const playersService = new PlayersService();