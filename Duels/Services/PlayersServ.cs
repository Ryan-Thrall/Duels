namespace Duels.Services;

public class PlayersServ
{
  private readonly PlayersRepo _pr;
  private readonly GamesServ _gs;

  public PlayersServ(PlayersRepo pr, GamesServ gs)
  {
    _pr = pr;
    _gs = gs;
  }

  // Post Player Object AND Add 1 to the Games PlayerCount
  public Player JoinGame(Player data, int gameId, Account userInfo)
  {
    // Non passed Player Data
    data.CreatorId = userInfo.Id;
    data.GameId = gameId;
    data.Status = "Waiting to Start";

    // Get the Game and List of Players in the Game
    Game game = _gs.GetGameById(gameId);
    List<Player> players = GetPlayersByGame(gameId);

    // If User already joined game THROW ERROR
    players.ForEach(player =>
    {
      if (player.CreatorId == userInfo.Id)
      {
        throw new Exception("You're Already in This Game");
      }
    });

    // If Game is full THROW ERROR
    if (game.PlayerCount == game.PlayerLimit)
    {
      throw new Exception("This Game is Full :(");
    }

    // Give a Number and post the player object
    data.PlayerNum = game.PlayerCount + 1;

    Player player = _pr.JoinGame(data);
    player.Creator = userInfo;

    // Add one to PlayerCount of Game
    game.PlayerCount++;
    game = _gs.AddPlayerToGame(game);

    // Return the player object
    return player;
  }

  // Get all players in a game
  // NOTE INACCESSIBLE BY CLIENT
  public List<Player> GetPlayersByGame(int gameId)
  {
    return _pr.GetPlayersByGame(gameId);
  }
}