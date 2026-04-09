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

        public void CreateRoom()
        {
            var roomId = GenerateUniqueId();
            var newState = new GameState(roomId);  
            _gameManager.Save(newState);
        }

        private string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString().Substring(0, 6).ToUpper();
        }
        
        public bool JoinRoom(string roomId, Player player)
        {
            var room =  _gameManager.GetRoom(roomId);
            if (room == null)
            {
                return false;
            }
            lock (room.Players)
            {
                room.Players.Add(player);
            }
            return true;

        }

        public Player GetWinner(string roomId)
        {
            throw new NotImplementedException();
        }

        public bool AddPoints(string roomId, string connectionId, int newScore)
        {

            var player = _gameManager.GetPlayer(roomId, connectionId);
            if (player == null)
            {
                return false;
            }
            lock (player)
            {
                player.Score += newScore;
            }
            return true;
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
