using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Services
{
    public class GameService : IGameService
    {
        private IGameManager _gameManager;

        public GameService(IGameManager gameManager)
        {
            _gameManager = gameManager;
        }

        public string CreateRoom()
        {
            var roomId = GenerateUniqueId();
            var newState = new GameState(roomId);
            _gameManager.AddRoom(newState);

            return roomId;
        }

        private string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
        }

        public bool JoinRoom(string roomId, string username, string connectionId)
        {
            var room = _gameManager.GetRoomByRoomId(roomId);
            if (room == null)
            {
                Console.WriteLine($"[DEBUG] Join failed: Room {roomId} not found.");
                return false;
            }

            if (string.IsNullOrEmpty(username))
            {
                Console.WriteLine("[DEBUG] Join failed: Username is null or empty.");
                return false;
            }
            var player = new Player { Username = username, ConnectionId = connectionId ,Score = 0};
            _gameManager.AddPlayerToRoom(roomId, player);
            return true;

        }

        public bool LeaveRoom(string connectionId)
        {
            return _gameManager.RemovePlayer(connectionId);
        }

        public Player GetWinner(string roomId)
        {
            throw new NotImplementedException();
        }

        public bool AddPoints(string roomId, string connectionId, int newScore)
        {
            throw new NotImplementedException();
        }

        public Player GetNextDrawer(string roomId)
        {
            throw new NotImplementedException();
        }

        public void StartGame(string roomId)
        {
            throw new NotImplementedException();
        }

        public void AddWords(string[] words)
        {
            throw new NotImplementedException();
        }
    }
}
