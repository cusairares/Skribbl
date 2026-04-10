using Microsoft.AspNetCore.SignalR;
using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Services
{
    public class GameHub : Hub
    {
        IGameService _gameService;

        public GameHub(IGameService gameService) => _gameService = gameService;

        public async Task JoinRoom(string roomId, string username)
        {
            var player = new Player
            {
                Username = username,
                ConnectionId = Context.ConnectionId,
                Score = 0,
            };

            var success = _gameService.JoinRoom(roomId, player);

            if (success)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                await Clients.Group(roomId).SendAsync("PlayerJoined", username);
            }
            else
            {
                await Clients.Caller.SendAsync("JoinFailed", "JoinRoom failed");
            }


        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _gameService.LeaveRoom(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
