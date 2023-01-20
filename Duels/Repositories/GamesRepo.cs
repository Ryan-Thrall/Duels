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
}