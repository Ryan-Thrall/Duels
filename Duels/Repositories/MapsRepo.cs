namespace Duels.Repositories;

public class MapsRepo : BaseRepo
{
  public MapsRepo(IDbConnection db) : base(db)
  {
  }

  public Map GenerateMap(Map data)
  {
    var sql = @"
    INSERT INTO maps(
      name,
      image,
      size,
      gameId,
      terrainData,
      spellData,
      troopData,
      structureData
    )
    VALUES(
      @Name,
      @Image,
      @Size,
      @GameId,
      @TerrainData,
      @SpellData,
      @TroopData,
      @StructureData
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