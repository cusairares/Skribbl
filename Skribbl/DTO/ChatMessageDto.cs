using Skribbl.Enums;

namespace Skribbl.DTO
{
    public class ChatMessageDto
    {
        public string Username { get; set; }
        public string Message { get; set; }
        public ChatMessageType Status { get; set; }
    }
}
