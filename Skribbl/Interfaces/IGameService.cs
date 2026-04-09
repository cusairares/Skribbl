using Skribbl.Models;

namespace Skribbl.Interfaces
{
    public interface IGameService
    {


        /// <summary>
        /// Adds a player to the given roomId
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="player"></param>
        /// <returns>If the connection was a success</returns>
        bool JoinRoom(string roomId,Player player);

        /// <summary>
        /// Creates a private room and also adds the player
        /// </summary>
        void CreateRoom();

        /// <summary>
        /// Returns the player with highest score
        /// </summary>
        /// <param name="roomId"></param>
        /// <returns></returns>
        Player GetWinner(string roomId);

        /// <summary>
        /// Update the score for a given player
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="player"></param>
        /// <param name="newScore"></param>
        bool AddPoints(string roomId, Player player, int newScore);

        /// <summary>
        /// Get the next drawing from given room
        /// </summary>
        /// <param name="roomId"></param>
        /// <returns></returns>
        Player GetNextDrawer(string roomId);


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
