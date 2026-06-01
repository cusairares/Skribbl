using Skribbl.Interfaces;
using Skribbl.Models;
using System.Collections.Concurrent;

namespace Skribbl.Repositories
{
    public class SessionRegistry : IRegistry
    {
        private Random _random;
        private List<string> _words = new List<string>() { "Soare", "Caine", "Braila" };

        //roomId - room
        private ConcurrentDictionary<string, SessionState> _activeSessions;

        //connectionId - roomId
        //rooms can have only unique connection ids
        private ConcurrentDictionary<string, string> _connectionIdMap = new();

        public SessionRegistry()
        {
            _random = new Random();
            _activeSessions = new ConcurrentDictionary<string, SessionState>();
        }

        public void AddRoom(SessionState sessionState)
        {
            _activeSessions[sessionState.Id] = sessionState;
        }

        public void RemoveRoom(SessionState sessionState)
        {
            _activeSessions.TryRemove(sessionState.Id, out _);

            var participantsToRemove = _connectionIdMap.Where(kvp => kvp.Value == sessionState.Id).Select(kvp => kvp.Key).ToList();

            foreach (var connectionId in participantsToRemove)
            {
                _connectionIdMap.TryRemove(connectionId, out _);
            }
        }

        public SessionState? GetRoomByRoomId(string roomId)
        {
            return _activeSessions.GetValueOrDefault(roomId);
        }

        public SessionState? GetRoomByConnectionId(string connectionId)
        {
            if (_connectionIdMap.TryGetValue(connectionId, out var roomId))
            {
                return GetRoomByRoomId(roomId);
            }

            return null;
        }

        public List<Participant> FetchParticipants(string roomId)
        {
            if(_activeSessions.TryGetValue(roomId, out var room)){
                return room.Participants;
            }
            else
            {
                return new List<Participant>();
            }
        }
        public Participant? GetParticipant(string connectionId)
        {
            var room = GetRoomByConnectionId(connectionId);
            if (room == null)
                return null;
            var participant = room.Participants.FirstOrDefault(x => x.ConnectionId == connectionId);

            return participant;
        }

        public bool AddParticipantToRoom(string roomId, Participant participant)
        {
            var room = GetRoomByRoomId(roomId);
            if (room == null)
            {
                return false;
            }
            lock (room.Participants)
            {
                var participantExisting = room.Participants.FirstOrDefault(x => x.Username == participant.Username);
                if (participantExisting != null)
                {
                    room.Participants.Remove(participantExisting);
                }

                room.Participants.Add(participant);
                _connectionIdMap[participant.ConnectionId] = roomId;
            }
            return true;
        }

        public bool RemoveParticipant(string connectionId)
        {
            var room = GetRoomByConnectionId(connectionId);
            if (room == null)
            {
                return false;
            }
            lock (room.Participants)
            {
                room.Participants.RemoveAll(x => x.ConnectionId == connectionId);
                if (room.Participants.Count == 0)
                {
                    RemoveRoom(room);
                }
                return _connectionIdMap.TryRemove(connectionId, out _);
            }

        }
    }
}
