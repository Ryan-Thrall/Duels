namespace Duels.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
  private readonly Auth0Provider _auth;
  private readonly GamesServ _gs;


  public GamesController(Auth0Provider auth, GamesServ gs)
  {
    _auth = auth;
    _gs = gs;
  }

  [Authorize]
  [HttpPost]
  public async Task<ActionResult<Game>> CreateGame([FromBody] Game data)
  {
    try
    {
      // Access User Info, Throw error on Fail
      Account userInfo = await _auth.GetUserInfoAsync<Account>(HttpContext);
      if (userInfo == null || userInfo.Id == null)
      {
        throw new Exception("ERROR: User not Found, Please Relogin and try again.");
      }

      Game game = _gs.CreateGame(data, userInfo);
      return Ok(game);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }

  [HttpGet]
  public ActionResult<List<Game>> GetAvailableGames()
  {
    try
    {
      Game games = _gs.GetAvailableGames();
      return Ok(games);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }
}