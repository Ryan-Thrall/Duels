namespace Duels.Repositories;

public class PlayersRepo : BaseRepo
{
  public PlayersRepo(IDbConnection db) : base(db)
  {
  }

  public Player JoinGame(Player data)
  {
    var sql = @"
    INSERT INTO players(
      faction,
      creatorId,
      playerNum,
      gameId,
      status
    )
    VALUES (
      @Faction,
      @CreatorId,
      @PlayerNum,
      @GameId,
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

  public List<Player> GetPlayersByGame(int gameId)
  {
    var sql = @"
    SELECT 
    p.*,
    g.id as gid,
    a.*
    FROM players p
    JOIN accounts a on a.id = p.creatorId
    LEFT JOIN games g on g.id = p.gameId
    WHERE p.gameId = @gameId
    GROUP BY p.id
    ;";

    return _db.Query<Player, Profile, Player>(sql, (p, pr) =>
    {
      p.Creator = pr;
      return p;
    }, new { gameId }).ToList();
  }
}