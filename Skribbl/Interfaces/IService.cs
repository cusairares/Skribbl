using System.Threading.Tasks;
using Skribbl.DTO;
using Skribbl.Models;

namespace Skribbl.Interfaces
{
    public interface IService
    {


        /// <summary>
        /// Creates new SessionState
        /// </summary>
        /// <returns>The RoomId</returns>
        string CreateRoom();

        /// <summary>
        /// Joins specific room with participant connectionId, also updates the dictionarys
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        bool JoinRoom(string roomId, JoinRoomDto request);

        string? LeaveRoom(string connectionId);

        /// <summary>
        /// Returns the participant with highest score
        /// </summary>
        /// <param name="roomId"></param>
        /// <returns></returns>
        Participant GetWinner(string roomId);

        /// <summary>
        /// Explictly adding points for a given participant
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="connectionId"></param>
        /// <param name="newScore"></param>
        bool AddPoints(string roomId, string connectionId, int newScore);

        /// <summary>
        /// Add specific words to the words list
        /// </summary>
        /// <param name="words"></param>
        void AddWords(string[] words);

        void AddCanvasUpdate(CanvasUpdate update);

        List<Participant> FetchParticipants(string roomId);

        List<CanvasUpdate> FetchCanvasUpdates(string roomId);
        Task<bool> StartMatchmakingRound(string connectionId);
        Task<bool> CommitSelectedWord(string connectionId, string word);
    }
}
