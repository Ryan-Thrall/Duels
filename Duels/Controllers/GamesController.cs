namespace Duels.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
  private readonly Auth0Provider _auth;
  private readonly GamesServ _gs;
  private readonly PlayersServ _ps;
  private readonly MapsServ _ms;


  public GamesController(Auth0Provider auth, GamesServ gs, PlayersServ ps, MapsServ ms)
  {
    _auth = auth;
    _gs = gs;
    _ps = ps;
    _ms = ms;
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


      Map map = _ms.GenerateMap(data.MapName, data.Id);

      data.Map = map;

      Game game = _gs.CreateGame(data, userInfo);

      Player player = new Player();

      _ps.JoinGame(player, game.Id, userInfo);
      game.PlayerCount++;



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
      List<Game> games = _gs.GetAvailableGames();
      return Ok(games);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }

  [HttpGet("{gameId}")]
  public ActionResult<Game> GetGameById(int gameId)
  {
    try
    {

      Game game = _gs.GetGameById(gameId);
      return Ok(game);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }

  [Authorize]
  [HttpGet("myGames")]
  public async Task<ActionResult<List<Game>>> GetMyGames()
  {
    try
    {
      // Access User Info, Throw error on Fail
      Account userInfo = await _auth.GetUserInfoAsync<Account>(HttpContext);
      if (userInfo == null || userInfo.Id == null)
      {
        throw new Exception("ERROR: User not Found, Please Relogin and try again.");
      }

      List<Game> games = _gs.GetMyGames(userInfo);
      return Ok(games);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }

  [Authorize]
  [HttpDelete("{id}")]
  public async Task<ActionResult<Game>> DeleteGame(int id)
  {
    try
    {
      // Access User Info, Throw error on Fail
      Account userInfo = await _auth.GetUserInfoAsync<Account>(HttpContext);
      if (userInfo == null || userInfo.Id == null)
      {
        throw new Exception("ERROR: User not Found, Please Relogin and try again.");
      }

      Game deletedGame = _gs.DeleteGame(id, userInfo?.Id);
      return Ok(deletedGame);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }

  [Authorize]
  [HttpPut("{gameId}/startGame")]
  public async Task<ActionResult<Game>> StartGame(int gameId)
  {
    try
    {
      // Access User Info, Throw error on Fail
      Account userInfo = await _auth.GetUserInfoAsync<Account>(HttpContext);
      if (userInfo == null || userInfo.Id == null)
      {
        throw new Exception("ERROR: User not Found, Please Relogin and try again.");
      }

      Game startedGame = _gs.StartGame(gameId, userInfo.Id);
      return Ok(startedGame);
    }
    catch (Exception e)
    {
      return BadRequest(e.Message);
    }
  }
}