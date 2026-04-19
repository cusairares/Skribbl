using Skribbl.Interfaces;
using System.Collections.Concurrent;

namespace Skribbl.Models
{
    public class GameManager : IGameManager
    {
        private Random _random;
        private List<string> _words = new List<string>() { "Soare", "Caine", "Braila" };

        //roomId - room
        private ConcurrentDictionary<string, GameState> _activeGames;

        //connectionId - roomId
        //rooms can have only unique connection ids
        private ConcurrentDictionary<string, string> _connectionIdMap = new();

        public GameManager()
        {
            _random = new Random();
            _activeGames = new ConcurrentDictionary<string, GameState>();
        }

        public void AddRoom(GameState gameState)
        {
            _activeGames[gameState.Id] = gameState;
        }

        public void RemoveRoom(GameState gameState)
        {
            _activeGames.TryRemove(gameState.Id, out _);

            var playersToRemove = _connectionIdMap.Where(kvp => kvp.Value == gameState.Id).Select(kvp => kvp.Key).ToList();

            foreach (var connectionId in playersToRemove)
            {
                _connectionIdMap.TryRemove(connectionId, out _);
            }
        }

        public GameState? GetRoomByRoomId(string roomId)
        {
            return _activeGames.GetValueOrDefault(roomId);
        }

        public GameState? GetRoomByConnectionId(string connectionId)
        {
            if (_connectionIdMap.TryGetValue(connectionId, out var roomId))
            {
                return GetRoomByRoomId(roomId);
            }

            return null;
        }

        public Player? GetPlayer(string connectionId)
        {
            var room = GetRoomByConnectionId(connectionId);
            if (room == null)
                return null;
            var player = room.Players.FirstOrDefault(x => x.ConnectionId == connectionId);

            return player;
        }

        public bool AddPlayerToRoom(string roomId, Player player)
        {
            var room = GetRoomByRoomId(roomId);
            if (room == null)
            {
                return false;
            }
            lock (room.Players)
            {
                var playerExisting = room.Players.FirstOrDefault(x => x.Username == player.Username);
                if (playerExisting != null)
                {
                    room.Players.Remove(playerExisting);
                }

                room.Players.Add(player);
                _connectionIdMap[player.ConnectionId] = roomId;
            }
            return true;
        }

        public bool RemovePlayer(string connectionId)
        {
            var room = GetRoomByConnectionId(connectionId);
            if (room == null)
            {
                return false;
            }
            lock (room.Players)
            {
                room.Players.RemoveAll(x => x.ConnectionId == connectionId);
                if (room.Players.Count == 0)
                {
                    RemoveRoom(room);
                }
                return _connectionIdMap.TryRemove(connectionId, out _);
            }

        }
    }
}
