using Microsoft.AspNetCore.SignalR;
using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Hubs
{
    public class SessionHub : Hub
    {
        public record CanvasUpdate(string RoomId,double X,double Y,bool IsNewStroke,string Color,int Width);
        public record SignalRJoinRequest(string RoomId, string Username);

        IService _gameService;

        public SessionHub(IService gameService) => _gameService = gameService;

        public async Task JoinSignalRGroup(SignalRJoinRequest request)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);
            await Clients.Group(request.RoomId).SendAsync("PlayerJoined", request.Username);
            Console.WriteLine($"[SIGNALR] Connection {Context.ConnectionId} joined group {request.RoomId}");
        }

        public async Task SendCanvasUpdate(CanvasUpdate update)
        {
            await Clients.OthersInGroup(update.RoomId).SendAsync("CanvasUpdated", update);
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _gameService.LeaveRoom(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
