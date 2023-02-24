namespace Duels.Services;

public class MapsServ
{
  private readonly MapsRepo _mr;
  private readonly PlayersServ _ps;

  public MapsServ(MapsRepo mr, PlayersServ ps)
  {
    _mr = mr;
    _ps = ps;
  }

  public Map GenerateMap(string mapName, int gameId)
  {
    Map map = new Map();

    switch (mapName)
    {
      case "hex":
        map.Size = 64;
        map.TerrainData =
        "w-w-l-l-l-l-l-l1-w-h-h-f-f-l-l-l-l-h-h-w-w-f-l-l-l-h-w-h-w-f-l-l-l-l-f-w-h-w-h-l-l-l-f-w-w-h-h-l-l-l-l-f-f-h-h-w-l2-l-l-l-l-l-w-w";
        map.SpellData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        map.TroopData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
        map.StructureData = "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0";
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

  public Map SetupMap(Map map)
  {
    List<Player> players = _ps.GetPlayersByGame(map.GameId);

    // Split the terrain data into a list
    string[] terrainData = map.TerrainData.Split('-');

    string[] structureData = map.StructureData.Split('-');

    string[] troopData = map.TroopData.Split('-');

    int c = 0;
    string structure = "0";
    string troop = "0";
    int playerInt = 0;
    // For every tile in the map
    foreach (string tile in terrainData)
    {
      // if the tile is a starting square place the appropriate structure data
      if (tile.Length >= 2)
      {
        playerInt = tile[1] - '1';


        if (players[playerInt].Faction == "human")
        {
          structure = "hb";
          troop = "hs";
        }
        else if (players[playerInt].Faction == "undead")
        {
          structure = "0";
          troop = "us";
        }
        else if (players[playerInt].Faction == "robot")
        {
          structure = "f";
          troop = "rg";
        }

        structureData[c] = tile[1] + structure;
        troopData[c] = tile[1] + troop;
      }
      c++;
    }

    map.StructureData = string.Join("-", structureData);
    map.TroopData = string.Join("-", troopData);

    return _mr.SetupMap(map);

  }
}