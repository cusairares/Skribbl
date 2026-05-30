using Skribbl.Models;

namespace Skribbl.DTO
{
    public record JoinRoomDto(string Username, string ConnectionId, AvatarOptions AvatarOptions);
}
