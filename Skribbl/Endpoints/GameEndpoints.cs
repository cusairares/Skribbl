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
            app.MapPost("/api/v1/rooms", (IService sessionService) =>
            {
                var roomId = sessionService.CreateRoom();
                return Results.Ok(new { roomId });
            })
            .WithTags("Rooms")
            .WithSummary("Create a new game room")
            .WithDescription("Initializes a new game session and returns the unique room ID.")
            .Produces(StatusCodes.Status200OK);

            app.MapPost("/api/v1/rooms/{roomId}/join", async (string roomId, JoinRoomRequest request, IService sessionService) =>
            {
                var success = await sessionService.JoinRoom(roomId, request);
                return success ? Results.Ok() : Results.BadRequest();
            })
            .WithTags("Rooms")
            .WithSummary("Join an existing game room")
            .WithDescription("Allows a user to join a specified room by providing a username and avatar options.")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

            app.MapGet("/api/v1/participants", (string roomId, string? sort, IService sessionService) =>
            {
                var participants = sessionService.FetchParticipants(roomId, sort);
                return Results.Ok(new { participants });
            })
            .WithTags("Rooms")
            .WithSummary("Get participants in a room")
            .WithDescription("Fetches a list of all participants currently in the specified room, sorted by score.")
            .Produces(StatusCodes.Status200OK);

            app.MapGet("/api/v1/rooms/{roomId}/canvas", (string roomId, IService sessionService) =>
            {
                var canvas = sessionService.FetchCanvasUpdates(roomId);
                return Results.Ok(new { canvas });
            })
            .WithTags("Rooms")
            .WithSummary("Get canvas state for a room")
            .WithDescription("Fetches the list of canvas updates for the specified room.")
            .Produces<List<CanvasUpdate>>(StatusCodes.Status200OK);

        }
    }
}
