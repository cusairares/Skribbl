using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Endpoints
{
    public static class ServiceEndpoints
    {
        public record CreateRoomRequest(string Username);

        public record JoinRoomRequest(string Username);
        public static void MapServiceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/rooms/create", (IGameService gameService) =>
            {
                var roomId = gameService.CreateRoom();
                return Results.Ok(new { roomId });
            });

            app.MapPost("/api/rooms/{roomId}/join", (string roomId, JoinRoomRequest request, IGameService gameService) =>
            {
                var success = gameService.JoinRoom(roomId, request.Username,string.Empty);

                return success ? Results.Ok() : Results.BadRequest();
            });
        }
    }
}
