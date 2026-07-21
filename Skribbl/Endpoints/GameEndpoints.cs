using Microsoft.AspNetCore.SignalR;
using Skribbl.DTO;
using Skribbl.Interfaces;

namespace Skribbl.Endpoints
{
    public static class GameEndpoints
    {
        public record CreateRoomRequest(string Username);


        public static void MapServiceEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/rooms/create", (IService sessionService) =>
            {
                var roomId = sessionService.CreateRoom();
                return Results.Ok(new { roomId });
            });

            app.MapPost("/api/rooms/join/{roomId}", (string roomId, JoinRoomRequest request, IService sessionService) =>
            {
                var success = sessionService.JoinRoom(roomId, request);

                return success ? Results.Ok() : Results.BadRequest();
            });

            app.MapGet("/api/{roomId}", (string roomId, IService sessionService) =>
            {
                var participants = sessionService.FetchParticipants(roomId);

                return Results.Ok( new { participants });
            });

            app.MapGet("/api/{roomId}/fetch_canvas", (string roomId, IService sessionService) =>
            {
                List<CanvasUpdate> canvas = sessionService.FetchCanvasUpdates(roomId);

                return Results.Ok(new { canvas });
            });
        }
    }
}
