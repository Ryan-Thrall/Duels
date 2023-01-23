namespace Duels.Models;

public class Map : IDbItem<int>
{

  public string Name { get; set; }
  public string Image { get; set; }
  public string Size { get; set; }
  public string GameId { get; set; }
  public string TerrainData { get; set; }
  public string SpellData { get; set; }
  public string TroopData { get; set; }
  public string StructureData { get; set; }

  // IDbItem Variables
  public int Id { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }

}