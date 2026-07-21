namespace Skribbl.DTO
{
    public class ChatMessageRequest
    {
        public string RoomId { get; set; }
        public string Message { get; set; }
        public string ConnectionId { get; set; }
    }
}
