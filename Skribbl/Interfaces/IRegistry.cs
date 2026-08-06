using Skribbl.DTO;
using Skribbl.Models;

namespace Skribbl.Interfaces
{
    public interface IRegistry
    {
        /// <summary>
        /// Adds the room to the _activeSessions dictionary
        /// </summary>
        /// <param name="room"></param>
        void AddRoom(SessionState room);

        /// <summary>
        /// Removes the room from _activeSessions and deletes all entries from _connectionIdMap
        /// </summary>
        /// <param name="room"></param>
        void RemoveRoom(SessionState room);

        SessionState? GetRoomByRoomId(string roomId);

        SessionState? GetRoomByConnectionId(string connectionId);

        Participant? GetParticipant(string connectionId);

        /// <summary>
        /// Adds participant to specified room inside _activeSessions and updates all entries from _connectionIdMap
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="participant"></param>
        /// <returns></returns>
        bool AddParticipantToRoom(string roomId, Participant participant);

        /// <summary>
        /// Removes participant from specified room inside _activeSessions and deletes all entries from _connectionIdMap
        /// </summary>
        /// <param name="connectionId"></param>
        /// <returns></returns>
        bool RemoveParticipant(string connectionId);
        List<Participant> FetchParticipants(string roomId, string? sort = null);
        List<CanvasUpdate> FetchCanvasUpdates(string roomId);
        void AddCanvasUpdate(CanvasUpdate update);
        List<string> FetchWords(string roomId);
    }
}
