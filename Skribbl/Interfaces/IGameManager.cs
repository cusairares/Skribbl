using Skribbl.Models;

namespace Skribbl.Interfaces
{
    public interface IGameManager
    {
        void Save(GameState gameState);

        GameState? GetRoom(string roomId);

        Player? GetPlayer(string roomId,string playerId);
    }
}
