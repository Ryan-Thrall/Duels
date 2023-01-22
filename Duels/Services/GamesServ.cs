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
  public Game GetGameById(int gameId)
  {
    Game game = _gr.GetGameById(gameId);

    if (game == null)
    {
      throw new Exception("Game Not Found.");
    }

    return game;
  }

  // Put the new playerCount on the game object
  public Game AddPlayerToGame(Game game)
  {
    return _gr.AddPlayerToGame(game);
  }

  // Get the games that the users account is playing in
  public List<Game> GetMyGames(Account userInfo)
  {
    return _gr.GetMyGames(userInfo.Id);
  }
}