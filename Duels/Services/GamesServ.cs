namespace Duels.Services;

public class GamesServ
{
  private readonly GamesRepo _gr;

  public GamesServ(GamesRepo gr)
  {
    _gr = gr;
  }

  // Post a Game Object
  public Game CreateGame(Game data, Account userInfo)
  {
    data.CreatorId = userInfo.Id;
    data.Status = "Waiting For Players";
    data.IsRanked = false;
    data.MapId = 1;
    data.WinnerId = null;


    Game game = _gr.CreateGame(data);
    game.Creator = userInfo;
    return game;
  }

  // Get Games where status = "Waiting For Players"
  public List<Game> GetAvailableGames()
  {
    return _gr.GetAvailableGames();
  }

  // Get Game By Id
  // REVIEW Make Accessible to Client Please ;)
  public Game GetGameById(int gameId)
  {
    return _gr.GetGameById(gameId);
  }

  // Put the new playerCount on the game object
  public Game AddPlayerToGame(Game game)
  {
    return _gr.AddPlayerToGame(game);
  }


}