namespace Duels.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
  private readonly Auth0Provider _auth;
  private readonly PlayersServ _ps;

  public PlayersController(Auth0Provider auth, PlayersServ ps)
  {
    _auth = auth;
    _ps = ps;
  }


}