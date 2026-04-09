using Skribbl.Interfaces;
using System.Collections.Concurrent;

namespace Skribbl.Models
{
    public class GameManager : IGameManager
    {
        private static GameManager _instance;
        private static readonly object _lock = new object();

        private Random _random;
        private List<string> _words = new List<string>() { "Soare", "Caine", "Braila" };
        private ConcurrentDictionary<string, GameState> _activeGames;
        public static GameManager Instance
        {
            get
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new GameManager();
                    }
                    return _instance;
                }
            }
        }

        public ConcurrentDictionary<string,GameState> ActiveGames
        {
            get => _activeGames;
            set => _activeGames = value;
        }

        public GameManager() 
        { 
            _random = new Random();
            _activeGames = new ConcurrentDictionary<string,GameState>();
        }

        public void Save(GameState gameState)
        {
            _activeGames[gameState.Id] = gameState;
        }

        public GameState? GetRoom(string roomId)
        {
            return _activeGames.GetValueOrDefault(roomId);
        }

        public Player? GetPlayer(string roomId, string connectionId)
        {
            var room = GetRoom(roomId);
            if(room == null)
                return null;
            var player = room.Players.FirstOrDefault(x => x.ConnectionId == connectionId);

            return player;
        }
    }
}
