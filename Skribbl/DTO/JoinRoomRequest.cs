using Skribbl.Models;

namespace Skribbl.DTO
{
    public record JoinRoomRequest(string Username, string ConnectionId, AvatarOptions AvatarOptions);
}
