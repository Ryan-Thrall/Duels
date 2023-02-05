namespace Duels.Repositories;

public class GamesRepo : BaseRepo
{
  public GamesRepo(IDbConnection db) : base(db)
  {
  }

  public Game CreateGame(Game data, Map map)
  {
    var sql = @"
    INSERT INTO games(
      title,
      creatorId,
      playerLimit,
      isPrivate,
      isRanked,
      mapId,
      mapName,
      status
    )
    VALUES (
      @Title,
      @CreatorId,
      @PlayerLimit,
      @IsPrivate,
      @IsRanked,
      @MapId,
      @MapName,
      @Status
    );
    SELECT LAST_INSERT_ID()
    ;";

    // Set The Created Time for this Game
    data.CreatedAt = DateTime.Now;
    data.UpdatedAt = DateTime.Now;

    data.Id = _db.ExecuteScalar<int>(sql, data);

    data.Map.GameId = data.Id;

    var newsql = @"
    UPDATE maps SET 
    gameId = @GameId
    WHERE id = @Id
    ;";

    _db.Execute(newsql, map);


    return data;
  }

  public List<Game> GetAvailableGames()
  {
    string status = "Waiting For Players";

    var sql = @"
    SELECT 
    g.*,
    a.*,
    m.*
    FROM games g
    JOIN accounts a ON a.id = g.creatorId
    LEFT JOIN maps m ON m.id = g.mapId
    WHERE g.Status = @status
    ;";

    return _db.Query<Game, Profile, Map, Game>(sql, (g, p, m) =>
    {
      g.Creator = p;
      g.Map = m;
      return g;
    }, new { status }).ToList();


  }

  public Game GetGameById(int gameId)
  {
    var sql = @"
    SELECT
    g.*,
    a.*,
    m.*
    FROM games g
    JOIN accounts a ON a.id = g.creatorId
    LEFT JOIN maps m ON m.id = g.mapId
    WHERE g.id = @gameId
    ;";

    return _db.Query<Game, Profile, Map, Game>(sql, (g, p, m) =>
    {
      g.Creator = p;
      g.Map = m;
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

  public List<Game> GetMyGames(string accountId)
  {
    var sql = @"
    SELECT
    g.*,
    a.*,
    m.*,
    p.creatorId,
    p.gameId
    FROM games g
    JOIN accounts a ON a.id = g.creatorId
    LEFT JOIN maps m ON m.id = g.mapId
    LEFT JOIN players p on p.gameId = g.id
    WHERE p.creatorId = @accountId
    ;";

    return _db.Query<Game, Profile, Map, Game>(sql, (g, p, m) =>
    {
      g.Creator = p;
      g.Map = m;
      return g;
    }, new { accountId }).ToList();
  }

  public void DeleteKeep(int id)
  {
    string sql = @"DELETE games, maps
FROM games
    INNER JOIN maps ON maps.gameId = @id
WHERE games.id = @id;";

    _db.Execute(sql, new { id });
  }
}