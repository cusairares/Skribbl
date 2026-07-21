using Skribbl.Enums;

namespace Skribbl.DTO
{
    public class ChatMessageEvent
    {
        public string Username { get; set; }
        public string Message { get; set; }
        public ChatMessageType Status { get; set; }
    }
}
