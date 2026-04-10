using Skribbl.Models;

namespace Skribbl.Interfaces
{
    public interface IGameManager
    {
        /// <summary>
        /// Adds the room to the _activeGames dictionary
        /// </summary>
        /// <param name="room"></param>
        void AddRoom(GameState room);

        /// <summary>
        /// Removes the room from _activeGames and deletes all entries from _connectionIdMap
        /// </summary>
        /// <param name="room"></param>
        void RemoveRoom(GameState room);

        GameState? GetRoomByRoomId(string roomId);

        GameState? GetRoomByConnectionId(string connectionId);

        Player? GetPlayer(string connectionId);

        /// <summary>
        /// Adds player to specified room inside _activeGames and updates all entries from _connectionIdMap
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="player"></param>
        /// <returns></returns>
        bool AddPlayerToRoom(string roomId, Player player);

        /// <summary>
        /// Removes player from specified room inside _activeGames and deletes all entries from _connectionIdMap
        /// </summary>
        /// <param name="connectionId"></param>
        /// <returns></returns>
        bool RemovePlayer(string connectionId);

    }
}
