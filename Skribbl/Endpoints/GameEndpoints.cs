using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Endpoints
{
    public static class GameEndpoints
    {
        public record CreateRoomRequest(string Username);

        public record JoinRoomRequest(string Username,string ConnectionId);
        public static void MapServiceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/rooms/create", (IService gameService) =>
            {
                var roomId = gameService.CreateRoom();
                return Results.Ok(new { roomId });
            });

            app.MapPost("/api/rooms/join/{roomId}", (string roomId, JoinRoomRequest request, IService gameService) =>
            {
                var success = gameService.JoinRoom(roomId, request.Username,request.ConnectionId);

                return success ? Results.Ok() : Results.BadRequest();
            });
        }
    }
}
