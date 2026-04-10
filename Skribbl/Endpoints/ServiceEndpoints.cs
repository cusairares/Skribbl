using Skribbl.Interfaces;
using Skribbl.Models;

namespace Skribbl.Endpoints
{
    public static class ServiceEndpoints
    {
        public record CreateRoomRequest(string Username);
        public static void MapServiceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/rooms/create", (CreateRoomRequest request, IGameService gameService) =>
            {
                var roomId = gameService.CreateRoom();
                return Results.Ok(new { roomId });
            });
        }
    }
}
