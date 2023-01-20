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

  [Authorize]
  [HttpPost("{gameId}")]
  public async Task<ActionResult<Player>> JoinGame([FromBody] Player data, int gameId)
  {
    try
    {
      // Access User Info, Throw error on Fail
      Account userInfo = await _auth.GetUserInfoAsync<Account>(HttpContext);
      if (userInfo == null || userInfo.Id == null)
      {
        throw new Exception("ERROR: User not Found, Please Relogin and try again.");
      }

      Player player = _ps.JoinGame(data, gameId, userInfo);
      return Ok(player);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }



}