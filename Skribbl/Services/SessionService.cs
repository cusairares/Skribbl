using Skribbl.DTO;
using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Services
{
    public class SessionService : IService
    {
        private IRegistry _gameManager;

        public SessionService(IRegistry gameManager)
        {
            _gameManager = gameManager;
        }

        public string CreateRoom()
        {
            var roomId = GenerateUniqueId();
            var newState = new SessionState(roomId);
            _gameManager.AddRoom(newState);

            return roomId;
        }

        private string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
        }

        public bool JoinRoom(string roomId, JoinRoomDto request)
        {
            var room = _gameManager.GetRoomByRoomId(roomId);
            if (room == null)
            {
                Console.WriteLine($"[DEBUG] Join failed: Room {roomId} not found.");
                return false;
            }

            if (string.IsNullOrEmpty(request.Username))
            {
                Console.WriteLine("[DEBUG] Join failed: Username is null or empty.");
                return false;
            }
            var player = new Participant { Username = request.Username, ConnectionId = request.ConnectionId, Score = 0, AvatarOptions = request.AvatarOptions };
            _gameManager.AddPlayerToRoom(roomId, player);
            return true;

        }

        public bool LeaveRoom(string connectionId)
        {
            return _gameManager.RemovePlayer(connectionId);
        }

        public Participant GetWinner(string roomId)
        {
            throw new NotImplementedException();
        }

        public bool AddPoints(string roomId, string connectionId, int newScore)
        {
            throw new NotImplementedException();
        }

        public Participant GetNextDrawer(string roomId)
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
