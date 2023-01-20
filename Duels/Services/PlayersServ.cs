namespace Duels.Services;

public class PlayersServ
{
  private readonly PlayersRepo _pr;

  public PlayersServ(PlayersRepo pr)
  {
    _pr = pr;
  }
}