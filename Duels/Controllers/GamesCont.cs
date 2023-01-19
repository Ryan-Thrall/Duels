namespace Duels.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesCont : ControllerBase
{
  private readonly Auth0Provider _auth;


  public GamesCont(Auth0Provider auth)
  {
    _auth = auth;
  }
}