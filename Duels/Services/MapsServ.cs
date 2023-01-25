namespace Duels.Services;

public class MapsServ
{
  private readonly MapsRepo _mr;

  public MapsServ(MapsRepo mr)
  {
    _mr = mr;
  }

  public Map GenerateMap(string mapName, int gameId)
  {
    Map map = new Map();

    switch (mapName)
    {
      case "map1":
        map.Size = 24;
        map.TerrainData = "w-l-l-l-l-w-l-1-1-1-1-w-1-1-1-1-1-1-w-1-1-1-1-w";
        map.SpellData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        map.TroopData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        map.StructureData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        break;
      default:
        map.Size = 24;
        map.TerrainData = "b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b";
        map.SpellData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        map.TroopData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        map.StructureData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        break;
    }
    map.GameId = gameId;

    map = _mr.GenerateMap(map);

    return map;
  }
}