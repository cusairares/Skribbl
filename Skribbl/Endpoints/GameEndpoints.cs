using Skribbl.DTO;
using Skribbl.Interfaces;

namespace Skribbl.Endpoints
{
    public static class GameEndpoints
    {
        public record CreateRoomRequest(string Username);


        public static void MapServiceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/rooms/create", (IService gameService) =>
            {
                var roomId = gameService.CreateRoom();
                return Results.Ok(new { roomId });
            });

            app.MapPost("/api/rooms/join/{roomId}", (string roomId, JoinRoomDto request, IService gameService) =>
            {
                var success = gameService.JoinRoom(roomId, request);

                return success ? Results.Ok() : Results.BadRequest();
            });
        }
    }
}
