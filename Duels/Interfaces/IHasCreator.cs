namespace Duels.Interfaces;

public interface IHasCreator : IDbItem<int>
{
  string CreatorId { get; set; }
  Profile Creator { get; set; }
}