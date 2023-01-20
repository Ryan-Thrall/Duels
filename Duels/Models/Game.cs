

public class Game : IHasCreator
{

  public string Title { get; set; }

  // Game Settings
  public int PlayerLimit { get; set; }
  public int MapId { get; set; }
  // public Map Map { get; set; }
  public string WinnerId { get; set; }
  // public Player Winner { get; set; }

  // Game Status Variables
  public int PlayerCount { get; set; }
  public string Status { get; set; }

  // Private Game Variables
  public bool IsPrivate { get; set; }
  public string Password { get; set; }
  public bool IsRanked { get; set; }

  // IHasCreator Variables
  public int Id { get; set; }
  public string CreatorId { get; set; }
  public Profile Creator { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
}