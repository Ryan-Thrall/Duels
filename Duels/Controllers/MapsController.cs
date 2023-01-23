namespace Duels.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MapsController : ControllerBase
{
  private readonly Auth0Provider _auth;
  private readonly MapsServ _ms;

  public MapsController(Auth0Provider auth, MapsServ ms)
  {
    _auth = auth;
    _ms = ms;
  }
}