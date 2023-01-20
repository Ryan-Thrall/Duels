namespace Duels.Models;

public class Player : IHasCreator
{

  public string Faction { get; set; }
  public int PlayerNum { get; set; }
  public int GameId { get; set; }
  public Game Game { get; set; }
  public string Status { get; set; }

  // IHasCreator Variables
  public int Id { get; set; }
  public string CreatorId { get; set; }
  public Profile Creator { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
}