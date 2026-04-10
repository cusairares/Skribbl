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

        public bool JoinRoom(string roomId, Player player)
        {
            var room = _gameManager.GetRoomByRoomId(roomId);
            if (room == null)
            {
                return false;
            }
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
