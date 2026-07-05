using Microsoft.AspNetCore.SignalR;
using Skribbl.DTO;
using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Hubs
{
    public class SessionHub : Hub
    {
        public record SignalRJoinRequest(string RoomId, string Username,AvatarOptions AvatarOptions);

        IService _sessionService;

        public SessionHub(IService sessionService) => _sessionService = sessionService;

        public async Task JoinSignalRGroup(SignalRJoinRequest request)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, request.RoomId);
            var participant = new Participant
            {
                ConnectionId = Context.ConnectionId,
                Username = request.Username,
                Score = 0,
                AvatarOptions = request.AvatarOptions,
            };
            await Clients.Group(request.RoomId).SendAsync("PlayerJoined",participant);
            Console.WriteLine($"[SIGNALR] Connection {Context.ConnectionId} joined group {request.RoomId}");
        }

        public async Task SendCanvasUpdate(CanvasUpdate update,IService sessionService)
        {
            sessionService.AddCanvasUpdate(update);
            await Clients.OthersInGroup(update.RoomId).SendAsync("CanvasUpdated", update);
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var roomId = _sessionService.LeaveRoom(Context.ConnectionId);
            if (!string.IsNullOrEmpty(roomId))
            {
                await Clients.Group(roomId).SendAsync("PlayerDisconnected", Context.ConnectionId);
                Console.WriteLine($"[SIGNALR] Connection {Context.ConnectionId} left group {roomId} due to disconnect.");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
