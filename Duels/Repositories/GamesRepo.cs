namespace Duels.Repositories;

public class GamesRepo : BaseRepo
{
  public GamesRepo(IDbConnection db) : base(db)
  {
  }

  public Game CreateGame(Game data)
  {
    var sql = @"
    INSERT INTO games(
      title,
      creatorId,
      playerLimit,
      isPrivate,
      isRanked,
      mapId,
      status
    )
    VALUES (
      @Title,
      @CreatorId,
      @PlayerLimit,
      @IsPrivate,
      @IsRanked,
      @MapId,
      @Status
    );
    SELECT LAST_INSERT_ID()
    ;";

    // Set The Created Time for this Game
    data.CreatedAt = DateTime.Now;
    data.UpdatedAt = DateTime.Now;


    data.Id = _db.ExecuteScalar<int>(sql, data);
    return data;
  }

  public List<Game> GetAvailableGames()
  {
    string status = "Waiting For Players";

    var sql = @"
    SELECT 
    g.*,
    a.*
    FROM games g
    JOIN accounts a ON a.id = g.creatorId
    WHERE g.Status = @status
    GROUP BY g.id
    ;";

    return _db.Query<Game, Profile, Game>(sql, (g, p) =>
    {
      g.Creator = p;
      return g;
    }, new { status }).ToList();


  }

  public Game GetGameById(int gameId)
  {
    var sql = @"
    SELECT
    g.*,
    a.*
    FROM games g
    JOIN accounts a ON a.id = g.creatorId
    WHERE g.id = @gameId
    GROUP BY g.id
    ;";

    return _db.Query<Game, Profile, Game>(sql, (g, p) =>
    {
      g.Creator = p;
      return g;
    }, new { gameId }).FirstOrDefault();
  }

  public Game AddPlayerToGame(Game game)
  {
    var sql = @"
    UPDATE games SET
    playerCount = @PlayerCount
    WHERE id = @Id
    ;";

    _db.Execute(sql, game);

    return game;
  }
}