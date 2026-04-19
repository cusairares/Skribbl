using Skribbl.Models;

namespace Skribbl.Interfaces
{
    public interface IGameService
    {


        /// <summary>
        /// Creates new GameState
        /// </summary>
        /// <returns>The RoomId</returns>
        string CreateRoom();

        /// <summary>
        /// Joins specific room with player connectionId, also updates the dictionarys
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="username"></param>
        /// <param name="connectionId"></param>
        /// <returns></returns>
        bool JoinRoom(string roomId, string username, string connectionId);

        bool LeaveRoom(string connectionId);

        /// <summary>
        /// Returns the player with highest score
        /// </summary>
        /// <param name="roomId"></param>
        /// <returns></returns>
        Player GetWinner(string roomId);

        /// <summary>
        /// Explictly adding points for a given player
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="connectionId"></param>
        /// <param name="newScore"></param>
        bool AddPoints(string roomId, string connectionId, int newScore);


        /// <summary>
        /// Signal to a specific game state to start
        /// </summary>
        /// <param name="roomId"></param>
        void StartGame(string roomId);


        /// <summary>
        /// Add specific words to the words list
        /// </summary>
        /// <param name="words"></param>
        void AddWords(string[] words);
    }
}
