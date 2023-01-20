namespace Duels.Services;

public class GamesServ
{
  private readonly GamesRepo _gr;

  public GamesServ(GamesRepo gr)
  {
    _gr = gr;
  }

  public Game CreateGame(Game data, Account userInfo)
  {
    data.CreatorId = userInfo.Id;
    data.Status = "Waiting For Players";
    data.IsRanked = false;
    data.MapId = 1;
    data.WinnerId = null;


    Game game = _gr.CreateGame(data);
    return game;
  }

  public Game GetAvailableGames()
  {
    throw new NotImplementedException();
  }


}