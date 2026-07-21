using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Skribbl.DTO;
using Skribbl.Interfaces;
using System.Collections.Generic;

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
            })
            .WithTags("Rooms")
            .WithSummary("Create a new game room")
            .WithDescription("Initializes a new game session and returns the unique room ID.")
            .Produces(StatusCodes.Status200OK);

            app.MapPost("/api/rooms/join/{roomId}", (string roomId, JoinRoomRequest request, IService sessionService) =>
            {
                var success = sessionService.JoinRoom(roomId, request);
                return success ? Results.Ok() : Results.BadRequest();
            })
            .WithTags("Rooms")
            .WithSummary("Join an existing game room")
            .WithDescription("Allows a user to join a specified room by providing a username and avatar options.")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

            app.MapGet("/api/{roomId}", (string roomId, IService sessionService) =>
            {
                var participants = sessionService.FetchParticipants(roomId);
                return Results.Ok(new { participants });
            })
            .WithTags("Rooms")
            .WithSummary("Get participants in a room")
            .WithDescription("Fetches a list of all participants currently in the specified room.")
            .Produces(StatusCodes.Status200OK);

            app.MapGet("/api/{roomId}/fetch_canvas", (string roomId, IService sessionService) =>
            {
                List<CanvasUpdate> canvas = sessionService.FetchCanvasUpdates(roomId);
                return Results.Ok(new { canvas });
            })
            .WithTags("Canvas")
            .WithSummary("Fetch canvas state")
            .WithDescription("Retrieves the entire history of canvas strokes for late-joining players.")
            .Produces(StatusCodes.Status200OK);
        }
    }
}
